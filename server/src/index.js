// server/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import patientsRouter from "./routes/patients.js";

const app = express();

/* ================================
   CORS — doit être avant les routes
   ================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  // ajoute ici ton domaine Vercel principal si tu veux être strict :
  "https://patient-zero-three.vercel.app",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
];
// autorise aussi les previews prod sur *.vercel.app
const vercelHostnameRegex = /\.vercel\.app$/;

app.use(cors({
  origin(origin, cb) {
    // Autoriser les requêtes sans Origin (curl, healthchecks)
    if (!origin) return cb(null, true);

    try {
      const { hostname } = new URL(origin);
      if (
        allowedOrigins.includes(origin) ||
        vercelHostnameRegex.test(hostname)
      ) {
        return cb(null, true);
      }
    } catch {
      // origin malformé -> on laissera refuser ci-dessous
    }
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // passe à true uniquement si tu utilises des cookies/sessions
}));

// Preflight global
app.options("*", cors());

/* ====== Middlewares ====== */
app.use(express.json());

/* ====== Healthcheck ====== */
app.get("/health", async (req, res) => {
  try {
    await pool.query("select 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ====== API ====== */
app.use("/api/patients", patientsRouter);

/* ====== Root ====== */
app.get("/", (req, res) => {
  const front = process.env.FRONT_URL || "http://localhost:5173/";
  res
    .type("text")
    .send(`Patient Zero API is running.\nTry /health or use the front on ${front}`);
});

/* ====== Boot ====== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[server] Patient Zero listening on :${PORT}`);
});

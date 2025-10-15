import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import patientsRouter from "./routes/patients.js";

const app = express();
app.use(express.json());

// --- CORS “prod-ready” ---
// Autorise localhost DEV + toutes les previews/prod Vercel (*.vercel.app)
const allowList = [
  "http://localhost:5174","http://localhost:5173",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
];
const vercelRegex = /\.vercel\.app$/; // autorise foo-bar.vercel.app
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      if (vercelRegex.test(new URL(origin).hostname)) return cb(null, true);
      if (allowList.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: false, // passe à true uniquement si tu utilises des cookies/sessions
  })
);

// --- Healthcheck ---
app.get("/health", async (req, res) => {
  try {
    await pool.query("select 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- API ---
app.use("/api/patients", patientsRouter);

// --- Root ---
app.get("/", (req, res) => {
  const front = process.env.FRONT_URL || "http://localhost:5173/";
  res
    .type("text")
    .send(`Patient Zero API is running.\nTry /health or use the front on ${front}`);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[server] Patient Zero listening on :${PORT}`);
});

// server/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import patientsRouter from "./routes/patients.js";

const app = express();

/* ================================
   CORS — simple, clair, avant TOUT
   ================================ */
const allowedOrigins = [
  "https://patient-zero-three.vercel.app", // prod (Vercel)
  "http://localhost:5173",                 // dev local
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // passe à true seulement si tu utilises des cookies
}));

// Preflight global (OPTIONS *)
app.options("*", cors());

/* ====== Middlewares ====== */
app.use(express.json());

/* ====== Healthcheck ====== */
app.get("/health", async (_req, res) => {
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
app.get("/", (_req, res) => {
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

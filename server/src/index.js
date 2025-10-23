// server/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./db.js";

// Routers
import authRouter, { requireAuth } from "./routes/auth.js";
import patientsRouter from "./routes/patients.js";

const app = express();

/* ================================
   CORS — correct avec credentials
   ================================ */
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONT_ORIGIN,
    credentials: true, // indispensable pour envoyer/recevoir le cookie JWT
  })
);

/* ====== Middlewares ====== */
app.use(express.json());
app.use(cookieParser());

/* ====== Healthcheck ====== */
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("select 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ====== Auth ====== */
app.use("/api/auth", authRouter);

/* ====== API protégées ====== */
app.use("/api/patients", requireAuth, patientsRouter);

/* ====== Root ====== */
app.get("/", (_req, res) => {
  const front = process.env.FRONT_URL || FRONT_ORIGIN;
  res
    .type("text")
    .send(`Patient Zero API is running.\nTry /api/health or use the front on ${front}`);
});

/* ====== Boot ====== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[server] Patient Zero listening on :${PORT}`);
});

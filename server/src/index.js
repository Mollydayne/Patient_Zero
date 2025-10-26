// ============================
// server/src/index.js — version corrigée
// ============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { pool } from "./db.js";

// Routes
import patientsRouter from "./routes/patients.js";
import authRouter, { requireAuth } from "./routes/auth.js";

dotenv.config();

const app = express();

// ============================
// CONFIG CORS ET COOKIES
// ============================
const FRONT =
  process.env.FRONT_URL ||
  process.env.FRONT_ORIGIN ||
  "http://localhost:5173";

app.set("trust proxy", 1); // Important pour Railway derrière proxy

app.use(
  cors({
    origin: FRONT,
    credentials: true, // autorise l’envoi du cookie
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors({ origin: FRONT, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// ============================
// ROUTES
// ============================

// Auth (login/logout)
app.use("/api/auth", authRouter);

// Patients (protégées)
app.use("/api/patients", requireAuth, patientsRouter);

// Page racine simple
app.get("/", (_req, res) => {
  res
    .type("text")
    .send(`Patient Zero API is running.\nFront authorized: ${FRONT}`);
});

// ============================
// LANCEMENT SERVEUR
// ============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Patient Zero listening on :${PORT}`);
});

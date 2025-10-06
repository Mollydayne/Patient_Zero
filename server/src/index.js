
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import patientsRouter from "./routes/patients.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: false }));

app.get("/health", async (req,res)=>{
  try {
    await pool.query("select 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use("/api/patients", patientsRouter);

app.get("/", (req, res) => {
  res
    .type("text")
    .send("Patient Zero API is running.\nTry /health or use the front on http://localhost:5173/");
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`[server] Patient Zero listening on :${PORT}`));

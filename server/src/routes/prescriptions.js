import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * GET /api/patients/:id/prescriptions
 * Liste des ordonnances d’un patient (du plus récent au plus ancien)
 */
router.get("/patients/:id/prescriptions", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `select id, patient_id, content, created_at
         from patient_prescription
        where patient_id = $1
        order by created_at desc`,
      [id]
    );
    res.json({ items: rows });
  } catch (e) {
    console.error("GET prescriptions error", e);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * POST /api/patients/:id/prescriptions
 * Crée une ordonnance
 * body: { content: string }
 */
router.post("/patients/:id/prescriptions", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body || {};
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "missing_content" });
  }
  try {
    const { rows } = await pool.query(
      `insert into patient_prescription (patient_id, content)
       values ($1, $2)
       returning id, patient_id, content, created_at`,
      [id, content.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error("POST prescription error", e);
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

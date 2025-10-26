import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/** GET /api/patients/:id/notes — liste des notes d’un patient (du + récent au + ancien) */
router.get("/patients/:id/notes", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `select id, patient_id, content, created_at
         from patient_note
        where patient_id = $1
        order by created_at desc`,
      [id]
    );
    res.json({ items: rows });
  } catch (e) {
    console.error("GET notes error", e);
    res.status(500).json({ error: "server_error" });
  }
});

/** POST /api/patients/:id/notes — crée une note
 *  body: { content: string }
 */
router.post("/patients/:id/notes", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body || {};
  if (!content || !content.trim()) return res.status(400).json({ error: "missing_content" });

  try {
    const { rows } = await pool.query(
      `insert into patient_note (patient_id, content)
       values ($1, $2)
       returning id, patient_id, content, created_at`,
      [id, content.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error("POST note error", e);
    res.status(500).json({ error: "server_error" });
  }
});

export default router;

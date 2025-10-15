import { Router } from "express";
import { query } from "../db.js";
const router = Router();

/**
 * GET /patients?query=...
 * - Recherche par nom/prénom/ID
 * - Ou renvoie les 25 derniers créés
 */
router.get("/", async (req, res) => {
  const q = (req.query.query || "").trim();
  let rows;
  if (q) {
    rows = (
      await query(
        `SELECT id, firstname, lastname, blood_type, allergies_summary
         FROM patient 
         WHERE lastname ILIKE $1 OR firstname ILIKE $1 OR id::text = $2
         ORDER BY lastname, firstname
         LIMIT 50`,
        [`%${q}%`, q]
      )
    ).rows;
  } else {
    rows = (
      await query(
        `SELECT id, firstname, lastname, blood_type, allergies_summary
         FROM patient 
         ORDER BY created_at DESC
         LIMIT 25`
      )
    ).rows;
  }
  res.json({ items: rows });
});

/**
 * GET /patients/:id
 * - Détail patient + visites + notes récentes
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const p = (await query(`SELECT * FROM patient WHERE id = $1`, [id])).rows[0];
  if (!p) return res.status(404).json({ error: "not_found" });
  const visits = (
    await query(
      `SELECT * FROM visit WHERE patient_id = $1 ORDER BY admitted_at DESC LIMIT 10`,
      [id]
    )
  ).rows;
  const notes = (
    await query(
      `SELECT n.* FROM note n 
       JOIN visit v ON v.id = n.visit_id 
       WHERE v.patient_id = $1 
       ORDER BY n.created_at DESC 
       LIMIT 10`,
      [id]
    )
  ).rows;
  res.json({ patient: p, visits, notes });
});

/**
 * POST /patients
 * - Accepte deux formats :
 *   1) Nouveau : { patient, situation, drugs, notes }
 *   2) Ancien  : { firstname, lastname, blood_type, allergies_summary }
 * - N'insère pour l’instant QUE les colonnes existantes dans patient.
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const isNested = body && typeof body === "object" && "patient" in body;

    // mapping des champs patient (compat imbriqué et à plat)
    const src = isNested ? (body.patient || {}) : body;

    const firstname = (src.firstname || "").trim();
    const lastname = (src.lastname || "").trim();
    const blood_type = src.blood_type || null;
    const allergies_summary = src.allergies_summary || null;

    if (!firstname || !lastname) {
      return res.status(400).json({ error: "missing_fields" });
    }

    // ⚠️ INSERT limité aux colonnes existantes de ta table
    const row = (
      await query(
        `INSERT INTO patient (firstname, lastname, blood_type, allergies_summary)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [firstname, lastname, blood_type, allergies_summary]
      )
    ).rows[0];

    return res.status(201).json(row);
  } catch (err) {
    console.error("Erreur POST /patients:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;

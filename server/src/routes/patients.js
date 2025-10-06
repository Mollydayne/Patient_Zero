
import { Router } from "express";
import { query } from "../db.js";
const router = Router();

router.get("/", async (req,res)=>{
  const q = (req.query.query || "").trim();
  let rows;
  if (q) {
    rows = (await query(
      `SELECT id, firstname, lastname, blood_type, allergies_summary
       FROM patient 
       WHERE lastname ILIKE $1 OR firstname ILIKE $1 OR id::text = $2
       ORDER BY lastname, firstname
       LIMIT 50`,
      [ `%${q}%`, q ]

    )).rows;
  } else {
    rows = (await query(
      `SELECT id, firstname, lastname, blood_type, allergies_summary
       FROM patient ORDER BY created_at DESC LIMIT 25`
    )).rows;
  }
  res.json({ items: rows });
});

router.get("/:id", async (req,res)=>{
  const id = req.params.id;
  const p = (await query(`SELECT * FROM patient WHERE id = $1`, [id])).rows[0];
  if (!p) return res.status(404).json({ error: "not_found" });
  const visits = (await query(`SELECT * FROM visit WHERE patient_id = $1 ORDER BY admitted_at DESC LIMIT 10`, [id])).rows;
  const notes = (await query(
    `SELECT n.* FROM note n 
     JOIN visit v ON v.id = n.visit_id 
     WHERE v.patient_id = $1 ORDER BY n.created_at DESC LIMIT 10`, [id]
  )).rows;
  res.json({ patient: p, visits, notes });
});

router.post("/", async (req,res)=>{
  const { firstname, lastname, blood_type, allergies_summary } = req.body || {};
  if (!firstname || !lastname) return res.status(400).json({ error: "missing_fields" });
  const row = (await query(
    `INSERT INTO patient (firstname, lastname, blood_type, allergies_summary)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [firstname, lastname, blood_type || null, allergies_summary || null]
  )).rows[0];
  res.status(201).json(row);
});

export default router;

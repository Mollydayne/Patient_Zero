import { Router } from "express";
import { pool, query } from "../db.js";

const router = Router();

/**
 * GET /patients?query=...
 * - Recherche par nom, prénom, téléphone ou adresse
 * - Ou renvoie les 25 derniers créés
 */
router.get("/", async (req, res) => {
  const q = (req.query.query || "").trim();
  let rows;
  try {
    if (q) {
      rows = (
        await query(
          `SELECT id, firstname, lastname, address, phone, blood_type, allergies_summary
           FROM patient 
           WHERE lastname ILIKE $1
              OR firstname ILIKE $1
              OR address ILIKE $1
              OR phone ILIKE $1
              OR id::text = $2
           ORDER BY lastname, firstname
           LIMIT 50`,
          [`%${q}%`, q]
        )
      ).rows;
    } else {
      rows = (
        await query(
          `SELECT id, firstname, lastname, address, phone, blood_type, allergies_summary
           FROM patient 
           ORDER BY created_at DESC 
           LIMIT 25`
        )
      ).rows;
    }
    res.json({ items: rows });
  } catch (err) {
    console.error("Erreur GET /patients :", err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * GET /patients/:id
 * - Retourne le dossier complet d’un patient
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [
      patientRes,
      situationRes,
      drugsRes,
      intakeRes,
      visitNotesRes,
    ] = await Promise.all([
      query("SELECT * FROM patient WHERE id = $1", [id]),
      query("SELECT * FROM patient_situation WHERE patient_id = $1", [id]),
      query("SELECT * FROM patient_drugs WHERE patient_id = $1", [id]),
      query("SELECT * FROM patient_intake WHERE patient_id = $1", [id]),
      query(
        `SELECT id, patient_id, content, reason, amount, created_at
           FROM patient_note
          WHERE patient_id = $1
          ORDER BY created_at DESC
          LIMIT 10`,
        [id]
      ),
    ]);

    if (patientRes.rowCount === 0) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json({
      patient: patientRes.rows[0],
      situation: situationRes.rows[0] || {},
      drugs: drugsRes.rows,
      intake: intakeRes.rows,
      notes: visitNotesRes.rows,
    });
  } catch (err) {
    console.error("Erreur GET /patients/:id :", err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * POST /patients
 * - Crée un nouveau patient
 */
router.post("/", async (req, res) => {
  const {
    firstname,
    lastname,
    birthdate,
    address,
    phone,
    blood_type,
    allergies_summary,
  } = req.body;

  try {
    const { rows } = await query(
      `INSERT INTO patient (firstname, lastname, birthdate, address, phone, blood_type, allergies_summary)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [firstname, lastname, birthdate, address, phone, blood_type, allergies_summary]
    );
    res.status(201).json({ item: rows[0] });
  } catch (err) {
    console.error("Erreur POST /patients :", err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * PUT /patients/:id
 * - Met à jour les informations d’un patient
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, birthdate, address, phone, blood_type, allergies_summary } = req.body;
  try {
    const { rows } = await query(
      `UPDATE patient
          SET firstname = $1,
              lastname = $2,
              birthdate = $3,
              address = $4,
              phone = $5,
              blood_type = $6,
              allergies_summary = $7
        WHERE id = $8
      RETURNING *`,
      [firstname, lastname, birthdate, address, phone, blood_type, allergies_summary, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "not_found" });
    res.json({ item: rows[0] });
  } catch (err) {
    console.error("Erreur PUT /patients/:id :", err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * DELETE /patients/:id
 * - Supprime un patient et ses données associées
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM patient_note WHERE patient_id = $1", [id]);
    await client.query("DELETE FROM patient_situation WHERE patient_id = $1", [id]);
    await client.query("DELETE FROM patient_drugs WHERE patient_id = $1", [id]);
    await client.query("DELETE FROM patient_intake WHERE patient_id = $1", [id]);
    await client.query("DELETE FROM visit WHERE patient_id = $1", [id]);
    await client.query("DELETE FROM patient WHERE id = $1", [id]);

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur DELETE /patients/:id :", err);
    res.status(500).json({ error: "server_error" });
  } finally {
    client.release();
  }
});

/**
 * GET /patients/:id/notes
 * - Liste les notes (comptes-rendus) d’un patient
 */
router.get("/:id/notes", async (req, res) => {
  const patientId = req.params.id;
  try {
    const { rows } = await query(
      `SELECT id, patient_id, content, reason, amount, created_at
         FROM patient_note
        WHERE patient_id = $1
        ORDER BY created_at DESC`,
      [patientId]
    );
    res.json({ items: rows });
  } catch (err) {
    console.error("Erreur GET /patients/:id/notes :", err);
    res.status(500).json({ error: "server_error" });
  }
});

/**
 * POST /patients/:id/notes
 * - Crée un compte-rendu clinique pour un patient
 */
router.post("/:id/notes", async (req, res) => {
  const patientId = req.params.id;
  const { content, reason, amount } = req.body || {};

  if (!content || String(content).trim().length === 0) {
    return res.status(400).json({ error: "missing_content" });
  }

  let amountValue = null;
  if (amount !== undefined && amount !== null && String(amount).trim() !== "") {
    const parsed = Number(amount);
    if (Number.isNaN(parsed)) {
      return res.status(400).json({ error: "invalid_amount" });
    }
    amountValue = parsed;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const exists = await client.query("SELECT 1 FROM patient WHERE id = $1", [patientId]);
    if (exists.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "patient_not_found" });
    }

    const { rows } = await client.query(
      `INSERT INTO patient_note (patient_id, content, reason, amount)
       VALUES ($1, $2, $3, $4)
       RETURNING id, patient_id, content, reason, amount, created_at`,
      [patientId, content, reason || null, amountValue]
    );

    await client.query("COMMIT");
    return res.status(201).json({ item: rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur POST /patients/:id/notes :", err);
    return res.status(500).json({ error: "server_error" });
  } finally {
    client.release();
  }
});

export default router;

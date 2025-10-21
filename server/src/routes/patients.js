import { Router } from "express";
import { pool, query } from "../db.js";
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
   // Si une query est fournie
rows = (
  await query(
    `SELECT p.id, p.firstname, p.lastname, pp.address, pp.phone
       FROM patient p
       LEFT JOIN patient_profile pp ON pp.patient_id = p.id
      WHERE p.lastname ILIKE $1
         OR p.firstname ILIKE $1
         OR p.id::text = $2
      ORDER BY p.lastname, p.firstname
      LIMIT 50`,
    [`%${q}%`, q]
  )
).rows;

  } else {
    rows = (
  await query(
    `SELECT p.id, p.firstname, p.lastname, pp.address, pp.phone
       FROM patient p
       LEFT JOIN patient_profile pp ON pp.patient_id = p.id
      ORDER BY p.created_at DESC
      LIMIT 25`
  )
).rows;
  }
  res.json({ items: rows });
});

/**
 * GET /api/patients/:id
 * - Détail patient + profil/situation/drugs + dernier snapshot + visites + notes récentes
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Patient de base
    const patient = (await query(`SELECT * FROM patient WHERE id = $1`, [id])).rows[0];
    if (!patient) return res.status(404).json({ error: "not_found" });

    // Requêtes parallèles pour tout le reste
    const [
      profileRes,
      situationRes,
      drugsRes,
      lastIntakeRes,
      visitsRes,
      visitNotesRes,
    ] = await Promise.all([
      query(
        `SELECT phone, address, religion, social_score
           FROM patient_profile
          WHERE patient_id = $1`,
        [id]
      ),
      query(
        `SELECT marital_status, job, criminal_activity, influence
           FROM patient_situation
          WHERE patient_id = $1`,
        [id]
      ),
      query(
        `SELECT drug_use, frequency, disability, influence
           FROM patient_drugs
          WHERE patient_id = $1`,
        [id]
      ),
      query(
        `SELECT snapshot, created_at
           FROM patient_intake
          WHERE patient_id = $1
          ORDER BY created_at DESC
          LIMIT 1`,
        [id]
      ),
      query(
        `SELECT *
           FROM visit
          WHERE patient_id = $1
          ORDER BY admitted_at DESC
          LIMIT 10`,
        [id]
      ),
      query(
        `SELECT n.*
           FROM note n
           JOIN visit v ON v.id = n.visit_id
          WHERE v.patient_id = $1
          ORDER BY n.created_at DESC
          LIMIT 10`,
        [id]
      ),
    ]);

    res.json({
      patient,
      profile:   profileRes.rows[0]   || null,
      situation: situationRes.rows[0] || null,
      drugs:     drugsRes.rows[0]     || null,
      last_intake: lastIntakeRes.rows[0] || null, // => { snapshot: {patient,situation,drugs,notes}, created_at }
      visits:    visitsRes.rows,
      notes:     visitNotesRes.rows,
    });
  } catch (err) {
    console.error("Erreur GET /patients/:id:", err);
    res.status(500).json({ error: "server_error" });
  }
});


/**
 * POST /api/patients
 * Body accepté : { patient:{...}, situation:{...}, drugs:{...}, notes:"..." } (format actuel du front)
 * - Crée le patient
 * - Upsert profile / situation / drugs
 * - Ajoute une note si fournie
 * - Stocke le snapshot JSONB complet pour fidélité 1:1 avec RegisterSummary
 */
router.post("/", async (req, res) => {
  const draft = req.body || {};
  const { patient = {}, situation = {}, drugs = {}, notes = "" } = draft;

  const firstname = (patient.firstname || "").trim();
  const lastname  = (patient.lastname  || "").trim();
  if (!firstname || !lastname) {
    return res.status(400).json({ error: "missing_fields" });
  }

  // Champs "anciens" (si un jour tu branches RegisterPatientHealth.jsx)
  const blood_type = patient.blood_type || null;
  const allergies_summary = patient.allergies_summary || null;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Patient (table existante)
    const created = await client.query(
      `INSERT INTO patient (firstname, lastname, blood_type, allergies_summary)
       VALUES ($1, $2, $3, $4)
       RETURNING id, firstname, lastname, dob, blood_type, allergies_summary, created_at`,
      [firstname, lastname, blood_type, allergies_summary]
    );
    const p = created.rows[0];

    // 2) Profil
    await client.query(
      `INSERT INTO patient_profile (patient_id, phone, address, religion, social_score)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (patient_id) DO UPDATE
       SET phone = EXCLUDED.phone,
           address = EXCLUDED.address,
           religion = EXCLUDED.religion,
           social_score = EXCLUDED.social_score,
           updated_at = now()`,
      [p.id, patient.phone || null, patient.address || null, patient.religion || null, patient.socialScore || null]
    );

    // 3) Situation
    await client.query(
      `INSERT INTO patient_situation (patient_id, marital_status, job, criminal_activity, influence)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (patient_id) DO UPDATE
       SET marital_status = EXCLUDED.marital_status,
           job = EXCLUDED.job,
           criminal_activity = EXCLUDED.criminal_activity,
           influence = EXCLUDED.influence,
           updated_at = now()`,
      [p.id, situation.maritalStatus || null, situation.job || null, situation.criminalActivity || null, situation.influence || null]
    );

    // 4) Drugs
    await client.query(
      `INSERT INTO patient_drugs (patient_id, drug_use, frequency, disability, influence)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (patient_id) DO UPDATE
       SET drug_use = EXCLUDED.drug_use,
           frequency = EXCLUDED.frequency,
           disability = EXCLUDED.disability,
           influence = EXCLUDED.influence,
           updated_at = now()`,
      [p.id, drugs.drugUse || null, drugs.frequency || null, drugs.disability || null, drugs.influence || null]
    );

    // 5) Note (si fournie)
    if ((notes || "").trim()) {
      await client.query(
        `INSERT INTO patient_note (patient_id, content) VALUES ($1, $2)`,
        [p.id, notes]
      );
    }

    // 6) Snapshot JSONB complet (fidélité RegisterSummary)
    await client.query(
      `INSERT INTO patient_intake (patient_id, snapshot) VALUES ($1, $2::jsonb)`,
      [p.id, JSON.stringify(draft)]
    );

    await client.query("COMMIT");
    return res.status(201).json({ id: p.id, ...p });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur POST /patients:", err);
    return res.status(500).json({ error: "server_error" });
  } finally {
    client.release();
  }
});

export default router;

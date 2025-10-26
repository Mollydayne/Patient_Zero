// server/scripts/createLocalUser.js
import bcrypt from "bcrypt";
import { pool } from "../src/db.js";

//  anti-prod
const url = process.env.DATABASE_URL || "";
const isProdEnv = process.env.NODE_ENV === "production";
const looksRemote = /railway\.app|amazonaws\.com|gcp|azure|vercel|render\.com/i.test(url);
const isLocalUrl = /localhost|127\.0\.0\.1/i.test(url) || url === "";

if (isProdEnv) {
  console.error("❌ Refus d'exécuter en production (NODE_ENV=production).");
  process.exit(1);
}
if (!isLocalUrl || looksRemote) {
  console.error("❌ Refus d'exécuter: la base ne semble pas locale (DATABASE_URL ressemble à une DB distante).");
  console.error("   DATABASE_URL actuel:", url || "(non défini)");
  process.exit(1);
}

// ⚙️ Paramètres (modifiable via env si besoin)
const USERNAME = process.env.TEST_USER_USERNAME || "testuser";
const PASSWORD = process.env.TEST_USER_PASSWORD || "test123";
const ROLE = process.env.TEST_USER_ROLE || "admin";

async function columnExists(table, column) {
  const { rows } = await pool.query(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_name = $1 AND column_name = $2
     ) AS exists`,
    [table, column]
  );
  return rows?.[0]?.exists === true;
}

async function main() {
  const hashed = await bcrypt.hash(PASSWORD, 10);

  // Détection des colonnes présentes pour éviter de "casser" selon ton schéma
  const hasRole = await columnExists("app_user", "role");
  const hasIsActive = await columnExists("app_user", "is_active");

  // On regarde si l'utilisateur existe déjà
  const { rows } = await pool.query(
    `SELECT id FROM app_user WHERE username = $1 LIMIT 1`,
    [USERNAME]
  );

  if (rows.length === 0) {
    // INSERT "souple" selon les colonnes disponibles
    if (hasRole && hasIsActive) {
      await pool.query(
        `INSERT INTO app_user (username, password, role, is_active)
         VALUES ($1, $2, $3, $4)`,
        [USERNAME, hashed, ROLE, true]
      );
    } else if (hasRole) {
      await pool.query(
        `INSERT INTO app_user (username, password, role)
         VALUES ($1, $2, $3)`,
        [USERNAME, hashed, ROLE]
      );
    } else {
      await pool.query(
        `INSERT INTO app_user (username, password)
         VALUES ($1, $2)`,
        [USERNAME, hashed]
      );
    }
    console.log(`✅ Utilisateur '${USERNAME}' créé (mdp: ${PASSWORD}).`);
  } else {
    // UPDATE pour réinitialiser le mot de passe sans casser le schéma
    if (hasRole && hasIsActive) {
      await pool.query(
        `UPDATE app_user
         SET password = $2, role = $3, is_active = $4
         WHERE username = $1`,
        [USERNAME, hashed, ROLE, true]
      );
    } else if (hasRole) {
      await pool.query(
        `UPDATE app_user
         SET password = $2, role = $3
         WHERE username = $1`,
        [USERNAME, hashed, ROLE]
      );
    } else {
      await pool.query(
        `UPDATE app_user
         SET password = $2
         WHERE username = $1`,
        [USERNAME, hashed]
      );
    }
    console.log(`🔁 Utilisateur '${USERNAME}' existait déjà: mot de passe réinitialisé.`);
  }

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});

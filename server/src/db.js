// server/src/db.js
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Détecte si on utilise une URL distante (Railway) ou locale
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Configuration du pool PostgreSQL
const poolConfig = hasDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // obligatoire pour Railway
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      ssl: false,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

// Création du pool
export const pool = new Pool(poolConfig);

// Petits logs de sécurité (désactivés pour prod)
pool.on("error", (err) => {
  console.error("[db] Pool error:", err.message);
});

export const query = (text, params) => pool.query(text, params);

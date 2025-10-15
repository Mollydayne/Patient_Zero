// server/src/db.js
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Détecte si on utilise une URL distante (Railway externe)
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Si DATABASE_URL est fournie, on l'utilise (cas Railway externe) + SSL
// Sinon, pg lit PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE depuis l'env (cas local/dév)
const poolConfig = hasDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // IMPORTANT pour Railway externe
      // optional: timeouts confort
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      // Laisse pg piocher dans PGHOST/..., ou met tes valeurs locales ici si besoin
      ssl: false,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

export const pool = new Pool(poolConfig);

// Logs utiles
pool.on("error", (err) => {
  console.error("[db] Pool error:", err.message);
});
pool.on("connect", () => {
  // console.log("[db] New client connected");
});
pool.on("acquire", () => {
  // console.log("[db] Client acquired");
});

export const query = (text, params) => pool.query(text, params);

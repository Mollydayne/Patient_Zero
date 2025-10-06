
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const sqlPath = path.join(__dirname, "../db/migrations/001_init.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");
  console.log("[migrate] applying 001_init.sql...");
  await query(sql);
  console.log("[migrate] done.");
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });

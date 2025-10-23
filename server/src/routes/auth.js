// server/src/routes/auth.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

// --------- Config ----------
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_TTL_DAYS = Number(process.env.JWT_TTL_DAYS || 7);

// ⚠️ Pour un front sur un domaine différent (Vercel) :
//    - en prod, il faut Secure:true + SameSite:'none' pour que le cookie passe cross-site.
const sameSite =
  process.env.COOKIE_SAMESITE?.toLowerCase?.() ||
  (process.env.NODE_ENV === "production" ? "none" : "lax"); // "lax" en dev local
const secure = process.env.NODE_ENV === "production"; // true en prod

function setSessionCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: `${JWT_TTL_DAYS}d` });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite, // 'none' si front/back sur domaines différents en prod
    maxAge: JWT_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

// --------- Middleware ----------
export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET); // { id, username, role }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

// Optionnel : requireRole("admin") pour protéger des routes admin
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}

// --------- Routes ----------
/**
 * POST /api/auth/login
 * Body: { username, password }
 * Compare en clair (pas de hash, voulu pour ton usage)
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: "missing_fields" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, username, password, role, is_active
         FROM app_user
        WHERE username = $1
        LIMIT 1`,
      [username]
    );
    const user = rows[0];
    if (!user || user.is_active === false) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    // Comparaison en clair (convenu pour jeu/proto)
    if (password !== user.password) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const payload = { id: user.id, username: user.username, role: user.role || "user" };
    setSessionCookie(res, payload);
    return res.json({ ok: true, user: payload });
  } catch (e) {
    console.error("auth/login error:", e);
    return res.status(500).json({ error: "server_error" });
  }
});

/**
 * GET /api/auth/me
 * Renvoie l'utilisateur courant (ou null)
 */
router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.json({ user: null });
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ user: payload });
  } catch {
    return res.json({ user: null });
  }
});

/**
 * POST /api/auth/logout
 * Supprime le cookie de session
 */
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    sameSite,
    secure,
    httpOnly: true,
  });
  return res.json({ ok: true });
});

export default router;

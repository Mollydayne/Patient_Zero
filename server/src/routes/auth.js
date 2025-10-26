// server/src/routes/auth.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

// ---------- Config ----------
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_TTL_DAYS = Number(process.env.JWT_TTL_DAYS || 7);

const isProd = process.env.NODE_ENV === "production";

// SameSite par défaut : 'none' en prod (cross-site Vercel → Railway), 'lax' en dev
const sameSite =
  (process.env.COOKIE_SAMESITE?.toLowerCase?.() || (isProd ? "none" : "lax"));
// Secure obligatoire en prod pour SameSite=None + HTTPS
const secure = isProd;

// ---------- Helpers ----------
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${JWT_TTL_DAYS}d` });
}

/**
 * Middleware d'authentification :
 * - lit d'abord le cookie httpOnly
 * - fallback sur le header Authorization: Bearer <token>
 */
export function requireAuth(req, res, next) {
  try {
    const cookieToken = req.cookies?.[COOKIE_NAME];

    const auth = req.get("Authorization");
    const headerToken = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ error: "unauthorized" });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, username, role }
    next();
  } catch (_) {
    return res.status(401).json({ error: "unauthorized" });
  }
}

/**
 * Middleware d’auto — optionnel (n’échoue pas si non connecté)
 */
export function maybeAuth(req, _res, next) {
  try {
    const cookieToken = req.cookies?.[COOKIE_NAME];
    const auth = req.get("Authorization");
    const headerToken = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    const token = cookieToken || headerToken;
    if (token) req.user = jwt.verify(token, JWT_SECRET);
  } catch (_) {
    // ignore
  }
  next();
}

/**
 * Middleware de rôles
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}

// ---------- Routes ----------

/**
 * POST /api/auth/login
 * Body: { username, password }
 * NB: comparaison en clair (selon ton implémentation actuelle).
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: "missing_credentials" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, username, password, role
         FROM app_user
        WHERE username = $1
        LIMIT 1`,
      [username]
    );

    const user = rows[0];
    if (!user || user.password !== password) {
      // (si tu hashes plus tard, remplace par bcrypt.compare)
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = signToken(payload);

    // Pose le cookie httpOnly pour usage cross-site (Vercel → Railway)
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure,        // true en prod
      sameSite,      // 'none' en prod
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * JWT_TTL_DAYS,
    });

    // Et retourne aussi le token (utile si tu veux l'utiliser en Bearer côté front)
    return res.json({ ok: true, token, user: payload });
  } catch (err) {
    console.error("auth/login error:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

/**
 * GET /api/auth/me
 * Permet au front de vérifier la session.
 */
router.get("/me", maybeAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: "unauthorized" });
  res.json({ user: req.user });
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

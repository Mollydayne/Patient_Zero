import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoPanakeia from "../assets/logo_panakeia_full_green.png"; // ✅ assure-toi que l'image est bien dans /src/assets/

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.username.trim(), form.password);
      navigate("/", { replace: true });
    } catch {
      setError("Identifiants invalides.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1d17] text-gray-100 font-sans">
      {/* Conteneur glossy */}
      <div className="relative w-full max-w-sm bg-green-900/20 backdrop-blur-md border border-green-400/30 shadow-lg rounded-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoPanakeia}
            alt="Logo Panakeia"
            className="w-48 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-center text-2xl font-semibold text-green-200 mb-2">
            Connexion sécurisée
          </h1>

          <div>
            <label className="block text-sm text-green-200/80 mb-1">Nom d'utilisateur</label>
            <input
              className="w-full bg-green-950/40 text-green-100 border border-green-500/30 rounded-md px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-green-200/80 mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full bg-green-950/40 text-green-100 border border-green-500/30 rounded-md px-3 py-2 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="text-center text-red-400 text-sm mt-2">{error}</div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-green-600/60 hover:bg-green-500/70 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]"
          >
            Se connecter
          </button>
        </form>

        {/* Effet de lueur en bas */}
        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-green-500/10 to-transparent rounded-b-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}

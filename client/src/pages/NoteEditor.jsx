import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GlossyButton from "../components/ui/GlossyButton.jsx"; // si tu l’as déjà
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Éditeur de compte-rendu clinique */
export default function NoteEditor() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reason: "",
    amount: "",
    content: "",
  });
  const [saving, setSaving] = useState(false);

  const canSave =
    form.content.trim().length > 0 &&
    form.reason.trim().length > 0 &&
    form.amount.trim().length > 0 &&
    !saving;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/patients/${patientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("save_failed");
      navigate(`/patients/${patientId}`, { replace: true });
    } catch (e) {
      console.error(e);
      alert("Erreur : impossible d’enregistrer le compte-rendu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-gray-800 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-emerald-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-emerald-700 drop-shadow-sm">
            🩺 Rédiger un compte-rendu
          </h1>
          <Link
            className="text-sm text-emerald-600 hover:underline"
            to={`/patients/${patientId}`}
          >
            ← Retour au dossier
          </Link>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Motif de la visite
            </label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Ex : Douleur thoracique, suivi post-op, contrôle annuel..."
              className="w-full rounded-2xl border border-emerald-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Montant facturé ($)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Ex : 120"
              className="w-full rounded-2xl border border-emerald-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Contenu du compte-rendu
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              placeholder="Anamnèse, examen clinique, diagnostics, conduite à tenir…"
              className="w-full rounded-2xl border border-emerald-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-400 transition resize-y"
            />
          </div>

          <div className="mt-6 flex gap-3">
            {GlossyButton ? (
              <GlossyButton
                onClick={save}
                disabled={!canSave}
                color="emerald"
                text={saving ? "Enregistrement..." : "Enregistrer le compte-rendu"}
              />
            ) : (
              <button
                onClick={save}
                disabled={!canSave}
                className={`rounded-2xl px-6 py-2 font-medium text-white shadow transition ${
                  canSave
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-emerald-300 cursor-not-allowed"
                }`}
              >
                {saving ? "Enregistrement..." : "Enregistrer le compte-rendu"}
              </button>
            )}

            <Link
              to={`/patients/${patientId}`}
              className="rounded-2xl px-6 py-2 border border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50 transition"
            >
              Annuler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

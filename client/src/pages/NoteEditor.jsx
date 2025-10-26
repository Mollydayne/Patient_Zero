import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Éditeur simple pour rédiger un compte-rendu (note clinique) */
export default function NoteEditor() {
  const { id: patientId } = useParams(); // /patients/:id/notes/new
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const canSave = content.trim().length > 0 && !saving;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/patients/${patientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("save_failed");
      navigate(`/patients/${patientId}`, { replace: true }); // retour à la fiche
    } catch (e) {
      console.error(e);
      alert("Erreur : impossible d’enregistrer le compte-rendu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Rédiger un compte-rendu</h1>
          <Link className="text-sm text-gray-400 hover:underline" to={`/patients/${patientId}`}>
            ← Retour au dossier patient
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <label className="block text-sm mb-2 opacity-80">Contenu du compte-rendu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="Anamnèse, examen clinique, diagnostics, conduite à tenir…"
            className="w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none focus:border-emerald-500 resize-y"
          />
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={save}
              disabled={!canSave}
              className={`rounded-2xl px-5 py-2 text-sm font-medium shadow text-white ${
                canSave ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-400/60 cursor-not-allowed"
              }`}
            >
              {saving ? "Enregistrement…" : "Enregistrer le compte-rendu"}
            </button>
            <Link
              to={`/patients/${patientId}`}
              className="rounded-2xl px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Annuler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

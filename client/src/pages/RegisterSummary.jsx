// RegisterSummary.jsx — refactor glossy vert/transparent aligné au design Register*
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useRegistration } from "../context/RegistrationContext.jsx";

// DS commun
import FormCard from "../components/form/FormCard.jsx";
import ActionNext from "../components/form/ActionNext.jsx";

export default function RegisterSummary() {
  const navigate = useNavigate();
  const { draft, reset } = useRegistration();

  const { patient = {}, situation = {}, drugs = {}, notes = "" } = draft || {};

  const fullname = useMemo(
    () => [patient.firstname, patient.lastname].filter(Boolean).join(" ") || "<prénom> <NOM>",
    [patient.firstname, patient.lastname]
  );

  // État d'enregistrement
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSave() {
    setError("");
    setCreated(null);

    if (!API_URL) {
      setError(
        "VITE_API_URL est manquant. Renseigne l’URL de ton API (ex: https://<service>.up.railway.app) dans Vercel ou .env.local."
      );
      return;
    }

    const payload = { patient, situation, drugs, notes };

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Erreur ${res.status}`);
      }

      const data = await res.json();
      setCreated(data);

      // reset du brouillon
      localStorage.removeItem("registrationDraft");
      reset();
    } catch (e) {
      setError(e.message || "Échec de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#f7faf8] px-6 py-8 flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        {/* En-tête */}
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-emerald-900">Résumé du dossier</h1>
            <p className="text-sm text-emerald-900/70">Vérifie les informations puis enregistre le patient.</p>
          </div>
          <div className="text-2xl font-bold text-emerald-950/80">{fullname}</div>
        </header>

        {/* Feedback état */}
        {(created || error) && (
          <div className="grid gap-3">
            {created && (
              <div className="rounded-2xl border border-emerald-300/50 bg-emerald-50/60 backdrop-blur px-4 py-3 shadow-sm">
                <p className="font-medium text-emerald-900">✅ Dossier enregistré avec succès</p>
                <p className="text-sm mt-1 text-emerald-900/80">
                  ID : <span className="font-mono">{created.id || "—"}</span>
                  {[created.firstname, created.lastname].some(Boolean) && (
                    <>
                      {" "}• Patient : <span className="font-semibold">{[created.firstname, created.lastname].filter(Boolean).join(" ")}</span>
                    </>
                  )}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate("/patients")}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2"
                  >
                    Voir la liste des patients
                  </button>
                  {created.id && (
                    <button
                      onClick={() => navigate(`/patients/${created.id}`)}
                      className="rounded-xl border border-emerald-600/70 text-emerald-700 hover:bg-emerald-600/10 text-sm font-medium px-4 py-2"
                    >
                      Ouvrir le dossier
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-300/60 bg-red-50/70 backdrop-blur px-4 py-3 shadow-sm">
                <p className="font-medium text-red-900">❌ Erreur</p>
                <p className="text-sm mt-1 text-red-900/80">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Résumé en cartes glossy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard title="Informations personnelles" icon="👤">
            <SummaryRow label="Téléphone" value={patient.phone} />
            <SummaryRow label="Score social" value={patient.socialScore} />
            <SummaryRow label="Adresse" value={patient.address} />
            <SummaryRow label="Confession" value={patient.religion} />
          </FormCard>

          <FormCard title="Situation" icon="🏠">
            <SummaryRow label="Situation matrimoniale" value={situation.maritalStatus} />
            <SummaryRow label="Métier" value={situation.job} />
            <SummaryRow label="Activité criminelle" value={situation.criminalActivity} />
            <SummaryRow label="Influence (soignant)" value={situation.influence} />
          </FormCard>

          <FormCard title="Antécédents / Substances" icon="🧪">
            <SummaryRow label="Drogues" value={drugs.drugUse || "Aucune"} />
            <SummaryRow label="Fréquence" value={drugs.frequency || "N/A"} />
            <SummaryRow label="Handicap" value={drugs.disability || "Aucun"} />
            <SummaryRow label="Influence (soignant)" value={drugs.influence} />
          </FormCard>

          <FormCard title="Notes" icon="📝">
            <p className="text-sm leading-relaxed text-emerald-950/90 whitespace-pre-wrap">
              {notes || "—"}
            </p>
          </FormCard>
        </div>

        {/* Actions secondaires (glossy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionTile onClick={() => { /* hook futur */ }}>Rédiger un compte‑rendu</ActionTile>
          <ActionTile onClick={() => { /* hook futur */ }}>Consulter les compte‑rendus</ActionTile>
          <ActionTile onClick={() => { /* hook futur */ }}>Générer une ordonnance</ActionTile>
          <ActionTile intent="danger" onClick={() => { /* hook futur */ }}>Supprimer le dossier</ActionTile>
        </div>

        {/* Barre d'action principale */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`rounded-2xl px-5 py-3 text-sm font-medium shadow transition text-white
                ${saving ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>

            <Link to="/patients" className="text-sm text-emerald-800 hover:underline">
              ← Retour aux patients
            </Link>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("registrationDraft");
              reset();
            }}
            className="text-sm text-rose-800 hover:underline"
          >
            Réinitialiser le brouillon
          </button>
        </div>

        {/* CTA de continuité (même composant que les autres pages) */}
        <ActionNext onClick={handleSave}>
          {saving ? "Enregistrement…" : "Enregistrer le patient"}
        </ActionNext>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1.5">
      <span className="text-emerald-900/70">{label} :</span>
      <span className="text-emerald-950/90 text-right">{String(value ?? "—")}</span>
    </div>
  );
}

function ActionTile({ children, intent = "primary", ...props }) {
  const base =
    "w-full rounded-2xl py-4 px-4 text-center text-sm font-medium shadow transition border backdrop-blur " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";
  const styles =
    intent === "danger"
      ? "border-rose-300/50 bg-rose-50/60 text-rose-900 hover:bg-rose-100/70"
      : "border-emerald-300/50 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100/70";
  return (
    <button {...props} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

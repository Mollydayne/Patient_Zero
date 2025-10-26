// RegisterSummary.jsx — version patchée avec ouverture de l’éditeur d’ordonnance
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useRegistration } from "../context/RegistrationContext.jsx";
import FormCard from "../components/form/FormCard.jsx";

export default function RegisterSummary() {
  const navigate = useNavigate();
  const { draft, reset } = useRegistration();
  const { patient = {}, situation = {}, drugs = {}, notes = "" } = draft || {};

  const fullname = useMemo(
    () => [patient.firstname, patient.lastname].filter(Boolean).join(" ") || "<prénom> <NOM>",
    [patient.firstname, patient.lastname]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /** Enregistre le patient en base et renvoie l'objet créé */
  async function handleSave() {
    setError("");
    setCreated(null);
    if (!API_URL) {
      setError("VITE_API_URL manquant");
      return null;
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
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCreated(data);
      localStorage.removeItem("registrationDraft");
      reset();
      return data;
    } catch (e) {
      setError(e.message || "Échec de l’enregistrement");
      return null;
    } finally {
      setSaving(false);
    }
  }

  /** Ouvre la page d’édition d’ordonnance (enregistre si besoin) */
  async function handlePrescription() {
    let id = created?.id;
    if (!id) {
      const newPatient = await handleSave();
      id = newPatient?.id;
    }
    if (id) navigate(`/patients/${id}/prescriptions/new`);
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

        {/* Feedback */}
        {error && (
          <div className="rounded-2xl border border-red-300/60 bg-red-50/70 px-4 py-3">
            <p className="font-medium text-red-900">❌ Erreur</p>
            <p className="text-sm text-red-900/80 mt-1">{error}</p>
          </div>
        )}

        {/* Cartes de résumé */}
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

        {/* Actions secondaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionTile onClick={() => { /* hook futur */ }}>Rédiger un compte-rendu</ActionTile>
          <ActionTile onClick={handlePrescription}>Générer une ordonnance</ActionTile>
        </div>

        {/* Action principale */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`rounded-2xl px-5 py-3 text-sm font-medium shadow text-white transition
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
    "w-full rounded-2xl py-4 px-4 text-center text-sm font-medium shadow transition border backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";
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

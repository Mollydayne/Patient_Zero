// RegisterSummary.jsx
import { Link } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

export default function RegisterSummary() {
  const { draft, reset } = useRegistration();

  // Déstructure avec valeurs par défaut
  const {
    patient = {},
    situation = {},
    drugs = {},
    notes = "",
  } = draft || {};

  const fullname =
    [patient.firstname, patient.lastname].filter(Boolean).join(" ") ||
    "<prénom> <NOM>";

  return (
    <div className="min-h-screen bg-[#EADEDA] text-black flex flex-col items-center p-6 font-sans">
      {/* En-tête */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-[#0AA15D]">
          Résumé du dossier
        </h1>
        <div className="text-2xl font-bold">{fullname}</div>
      </div>

      {/* Grille */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <Section title="Informations personnelles">
          <Row label="Téléphone" value={patient.phone} />
          <Row label="Score social" value={patient.socialScore} />
          <Row label="Adresse" value={patient.address} />
          <Row label="Confession" value={patient.religion} />
        </Section>

        {/* Situation */}
        <Section title="Situation">
          <Row label="Situation matrimoniale" value={situation.maritalStatus} />
          <Row label="Métier" value={situation.job} />
          <Row label="Activité criminelle" value={situation.criminalActivity} />
          <Row label="Influence (soignant)" value={situation.influence} />
        </Section>

        {/* Antécédents / Substances */}
        <Section title="Antécédents / Substances">
          <Row label="Drogues" value={drugs.drugUse || "Aucune"} />
          <Row label="Fréquence" value={drugs.frequency || "N/A"} />
          <Row label="Handicap" value={drugs.disability || "Aucun"} />
          <Row label="Influence (soignant)" value={drugs.influence} />
        </Section>

        {/* Notes */}
        <Section title="Notes">
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {notes || "—"}
          </p>
        </Section>
      </div>

      {/* Actions */}
      <div className="w-full max-w-5xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionButton onClick={() => { /* à brancher plus tard */ }}>
          Rédiger un compte-rendu
        </ActionButton>
        <ActionButton onClick={() => { /* à brancher plus tard */ }}>
          Consulter les compte-rendus
        </ActionButton>
        <ActionButton onClick={() => { /* à brancher plus tard */ }}>
          Générer une ordonnance
        </ActionButton>
        <ActionButton intent="danger" onClick={() => { /* à brancher plus tard */ }}>
          Supprimer le dossier
        </ActionButton>
      </div>

      {/* Lien retour et reset */}
      <div className="w-full max-w-5xl mt-6 flex justify-between">
        <Link
          to="/patients"
          className="text-sm text-[#0AA15D] hover:underline"
        >
          ← Retour aux patients
        </Link>
        <button
          onClick={reset}
          className="text-sm text-[#8A3033] hover:underline"
        >
          Réinitialiser le brouillon
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-[#F9F9F9] rounded-xl p-5 shadow border border-gray-300">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block w-2 h-2 rounded-full bg-[#0AA15D]" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-600">{label} :</span>
      <span className="text-gray-900 text-right">{value || "—"}</span>
    </div>
  );
}

function ActionButton({ children, intent = "primary", ...props }) {
  const styles =
    intent === "danger"
      ? "bg-[#8A3033] hover:bg-[#823329] text-white"
      : "bg-[#0AA15D] hover:bg-[#0db569] text-white";
  return (
    <button
      {...props}
      className={`w-full rounded-xl py-4 px-4 text-center text-sm font-medium shadow transition ${styles}`}
    >
      {children}
    </button>
  );
}

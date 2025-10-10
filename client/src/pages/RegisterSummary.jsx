import { Link } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext";

export default function RegisterSummary() {
  const { draft, reset } = useRegistration();
  const { patient = {}, situation = {}, drugs = {}, notes = "" } = draft;

  const fullname = [patient.firstname, patient.lastname].filter(Boolean).join(" ") || "<prénom> <NOM>";

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Résumé du dossier</h1>
        <div className="text-2xl font-bold opacity-90">{fullname}</div>
      </div>

      {/* Grille */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <Section title="Informations personnelles">
          <Row label="Téléphone" value={patient.phone} />
          <Row label="Score social" value={patient.socialScore} />
          <Row label="Adresse" value={patient.address} />
          <Row label="Confession" value={patient.faith} />
        </Section>

        {/* Situation */}
        <Section title="Situation">
          <Row label="Situation matrimoniale" value={situation.maritalStatus} />
          <Row label="Métier" value={situation.job} />
          <Row label="Activité criminelle" value={situation.crimeActivity} />
          <Row label="Influence" value={situation.influence} />
        </Section>

        {/* Antécédents médicaux */}
        <Section title="Antécédents médicaux">
          <Row label="Drogues" value={drugs.type || "Aucune"} />
          <Row label="Consommation" value={drugs.usage || "N/A"} />
          <Row label="Handicap" value={patient.handicap || "Aucun"} />
          <Row label="Traitements" value={patient.treatments || "Aucun"} />
        </Section>

        {/* Notes */}
        <Section title="Notes">
          <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
            {notes || "—"}
          </p>
        </Section>
      </div>

      {/* Boutons d’actions */}
      <div className="w-full max-w-5xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionButton onClick={()=>{/* à brancher plus tard */}}>
          Rédiger un compte-rendu
        </ActionButton>
        <ActionButton onClick={()=>{/* à brancher plus tard */}}>
          Consulter les compte-rendus précédents
        </ActionButton>
        <ActionButton onClick={()=>{/* à brancher plus tard */}}>
          Générer une ordonnance
        </ActionButton>
        <ActionButton intent="danger" onClick={()=>{/* à brancher plus tard */}}>
          Supprimer le dossier
        </ActionButton>
      </div>

      {/* Lien retour et reset (utile en dev) */}
      <div className="w-full max-w-5xl mt-6 flex justify-between">
        <Link to="/patients" className="text-sm text-gray-400 hover:text-gray-200 underline">← Retour aux patients</Link>
        <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-200 underline">Réinitialiser le brouillon</button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-[#1b1b1b] rounded-xl p-5 shadow border border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400/80" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400">{label} :</span>
      <span className="text-gray-200 text-right">{value || "—"}</span>
    </div>
  );
}

function ActionButton({ children, intent="primary", ...props }) {
  const styles = intent === "danger"
    ? "bg-[#8A3033] hover:bg-[#823329]"
    : "bg-cyan-600/80 hover:bg-cyan-600";
  return (
    <button {...props}
      className={`w-full rounded-xl py-4 px-4 text-center text-sm font-medium shadow transition ${styles}`}>
      {children}
    </button>
  );
}

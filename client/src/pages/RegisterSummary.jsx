// RegisterSummary.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegistration } from "../context/RegistrationContext.jsx";

export default function RegisterSummary() {
  const navigate = useNavigate();
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

  // État pour l’enregistrement
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null); // stocke la réponse (ex: patient créé)

  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSave() {
    setError("");
    setCreated(null);

    if (!API_URL) {
      setError(
        "VITE_API_URL est manquant. Renseigne l’URL de ton API (ex: https://<service>.up.railway.app) dans Vercel/ ton .env.local."
      );
      return;
    }

    // Payload envoyé au backend (tu pourras mapper plus finement côté route)
    const payload = { patient, situation, drugs, notes };

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // si l'API renvoie du texte en erreur, on l’affiche
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Erreur ${res.status}`);
      }

      const data = await res.json(); // ex: { id, firstname, ... } retourné par le backend
      setCreated(data);

      // On vide le brouillon local
      localStorage.removeItem("registrationDraft");
      reset();
    } catch (e) {
      setError(e.message || "Échec de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EADEDA] text-black flex flex-col items-center p-6 font-sans">
      {/* En-tête */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-[#0AA15D]">
          Résumé du dossier
        </h1>
        <div className="text-2xl font-bold">{fullname}</div>
      </div>

      {/* Messages état */}
      <div className="w-full max-w-5xl space-y-3 mb-4">
        {created && (
          <div className="rounded-xl border border-green-300 bg-green-50 text-green-800 p-4">
            <p className="font-medium">
              ✅ Dossier enregistré avec succès.
            </p>
            <p className="text-sm mt-1">
              ID: <span className="font-mono">{created.id || "—"}</span>
              {created.firstname || created.lastname ? (
                <>
                  {" "}
                  • Patient:{" "}
                  <span className="font-semibold">
                    {[created.firstname, created.lastname]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </span>
                </>
              ) : null}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigate("/patients")}
                className="rounded-lg bg-[#0AA15D] hover:bg-[#0db569] text-white text-sm font-medium px-4 py-2"
              >
                Voir la liste des patients
              </button>
              {/* Si tu as une page de détail, tu peux router vers /patients/:id */}
              {created.id && (
                <button
                  onClick={() => navigate(`/patients/${created.id}`)}
                  className="rounded-lg border border-[#0AA15D] text-[#0AA15D] hover:bg-[#0AA15D]/10 text-sm font-medium px-4 py-2"
                >
                  Ouvrir le dossier
                </button>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-800 p-4">
            <p className="font-medium">❌ Erreur</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
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

      {/* Enregistrer + Retour/Reset */}
      <div className="w-full max-w-5xl mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-xl px-5 py-3 text-sm font-medium shadow transition text-white
              ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-[#0AA15D] hover:bg-[#0db569]"}`}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>

          <Link
            to="/patients"
            className="text-sm text-[#0AA15D] hover:underline"
          >
            ← Retour aux patients
          </Link>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("registrationDraft");
            reset();
          }}
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
      <span className="text-gray-900 text-right">{String(value ?? "—")}</span>
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


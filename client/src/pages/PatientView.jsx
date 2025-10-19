// client/src/pages/PatientView.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

/* Utils */
function fmtDate(d, locale = "fr-FR") {
  if (!d) return "—";
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: undefined }).format(date);
  } catch {
    return "—";
  }
}

function Pill({ children }) {
  return (
    <span className="inline-block rounded-full border border-white/20 px-2 py-0.5 text-sm opacity-80">
      {children ?? "—"}
    </span>
  );
}

function Section({ title, children, right }) {
  return (
    <section className="bg-[#1b1b1b] rounded-xl border border-white/10 p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-4 lg:col-span-3 text-white/70">
        {label}
      </div>
      <div className={`col-span-12 md:col-span-8 lg:col-span-9 ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </div>
    </div>
  );
}

/* Page */
export default function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    let on = true;
    (async () => {
      setState({ loading: true, error: null });
      try {
        const base = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${base}/api/patients/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (on) setData(json), setState({ loading: false, error: null });
      } catch (e) {
        if (on) setState({ loading: false, error: e.message || "error" });
      }
    })();
    return () => { on = false; };
  }, [id]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-4">
          <div className="h-8 w-64 bg-white/10 rounded" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-white/10 rounded-xl" />
            <div className="h-64 bg-white/10 rounded-xl" />
            <div className="h-64 bg-white/10 rounded-xl md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <button onClick={() => navigate(-1)} className="btn btn--outline border-white/20 text-white/80">
              ← Retour
            </button>
          </div>
          <div className="bg-red-900/40 border border-red-700/50 text-red-100 rounded-xl p-4">
            <p className="font-semibold mb-1">Impossible de charger le dossier</p>
            <p className="opacity-90 text-sm">
              Détail : {String(state.error)} — vérifie l’ID patient et l’URL API
              (<code className="font-mono">{import.meta.env.VITE_API_URL}</code>).
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* Mapping exact à ta route backend */
  const {
    patient = {},
    profile = {},
    situation: sit = {},
    drugs = {},
    last_intake = null,
    visits = [],
    notes = [],
  } = data || {};

  const fullname = [patient.firstname, patient.lastname].filter(Boolean).join(" ") || "Patient inconnu";

  const handleCopyId = async () => {
    try {
      if (patient.id) await navigator.clipboard.writeText(patient.id);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Fil d'Ariane + actions */}
        <div className="flex items-center justify-between gap-3">
          <nav className="text-sm opacity-80">
            <Link className="hover:underline" to="/patients">Patients</Link> / <span className="opacity-90">{fullname}</span>
          </nav>
          <div className="flex gap-2">
            <Link
              to={`/patients/${patient.id}/edit`}
              className="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/5"
            >
              ✏️ Modifier
            </Link>
            <Link
              to={`/patients/${patient.id}/visits/new`}
              className="px-3 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
            >
              ➕ Nouvelle visite
            </Link>
          </div>
        </div>

        {/* En-tête */}
        <header className="bg-[#1b1b1b] rounded-2xl border border-white/10 p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{fullname}</h1>
              <div className="mt-1 flex flex-wrap gap-2">
                {patient.blood_type ? <Pill>Groupe {patient.blood_type}</Pill> : null}
                {patient.dob ? <Pill>Naissance : {fmtDate(patient.dob)}</Pill> : null}
                {patient.created_at ? <Pill>Dossier créé : {fmtDate(patient.created_at)}</Pill> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {patient.id ? <span className="font-mono text-sm opacity-80">{patient.id}</span> : null}
              {patient.id ? (
                <button
                  onClick={handleCopyId}
                  className="px-2 py-1 rounded-md border border-white/20 text-xs hover:bg白/5"
                  title="Copier l'identifiant patient"
                >
                  Copier
                </button>
              ) : null}
            </div>
          </div>
          {patient.allergies_summary ? (
            <div className="mt-4 p-3 rounded-lg bg-amber-900/30 border border-amber-400/30">
              <div className="text-amber-200 font-medium">Allergies</div>
              <div className="opacity-90">{patient.allergies_summary}</div>
            </div>
          ) : null}
        </header>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profil */}
          <Section title="Profil">
            <Row label="Nom complet" value={fullname} />
            <Row label="Date de naissance" value={patient.dob ? fmtDate(patient.dob) : "—"} />
            <Row label="Groupe sanguin" value={patient.blood_type || "—"} />
            <Row label="Allergies (résumé)" value={patient.allergies_summary || "—"} />
            <Row label="Téléphone" value={profile.phone || "—"} mono />
            <Row label="Adresse" value={profile.address || "—"} />
            <Row label="Religion" value={profile.religion || "—"} />
            <Row label="Score social" value={profile.social_score ?? "—"} />
          </Section>

          {/* Situation */}
          <Section title="Situation">
            <Row label="Statut marital" value={sit.marital_status || "—"} />
            <Row label="Profession" value={sit.job || "—"} />
            <Row label="Activité criminelle" value={sit.criminal_activity || "—"} />
            <Row label="Influence (situation)" value={sit.influence ?? "—"} />
          </Section>

          {/* Substances */}
          <Section title="Substances">
            <Row label="Usage de drogues" value={drugs.drug_use || "—"} />
            <Row label="Fréquence" value={drugs.frequency || "—"} />
            <Row label="Handicap / incapacité" value={drugs.disability || "—"} />
            <Row label="Influence (substances)" value={drugs.influence ?? "—"} />
          </Section>

          {/* Notes récentes */}
          <div className="md:col-span-2">
            <Section title="Notes récentes">
              {notes.length ? (
                <ul className="space-y-3">
                  {notes.map((n) => (
                    <li key={n.id} className="border border-white/10 rounded-lg p-3">
                      <div className="text-sm opacity-70 mb-1">
                        {fmtDate(n.created_at)} — note #{String(n.id).slice(0, 8)}
                      </div>
                      <div className="whitespace-pre-wrap">{n.content || "—"}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="opacity-80">Aucune note enregistrée.</div>
              )}
            </Section>
          </div>

          {/* Visites */}
          <div className="md:col-span-2">
            <Section
              title="Visites"
              right={
                <Link
                  to={`/patients/${patient.id}/visits/new`}
                  className="text-sm px-2 py-1 rounded-md border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
                >
                  + Ajouter une visite
                </Link>
              }
            >
              {visits.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-white/70">
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 pr-3">Date d’admission</th>
                        <th className="text-left py-2 pr-3">Motif</th>
                        <th className="text-left py-2 pr-3">Médecin</th>
                        <th className="text-left py-2 pr-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((v) => (
                        <tr key={v.id} className="border-b border-white/5">
                          <td className="py-2 pr-3">{fmtDate(v.admitted_at || v.date)}</td>
                          <td className="py-2 pr-3">{v.reason || "—"}</td>
                          <td className="py-2 pr-3">{v.doctor || "—"}</td>
                          <td className="py-2 pr-3">
                            <Link to={`/visits/${v.id}`} className="underline hover:no-underline">
                              Ouvrir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="opacity-80">Aucune visite enregistrée.</div>
              )}
            </Section>
          </div>

          {/* Snapshot d’inscription (optionnel) */}
          {last_intake?.snapshot ? (
            <div className="md:col-span-2">
              <Section title="Dernier snapshot d’inscription">
                <pre className="bg-black/30 rounded-lg p-3 overflow-auto text-sm">
                  {JSON.stringify(last_intake.snapshot, null, 2)}
                </pre>
                <div className="text-xs opacity-70">
                  Sauvé le {fmtDate(last_intake.created_at)}
                </div>
              </Section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

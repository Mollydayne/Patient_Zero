// PatientView.jsx — refactor glossy vert/transparent + bouton supprimer le dossier
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

/* Utils */
function fmtDate(d, locale = "fr-FR") {
  if (!d) return "—";
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
  } catch {
    return "—";
  }
}

function Pill({ children }) {
  return (
    <span className="inline-block rounded-full border border-emerald-300/40 bg-emerald-50/40 backdrop-blur px-2 py-0.5 text-xs text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      {children ?? "—"}
    </span>
  );
}

function GlassCard({ title, right, children }) {
  return (
    <section className="rounded-2xl border border-emerald-300/50 bg-emerald-50/60 backdrop-blur px-4 py-4 md:px-6 md:py-6 shadow-sm shadow-emerald-900/5">
      <div className="mb-3 flex items-center justify-between gap-4">
        {title ? (
          <h2 className="text-lg md:text-xl font-semibold text-emerald-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
            {title}
          </h2>
        ) : <div />}
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="grid grid-cols-12 gap-3 text-sm">
      <div className="col-span-12 md:col-span-4 lg:col-span-3 text-emerald-900/70">{label}</div>
      <div className={`col-span-12 md:col-span-8 lg:col-span-9 ${mono ? "font-mono" : ""} text-emerald-950/90`}>{value ?? "—"}</div>
    </div>
  );
}

export default function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });
  const [deleting, setDeleting] = useState(false);
  const [askConfirm, setAskConfirm] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Fetch dossier patient
  useEffect(() => {
    let on = true;
    (async () => {
      setState({ loading: true, error: null });
      try {
        const res = await fetch(`${API_URL}/api/patients/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (on) setData(json), setState({ loading: false, error: null });
      } catch (e) {
        if (on) setState({ loading: false, error: e.message || "error" });
      }
    })();
    return () => {
      on = false;
    };
  }, [id, API_URL]);

  // Mapping backend
  const {
    patient = {},
    profile = {},
    situation: sit = {},
    drugs = {},
    last_intake = null,
    visits = [],
    notes = [],
  } = data || {};

  const fullname = useMemo(
    () => [patient.firstname, patient.lastname].filter(Boolean).join(" ") || "Patient inconnu",
    [patient.firstname, patient.lastname]
  );

  async function handleDelete() {
    if (!patient?.id || !API_URL) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_URL}/api/patients/${patient.id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }
      // Après suppression, retour à la liste
      navigate("/patients");
    } catch (e) {
      alert(`Suppression impossible : ${e.message || e}`);
    } finally {
      setDeleting(false);
      setAskConfirm(false);
    }
  }

  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-emerald-950 p-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-4">
          <div className="h-8 w-64 rounded-2xl bg-emerald-100" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-emerald-100" />
            <div className="h-64 rounded-2xl bg-emerald-100" />
            <div className="h-64 rounded-2xl bg-emerald-100 md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-emerald-950 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <button onClick={() => navigate(-1)} className="rounded-xl border border-emerald-300/60 bg-emerald-50/70 px-3 py-1.5 text-emerald-900">
              ← Retour
            </button>
          </div>
          <div className="rounded-2xl border border-rose-300/60 bg-rose-50/70 backdrop-blur px-4 py-3 shadow-sm">
            <p className="font-medium text-rose-900">Impossible de charger le dossier</p>
            <p className="opacity-90 text-sm text-rose-900/80 mt-1">
              Détail : {String(state.error)} — vérifie l’ID patient et l’URL API
              (<code className="font-mono">{API_URL || "VITE_API_URL manquant"}</code>).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-emerald-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Fil d'Ariane + actions */}
        <div className="flex items-center justify-between gap-3">
          <nav className="text-sm text-emerald-900/70">
            <Link className="hover:underline" to="/patients">Patients</Link> / <span className="text-emerald-950/90">{fullname}</span>
          </nav>

          <div className="flex gap-2">
            <Link
              to={`/patients/${patient.id}/edit`}
              className="rounded-xl border border-emerald-300/60 bg-white/70 hover:bg-white px-3 py-1.5 text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            >
              ✏️ Modifier
            </Link>
            <Link
              to={`/patients/${patient.id}/visits/new`}
              className="rounded-xl border border-emerald-300/60 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1.5 text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            >
              ➕ Nouvelle visite
            </Link>

            {/* Bouton supprimer avec confirmation */}
            {!askConfirm ? (
              <button
                onClick={() => setAskConfirm(true)}
                className="rounded-xl border border-rose-300/60 bg-rose-50/70 hover:bg-rose-100 px-3 py-1.5 text-rose-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
              >
                🗑️ Supprimer le dossier
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`rounded-xl px-3 py-1.5 text-white ${deleting ? "bg-rose-400" : "bg-rose-600 hover:bg-rose-700"}`}
                  title="Confirmer la suppression"
                >
                  {deleting ? "Suppression…" : "Confirmer"}
                </button>
                <button
                  onClick={() => setAskConfirm(false)}
                  disabled={deleting}
                  className="rounded-xl border border-emerald-300/60 bg-white/70 hover:bg-white px-3 py-1.5 text-emerald-900"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* En-tête glossy */}
        <header className="rounded-2xl border border-emerald-300/50 bg-emerald-50/60 backdrop-blur p-5 md:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-emerald-950">{fullname}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.blood_type ? <Pill>Groupe {patient.blood_type}</Pill> : null}
                {patient.dob ? <Pill>Naissance : {fmtDate(patient.dob)}</Pill> : null}
                {patient.created_at ? <Pill>Dossier créé : {fmtDate(patient.created_at)}</Pill> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {patient.id ? <span className="font-mono text-xs text-emerald-900/70">{patient.id}</span> : null}
              {patient.id ? (
                <button
                  onClick={async () => { try { await navigator.clipboard.writeText(patient.id); } catch {} }}
                  className="rounded-md border border-emerald-300/60 bg-white/70 hover:bg-white px-2 py-1 text-xs text-emerald-900"
                  title="Copier l'identifiant patient"
                >
                  Copier
                </button>
              ) : null}
            </div>
          </div>
          {patient.allergies_summary ? (
            <div className="mt-4 rounded-xl border border-amber-300/50 bg-amber-50/70 p-3 text-amber-950">
              <div className="font-medium">Allergies</div>
              <div className="opacity-90">{patient.allergies_summary}</div>
            </div>
          ) : null}
        </header>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profil */}
          <GlassCard title="Profil">
            <Row label="Nom complet" value={fullname} />
            <Row label="Date de naissance" value={patient.dob ? fmtDate(patient.dob) : "—"} />
            <Row label="Groupe sanguin" value={patient.blood_type || "—"} />
            <Row label="Allergies (résumé)" value={patient.allergies_summary || "—"} />
            <Row label="Téléphone" value={profile.phone || "—"} mono />
            <Row label="Adresse" value={profile.address || "—"} />
            <Row label="Religion" value={profile.religion || "—"} />
            <Row label="Score social" value={profile.social_score ?? "—"} />
          </GlassCard>

          {/* Situation */}
          <GlassCard title="Situation">
            <Row label="Statut marital" value={sit.marital_status || "—"} />
            <Row label="Profession" value={sit.job || "—"} />
            <Row label="Activité criminelle" value={sit.criminal_activity || "—"} />
            <Row label="Influence (situation)" value={sit.influence ?? "—"} />
          </GlassCard>

          {/* Substances */}
          <GlassCard title="Substances">
            <Row label="Usage de drogues" value={drugs.drug_use || "—"} />
            <Row label="Fréquence" value={drugs.frequency || "—"} />
            <Row label="Handicap / incapacité" value={drugs.disability || "—"} />
            <Row label="Influence (substances)" value={drugs.influence ?? "—"} />
          </GlassCard>

          {/* Notes récentes */}
          <div className="md:col-span-2">
            <GlassCard title="Notes récentes">
              {notes.length ? (
                <ul className="space-y-3">
                  {notes.map((n) => (
                    <li key={n.id} className="rounded-xl border border-emerald-300/40 bg-white/70 backdrop-blur p-3">
                      <div className="text-xs text-emerald-900/70 mb-1">{fmtDate(n.created_at)} — note #{String(n.id).slice(0, 8)}</div>
                      <div className="whitespace-pre-wrap text-emerald-950/90">{n.content || "—"}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-emerald-900/70">Aucune note enregistrée.</div>
              )}
            </GlassCard>
          </div>

          {/* Visites */}
          <div className="md:col-span-2">
            <GlassCard
              title="Visites"
              right={
                <Link
                  to={`/patients/${patient.id}/visits/new`}
                  className="text-sm rounded-md border border-emerald-300/60 bg-white/70 hover:bg-white px-2 py-1 text-emerald-900"
                >
                  + Ajouter une visite
                </Link>
              }
            >
              {visits.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-emerald-900/70">
                      <tr className="border-b border-emerald-300/40">
                        <th className="text-left py-2 pr-3">Date d’admission</th>
                        <th className="text-left py-2 pr-3">Motif</th>
                        <th className="text-left py-2 pr-3">Médecin</th>
                        <th className="text-left py-2 pr-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((v) => (
                        <tr key={v.id} className="border-b border-emerald-300/20">
                          <td className="py-2 pr-3">{fmtDate(v.admitted_at || v.date)}</td>
                          <td className="py-2 pr-3">{v.reason || "—"}</td>
                          <td className="py-2 pr-3">{v.doctor || "—"}</td>
                          <td className="py-2 pr-3">
                            <Link to={`/visits/${v.id}`} className="underline text-emerald-900 hover:no-underline">
                              Ouvrir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-emerald-900/70">Aucune visite enregistrée.</div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

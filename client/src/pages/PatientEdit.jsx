// PatientEdit.jsx — édition dossier patient (glossy vert)
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function Section({ title, children, right }) {
  return (
    <section className="rounded-2xl border border-emerald-300/50 bg-emerald-50/60 backdrop-blur px-4 py-4 md:px-6 md:py-6 shadow-sm shadow-emerald-900/5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-emerald-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
          {title}
        </h2>
        {right}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-emerald-900/70">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-emerald-300/60 bg-white/70 focus:bg-white px-3 py-2 text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-300/60"
      />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 md:col-span-2">
      <span className="text-sm text-emerald-900/70">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-xl border border-emerald-300/60 bg-white/70 focus:bg-white px-3 py-2 text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-300/60"
      />
    </label>
  );
}

export default function PatientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || ""; // ← base du domaine (SANS /api)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // état du formulaire (profil / situation / drugs + quelques champs patient)
  const [form, setForm] = useState({
    // patient
    blood_type: "",
    allergies_summary: "",
    dob: "",

    // profile
    phone: "",
    address: "",
    religion: "",
    social_score: "",

    // situation
    marital_status: "",
    job: "",
    criminal_activity: "",
    sit_influence: "",

    // drugs
    drug_use: "",
    frequency: "",
    disability: "",
    drugs_influence: "",
  });

  const [fullname, setFullname] = useState("…");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/patients/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!on) return;
        setFullname([data.patient?.firstname, data.patient?.lastname].filter(Boolean).join(" ") || `Patient #${id}`);

        setForm({
          blood_type: data.patient?.blood_type || "",
          allergies_summary: data.patient?.allergies_summary || "",
          dob: data.patient?.dob ? String(data.patient.dob).slice(0, 10) : "",

          phone: data.profile?.phone || "",
          address: data.profile?.address || "",
          religion: data.profile?.religion || "",
          social_score: data.profile?.social_score ?? "",

          marital_status: data.situation?.marital_status || "",
          job: data.situation?.job || "",
          criminal_activity: data.situation?.criminal_activity || "",
          sit_influence: data.situation?.influence ?? "",

          drug_use: data.drugs?.drug_use || "",
          frequency: data.drugs?.frequency || "",
          disability: data.drugs?.disability || "",
          drugs_influence: data.drugs?.influence ?? "",
        });
      } catch (e) {
        if (on) setError(e.message || "Erreur de chargement");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => (on = false);
  }, [API, id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // mapping body attendu par l’API PUT
      const body = {
        patient: {
          blood_type: form.blood_type || null,
          allergies_summary: form.allergies_summary || null,
          dob: form.dob || null,
        },
        profile: {
          phone: form.phone || null,
          address: form.address || null,
          religion: form.religion || null,
          social_score: form.social_score === "" ? null : Number(form.social_score),
        },
        situation: {
          marital_status: form.marital_status || null,
          job: form.job || null,
          criminal_activity: form.criminal_activity || null,
          influence: form.sit_influence === "" ? null : Number(form.sit_influence),
        },
        drugs: {
          drug_use: form.drug_use || null,
          frequency: form.frequency || null,
          disability: form.disability || null,
          influence: form.drugs_influence === "" ? null : Number(form.drugs_influence),
        },
      };

      const res = await fetch(`${API}/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j.error || msg;
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      // retour à la vue du patient
      navigate(`/patients/${id}`);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-emerald-950 p-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-4">
          <div className="h-8 w-64 rounded-2xl bg-emerald-100" />
          <div className="h-64 rounded-2xl bg-emerald-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-emerald-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Fil d'Ariane */}
        <div className="flex items-center justify-between">
          <nav className="text-sm text-emerald-900/70">
            <Link className="hover:underline" to="/patients">Patients</Link> /{" "}
            <Link className="hover:underline" to={`/patients/${id}`}>{fullname}</Link> /{" "}
            <span className="text-emerald-950/90">Modifier</span>
          </nav>
          <div className="text-sm">
            <Link className="rounded-xl border border-emerald-300/60 bg-white/70 hover:bg-white px-3 py-1.5 text-emerald-900" to={`/patients/${id}`}>
              ← Annuler
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-300/60 bg-rose-50/70 px-4 py-3 text-rose-900">
            Erreur : {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Patient (quelques champs) */}
          <Section title={`Informations du patient — ${fullname}`}>
            <Field label="Groupe sanguin" name="blood_type" value={form.blood_type} onChange={onChange} />
            <Field label="Date de naissance" type="date" name="dob" value={form.dob} onChange={onChange} />
            <TextArea label="Allergies (résumé)" name="allergies_summary" value={form.allergies_summary} onChange={onChange} />
          </Section>

          {/* Profil */}
          <Section title="Profil">
            <Field label="Téléphone" name="phone" value={form.phone} onChange={onChange} />
            <Field label="Adresse" name="address" value={form.address} onChange={onChange} />
            <Field label="Religion" name="religion" value={form.religion} onChange={onChange} />
            <Field label="Score social" type="number" step="1" name="social_score" value={form.social_score} onChange={onChange} />
          </Section>

          {/* Situation */}
          <Section title="Situation">
            <Field label="Statut marital" name="marital_status" value={form.marital_status} onChange={onChange} />
            <Field label="Profession" name="job" value={form.job} onChange={onChange} />
            <Field label="Activité criminelle" name="criminal_activity" value={form.criminal_activity} onChange={onChange} />
            <Field label="Influence (situation)" type="number" step="1" name="sit_influence" value={form.sit_influence} onChange={onChange} />
          </Section>

          {/* Substances */}
          <Section title="Substances">
            <Field label="Usage de drogues" name="drug_use" value={form.drug_use} onChange={onChange} />
            <Field label="Fréquence" name="frequency" value={form.frequency} onChange={onChange} />
            <Field label="Handicap / incapacité" name="disability" value={form.disability} onChange={onChange} />
            <Field label="Influence (substances)" type="number" step="1" name="drugs_influence" value={form.drugs_influence} onChange={onChange} />
          </Section>

          <div className="flex items-center justify-end gap-2">
            <Link to={`/patients/${id}`} className="rounded-xl border border-emerald-300/60 bg-white/70 hover:bg-white px-4 py-2 text-emerald-900">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`rounded-xl px-4 py-2 text-white ${saving ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

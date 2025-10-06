
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PatientView(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      const res = await fetch(`${API}/api/patients/${id}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div>Chargement…</div>;
  if (!data) return <div>Introuvable.</div>;

  const p = data.patient;

  return (
    <section className="space-y-4">
      <div className="card p-5">
        <h1 className="text-2xl font-semibold">{p.lastname} {p.firstname}</h1>
        <div className="text-neutral-400 text-sm">Groupe sanguin: {p.blood_type || '—'} • Allergies: {p.allergies_summary || '—'}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-2">Visites</h2>
          <ul className="space-y-2">
            {data.visits.map(v => (
              <li key={v.id} className="text-sm">
                <span className="text-neutral-400">{new Date(v.admitted_at).toLocaleString()} — </span>
                <span className="font-medium">{v.reason || 'Admission'}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">{v.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-2">Dernières notes</h2>
          <ul className="space-y-2">
            {data.notes.map(n => (
              <li key={n.id} className="text-sm">
                <span className="text-neutral-400">{new Date(n.created_at).toLocaleString()} — </span>
                <span className="font-medium">{n.type || 'note'}: </span>
                <span>{n.content}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

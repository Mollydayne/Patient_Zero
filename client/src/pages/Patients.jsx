
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Patients(){
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/patients?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setPatients(data.items || []);
    setLoading(false);
  };

  useEffect(()=>{ search(); }, []);

  return (
    <section className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2">
          <input className="input" placeholder="Rechercher par nom ou ID..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="btn" onClick={search}>Rechercher</button>
        </div>
      </div>

      <div className="grid gap-3">
        {loading && <div className="text-neutral-400">Chargement…</div>}
        {!loading && patients.map(p => (
          <Link key={p.id} to={`/patients/${p.id}`} className="card p-4 hover:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.lastname} {p.firstname}</div>
                <div className="text-sm text-neutral-400">Groupe sanguin: {p.blood_type || '—'} • Allergies: {p.allergies_summary || '—'}</div>
              </div>
              <div className="text-xs text-neutral-500">{p.id}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

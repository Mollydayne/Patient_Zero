
import React from "react";
export default function Dashboard(){
  return (
    <section className="grid md:grid-cols-3 gap-4">
      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-2">Recherche rapide</h2>
        <p className="text-sm text-neutral-400">Utilisez l'onglet Patients pour lancer une recherche (nom, ID).</p>
      </div>
      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-2">Admissions ouvertes</h2>
        <p className="text-sm text-neutral-400">À brancher: /api/visits?status=open</p>
      </div>
     <div className="card p-5">
        <h2 className="text-xl font-semibold mb-2">Dernières notes</h2>
        <p className="text-sm text-neutral-400">À brancher: /api/notes?limit=5</p>
      </div>
    </section>
  );
}

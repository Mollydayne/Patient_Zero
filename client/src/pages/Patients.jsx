import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlossyButton from "../components/ui/GlossyButton.jsx";
import MordechaiLogo from "../components/MordechaiLogo.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Patients() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/patients?query=${encodeURIComponent(query)}`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        if (res.status === 401) {
          // TODO: rediriger vers /login ou afficher un message
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setPatients(data.items || []);
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Logo en haut gauche, sous la TopBar */}
      <MordechaiLogo />

      <section className="min-h-screen bg-[#f7faf8] px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Barre de recherche */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300/80 text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#0aa15d]/50
                           placeholder:text-gray-400 bg-white/70"
                placeholder="Rechercher par nom ou numéro…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
              <GlossyButton onClick={search}>Rechercher</GlossyButton>
            </div>

            {/* Bouton Inscrire un patient */}
            <div className="mt-4">
              <GlossyButton to="/register" className="font-medium">
                + Inscrire un patient
              </GlossyButton>
            </div>
          </div>

          {/* Liste des patients */}
          <div className="grid gap-4">
            {loading && (
              <div className="text-gray-500 italic">Chargement en cours…</div>
            )}

            {!loading && patients.length === 0 && (
              <div className="text-gray-500 text-center italic py-8">
                Aucun patient trouvé.
              </div>
            )}

            {!loading &&
              patients.map((p) => (
                <Link
                  key={p.id}
                  to={`/patients/${p.id}`}
                  className="flex justify-between items-center bg-white/80 backdrop-blur-sm
                             p-5 rounded-xl shadow-sm border border-gray-200
                             hover:shadow-md hover:border-[#0aa15d]/50 transition-all duration-200"
                >
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {p.lastname} {p.firstname}
                    </div>
                    <div className="text-sm text-gray-500">
                      Adresse : {p.address || "—"} • Tel : {p.phone || "—"}
                    </div>
                  </div>
                  <span className="text-[#0aa15d] text-sm font-medium">
                    Voir le dossier →
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

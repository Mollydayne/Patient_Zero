import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPatientDrugs() {
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // branchement horloge si besoin plus tard
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-4">
        <div className="w-48 h-24 flex items-center justify-center shadow-lg" />
        <div className="text-right text-gray-300">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl text-[#FFD29D] mb-6 self-start max-w-4xl">Nouveau patient</h1>

      {/* Card */}
      <div className="w-full max-w-4xl border border-gray-700 rounded-lg p-0 overflow-hidden bg-[#1E1E1E]">
        {/* Section Header */}
        <div className="bg-[#0aa15d] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <span className="ml-20">Antécédents</span>
        </div>
                         <div className="absolute ml-4 -mt-16 w-20 h-20 bg-white rounded-full z-10 border-2 border-[#0aa15d] flex items-center justify-center">Test</div>

        {/* Fields */}
        <form className="grid grid-cols-2 gap-4 p-6">
          {/* Consommation de drogues ? */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Le patient consomme-t-il des drogues ?
            </label>
            <select className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]">
              <option>-- Sélectionner --</option>
              <option>Non</option>
              <option>Oui, occasionnellement</option>
              <option>Oui, régulièrement</option>
            </select>
          </div>

          {/* Fréquence */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">À quelle fréquence ?</label>
            <select className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]">
              <option>-- Sélectionner --</option>
              <option>1× / mois ou moins</option>
              <option>1–3× / semaine</option>
              <option>Quotidien</option>
              <option>Plusieurs fois / jour</option>
            </select>
          </div>

          {/* Handicap(s) */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Avez-vous un ou plusieurs handicap(s) ?
            </label>
            <select className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]">
              <option>-- Sélectionner --</option>
              <option>Non</option>
              <option>Oui (moteur)</option>
              <option>Oui (sensoriel)</option>
              <option>Oui (psychique / cognitif)</option>
              <option>Oui (autre)</option>
            </select>
          </div>

          {/* Influence — réservé au médecin */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-red-400">[Réservé au médecin] Influence</label>
            <select
              disabled
              className="border border-gray-600 bg-[#0f0f0f] text-gray-500 px-2 py-1 cursor-not-allowed"
              title="Réservé au médecin"
            >
              <option>— Champ verrouillé —</option>
            </select>
          </div>
        </form>
      </div>

      {/* Footer nav buttons */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => navigate("/register/situation")}
          className="flex items-center gap-2 text-[#FFD29D] hover:underline"
        >
          <span className="w-8 h-8 rounded-full border-2 border-[#4CC9F0] flex items-center justify-center text-[#4CC9F0]">◀</span>
          Revenir à l’étape précédente
        </button>

        <button
          type="button"
          onClick={() => navigate("/register/notes")}
          className="flex items-center gap-2 text-[#FFD29D] hover:underline"
        >
          Valider et passer à la suite
          <span className="w-8 h-8 rounded-full border-2 border-[#FFD29D] flex items-center justify-center text-[#FFD29D]">▶</span>
        </button>
      </div>
    </div>
  );
}

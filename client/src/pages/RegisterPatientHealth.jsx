import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPatientHealth() {
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const navigate = useNavigate();

  // (facultatif) si tu veux brancher l’horloge plus tard
  useEffect(() => {}, []);

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
      <h1 className="text-3xl text-[#FFD29D] mb-6 self-start max-w-4xl">
        Nouveau patient
      </h1>

      {/* Card */}
      <div className="w-full max-w-4xl border border-gray-700 rounded-lg p-0 overflow-hidden bg-[#1E1E1E]">
        {/* Section Header */}
        <div className="bg-[#8A3033] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1E1E1E] border-4 border-[#8A3033] rounded-full" />
          Santé
        </div>

        {/* Fields */}
        <form className="grid grid-cols-2 gap-4 p-6">
          {/* Groupe sanguin */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">Groupe sanguin</label>
            <select className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]">
              <option>-- Sélectionner --</option>
              <option>O−</option><option>O+</option>
              <option>A−</option><option>A+</option>
              <option>B−</option><option>B+</option>
              <option>AB−</option><option>AB+</option>
            </select>
          </div>

          {/* Antécédents médicaux */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">Antécédents médicaux</label>
            <textarea rows={3} className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]" />
          </div>

          {/* Allergies */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">Allergies</label>
            <textarea rows={3} className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]" />
          </div>

          {/* Traitements en cours */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">Traitements en cours</label>
            <textarea rows={3} className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]" />
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

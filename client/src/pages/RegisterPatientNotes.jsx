// RegisterPatientNotes.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

export default function RegisterPatientNotes() {
  const navigate = useNavigate();
  const { draft, setNotes } = useRegistration();

  // État local pour le contenu des notes (prérempli si retour arrière)
  const [text, setText] = useState(draft?.notes || "");

  // Sauvegarde et revient à l’étape précédente
  const handleBack = () => {
    setNotes(text);
    navigate("/register/drugs");
  };

  // Sauvegarde et passe au récapitulatif final
  const handleNext = () => {
    setNotes(text);
    navigate("/register/summary");
  };

  return (
    <div className="min-h-screen bg-[#EADEDA] text-black flex flex-col items-center p-6 font-sans">
      {/* En-tête visuel */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-4">
        <div className="w-48 h-24 flex items-center justify-center shadow-lg" />
        <div className="text-right text-gray-700">
          {/* Date et heure affichées par le composant externe */}
        </div>
      </div>

      {/* Titre principal */}
      <h1 className="text-3xl text-[#8A3033] mb-6 self-start max-w-4xl">
        Nouveau patient
      </h1>

      {/* Carte de formulaire */}
      <div className="w-full max-w-4xl border border-gray-300 rounded-lg p-0 overflow-hidden bg-[#F9F9F9]">
        {/* En-tête de section */}
        <div className="bg-[#8A3033] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#F9F9F9] border-4 border-[#8A3033] rounded-full" />
          Notes
        </div>

        {/* Formulaire contrôlé */}
        <form
          className="grid grid-cols-1 gap-4 p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-700">Notes libres</label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-400 bg-white text-black px-2 py-2 focus:outline-none focus:border-[#8A3033]"
            />
          </div>
        </form>
      </div>

      {/* Boutons de navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#8A3033] hover:underline"
        >
          <span className="w-8 h-8 rounded-full border-2 border-[#4CC9F0] flex items-center justify-center text-[#4CC9F0]">
            ◀
          </span>
          Revenir à l’étape précédente
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 text-[#8A3033] hover:underline"
        >
          Terminer l’enregistrement
          <span className="w-8 h-8 rounded-full border-2 border-[#8A3033] flex items-center justify-center text-[#8A3033]">
            ✔
          </span>
        </button>
      </div>
    </div>
  );
}

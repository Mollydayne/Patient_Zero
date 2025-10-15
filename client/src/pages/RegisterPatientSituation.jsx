// RegisterPatientSituation.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

export default function RegisterPatientSituation() {
  const navigate = useNavigate();
  const { draft, setSection } = useRegistration();

  // État local du formulaire (prérempli si retour arrière)
  const [form, setForm] = useState({
    maritalStatus: draft?.situation?.maritalStatus || "",
    job: draft?.situation?.job || "",
    criminalActivity: draft?.situation?.criminalActivity || "",
    influence: draft?.situation?.influence || "",
  });

  // Gère les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Sauvegarde et passe à l'étape suivante
  const handleNext = () => {
    setSection("situation", form);
    navigate("/register/drugs");
  };

  // Sauvegarde et revient à l'étape précédente
  const handleBack = () => {
    setSection("situation", form);
    navigate("/register");
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
      <h1 className="text-3xl text-[#0AA15D] mb-6 self-start max-w-4xl">
        Nouveau patient
      </h1>

      {/* Carte de formulaire */}
      <div className="w-full max-w-4xl border border-gray-300 rounded-lg p-0 overflow-hidden bg-[#F0F0F0]">
        {/* En-tête de section */}
        <div className="bg-[#0AA15D] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <span className="ml-20">Situation familiale</span>
        </div>

        <div className="absolute ml-4 -mt-16 w-20 h-20 bg-white rounded-full z-10 border-2 border-[#0AA15D] flex items-center justify-center">
          Test
        </div>

        {/* Formulaire contrôlé */}
        <form
          className="grid grid-cols-2 gap-4 p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Situation matrimoniale */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-700">Situation matrimoniale</label>
            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className="border border-gray-400 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Célibataire">Célibataire</option>
              <option value="En couple">En couple</option>
              <option value="Marié·e">Marié·e</option>
              <option value="Divorcé·e">Divorcé·e</option>
              <option value="Veuf·ve">Veuf·ve</option>
            </select>
          </div>

          {/* Métier */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-700">Métier</label>
            <input
              type="text"
              name="job"
              value={form.job}
              onChange={handleChange}
              className="border border-gray-400 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
            />
          </div>

          {/* Activité criminelle */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-700">Activité criminelle</label>
            <input
              type="text"
              name="criminalActivity"
              value={form.criminalActivity}
              onChange={handleChange}
              className="border border-gray-400 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
            />
          </div>

          {/* Influence (réservé au soignant) */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-700">
              <span className="text-red-500">(Réservé au soignant) </span>Influence
            </label>
            <select
              name="influence"
              value={form.influence}
              onChange={handleChange}
              disabled
              className="border border-gray-400 bg-gray-100 text-gray-500 px-2 py-1 cursor-not-allowed"
              title="Réservé au soignant"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Faible">Faible</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Élevée">Élevée</option>
              <option value="Très élevée">Très élevée</option>
            </select>
          </div>
        </form>
      </div>

      {/* Boutons de navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#0AA15D] hover:underline"
        >
          <span className="w-8 h-8 rounded-full border-2 border-[#4CC9F0] flex items-center justify-center text-[#4CC9F0]">
            ◀
          </span>
          Revenir à l’étape précédente
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 text-[#0AA15D] hover:underline"
        >
          Valider et passer à la suite
          <span className="w-8 h-8 rounded-full border-2 border-[#0AA15D] flex items-center justify-center text-[#0AA15D]">
            ▶
          </span>
        </button>
      </div>
    </div>
  );
}

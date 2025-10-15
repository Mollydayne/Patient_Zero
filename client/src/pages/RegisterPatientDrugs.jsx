// RegisterPatientDrugs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

export default function RegisterPatientDrugs() {
  const navigate = useNavigate();
  const { draft, setSection } = useRegistration();

  // État local du formulaire (prérempli si retour arrière)
  const [form, setForm] = useState({
    drugUse: draft?.drugs?.drugUse || "",
    frequency: draft?.drugs?.frequency || "",
    disability: draft?.drugs?.disability || "",
    influence: draft?.drugs?.influence || "",
  });

  // Met à jour le state local à chaque changement dans un champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Sauvegarde les données et passe à l'étape suivante
  const handleNext = () => {
    setSection("drugs", form);
    navigate("/register/notes");
  };

  // Sauvegarde et revient à l'étape précédente
  const handleBack = () => {
    setSection("drugs", form);
    navigate("/register/situation");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center p-6 font-sans">
      {/* En-tête visuel */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-4">
        <div className="w-48 h-24 flex items-center justify-center shadow-lg" />
        <div className="text-right text-gray-300">
          {/* Date et heure affichées par le composant externe */}
        </div>
      </div>

      {/* Titre principal */}
      <h1 className="text-3xl text-[#FFD29D] mb-6 self-start max-w-4xl">
        Nouveau patient
      </h1>

      {/* Carte de formulaire */}
      <div className="w-full max-w-4xl border border-gray-700 rounded-lg p-0 overflow-hidden bg-[#1E1E1E]">
        {/* En-tête de section */}
        <div className="bg-[#0aa15d] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <span className="ml-20">Antécédents</span>
        </div>

        <div className="absolute ml-4 -mt-16 w-20 h-20 bg-white rounded-full z-10 border-2 border-[#0aa15d] flex items-center justify-center">
          Test
        </div>

        {/* Formulaire contrôlé */}
        <form
          className="grid grid-cols-2 gap-4 p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Consommation de drogues */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Le patient consomme-t-il des drogues ?
            </label>
            <select
              name="drugUse"
              value={form.drugUse}
              onChange={handleChange}
              className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Non">Non</option>
              <option value="Oui, occasionnellement">Oui, occasionnellement</option>
              <option value="Oui, régulièrement">Oui, régulièrement</option>
            </select>
          </div>

          {/* Fréquence */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">À quelle fréquence ?</label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
            >
              <option value="">-- Sélectionner --</option>
              <option value="1× / mois ou moins">1× / mois ou moins</option>
              <option value="1–3× / semaine">1–3× / semaine</option>
              <option value="Quotidien">Quotidien</option>
              <option value="Plusieurs fois / jour">Plusieurs fois / jour</option>
            </select>
          </div>

          {/* Handicap(s) */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Avez-vous un ou plusieurs handicap(s) ?
            </label>
            <select
              name="disability"
              value={form.disability}
              onChange={handleChange}
              className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Non">Non</option>
              <option value="Oui (moteur)">Oui (moteur)</option>
              <option value="Oui (sensoriel)">Oui (sensoriel)</option>
              <option value="Oui (psychique / cognitif)">
                Oui (psychique / cognitif)
              </option>
              <option value="Oui (autre)">Oui (autre)</option>
            </select>
          </div>

          {/* Champ réservé au médecin */}
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-red-400">
              [Réservé au médecin] Influence
            </label>
            <select
              name="influence"
              value={form.influence}
              disabled
              className="border border-gray-600 bg-[#0f0f0f] text-gray-500 px-2 py-1 cursor-not-allowed"
              title="Réservé au médecin"
            >
              <option value="">— Champ verrouillé —</option>
            </select>
          </div>
        </form>
      </div>

      {/* Boutons de navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#FFD29D] hover:underline"
        >
          <span className="w-8 h-8 rounded-full border-2 border-[#4CC9F0] flex items-center justify-center text-[#4CC9F0]">
            ◀
          </span>
          Revenir à l’étape précédente
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 text-[#FFD29D] hover:underline"
        >
          Valider et passer à la suite
          <span className="w-8 h-8 rounded-full border-2 border-[#FFD29D] flex items-center justify-center text-[#FFD29D]">
            ▶
          </span>
        </button>
      </div>
    </div>
  );
}

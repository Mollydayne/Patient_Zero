// RegisterPatient.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Page 1 — Inscription patient : Informations personnelles
 * - Contient le formulaire d'inscription du patient.
 * - Navigue vers /register/situation après validation.
 * - L'affichage de la date et de l'heure est géré ailleurs (TopBar / Profil).
 */
export default function RegisterPatient() {
  const navigate = useNavigate();

  // État du formulaire
  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    phone: "",
    address: "",
    religion: "",
    socialScore: "",
  });

  // Mise à jour des champs du formulaire
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validation et navigation vers l'étape suivante
  const handleNext = async () => {
    // Vérification minimale
    if (!form.lastname.trim() || !form.firstname.trim()) {
      alert("Veuillez renseigner au minimum le nom et le prénom.");
      return;
    }

    // TODO : enregistrement en base de données (exemple à brancher plus tard)
    // const res = await fetch(`${API}/api/patients`, { ... });

    // Navigation vers la page suivante
    navigate("/register/situation");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center p-6 font-sans">
      {/* En-tête visuel (logo fictif) */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-4">
        <div className="w-48 h-24 flex items-center justify-center shadow-lg bg-transparent" />
      </div>

      {/* Titre de la page */}
      <h1 className="text-3xl text-[#FFD29D] mb-6 self-start max-w-4xl">
        Nouveau patient
      </h1>

      {/* Bloc formulaire */}
      <div className="w-full max-w-4xl border border-gray-700 rounded-lg overflow-hidden bg-[#1E1E1E]">
        {/* Bandeau de section */}
        <div className="bg-[#8A3033] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1E1E1E] border-4 border-[#8A3033] rounded-full" />
          Informations personnelles
        </div>

        {/* Formulaire contrôlé */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          {/* Nom */}
          <div className="flex flex-col">
            <label htmlFor="lastname" className="text-sm mb-1 text-gray-300">
              Nom
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
              value={form.lastname}
              onChange={onChange}
              required
            />
          </div>

          {/* Prénom */}
          <div className="flex flex-col">
            <label htmlFor="firstname" className="text-sm mb-1 text-gray-300">
              Prénom
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
              value={form.firstname}
              onChange={onChange}
              required
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm mb-1 text-gray-300">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="Ex : 06 12 34 56 78"
              className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
              value={form.phone}
              onChange={onChange}
            />
          </div>

          {/* Adresse */}
          <div className="flex flex-col">
            <label htmlFor="address" className="text-sm mb-1 text-gray-300">
              Adresse
            </label>
            <select
              id="address"
              name="address"
              className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
              value={form.address}
              onChange={onChange}
            >
              <option value="">-- Sélectionner --</option>
              <option value="Adresse 1">Adresse 1</option>
              <option value="Adresse 2">Adresse 2</option>
            </select>
          </div>

          {/* Confession */}
          <div className="flex flex-col">
            <label htmlFor="religion" className="text-sm mb-1 text-gray-300">
              Confession
            </label>
            <select
              id="religion"
              name="religion"
              className="border border-gray-500 bg-[#121212] text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
              value={form.religion}
              onChange={onChange}
            >
              <option value="">-- Sélectionner --</option>
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
            </select>
          </div>

          {/* Score social */}
          <div className="flex flex-col">
            <label htmlFor="socialScore" className="text-sm mb-1 text-gray-300">
              Score social
            </label>
            <input
              id="socialScore"
              name="socialScore"
              type="number"
              inputMode="numeric"
              className="border border-gray-500 bg-transparent text-gray-100 px-2 py-1 focus:outline-none focus:border-[#FFD29D]"
              value={form.socialScore}
              onChange={onChange}
            />
          </div>
        </form>
      </div>

      {/* Bouton d’action */}
      <div className="w-full max-w-4xl flex justify-end items-center mt-6">
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

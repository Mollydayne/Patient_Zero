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
    <div className="min-h-screen bg-[#f5fff8] text-black flex flex-col items-center p-6 font-sans">
      {/* En-tête visuel (logo fictif) */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-4">
        <div className="w-48 h-24 flex items-center justify-center shadow-lg bg-transparent" />
      </div>

      {/* Titre de la page */}
      <div className="w-full flex justify-end mr-6"><h1 className="text-3xl text-[#0AA15D] mb-6 self-start max-w-4xl">
        Nouveau patient
      </h1></div>

      {/* Bloc formulaire */}
      <div className="w-full max-w-4xl rounded-lg overflow-hidden bg-[#F0F0F0]">
        {/* Bandeau de section */}

        <div className="bg-[#0aa15d] text-white px-6 py-2 text-lg font-semibold rounded-t-lg relative">
          <span className="ml-20">Informations personnelles</span>
        </div>
                         <div className="absolute ml-4 -mt-16 w-20 h-20 bg-white rounded-full z-10 border-2 border-[#0aa15d] flex items-center justify-center">Test</div>

        {/* Formulaire contrôlé */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 text-black"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          {/* Nom */}
          <div className="flex flex-col">
            <label htmlFor="lastname" className="text-sm mb-1">
              Nom
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              className="border border-gray-500 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
              value={form.lastname}
              onChange={onChange}
              required
            />
          </div>

          {/* Prénom */}
          <div className="flex flex-col">
            <label htmlFor="firstname" className="text-sm mb-1">
              Prénom
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              className="border border-gray-500 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
              value={form.firstname}
              onChange={onChange}
              required
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm mb-1">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="Ex: 555-12345"
              className="border border-gray-500 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
              value={form.phone}
              onChange={onChange}
            />
          </div>

          {/* Adresse */}
          <div className="flex flex-col">
            <label htmlFor="address" className="text-sm mb-1">
              Adresse
            </label>
            <select
              id="address"
              name="address"
              className="border border-gray-500 text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
              value={form.address}
              onChange={onChange}
            >
              <option value="">-- Sélectionner --</option>
              <option value="Barrio Azul">Barrio Azul</option>
              <option value="Golden Heights">Golden Heights</option>
              <option value="Harbor Block">Harbor Block</option>
              <option value="Iron Tower">Iron Tower</option>
              <option value="Lotus Quarter">Lotus Quarter</option>
              <option value="Red Forge">Red Forge</option>
              <option value="Rose Crown">Rose Crown</option>
              <option value="Verdant Empire">Verdant Empire</option>
              <option value="Extérieur de Los Santos">Extérieur de Los Santos</option>                            
            </select>
          </div>

          {/* Confession */}
          <div className="flex flex-col">
            <label htmlFor="religion" className="text-sm mb-1">
              Confession
            </label>
            <select
              id="religion"
              name="religion"
              className="border border-gray-500 text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
              value={form.religion}
              onChange={onChange}
            >
              <option value="">-- Sélectionner --</option>
              <option value="Sans religion">Sans religion</option>
              <option value="Christianisme">Christianisme</option>
              <option value="Islam">Islam</option>
              <option value="Hindouisme">Hindouisme</option>
              <option value="Bouddhisme">Bouddhisme</option>
              <option value="Animisme">Animisme</option>
              <option value="Sikhisme">Sikhisme</option>
              <option value="Judaïsme">Judaïsme</option>
            </select>
          </div>

          {/* Score social */}
          <div className="flex flex-col">
            <label htmlFor="socialScore" className="text-sm mb-1">
              Score social
            </label>
            <input
              id="socialScore"
              name="socialScore"
              type="text"
              className="border border-gray-500 bg-white text-black px-2 py-1 focus:outline-none focus:border-[#0AA15D]"
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
          className="flex items-center gap-2 text-[#0AA15D]"
        >
          Valider et<br></br>passer à la suite
<span className="w-12 h-12 rounded-full bg-[#0AA15D] flex items-center justify-center hover:bg-[#0db569]">
  <span className="ml-1"><svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2L10 6L2 10V2Z" fill="white"/>
  </svg></span>
</span>
        </button>
      </div>
    </div>
  );
}

// RegisterPatientSituation.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

import FormCard from "../components/form/FormCard.jsx";
import { Field, TextInput, Select } from "../components/form/Field.jsx";
import GlossyButton from "../components/ui/GlossyButton.jsx";
import ActionNext from "../components/form/ActionNext.jsx";

export default function RegisterPatientSituation() {
  const navigate = useNavigate();
  const { draft, setSection } = useRegistration();

  // On ne garde QUE tes champs d'origine
  const [form, setForm] = useState({
    maritalStatus: draft?.situation?.maritalStatus || "",
    job: draft?.situation?.job || "",
    criminalActivity: draft?.situation?.criminalActivity || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setSection("situation", form);
    navigate("/register/drugs");
  };

  const handleBack = () => {
    setSection("situation", form);
    navigate("/register");
  };

  return (
    <section className="min-h-screen bg-[#f7faf8] px-6 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Carte formulaire */}
        <FormCard title="Situation familiale" icon="👥">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            {/* Situation matrimoniale */}
            <Field label="Situation matrimoniale" id="maritalStatus">
              <Select
                id="maritalStatus"
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
              >
                <option value="">-- Sélectionner --</option>
                <option value="Célibataire">Célibataire</option>
                <option value="En couple">En couple</option>
                <option value="Marié·e">Marié·e</option>
                <option value="Divorcé·e">Divorcé·e</option>
                <option value="Veuf·ve">Veuf·ve</option>
              </Select>
            </Field>

            {/* Métier */}
            <Field label="Métier" id="job">
              <TextInput
                id="job"
                name="job"
                type="text"
                value={form.job}
                onChange={handleChange}
                placeholder="Ex : taxi"
              />
            </Field>

            {/* Activité criminelle */}
            <Field label="Activité criminelle" id="criminalActivity">
              <TextInput
                id="criminalActivity"
                name="criminalActivity"
                type="text"
                value={form.criminalActivity}
                onChange={handleChange}
                placeholder="Ex : dealeur, etc."
              />
            </Field>
          </form>
        </FormCard>

        {/* Actions bas de page */}
        <div className="w-full max-w-4xl flex items-center justify-between">
          <GlossyButton to="/register" onClick={handleBack} className="font-medium">
            ← Revenir à l’étape précédente
          </GlossyButton>

          <ActionNext onClick={handleNext}>
            Valider et passer à la suite   →
          </ActionNext>
        </div>
      </div>
    </section>
  );
}

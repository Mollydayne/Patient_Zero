// RegisterPatientDrugs.jsx — refactor glossy vert/transparent aligné sur RegisterPatient.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

// Même design system que RegisterPatient.jsx
import FormCard from "../components/form/FormCard.jsx";
import { Field, Select, TextInput } from "../components/form/Field.jsx";
import ActionNext from "../components/form/ActionNext.jsx";

export default function RegisterPatientDrugs() {
  const navigate = useNavigate();
  const { draft, setSection } = useRegistration();

  const [form, setForm] = useState({
    drugUse: draft?.drugs?.drugUse || "",
    frequency: draft?.drugs?.frequency || "",
    disability: draft?.drugs?.disability || "",
    influence: draft?.drugs?.influence || "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Autosave doux dans le contexte d'inscription
  useEffect(() => {
    setSection("drugs", form);
  }, [form, setSection]);

  // Validation identique dans l'esprit à RegisterPatient.jsx
  const validate = useMemo(() => {
    const e = {};
    if (!form.drugUse) e.drugUse = "Sélectionnez une réponse.";
    if (form.drugUse && form.drugUse !== "Non" && !form.frequency) e.frequency = "Indiquez la fréquence.";
    return e;
  }, [form]);

  const errors = validate;
  const disableNext = Object.keys(errors).length > 0;

  const handleNext = () => {
    if (disableNext) return;
    setSection("drugs", form);
    navigate("/register/notes");
  };

  return (
    <section className="min-h-screen bg-[#f7faf8] px-6 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/*
          FormCard applique déjà le rendu "glossy" (fond verre dépoli + bord arrondi + accent vert translucide)
          tel qu'utilisé sur RegisterPatient.jsx. On ne réinvente pas le style ici, on réutilise le même composant.
        */}
        <FormCard title="Utilisation de drogues" icon="🧪">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            {/* Consommation de drogues ? */}
            <Field
              label="Le patient consomme‑t‑il des drogues ?"
              id="drugUse"
              error={errors.drugUse}
              success={!errors.drugUse && form.drugUse ? "OK" : undefined}
            >
              <Select
                id="drugUse"
                name="drugUse"
                value={form.drugUse}
                onChange={onChange}
                valid={!errors.drugUse && !!form.drugUse}
              >
                <option value="">-- Sélectionner --</option>
                <option value="Non">Non</option>
                <option value="Oui, occasionnellement">Oui, occasionnellement</option>
                <option value="Oui, régulièrement">Oui, régulièrement</option>
              </Select>
            </Field>

            {/* Fréquence — activée uniquement si consommation */}
            <Field
              label="À quelle fréquence ?"
              id="frequency"
              hint={form.drugUse === "Non" || !form.drugUse ? "Désactivé si \"Non\"" : undefined}
              error={errors.frequency}
              success={!errors.frequency && form.frequency ? "OK" : undefined}
            >
              <Select
                id="frequency"
                name="frequency"
                value={form.frequency}
                onChange={onChange}
                disabled={form.drugUse === "Non" || !form.drugUse}
                valid={!errors.frequency && !!form.frequency}
              >
                <option value="">-- Sélectionner --</option>
                <option value="1× / mois ou moins">1× / mois ou moins</option>
                <option value="1–3× / semaine">1–3× / semaine</option>
                <option value="Quotidien">Quotidien</option>
                <option value="Plusieurs fois / jour">Plusieurs fois / jour</option>
              </Select>
            </Field>

            {/* Handicap(s) */}
            <Field
              label="Avez‑vous un ou plusieurs handicap(s) ?"
              id="disability"
              success={form.disability ? "OK" : undefined}
            >
              <Select
                id="disability"
                name="disability"
                value={form.disability}
                onChange={onChange}
                valid={!!form.disability}
              >
                <option value="">-- Sélectionner --</option>
                <option value="Non">Non</option>
                <option value="Oui (moteur)">Oui (moteur)</option>
                <option value="Oui (sensoriel)">Oui (sensoriel)</option>
                <option value="Oui (psychique / cognitif)">Oui (psychique / cognitif)</option>
                <option value="Oui (autre)">Oui (autre)</option>
              </Select>
            </Field>

            {/* Réservé au médecin (lecture seule, cohérent DS) */}
            <Field
              label="[Réservé au médecin] Influence"
              id="influence"
              hint="Champ verrouillé"
            >
              <TextInput
                id="influence"
                name="influence"
                value={form.influence}
                readOnly
                placeholder="—"
              />
            </Field>
          </form>
        </FormCard>

        <ActionNext onClick={handleNext}>
          {disableNext ? "Compléter les champs requis" : "Valider et passer à la suite"}
        </ActionNext>
      </div>
    </section>
  );
}

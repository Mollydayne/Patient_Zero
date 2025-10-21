// RegisterPatient.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

import FormCard from "../components/form/FormCard.jsx";
import { Field, TextInput, Select } from "../components/form/Field.jsx";
import ActionNext from "../components/form/ActionNext.jsx";
import useDebounce from "../utils/useDebounce.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const PHONE_RE = /^555-\d{5}$/; // ex: 555-12345

export default function RegisterPatient() {
  const navigate = useNavigate();
  const { draft, setSection } = useRegistration();

  const [form, setForm] = useState({
    lastname:  draft?.patient?.lastname  || "",
    firstname: draft?.patient?.firstname || "",
    phone:     draft?.patient?.phone     || "",
    address:   draft?.patient?.address   || "",
    religion:  draft?.patient?.religion  || "",
    socialScore: draft?.patient?.socialScore || "",
  });

  // États de validation
  const [errors, setErrors] = useState({});
  const [duplicate, setDuplicate] = useState(null); // message doublon ou null
  const debouncedPhone = useDebounce(form.phone);
  const debouncedLastname = useDebounce(form.lastname.trim().toLowerCase());

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Validation synchrones de base
  const validate = useMemo(() => {
    const e = {};
    if (!form.lastname.trim()) e.lastname = "Le nom est requis.";
    if (!form.firstname.trim()) e.firstname = "Le prénom est requis.";
    if (!form.phone.trim()) e.phone = "Le numéro de téléphone est requis.";
    else if (!PHONE_RE.test(form.phone)) e.phone = "Format requis : 555-XXX-XXXX (ex: 555-123-4567).";
    return e;
  }, [form]);

  useEffect(() => setErrors(validate), [validate]);

  // Vérification "doublon" côté front (pré-check)
  // ⚠️ Nécessite une route côté API. Voir section 4 pour l'implémentation serveur.
  useEffect(() => {
    let active = true;

    async function check() {
      setDuplicate(null);
      // si format invalide ou nom vide, on ne check pas encore
      if (!PHONE_RE.test(debouncedPhone) || !debouncedLastname) return;

      try {
        // Idéalement, une route dédiée:
        //   GET /api/patients/exists?phone=555-123-4567&lastname=doe
        const url = `${API}/api/patients/exists?phone=${encodeURIComponent(debouncedPhone)}&lastname=${encodeURIComponent(debouncedLastname)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json(); // { exists: boolean, matchType: "phone"|"name"|"both" }
        if (!active) return;

        if (data.exists) {
          const msg =
            data.matchType === "both"
              ? "Un patient avec ce nom et ce numéro existe déjà."
              : data.matchType === "phone"
              ? "Ce numéro existe déjà dans la patientèle."
              : "Un(e) patient(e) porte déjà un nom similaire.";
          setDuplicate(msg);
        } else {
          setDuplicate(null);
        }
      } catch {
        // silence radio si l'API n'existe pas encore
      }
    }
    check();

    return () => { active = false; };
  }, [API, debouncedPhone, debouncedLastname]);

  const hasErrors = Object.keys(errors).length > 0;
  const disableNext = hasErrors || !!duplicate;

  const handleNext = () => {
    if (disableNext) return;
    setSection("patient", form);
    navigate("/register/situation");
  };

  return (
    <section className="min-h-screen bg-[#f7faf8] px-6 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">

        <FormCard title="Informations personnelles" icon="🪪">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <Field
              label="Nom"
              id="lastname"
              error={errors.lastname}
              success={!errors.lastname && form.lastname ? "OK" : undefined}
            >
              <TextInput
                id="lastname"
                name="lastname"
                value={form.lastname}
                onChange={onChange}
                invalid={!!errors.lastname}
                valid={!errors.lastname && !!form.lastname}
              />
            </Field>

            <Field
              label="Prénom"
              id="firstname"
              error={errors.firstname}
              success={!errors.firstname && form.firstname ? "OK" : undefined}
            >
              <TextInput
                id="firstname"
                name="firstname"
                value={form.firstname}
                onChange={onChange}
                invalid={!!errors.firstname}
                valid={!errors.firstname && !!form.firstname}
              />
            </Field>

            <Field
              label="Téléphone (format 555-XXX-XXXX)"
              id="phone"
              error={errors.phone || duplicate}
              success={!errors.phone && !duplicate && form.phone ? "Disponible" : undefined}
            >
              <TextInput
                id="phone"
                name="phone"
                placeholder="ex: 555-12345"
                value={form.phone}
                onChange={onChange}
                invalid={!!(errors.phone || duplicate)}
                valid={!errors.phone && !duplicate && !!form.phone}
              />
            </Field>

            <Field
              label="Adresse (quartier)"
              id="address"
              success={form.address ? "OK" : undefined}
            >
              <Select
                id="address"
                name="address"
                value={form.address}
                onChange={onChange}
                valid={!!form.address}
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
              </Select>
            </Field>

            <Field label="Confession" id="religion" success={form.religion ? "OK" : undefined}>
              <Select
                id="religion"
                name="religion"
                value={form.religion}
                onChange={onChange}
                valid={!!form.religion}
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
              </Select>
            </Field>

            <Field label="Score social" id="socialScore" success={form.socialScore ? "OK" : undefined}>
              <TextInput
                id="socialScore"
                name="socialScore"
                value={form.socialScore}
                onChange={onChange}
                valid={!!form.socialScore}
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

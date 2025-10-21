// RegisterPatientNotes.jsx — refactor glossy vert/transparent aligné sur RegisterPatient.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../context/RegistrationContext.jsx";

// Réutilise les mêmes composants de design system
import FormCard from "../components/form/FormCard.jsx";
import { Field } from "../components/form/Field.jsx";
import ActionNext from "../components/form/ActionNext.jsx";

export default function RegisterPatientNotes() {
  const navigate = useNavigate();
  const { draft, setNotes } = useRegistration();

  // État local (prérempli si retour arrière)
  const [text, setText] = useState(draft?.notes || "");

  // Autosave doux à chaque saisie (même logique que les autres pages)
  useEffect(() => {
    setNotes(text);
  }, [text, setNotes]);

  const handleBack = () => {
    setNotes(text);
    navigate("/register/drugs");
  };

  const handleNext = () => {
    setNotes(text);
    navigate("/register/summary");
  };

  return (
    <section className="min-h-screen bg-[#f7faf8] px-6 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Carte glossy comme sur RegisterPatient.jsx */}
        <FormCard title="Notes libres" icon="📝">
          <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Observations / éléments utiles au médecin" id="notes" hint="Vous pouvez coller des informations cliniques, des antécédents, etc.">
              <textarea
                id="notes"
                rows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full resize-y min-h-[10rem] rounded-xl px-4 py-3 outline-none transition border backdrop-blur
                           border-emerald-300/30 bg-emerald-50/40 focus:bg-white/70
                           shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
                           placeholder:text-emerald-900/40 text-emerald-950"
                placeholder="Ex.: patient retrouvé inconscient dans un parc, antécédents de consommation de substances, etc."
              />
            </Field>

            {/* Mini helper facultatif */}
            <div className="text-xs text-emerald-900/60">
              Astuce : les notes sont enregistrées automatiquement. Vous pourrez les modifier dans le récapitulatif.
            </div>
          </form>
        </FormCard>

        {/* Barre d'action, même composant que les autres pages */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-emerald-800 hover:underline"
          >
            <span className="w-8 h-8 rounded-full border-2 border-emerald-400/70 grid place-items-center text-emerald-700">◀</span>
            Étape précédente
          </button>

          <ActionNext onClick={handleNext}>Terminer l’enregistrement</ActionNext>
        </div>
      </div>
    </section>
  );
}

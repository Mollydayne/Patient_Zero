import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "registrationDraft_v1";
const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [draft, setDraft] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) ?? {
      patient: {}, situation: {}, drugs: {}, notes: ""
    }; } catch { return { patient:{}, situation:{}, drugs:{}, notes:"" }; }
  });

  useEffect(() => { sessionStorage.setItem(KEY, JSON.stringify(draft)); }, [draft]);

  const api = useMemo(() => ({
    draft,
    setSection(section, value) {
      setDraft(prev => ({ ...prev, [section]: { ...prev[section], ...value } }));
    },
    setNotes(text) {
      setDraft(prev => ({ ...prev, notes: text }));
    },
    reset() {
      sessionStorage.removeItem(KEY);
      setDraft({ patient:{}, situation:{}, drugs:{}, notes:"" });
    }
  }), [draft]);

  return <RegistrationContext.Provider value={api}>{children}</RegistrationContext.Provider>;
}

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used inside <RegistrationProvider>");
  return ctx;
};

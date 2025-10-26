import { useNavigate } from "react-router-dom";

/**
 * Bouton réutilisable pour ouvrir l’éditeur d’ordonnance.
 * - props:
 *   - patientId (string) requis
 *   - className (string) optionnel
 *   - variant: "primary" | "ghost" | "link" (style basique)
 */
export default function PrescriptionButton({ patientId, className = "", variant = "primary", children }) {
  const navigate = useNavigate();
  const label = children || "Générer une ordonnance";

  const base =
    variant === "primary"
      ? "rounded-2xl px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow"
      : variant === "ghost"
      ? "rounded-2xl px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10"
      : "text-emerald-600 hover:underline";

  return (
    <button
      onClick={() => navigate(`/patients/${patientId}/prescriptions/new`)}
      className={`${base} ${className}`}
    >
      {label}
    </button>
  );
}

import { Link, useLocation } from "react-router-dom";

// Barre de navigation minimaliste : un seul bouton "Accueil" centré en haut de la page.
export default function Navbar() {
  // useLocation sert uniquement à savoir si on se trouve déjà sur la page /patients
  const location = useLocation();

  // On vérifie si la page actuelle est "/patients" pour adapter le style du bouton
  const isActive = location.pathname === "/patients";

  return (
    <nav className="navbar flex justify-center mt-4">
      <Link
        to="/patients"
        className={`text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200 border 
          ${
            isActive
              ? "bg-[#8A3033] text-[#EADEDA] border-[#8A3033]"
              : "text-[#8A3033] border-[#8A3033]/40 hover:bg-[#8A3033]/10"
          }`}
      >
        Accueil
      </Link>
    </nav>
  );
}

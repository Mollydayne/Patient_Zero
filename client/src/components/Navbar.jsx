import { Link, useLocation } from "react-router-dom";

// Barre de navigation minimaliste avec un bouton glossy "Accueil"
export default function Navbar() {
  const location = useLocation();
  const isActive = location.pathname === "/patients";

  return (
    <nav className="flex justify-center mt-6">
      <Link
        to="/patients"
        className={`relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl 
          backdrop-blur-sm transition-all duration-200 select-none font-medium
          ring-1 shadow-lg 
          before:absolute before:inset-0 before:rounded-xl before:pointer-events-none 
          before:bg-gradient-to-b before:from-white/30 before:to-transparent
          after:absolute after:top-1 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[22%] 
          after:rounded-full after:bg-white/40 after:blur-[6px] after:pointer-events-none
          ${
            isActive
              ? "bg-[#0aa15d]/30 text-[#0aa15d] ring-[#0aa15d]/50 shadow-[0_4px_12px_rgba(10,161,93,0.25)]"
              : "bg-[rgba(10,161,93,0.12)] text-[#0aa15d] ring-[rgba(10,161,93,0.35)] shadow-[0_4px_10px_rgba(10,161,93,0.15)] hover:bg-[rgba(10,161,93,0.18)] hover:shadow-[0_6px_16px_rgba(10,161,93,0.25)] active:translate-y-[1px] active:shadow-inner active:bg-[rgba(10,161,93,0.22)]"
          }`}
      >
        Accueil
      </Link>
    </nav>
  );
}

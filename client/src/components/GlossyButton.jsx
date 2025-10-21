import React from "react";
import { Link } from "react-router-dom";

/**
 * GlossyButton
 * - Bouton semi-transparent avec effet verre + relief
 * - Peut servir de <button> ou de <Link> selon les props
 *
 * Props :
 *  - to : si fourni, rend un <Link> React Router
 *  - onClick : fonction appelée au clic (si bouton)
 *  - children : contenu du bouton
 *  - className : styles additionnels
 */
export default function GlossyButton({ to, onClick, children, className = "" }) {
  const baseClass =
    "relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl " +
    "backdrop-blur-sm bg-[rgba(10,161,93,0.12)] text-[#0aa15d] " +
    "ring-1 ring-[rgba(10,161,93,0.35)] shadow-lg shadow-[rgba(10,161,93,0.18)] " +
    "transition-all duration-200 select-none " +
    "hover:bg-[rgba(10,161,93,0.18)] hover:shadow-[rgba(10,161,93,0.28)] " +
    "active:translate-y-[1px] active:shadow-inner active:bg-[rgba(10,161,93,0.22)] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0aa15d]/60 " +
    "before:absolute before:inset-0 before:rounded-xl before:pointer-events-none " +
    "before:bg-gradient-to-b before:from-white/30 before:to-transparent " +
    "after:absolute after:top-1 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[22%] " +
    "after:rounded-full after:bg-white/40 after:blur-[6px] after:pointer-events-none " +
    className;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
}


import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-neutral-800/70 bg-neutral-950/70 sticky top-0 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <div className="font-bold tracking-wide text-lg">🩺 Patient Zero</div>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({isActive})=> isActive? "text-white" : "text-neutral-400 hover:text-white"}>Dashboard</NavLink>
          <NavLink to="/patients" className={({isActive})=> isActive? "text-white" : "text-neutral-400 hover:text-white"}>Patients</NavLink>
          <NavLink to="/admin" className={({isActive})=> isActive? "text-white" : "text-neutral-400 hover:text-white"}>Admin</NavLink>
        </nav>
        <div className="ml-auto text-neutral-400 text-sm">ENV: <span className="text-white">{import.meta.env.VITE_API_URL || "http://localhost:4000"}</span></div>
      </div>
    </header>
  );
}

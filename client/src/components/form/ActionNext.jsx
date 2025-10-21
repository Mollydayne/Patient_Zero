import React from "react";
import GlossyButton from "../ui/GlossyButton.jsx";

export default function ActionNext({ onClick, children = "Valider et passer à la suite" }) {
  return (
    <div className="w-full max-w-4xl flex justify-end items-center mt-6">
      <GlossyButton onClick={onClick} className="gap-3">
        <span className="text-sm leading-tight text-[#0aa15d]">{children}</span>
        <span className="w-10 h-10 rounded-full bg-[#0aa15d] text-white flex items-center justify-center
                         shadow-md hover:scale-[1.03] transition-transform">
          {/* chevron play */}
          <svg width="18" height="18" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L10 6L2 10V2Z" />
          </svg>
        </span>
      </GlossyButton>
    </div>
  );
}

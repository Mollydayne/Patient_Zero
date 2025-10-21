import React from "react";

export default function FormCard({ title, icon, children }) {
  return (
    <div className="w-full max-w-4xl rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
      <div className="relative px-6 py-3 bg-[#0aa15d]/15 rounded-t-2xl border-b border-[#0aa15d]/30">
        {/* pastille circulaire à gauche */}
        <div className="absolute -top-6 left-6 w-14 h-14 rounded-full bg-white border-2 border-[#0aa15d]
                        flex items-center justify-center shadow-sm text-[#0aa15d]">
          {icon ?? "🧑‍⚕️"}
        </div>
        <h2 className="pl-16 text-[#0aa15d] font-semibold text-lg">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

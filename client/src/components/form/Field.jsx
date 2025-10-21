import React from "react";

export function Field({ label, id, error, success, children }) {
  const hintColor = error ? "text-red-600" : success ? "text-[#0aa15d]" : "text-gray-500";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-600">{label}</label>
      {children}
      {(error || success) && (
        <div className={`flex items-center gap-1 text-xs ${hintColor}`}>
          <ValidationIcon error={!!error} success={!!success} />
          <span>{error || success}</span>
        </div>
      )}
    </div>
  );
}

export function TextInput({ id, name, value, onChange, type = "text", placeholder, invalid, valid }) {
  const ring =
    invalid ? "focus:ring-red-300 focus:border-red-400 border-red-300"
    : valid ? "focus:ring-[#0aa15d]/40 focus:border-[#0aa15d]/60 border-[#0aa15d]/50"
    : "focus:ring-[#0aa15d]/40 focus:border-[#0aa15d]/60 border-gray-300";

  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 rounded-lg border bg-white/80 text-gray-900 outline-none ${ring}`}
    />
  );
}

export function Select({ id, name, value, onChange, children, invalid, valid }) {
  const ring =
    invalid ? "focus:ring-red-300 focus:border-red-400 border-red-300"
    : valid ? "focus:ring-[#0aa15d]/40 focus:border-[#0aa15d]/60 border-[#0aa15d]/50"
    : "focus:ring-[#0aa15d]/40 focus:border-[#0aa15d]/60 border-gray-300";

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 rounded-lg border bg-white/80 text-gray-900 outline-none ${ring}`}
    >
      {children}
    </select>
  );
}

function ValidationIcon({ error, success }) {
  if (error) {
    return (
      <svg width="14" height="14" viewBox="0 0 20 20" className="shrink-0" fill="currentColor">
        <path d="M10 0a10 10 0 100 20A10 10 0 0010 0Zm3.54 13.46-1.08 1.08L10 12.08l-2.46 2.46-1.08-1.08L8.92 11 6.46 8.54 7.54 7.46 10 9.92l2.46-2.46 1.08 1.08L11.08 11l2.46 2.46Z"/>
      </svg>
    );
  }
  if (success) {
    return (
      <svg width="14" height="14" viewBox="0 0 20 20" className="shrink-0" fill="currentColor">
        <path d="M10 0a10 10 0 100 20A10 10 0 0010 0Zm-1.2 14.4-3.6-3.6 1.2-1.2 2.4 2.4 5.4-5.4 1.2 1.2-6.6 6.6Z"/>
      </svg>
    );
  }
  return null;
}

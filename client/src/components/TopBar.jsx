import { useEffect, useState } from "react";

export default function TopBar() {
  return (
    <header
      className="w-full flex justify-end items-center px-6 py-3
                 bg-white/60 backdrop-blur-md border-b border-[#0aa15d]/30 shadow-sm"
    >
      <Clock offsetYears={9} />
    </header>
  );
}

function addYearsClamped(date, years) {
  const d = new Date(date);
  const month = d.getMonth();
  d.setFullYear(d.getFullYear() + years);
  if (d.getMonth() !== month) d.setDate(0);
  return d;
}

function Clock({ offsetYears = 0 }) {
  const [now, setNow] = useState(new Date());
  const [blink, setBlink] = useState(true);

  // Actualisation de l'heure
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Clignotement des deux-points toutes les secondes
  useEffect(() => {
    const blinker = setInterval(() => setBlink((prev) => !prev), 1000);
    return () => clearInterval(blinker);
  }, []);

  const gameNow = addYearsClamped(now, offsetYears);
  const dateStr = gameNow.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hours = gameNow.getHours().toString().padStart(2, "0");
  const minutes = gameNow.getMinutes().toString().padStart(2, "0");

  return (
    <div
      className="font-mono text-right leading-tight text-[#0aa15d]
                 drop-shadow-[0_0_8px_rgba(10,161,93,0.4)]"
      data-era={`+${offsetYears}y`}
    >
      <div className="text-lg tracking-widest font-semibold">{dateStr}</div>
      <div className="text-2xl font-bold select-none">
        {hours}
        <span
          className={`inline-block w-2 text-center ${
            blink ? "opacity-100" : "opacity-30"
          } transition-opacity duration-300`}
        >
          :
        </span>
        {minutes}
      </div>
    </div>
  );
}

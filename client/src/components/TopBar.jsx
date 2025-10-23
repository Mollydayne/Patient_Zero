import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function TopBar() {
  return (
    <header
      className="w-full flex justify-between items-center px-6 py-3
                 bg-white/60 backdrop-blur-md border-b border-[#0aa15d]/30 shadow-sm"
    >
      <LeftActions />
      <Clock offsetYears={9} />
    </header>
  );
}

function LeftActions() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await logout(); // POST /api/auth/logout + clear user
    } catch (e) {
      // même si l’appel échoue, on redirige pour couper l’accès
    } finally {
      setLoading(false);
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-3 py-1.5 rounded-md border border-[#0aa15d]/40
                   text-[#0aa15d] hover:text-white
                   bg-white/20 hover:bg-[#16a34a]/70
                   shadow-sm transition-colors disabled:opacity-60"
        title="Se déconnecter"
      >
        {loading ? "Déconnexion…" : "Déconnexion"}
      </button>
    </div>
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

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

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
          className={`inline-block w-4 text-center mx-[1px] ${
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

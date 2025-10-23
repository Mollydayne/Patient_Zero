import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, booting } = useAuth();
  if (booting) return <div className="p-6 text-neutral-400">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

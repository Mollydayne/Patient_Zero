// App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Composants globaux
import TopBar from "./components/TopBar.jsx";
import Navbar from "./components/Navbar.jsx";

// Pages principales
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import PatientView from "./pages/PatientView.jsx";
import VisitView from "./pages/VisitView.jsx";

// Inscription patient (multi-étapes)
import RegisterPatient from "./pages/RegisterPatient.jsx";
import RegisterPatientSituation from "./pages/RegisterPatientSituation.jsx";
import RegisterPatientDrugs from "./pages/RegisterPatientDrugs.jsx";
import RegisterPatientNotes from "./pages/RegisterPatientNotes.jsx";
import RegisterSummary from "./pages/RegisterSummary.jsx";

export default function App() {
  return (
    <div className="app light bg-neutral-100">
      {/* Barre du haut (profil + horloge) */}
      <TopBar />
      {/* Navbar (actuellement juste un bouton Accueil → /patients) */}
      <Navbar />

      <main className="container">
        <Routes>
          {/* Redirection de la racine vers /patients */}
          <Route path="/" element={<Navigate to="/patients" replace />} />

          {/* Pages "simples" */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientView />} />
          <Route path="/visits/:id" element={<VisitView />} />

          {/* ====== Inscription multi-étapes (routes imbriquées) ======
             - /register                 → RegisterPatient (index)
             - /register/situation       → RegisterPatientSituation
             - /register/drugs           → RegisterPatientDrugs
             - /register/notes           → RegisterPatientNotes
             - /register/summary         → RegisterSummary
          */}
          <Route path="/register" element={<Outlet />}>
            {/* Étape 1 (index) */}
            <Route index element={<RegisterPatient />} />
            {/* Étape 2 */}
            <Route path="situation" element={<RegisterPatientSituation />} />
            {/* Étape 3 */}
            <Route path="drugs" element={<RegisterPatientDrugs />} />
            {/* Étape 4 */}
            <Route path="notes" element={<RegisterPatientNotes />} />
            {/* Récapitulatif */}
            <Route path="summary" element={<RegisterSummary />} />
          </Route>

          {/* Fallback optionnel : si aucune route ne correspond */}
          <Route path="*" element={<Navigate to="/patients" replace />} />
        </Routes>
      </main>
    </div>
  );
}

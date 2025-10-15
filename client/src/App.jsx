// App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RegistrationProvider } from "./context/RegistrationContext.jsx";

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

// ----- Layouts -----
function RootLayout() {
  return (
    <div className="app light bg-neutral-100 min-h-screen">
      <TopBar />
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

// Layout dédié au flow d'inscription si tu veux ajouter une barre d'étapes plus tard
function RegisterLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* Layout global */}
      <Route element={<RootLayout />}>
        {/* Redirection racine */}
        <Route index element={<Navigate to="/patients" replace />} />

        {/* Pages simples */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientView />} />
        <Route path="visits/:id" element={<VisitView />} />

        {/* Flow d'inscription multi-étapes */}
        <Route
          path="register"
          element={
            <RegistrationProvider>
              <RegisterLayout />
            </RegistrationProvider>
          }
        >
          <Route index element={<RegisterPatient />} />
          <Route path="situation" element={<RegisterPatientSituation />} />
          <Route path="drugs" element={<RegisterPatientDrugs />} />
          <Route path="notes" element={<RegisterPatientNotes />} />
          <Route path="summary" element={<RegisterSummary />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/patients" replace />} />
      </Route>
    </Routes>
  );
}

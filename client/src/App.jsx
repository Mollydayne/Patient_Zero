// App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RegistrationProvider } from "./context/RegistrationContext.jsx";

// Auth
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";

// Composants globaux
import TopBar from "./components/TopBar.jsx";
import Navbar from "./components/Navbar.jsx";

// Pages principales
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import PatientView from "./pages/PatientView.jsx";
import VisitView from "./pages/VisitView.jsx";
import PatientEdit from "./pages/PatientEdit.jsx";
import PrescriptionEditor from "./pages/PrescriptionEditor.jsx";
import NoteEditor from "./pages/NoteEditor.jsx";

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

function RegisterLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* 1) Page publique = /login */}
      <Route path="/login" element={<Login />} />

      {/* 2) Tout le reste est protégé */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RootLayout />}>
          {/* À la racine, on choisit ce que voit un utilisateur connecté */}
          <Route index element={<Navigate to="/patients" replace />} />

          {/* Pages simples */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientView />} />
          <Route path="patients/:id/edit" element={<PatientEdit />} />
          <Route path="visits/:id" element={<VisitView />} />
          <Route path="/patients/:id/prescriptions/new" element={<PrescriptionEditor />} />
          <Route path="/patients/:id/notes/new" element={<NoteEditor />} />

          {/* Flow d'inscription */}
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
        </Route>
      </Route>

      {/* 3) Fallback → vers /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

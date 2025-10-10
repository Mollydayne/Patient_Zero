import TopBar from './components/TopBar.jsx';
import LogoHeader from './components/LogoHeader.jsx';
import { SearchSection, RecentViewed } from './components/HomeSections.jsx';

import { Routes, Route, Navigate, Link } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import PatientView from "./pages/PatientView.jsx";
import VisitView from "./pages/VisitView.jsx";
import RegisterPatient from "./pages/RegisterPatient.jsx";
import RegisterPatientSituation from "./pages/RegisterPatientSituation.jsx";
import RegisterPatientHealth from "./pages/RegisterPatientHealth.jsx";
import RegisterPatientNotes from "./pages/RegisterPatientNotes.jsx";
import RegisterPatientDrugs from "./pages/RegisterPatientDrugs.jsx";
import RegisterSummary from "./pages/RegisterSummary.jsx";



export default function App(){
  return (
    <div className="app light">
      <TopBar />

      {/* petite nav temporaire pour tester */}
      <nav className="w-full mt-6">
  <div className="mx-auto flex items-center justify-center gap-4">
    <Link
      to="/"
      className="inline-flex items-center justify-center h-12 px-6
                 rounded-full bg-[#7A3033]/90 hover:bg-[#7A3033]
                 text-white font-semibold transition w-auto"
    >
      Accueil
    </Link>
    <Link
      to="/dashboard"
      className="inline-flex items-center justify-center h-12 px-6
                 rounded-full bg-[#7A3033]/90 hover:bg-[#7A3033]
                 text-white font-semibold transition w-auto"
    >
      Dashboard
    </Link>
    <Link
      to="/patients"
      className="inline-flex items-center justify-center h-12 px-6
                 rounded-full bg-[#7A3033]/90 hover:bg-[#7A3033]
                 text-white font-semibold transition w-auto"
    >
      Patients
    </Link>
  </div>
</nav>


      <main className="container">
        <Routes>
          {/* Accueil maquette (logo + recherche + récentes) */}
          <Route path="/" element={
            <>
              <LogoHeader />
              <SearchSection />
              <RecentViewed />
            </>
          } />

          {/* vraies pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientView />} />
          <Route path="/visits/:id" element={<VisitView />} />
          <Route path="/register/situation" element={<RegisterPatientSituation />} />
          <Route path="/register/drugs" element={<RegisterPatientDrugs />} />
          <Route path="/register/health" element={<RegisterPatientHealth />} />
          <Route path="/register/notes" element={<RegisterPatientNotes />} />
          <Route path="/register/summary" element={<RegisterSummary />} />


          {/* Nouvelle page d’inscription */}
          <Route path="/register-patient" element={<RegisterPatient />} />
          {/* <Route path="/register/summary" element={<RegisterSummary />} /> */}
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/patients" replace />} />
        </Routes>
      </main>

      <footer className="footer muted">© {new Date().getFullYear()} Patient Zero</footer>
    </div>
  );
}

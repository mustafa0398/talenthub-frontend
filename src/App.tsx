import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import CandidatesPage from "./pages/CandidatesPage";
import PipelinesPage from "./pages/PipelinesPage";
import ReportsPage from "./pages/ReportsPage";
import ImportPage from "./pages/ImportPage";
import NewCandidatePage from "./pages/NewCandidatePage";
import EditCandidatePage from "./pages/EditCandidatePage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<CandidatesPage />} />
        <Route path="/pipelines" element={<PipelinesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/new" element={<NewCandidatePage />} />
        <Route path="/edit/:id" element={<EditCandidatePage />} /> 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

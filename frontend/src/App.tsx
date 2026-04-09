import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";
import DashboardPage from "./pages/DashboardPage";
import EvaluationResultPage from "./pages/EvaluationResultPage";
import HistoryPage from "./pages/HistoryPage";
import NewEvaluationPage from "./pages/NewEvaluationPage";
import RubricBuilderPage from "./pages/RubricBuilderPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/evaluate" element={<NewEvaluationPage />} />
        <Route path="/result/:submissionId" element={<EvaluationResultPage />} />
        <Route path="/rubrics" element={<RubricBuilderPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </AppShell>
  );
}

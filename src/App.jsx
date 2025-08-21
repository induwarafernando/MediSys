import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CognitoRedirect from "./auth/CognitoRedirect";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import UploadPage from "./pages/clinic/UploadPage";
import HistoryPage from "./pages/clinic/SubmissionHistory";
import NotificationsPage from "./pages/internal/NotificationLogs";
import AllClinicSubmissions from "./pages/internal/AllClinicSubmissions";
import ReportDetails from "./pages/internal/ReportDetails";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("idToken");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cognito hosted login redirect */}
        <Route path="/login" element={<CognitoRedirect />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="reports" element={<AllClinicSubmissions />} />
          <Route path="reports/:id" element={<ReportDetails />} />
        </Route>

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

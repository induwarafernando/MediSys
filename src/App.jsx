import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage'; // layout
import DashboardHome from './pages/dashboard/DashboardHome'; // index (home)
import UploadPage from './pages/clinic/UploadPage';
import HistoryPage from './pages/clinic/SubmissionHistory';
import NotificationsPage from './pages/internal/NotificationLogs';
import AllClinicSubmissions from './pages/internal/AllClinicSubmissions'; // staff view
import ReportDetails from './pages/internal/ReportDetails'; // staff view

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('idToken');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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
          {/* make child path RELATIVE to /dashboard */}
          <Route path="reports/:id" element={<ReportDetails />} />

          {/* Optional staff routes:
          <Route path="analytics" element={<AnalyticsPage />} />
          */}
        </Route>

        {/* Redirect unknowns */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { useLocation } from 'react-router-dom';

function DashboardPage() {
  const location = useLocation();
  const role = location.state?.role || 'unknown';

  return (
    <div>
      <h2>Welcome to the Dashboard ({role})</h2>

      {role === 'clinic_user' && (
        <>
          <h3>Clinic Modules</h3>
          <ul>
            <li><a href="/upload">Upload Diagnostic Report</a></li>
            <li><a href="/history">View Upload History</a></li>
          </ul>
        </>
      )}

      {role === 'internal_staff' && (
        <>
          <h3>Staff Modules</h3>
          <ul>
            <li><a href="/dashboard/analytics">Analytics Dashboard</a></li>
            <li><a href="/dashboard/reports">All Clinic Submissions</a></li>
          </ul>
        </>
      )}
    </div>
  );
}

export default DashboardPage;

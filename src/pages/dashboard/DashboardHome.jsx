import React from 'react';

export default function DashboardHome() {
  const role = localStorage.getItem('role') || 'clinic_user';
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {role === 'internal_staff' ? 'Staff Analytics Dashboard' : 'Clinic Dashboard'}
      </h1>
      <p className="text-gray-600">
        {role === 'internal_staff'
          ? 'Monitor system performance and clinic submissions.'
          : 'Upload and manage your diagnostic reports securely.'}
      </p>
    </div>
  );
}

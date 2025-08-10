import React from 'react';
import { useLocation } from 'react-router-dom';

function DashboardPage() {
  const location = useLocation();
  const role = location.state?.role || 'unknown';

  const commonLinks = [
    { name: 'Dashboard', href: '#' },
    ...(role === 'clinic_user'
      ? [
          { name: 'Upload Reports', href: '/upload' },
          { name: 'Report History', href: '/history' },
        ]
      : role === 'internal_staff'
      ? [
          { name: 'Analytics Dashboard', href: '/dashboard/analytics' },
          { name: 'All Clinic Submissions', href: '/dashboard/reports' },
        ]
      : []),
    { name: 'Help', href: '#' },
    { name: 'Settings', href: '#' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">MediSys Diagnostics</h2>
        <nav className="space-y-2">
          {commonLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>

        {role === 'clinic_user' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Diagnostic Reports</h2>
            <p className="text-gray-600 mb-6">
              Securely upload patient diagnostic reports in CSV or Excel format. Ensure files are properly formatted before uploading.
            </p>

            {/* Upload Box */}
            <div className="border-dashed border-2 border-gray-300 p-10 rounded-lg bg-white text-center mb-10">
              <p className="text-gray-500 mb-2 font-medium">Drag and drop files here or</p>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200">
                Browse Files
              </button>
            </div>

            {/* Upload History Table */}
            <h3 className="text-lg font-semibold mb-2">Upload History</h3>
            <input
              type="text"
              placeholder="Search by file name"
              className="w-full mb-4 px-4 py-2 border rounded-md"
            />

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="px-6 py-3">File Name</th>
                    <th className="px-6 py-3">Upload Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'PatientReport_20240726.csv', date: 'July 26, 2024', status: 'Uploaded' },
                    { name: 'PatientReport_20240725.xlsx', date: 'July 25, 2024', status: 'Processing' },
                    { name: 'PatientReport_20240724.csv', date: 'July 24, 2024', status: 'Completed' },
                    { name: 'PatientReport_20240723.xlsx', date: 'July 23, 2024', status: 'Failed' },
                  ].map((file) => (
                    <tr key={file.name} className="border-b">
                      <td className="px-6 py-4">{file.name}</td>
                      <td className="px-6 py-4">{file.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {file.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'internal_staff' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Staff Modules</h2>
            <p className="text-gray-600">Access analytics, monitor submissions, and manage clinics.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function DashboardPage() {
  const location = useLocation();
  const role = location.state?.role || 'unknown';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

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
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white p-4 shadow-md transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold text-gray-800 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            MediSys
          </h2>
          <button onClick={toggleSidebar}>
            {isCollapsed ? <Menu className="h-6 w-6 text-gray-600" /> : <X className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        <nav className="space-y-2">
          {commonLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
            >
              <span className="text-sm">{isCollapsed ? link.name.charAt(0) : link.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>

        {role === 'clinic_user' && (
          <>
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-2">Upload Diagnostic Reports</h2>
              <div className="border-2 border-dashed border-gray-300 bg-white p-6 rounded-lg text-center">
                <p className="text-gray-500 mb-2">Drag & drop files or</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Browse Files
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Upload History</h3>
              <input
                type="text"
                placeholder="Search by file name"
                className="w-full mb-4 px-4 py-2 border rounded-md"
              />
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">File Name</th>
                      <th className="px-6 py-3">Upload Date</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Report_2024.csv', date: 'Aug 10, 2025', status: 'Completed' },
                      { name: 'Report_2025.xlsx', date: 'Aug 11, 2025', status: 'Processing' },
                    ].map((file) => (
                      <tr key={file.name} className="border-b">
                        <td className="px-6 py-4">{file.name}</td>
                        <td className="px-6 py-4">{file.date}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            {file.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {role === 'internal_staff' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Staff Tools</h2>
            <p className="text-gray-600 mb-4">
              Monitor clinic activity, analyze trends, and manage submissions securely.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2">Clinic Submissions</h3>
                <p className="text-sm text-gray-600">View, search, and download reports submitted by clinics.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">Visualize trends using AWS QuickSight integration.</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;

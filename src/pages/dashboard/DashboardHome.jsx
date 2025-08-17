import React, { useMemo } from 'react';
import {
  Upload, FileText, Bell, Database, TrendingUp, Shield, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

// ---- Shared small widgets ----
function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 text-blue-600" />}
      </div>
      {sub && <p className="text-sm text-gray-500 mt-2">{sub}</p>}
    </div>
  );
}

function StatusPill({ status }) {
  const base = 'px-2 py-0.5 rounded-full text-[11px] font-medium';
  if (status === 'Completed') return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
  if (status === 'Processing') return <span className={`${base} bg-yellow-100 text-yellow-700`}>Processing</span>;
  if (status === 'Failed') return <span className={`${base} bg-red-100 text-red-700`}>Failed</span>;
  return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
}

function StatusIcon({ status }) {
  if (status === 'Completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === 'Processing') return <Clock className="h-4 w-4 text-yellow-500" />;
  if (status === 'Failed') return <AlertCircle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-gray-500" />;
}

// ---- Mock data (swap with API later) ----
const MOCK_REPORTS = [
  { id: 1, name: 'Blood_Test_Results_Jan2025.csv', date: 'Aug 12, 2025', status: 'Completed', records: 150, clinic: 'Clinic A', time: '2.3s' },
  { id: 2, name: 'Radiology_Reports_Q1.xlsx',      date: 'Aug 13, 2025', status: 'Processing', records: 75, clinic: 'Clinic B', time: '—'   },
  { id: 3, name: 'Lab_Results_Feb2025.csv',        date: 'Aug 14, 2025', status: 'Failed',     records: 0,   clinic: 'Clinic A', time: '0.8s' },
];

function RecentUploads({ items }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-green-600" /> Recent Uploads
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2 font-semibold text-gray-700">File</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-700">Date</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-700">Records</th>
              <th className="text-left px-4 py-2 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.date}</td>
                <td className="px-4 py-2">{r.records}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={r.status} />
                    <StatusPill status={r.status} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No recent uploads.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Role-specific blocks (in one file) ----
function ClinicDashboard() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clinic Dashboard</h1>
        <p className="text-gray-600">Upload and manage your diagnostic reports securely.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Uploads" value="238" icon={Upload} sub="All time" />
        <StatCard label="Avg. Processing" value="2.4s" icon={Clock} sub="Last 30 days" />
        <StatCard label="Completed" value="98.2%" icon={TrendingUp} sub="Success rate" />
        <StatCard label="Notifications" value="7" icon={Bell} sub="Last 24h" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentUploads items={MOCK_REPORTS} />
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" /> Quick Actions
          </h3>
          <div className="grid gap-3">
            <a href="/dashboard/upload" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Upload Report</a>
            <a href="/dashboard/history" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">View History</a>
            <a href="/dashboard/notifications" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">Notifications</a>
          </div>
        </div>
      </div>
    </>
  );
}

function StaffDashboard() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor system performance and clinic submissions.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Submissions" value="1,234" icon={Database} sub="All time" />
        <StatCard label="Processing Time" value="2.1s" icon={Clock} sub="Avg last 30 days" />
        <StatCard label="Active Clinics" value="45" icon={Shield} sub="3 new this week" />
        <StatCard label="Success Rate" value="98.7%" icon={TrendingUp} sub="+0.3% vs last week" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" /> Recent Submissions
          </h3>
          <ul className="space-y-3">
            {MOCK_REPORTS.map(r => (
              <li key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{r.clinic}</div>
                  <div className="text-xs text-gray-500">{r.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={r.status} />
                  <span className="text-xs text-gray-600">{r.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" /> System Health
          </h3>
          <div className="space-y-3">
            <Row label="AWS Lambda" value="Healthy" />
            <Row label="DynamoDB" value="Connected" />
            <Row label="S3 Storage" value="Available" />
            <Row label="SNS Notifications" value="Active" />
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className="text-green-600 font-medium">{value}</span>
    </div>
  );
}

// ---- Single-page role switch ----
export default function DashboardHome() {
  const role = (localStorage.getItem('role') || 'clinic_user').trim();
  const isStaff = useMemo(() => role === 'internal_staff', [role]);

  return isStaff ? <StaffDashboard /> : <ClinicDashboard />;
}

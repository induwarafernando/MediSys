// src/pages/dashboard/InternalDashboardHome.jsx
import React, { useEffect, useState } from "react";
import {
  Database,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart2,
  Users,
  Bell,
  TrendingUp,
  Download,
} from "lucide-react";

function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 text-green-600" />}
      </div>
      {sub && <p className="text-sm text-gray-500 mt-2">{sub}</p>}
    </div>
  );
}

function StatusPill({ status }) {
  const base = "px-2 py-0.5 rounded-full text-[11px] font-medium";
  if (status === "Completed")
    return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
  if (status === "In Review")
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>In Review</span>;
  if (status === "Failed")
    return <span className={`${base} bg-red-100 text-red-700`}>Failed</span>;
  return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
}

function StatusIcon({ status }) {
  if (status === "Completed")
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === "In Review")
    return <Clock className="h-4 w-4 text-yellow-500" />;
  if (status === "Failed")
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-gray-500" />;
}

function RecentSubmissions({ items }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Database className="h-5 w-5 text-green-600" /> Recent Submissions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2">File</th>
              <th className="text-left px-4 py-2">Clinic</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Records</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.clinicName}</td>
                <td className="px-4 py-2">
                  {new Date(r.uploadedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{r.recordCount}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={r.status} />
                    <StatusPill status={r.status} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No recent submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemHealthRow({ label, value, status = 'healthy' }) {
  const statusColor = status === 'healthy' || status === 'active' || status === 'available' || status === 'connected'
    ? 'text-green-600'
    : status === 'warning'
    ? 'text-yellow-600'
    : 'text-red-600';

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className={`${statusColor} font-medium`}>{value}</span>
    </div>
  );
}


export default function InternalDashboardHome() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    activeClinics: 0,
    pendingReviews: 0,
    systemUptime: "99.9%",
    notifications: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    // Simulate fetching data for internal staff
    fetch("http://localhost:5000/internal-stats") // You might want to create a separate endpoint
      .then((res) => res.json())
      .then(setStats)
      .catch(() =>
        setStats({
          totalSubmissions: 45,
          activeClinics: 12,
          pendingReviews: 3,
          systemUptime: "99.9%",
          notifications: 5,
        })
      );

    fetch("http://localhost:5000/internal-submissions") // You might want to create a separate endpoint
      .then((res) => res.json())
      .then(setRecentSubmissions)
      .catch(() =>
        setRecentSubmissions([
          {
            id: 1,
            name: "ClinicB_Report_Q3.csv",
            clinicName: "Clinic B",
            uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
            recordCount: 150,
            status: "In Review",
          },
          {
            id: 2,
            name: "ClinicA_Monthly_Data.csv",
            clinicName: "Clinic A",
            uploadedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
            recordCount: 230,
            status: "Completed",
          },
          {
            id: 3,
            name: "ClinicC_LabResults.csv",
            clinicName: "Clinic C",
            uploadedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
            recordCount: 80,
            status: "Failed",
          },
        ])
      );
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Internal Staff Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor system performance, manage submissions, and ensure compliance.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Submissions" value={stats.totalSubmissions} icon={Database} sub="All time" />
        <StatCard label="Active Clinics" value={stats.activeClinics} icon={Users} sub="Currently registered" />
        <StatCard label="Pending Reviews" value={stats.pendingReviews} icon={Clock} sub="Awaiting action" />
        <StatCard label="System Uptime" value={stats.systemUptime} icon={TrendingUp} sub="Last 30 days" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSubmissions items={recentSubmissions} />

        {/* RIGHT SIDE CONTENT for Internal Staff */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" /> System Health & Status
            </h3>
            <div className="space-y-1">
              <SystemHealthRow label="AWS Lambda" value="Healthy" status="healthy" />
              <SystemHealthRow label="DynamoDB" value="Connected" status="connected" />
              <SystemHealthRow label="S3 Storage" value="Available" status="available" />
              <SystemHealthRow label="SNS Notifications" value="Active" status="active" />
              <SystemHealthRow label="Authentication Service" value="Operational" status="active" />
            </div>
          </div>

          {/* QUICK ACTIONS for Internal Staff */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-green-600" /> Quick Actions
            </h3>
            <div className="grid gap-3">
              <a
                href="/internal/reports"
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Database className="h-5 w-5" /> View All Submissions
              </a>
              <a
                href="/internal/compliance"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2"
              >
                <Shield className="h-5 w-5" /> Review Compliance
              </a>
              <a
                href="/internal/notifications"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2"
              >
                <Bell className="h-5 w-5" /> Manage Alerts
              </a>
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" /> Download System Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
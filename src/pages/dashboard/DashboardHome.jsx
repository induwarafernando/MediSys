// src/pages/dashboard/DashboardHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Upload,
  FileText,
  Bell,
  Database,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
              <th className="text-left px-4 py-2">File</th>
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
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No uploads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const role = (localStorage.getItem("role") || "clinic_user").trim();
  const isStaff = useMemo(() => role === "internal_staff", [role]);

  const [stats, setStats] = useState({
    totalUploads: 0,
    avgProcessing: "0s",
    successRate: "0%",
    activeClinics: 0,
    notifications: 0,
  });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() =>
        setStats({
          totalUploads: 9,
          avgProcessing: "2.4s",
          successRate: "98%",
          activeClinics: 10,
          notifications: 2,
        })
      );

    fetch("http://localhost:5000/reports")
      .then((res) => res.json())
      .then(setReports)
      .catch(() =>
        setReports([
          {
            id: 1,
            name: "Fallback.csv",
            uploadedAt: new Date(),
            recordCount: 20,
            status: "Completed",
          },
        ])
      );
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isStaff ? "Staff Analytics Dashboard" : "Clinic Dashboard"}
        </h1>
        <p className="text-gray-600">
          {isStaff
            ? "Monitor system performance and clinic submissions."
            : "Upload and manage your diagnostic reports securely."}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Uploads" value={stats.totalUploads} icon={Upload} sub="All time" />
        <StatCard label="Avg. Processing" value={stats.avgProcessing} icon={Clock} sub="Last 30 days" />
        <StatCard label="Success Rate" value={stats.successRate} icon={TrendingUp} sub="Success rate" />
        <StatCard label="Notifications" value={stats.notifications} icon={Bell} sub="Last 24h" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentUploads items={reports} />

        {/* RIGHT SIDE CONTENT */}
        <div className="space-y-6">
          {isStaff && (
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
          )}

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" /> Quick Actions
            </h3>
            <div className="grid gap-3">
              <a
                href="/dashboard/upload"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Upload Report
              </a>
              <a
                href="/dashboard/history"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                View History
              </a>
              <a
                href="/dashboard/notifications"
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Notifications
              </a>
            </div>
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

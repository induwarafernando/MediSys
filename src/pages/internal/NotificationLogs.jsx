// /src/pages/internal/NotificationLogs.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle, AlertCircle, FileText, Search, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

function timeAgo(iso) {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function TypeBadge({ type }) {
  const base = "px-2 py-0.5 rounded-full text-[11px] font-medium border inline-flex items-center gap-1";
  if (type === "Approved") return <span className={`${base} bg-green-50 text-green-700 border-green-200`}>Approved</span>;
  if (type === "Rejected") return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>Rejected</span>;
  // New submission (partner upload available for review)
  return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>New Submission</span>;
}

function TypeIcon({ type }) {
  const cls = "h-5 w-5";
  if (type === "Approved") return <CheckCircle className={`${cls} text-green-500`} />;
  if (type === "Rejected") return <AlertCircle className={`${cls} text-red-500`} />;
  return <FileText className={`${cls} text-blue-500`} />;
}

// --- Mock data (replace with API results) ---
const MOCK_NOTIFICATIONS = [
  // type: "NewSubmission" | "Approved" | "Rejected"
  {
    id: "n-901",
    type: "NewSubmission",
    title: "Clinic A uploaded a new report",
    message: "Blood_Test_Results_Jan2025.csv is ready for review.",
    orgName: "Clinic A",
    reportId: 201,
    createdAt: "2025-08-16T08:40:00Z",
    read: false,
  },
  {
    id: "n-902",
    type: "Approved",
    title: "Report approved",
    message: "Chemistry_Panel_Mar2025.csv has been approved.",
    orgName: "Clinic C",
    reportId: 204,
    createdAt: "2025-08-16T07:55:00Z",
    read: false,
  },
  {
    id: "n-903",
    type: "Rejected",
    title: "Report rejected",
    message: "Pathology_Special_Aug2025.xlsx was rejected: Missing Patient ID column.",
    orgName: "Clinic B",
    reportId: 210,
    createdAt: "2025-08-16T06:25:00Z",
    read: true,
  },
  {
    id: "n-904",
    type: "Approved",
    title: "Report approved",
    message: "Hematology_Apr2025.csv has been approved.",
    orgName: "Clinic A",
    reportId: 205,
    createdAt: "2025-08-15T10:10:00Z",
    read: true,
  },
  {
    id: "n-905",
    type: "NewSubmission",
    title: "Clinic H uploaded a new report",
    message: "Endocrinology_Aug2025.csv submitted and awaits review.",
    orgName: "Clinic H",
    reportId: 212,
    createdAt: "2025-08-16T09:12:00Z",
    read: false,
  },
];

export default function NotificationLogs({ isReviewer: isReviewerProp }) {
  // Simple role/org detection for MVP – replace with Cognito/JWT claims in production
  const roleFromStorage = (localStorage.getItem("role") || "").trim();
  const orgFromStorage = (localStorage.getItem("orgName") || "Clinic A").trim();

  const isReviewer = typeof isReviewerProp === "boolean"
    ? isReviewerProp
    : roleFromStorage === "Reviewer";

  const myOrgName = isReviewer ? null : orgFromStorage; // clinic users see only their org

  // local state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Unread"); // "Unread" | "All"
  const [typeFilter, setTypeFilter] = useState("All"); // All | NewSubmission | Approved | Rejected
  const [search, setSearch] = useState("");

  // simulate fetch
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const t = setTimeout(() => {
      if (!mounted) return;
      // Scope for clinic users
      const scoped = myOrgName
        ? MOCK_NOTIFICATIONS.filter((n) => n.orgName === myOrgName)
        : MOCK_NOTIFICATIONS.slice();
      setItems(scoped);
      setLoading(false);
    }, 250);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [myOrgName]);

  // derived lists
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((n) => {
      const matchesType = typeFilter === "All" ? true : n.type === typeFilter;
      const matchesTab = tab === "Unread" ? !n.read : true;
      const matchesText =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.orgName || "").toLowerCase().includes(q) ||
        String(n.reportId).includes(q);
      return matchesType && matchesTab && matchesText;
    });
  }, [items, typeFilter, tab, search]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  // actions
  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const refresh = () => {
    // re-run the same fetch simulation; in real app call your API
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev]); // no-op for demo; replace with fresh data
      setLoading(false);
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="text-sm text-gray-500">
          {isReviewer ? "Scope: All Organizations" : `Scope: ${myOrgName}`}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header controls */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          {/* Tabs */}
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setTab("Unread")}
              className={`px-3 py-1.5 text-sm ${tab === "Unread" ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
            >
              Unread {unreadCount > 0 && <span className="ml-1 inline-block px-1.5 rounded-full bg-white/20 text-white text-[11px]">{unreadCount}</span>}
            </button>
            <button
              onClick={() => setTab("All")}
              className={`px-3 py-1.5 text-sm ${tab === "All" ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
            >
              All
            </button>
          </div>

          {/* Right controls */}
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, report, org…"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All types</option>
              <option value="NewSubmission">New submission</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>

            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              title="Mark all as read"
            >
              <Bell className="h-4 w-4" /> Mark all read
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="p-6 text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-500">No notifications.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map((n) => (
              <li key={n.id} className={`p-4 ${!n.read ? "bg-blue-50/40" : "bg-white"}`}>
                <div className="flex items-start gap-3">
                  <TypeIcon type={n.type === "NewSubmission" ? "NewSubmission" : n.type} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium text-gray-900">{n.title}</div>
                      <TypeBadge type={n.type === "NewSubmission" ? "NewSubmission" : n.type} />
                      <div className="text-xs text-gray-500">• {n.orgName}</div>
                      <div className="text-xs text-gray-400">• {timeAgo(n.createdAt)}</div>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">{n.message}</div>

                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        to={`/dashboard/reports/${n.reportId}`}
                        className="text-sm text-blue-600 hover:underline"
                        title="Open report"
                        onClick={() => markRead(n.id)}
                      >
                        View report
                      </Link>
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-sm text-gray-600 hover:underline"
                          title="Mark as read"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Small legend */}
      <div className="mt-4 text-xs text-gray-500">
        Showing {isReviewer ? "all organizations" : `notifications for ${myOrgName}`}. Replace mock data with your API:
        <code className="ml-1">GET /notifications?scope=org|all</code>,{" "}
        <code>POST /notifications/:id/read</code>.
      </div>
    </div>
  );
}

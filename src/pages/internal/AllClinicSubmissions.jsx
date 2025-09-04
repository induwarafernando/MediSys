import React, { useMemo, useState, useEffect } from "react";
import { FileText, Search, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;
const USE_DUMMY_DATA = false; // 🔀 toggle here (true = mock data, false = API)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/** Helpers */
function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
}

function getStatusIcon(status) {
  const cls = "h-4 w-4";
  if (status === "Approved")
    return (
      <svg className={`${cls} text-green-500`} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
        />
      </svg>
    );
  if (status === "In Review")
    return (
      <svg className={`${cls} text-blue-500`} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 8v5l4 2 .75-1.23-3.25-1.77V8z"
        />
        <path
          fill="currentColor"
          d="M12 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10zm0-18a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8z"
        />
      </svg>
    );
  if (status === "Rejected")
    return (
      <svg className={`${cls} text-red-500`} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2 1 21h22L12 2zm1 15h-2v-2h2zm0-4h-2V9h2z"
        />
      </svg>
    );
  return (
    <svg className={`${cls} text-gray-500`} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  );
}
function getStatusPill(status) {
  const base =
    "px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1";
  if (status === "Approved")
    return `${base} bg-green-50 text-green-700 border-green-200`;
  if (status === "In Review")
    return `${base} bg-blue-50 text-blue-700 border-blue-200`;
  if (status === "Rejected")
    return `${base} bg-red-50 text-red-700 border-red-200`;
  return `${base} bg-gray-50 text-gray-700 border-gray-200`;
}

/** Mock data */
const MOCK_REPORTS = [
  {
    id: 201,
    name: "Blood_Test_Results_Jan2025.csv",
    uploadedAt: "2025-08-12T10:00:00Z",
    status: "Approved",
    clinic: "Clinic A",
    recordCount: 150,
    s3Key: "org/clinic-a/201.csv",
  },
  {
    id: 202,
    name: "Radiology_Reports_Q1.xlsx",
    uploadedAt: "2025-08-13T08:55:00Z",
    status: "In Review",
    clinic: "Clinic B",
    recordCount: 75,
    s3Key: "org/clinic-b/202.xlsx",
  },
  {
    id: 203,
    name: "Lab_Results_Feb2025.csv",
    uploadedAt: "2025-08-14T13:15:00Z",
    status: "Rejected",
    clinic: "Clinic A",
    recordCount: 0,
    s3Key: "org/clinic-a/203.csv",
  },
];

export default function AllClinicSubmissions() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("uploadedAt"); // name | clinic | status | uploadedAt | recordCount
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // fetch reports
  useEffect(() => {
    if (USE_DUMMY_DATA) {
      setReports(MOCK_REPORTS);
    } else {
      fetch(`${API_BASE}/reports`)
        .then((res) => res.json())
        .then((data) => setReports(data))
        .catch((err) => {
          console.error("❌ Failed to fetch reports:", err);
          setReports([]);
        });
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const onDownload = (id) => {
    const r = reports.find((x) => x.id === id);
    console.log("Download requested for:", r?.s3Key);
    setToast({ type: "info", text: `Downloading ${r?.name}...` });
  };

  /** Filtering + sorting */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesText =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.clinic.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" ? true : r.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "recordCount") {
        va = Number(va || 0);
        vb = Number(vb || 0);
      } else if (sortKey === "uploadedAt") {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      } else {
        va = String(va || "");
        vb = String(vb || "");
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const setSort = (key) => {
    setPage(1);
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortHeader = ({ label, keyName, widthClass = "" }) => (
    <th
      className={`text-left px-6 py-3 font-semibold text-gray-700 cursor-pointer select-none ${widthClass}`}
      onClick={() => setSort(keyName)}
      title={`Sort by ${label}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === keyName && (
          <span className="text-xs text-gray-500">
            {sortDir === "asc" ? "▲" : "▼"}
          </span>
        )}
      </span>
    </th>
  );

  const goToDetails = (id) => navigate(`/dashboard/reports/${id}`);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Clinic Submissions</h2>

      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : toast.type === "warn"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-gray-50 border-gray-200 text-gray-700"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by file name or clinic..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:w-56"
          >
            <option>All</option>
            <option>In Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <SortHeader
                  label="File Details"
                  keyName="name"
                  widthClass="w-2/5"
                />
                <SortHeader label="Clinic" keyName="clinic" />
                <SortHeader label="Upload Date" keyName="uploadedAt" />
                <SortHeader label="Records" keyName="recordCount" />
                <SortHeader label="Status" keyName="status" />
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-gray-500"
                    colSpan={6}
                  >
                    No reports found. Try clearing filters.
                  </td>
                </tr>
              )}

              {pageData.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* CLICKABLE column -> go to details page */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => goToDetails(r.id)}
                      className="flex items-center gap-2 group"
                      title="Open report details"
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 group-hover:underline">
                          {r.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r.recordCount} records
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4">{r.clinic}</td>
                  <td className="px-6 py-4">{formatDate(r.uploadedAt)}</td>
                  <td className="px-6 py-4">{r.recordCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(r.status)}
                      <span className={getStatusPill(r.status)}>
                        {r.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                        onClick={() => goToDetails(r.id)}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Download"
                        onClick={() => onDownload(r.id)}
                      >
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Page {page} of {totalPages} · {filtered.length} result
            {filtered.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

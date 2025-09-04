// src/pages/clinic/SubmissionHistory.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 8;

function getStatusIcon(status) {
  if (status === 'Completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === 'Processing') return <Clock className="h-4 w-4 text-yellow-500" />;
  if (status === 'Failed') return <AlertCircle className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-gray-500" />;
}

function getStatusPill(status) {
  const base = 'px-3 py-1 rounded-full text-xs font-medium';
  if (status === 'Completed') return `${base} bg-green-100 text-green-800`;
  if (status === 'Processing') return `${base} bg-yellow-100 text-yellow-800`;
  if (status === 'Failed') return `${base} bg-red-100 text-red-800`;
  return `${base} bg-gray-100 text-gray-800`;
}

// --- MOCK (keep for fallback/testing) ---
const MOCK_REPORTS = [
  { id: 101, name: 'Blood_Test_Results_Jan2025.csv', uploadDate: 'Aug 12, 2025', status: 'Completed', clinic: 'Clinic A', recordCount: 150 },
  { id: 102, name: 'Radiology_Reports_Q1.xlsx', uploadDate: 'Aug 13, 2025', status: 'Processing', clinic: 'Clinic B', recordCount: 75 },
  { id: 103, name: 'Lab_Results_Feb2025.csv', uploadDate: 'Aug 14, 2025', status: 'Failed', clinic: 'Clinic A', recordCount: 0 },
];

export default function SubmissionHistory() {
  const [reports, setReports] = useState([]);   // real data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('uploadDate');
  const [sortDir, setSortDir] = useState('desc');

  const navigate = useNavigate();
  const goToDetails = (id) => navigate(`/dashboard/reports/${id}`);

  // --- Fetch from Node API ---
  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/reports');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error('❌ Failed to fetch reports:', err);
        setError('Failed to load reports, showing mock data');
        setReports(MOCK_REPORTS); // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesText =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.clinic.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' ? true : r.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (sortKey === 'recordCount') {
        va = Number(va || 0);
        vb = Number(vb || 0);
      } else if (sortKey === 'uploadDate' || sortKey === 'uploadedAt') {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      } else {
        va = String(va || '');
        vb = String(vb || '');
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
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
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ label, keyName, widthClass = '' }) => (
    <th
      className={`text-left px-6 py-3 font-semibold text-gray-700 cursor-pointer select-none ${widthClass}`}
      onClick={() => setSort(keyName)}
      title={`Sort by ${label}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === keyName && (
          <span className="text-xs text-gray-500">
            {sortDir === 'asc' ? '▲' : '▼'}
          </span>
        )}
      </span>
    </th>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Report History</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading && <p className="text-gray-500">Loading reports...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

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
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
            <option>In Review</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <SortHeader label="File Details" keyName="name" widthClass="w-2/5" />
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
              {pageData.length === 0 && !loading && (
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500">
                          {r.recordCount} records
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{r.clinic}</td>
                  <td className="px-6 py-4">
                    {new Date(r.uploadedAt || r.uploadDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{r.recordCount ?? '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(r.status)}
                      <span className={getStatusPill(r.status)}>{r.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                        onClick={() => goToDetails(r.id)}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-gray-500" />
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
            {filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? 'text-gray-300 border-gray-200'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? 'text-gray-300 border-gray-200'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
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

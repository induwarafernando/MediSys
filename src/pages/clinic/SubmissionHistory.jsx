import React, { useMemo, useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- add this

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

const MOCK_REPORTS = [
  { id: 101, name: 'Blood_Test_Results_Jan2025.csv', uploadDate: 'Aug 12, 2025', status: 'Completed', clinic: 'Clinic A', recordCount: 150, processingTime: '2.3s' },
  { id: 102, name: 'Radiology_Reports_Q1.xlsx', uploadDate: 'Aug 13, 2025', status: 'Processing', clinic: 'Clinic B', recordCount: 75, processingTime: '—' },
  { id: 103, name: 'Lab_Results_Feb2025.csv', uploadDate: 'Aug 14, 2025', status: 'Failed', clinic: 'Clinic A', recordCount: 0, processingTime: '0.8s' },
  { id: 104, name: 'Chemistry_Panel_Mar2025.csv', uploadDate: 'Aug 14, 2025', status: 'Completed', clinic: 'Clinic C', recordCount: 212, processingTime: '3.1s' },
  { id: 105, name: 'Hematology_Apr2025.csv', uploadDate: 'Aug 15, 2025', status: 'Completed', clinic: 'Clinic A', recordCount: 98, processingTime: '2.0s' },
  { id: 106, name: 'Radiology_Reports_Q2.xlsx', uploadDate: 'Aug 15, 2025', status: 'Completed', clinic: 'Clinic B', recordCount: 61, processingTime: '4.6s' },
  { id: 107, name: 'Microbiology_May2025.csv', uploadDate: 'Aug 15, 2025', status: 'Processing', clinic: 'Clinic D', recordCount: 0, processingTime: '—' },
  { id: 108, name: 'Virology_Jun2025.csv', uploadDate: 'Aug 15, 2025', status: 'Completed', clinic: 'Clinic E', recordCount: 134, processingTime: '2.8s' },
  { id: 109, name: 'Urinalysis_Jul2025.csv', uploadDate: 'Aug 15, 2025', status: 'Completed', clinic: 'Clinic F', recordCount: 87, processingTime: '1.9s' },
  { id: 110, name: 'Pathology_Special_Aug2025.xlsx', uploadDate: 'Aug 16, 2025', status: 'Failed', clinic: 'Clinic B', recordCount: 0, processingTime: '0.7s' },
  { id: 111, name: 'Coagulation_Aug2025.csv', uploadDate: 'Aug 16, 2025', status: 'Completed', clinic: 'Clinic G', recordCount: 53, processingTime: '1.4s' },
  { id: 112, name: 'Endocrinology_Aug2025.csv', uploadDate: 'Aug 16, 2025', status: 'Processing', clinic: 'Clinic H', recordCount: 0, processingTime: '—' },
];

export default function SubmissionHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('uploadDate'); // 'name' | 'clinic' | 'status' | 'uploadDate' | 'recordCount'
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  const navigate = useNavigate();                         // <-- init navigate
  const goToDetails = (id) => navigate(`/dashboard/reports/${id}`); // <-- function

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_REPORTS.filter(r => {
      const matchesText = !q || r.name.toLowerCase().includes(q) || r.clinic.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' ? true : r.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'recordCount') {
        va = Number(va || 0); vb = Number(vb || 0);
      } else {
        va = String(va || ''); vb = String(vb || '');
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
    else { setSortKey(key); setSortDir('asc'); }
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
          <span className="text-xs text-gray-500">{sortDir === 'asc' ? '▲' : '▼'}</span>
        )}
      </span>
    </th>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Report History</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by file name or clinic..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:w-56"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <SortHeader label="File Details" keyName="name" widthClass="w-2/5" />
                <SortHeader label="Clinic" keyName="clinic" />
                <SortHeader label="Upload Date" keyName="uploadDate" />
                <SortHeader label="Records" keyName="recordCount" />
                <SortHeader label="Status" keyName="status" />
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                    No reports found. Try clearing filters.
                  </td>
                </tr>
              )}

              {pageData.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.recordCount} records</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{r.clinic}</td>
                  <td className="px-6 py-4">{r.uploadDate}</td>
                  <td className="px-6 py-4">{r.recordCount}</td>
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
                        onClick={() => goToDetails(r.id)}   // <-- navigate to details
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
            Page {page} of {totalPages} · {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages ? 'text-gray-300 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
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

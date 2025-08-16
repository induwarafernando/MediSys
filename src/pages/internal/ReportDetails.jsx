import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Check, X, CheckCircle, Clock } from "lucide-react";

/** Helpers */
function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return String(d);
  }
}
function getStatusIcon(status) {
  const cls = "h-4 w-4";
  if (status === "Approved") return <CheckCircle className={`${cls} text-green-500`} />;
  if (status === "In Review") return <Clock className={`${cls} text-blue-500`} />;
  if (status === "Rejected") return <AlertCircle className={`${cls} text-red-500`} />;
  return <Clock className={`${cls} text-gray-500`} />;
}
function getStatusPill(status) {
  const base = "px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1";
  if (status === "Approved") return `${base} bg-green-50 text-green-700 border-green-200`;
  if (status === "In Review") return `${base} bg-blue-50 text-blue-700 border-blue-200`;
  if (status === "Rejected") return `${base} bg-red-50 text-red-700 border-red-200`;
  return `${base} bg-gray-50 text-gray-700 border-gray-200`;
}

/** Replace these with real API calls */
async function fetchReportById(id) {
  // TODO: GET /reports/:id
  // Demo mock:
  const base = {
    id: Number(id),
    name: `Report_${id}.csv`,
    clinic: "Clinic A",
    uploadedAt: "2025-08-16T09:10:00Z",
    status: id % 3 === 0 ? "Rejected" : id % 2 === 0 ? "In Review" : "Approved",
    recordCount: 120,
  };
  return new Promise((res) => setTimeout(() => res(base), 300));
}
async function fetchReportDetails(id) {
  // TODO: GET /reports/:id/details
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          summary: {
            recordCount: 120,
            errorCount: 1,
            columns: ["patient_id", "test_code", "test_name", "value", "unit", "flag"],
          },
          sampleRows: [
            { patient_id: "P-1001", test_code: "HB", test_name: "Hemoglobin", value: 13.4, unit: "g/dL", flag: "N" },
            { patient_id: "P-1002", test_code: "WBC", test_name: "White Blood Cells", value: 7.9, unit: "10^9/L", flag: "N" },
          ],
        }),
      300
    )
  );
}
async function approveReport(id, comment) {
  // TODO: POST /reports/:id/approve
  return new Promise((res) => setTimeout(res, 300));
}
async function rejectReport(id, reason) {
  // TODO: POST /reports/:id/reject
  return new Promise((res) => setTimeout(res, 300));
}

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [m, d] = await Promise.all([fetchReportById(id), fetchReportDetails(id)]);
        if (!mounted) return;
        setMeta(m);
        setDetails(d);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const statusSteps = ["In Review", "Approved", "Rejected"];
  const currentIdx = Math.max(0, statusSteps.indexOf(meta?.status || "In Review"));

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      setError("");
      await approveReport(id, reason);
      setMeta((m) => ({ ...m, status: "Approved" }));
      setToast({ type: "success", text: `Report #${id} approved` });
    } catch (e) {
      setError(e?.message || "Failed to approve.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await rejectReport(id, reason.trim());
      setMeta((m) => ({ ...m, status: "Rejected" }));
      setToast({ type: "warn", text: `Report #${id} rejected` });
    } catch (e) {
      setError(e?.message || "Failed to reject.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">Loading…</div>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">Report not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

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

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">{meta.name}</div>
            <div className="mt-1 text-sm text-gray-600">
              {meta.clinic} • {formatDate(meta.uploadedAt)}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {getStatusIcon(meta.status)}
              <span className={getStatusPill(meta.status)}>{meta.status}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 pt-4">
          <ol className="flex items-center gap-2 overflow-x-auto pb-2">
            {statusSteps.map((s, idx) => (
              <li key={s} className="flex items-center">
                <div
                  className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap ${
                    idx < currentIdx
                      ? "bg-green-50 text-green-700 border-green-200"
                      : idx === currentIdx
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {s}
                </div>
                {idx < statusSteps.length - 1 && <div className="w-6 h-px bg-gray-200 mx-2" />}
              </li>
            ))}
          </ol>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-2">
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-md text-sm border ${
                activeTab === "summary"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm border ${
                activeTab === "data"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("data")}
            >
              Extracted Data
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === "summary" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500">Records</div>
                <div className="text-2xl font-semibold">{details?.summary?.recordCount ?? "—"}</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-500">Errors</div>
                <div className="text-2xl font-semibold">{details?.summary?.errorCount ?? "—"}</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 md:col-span-3">
                <div className="text-xs text-gray-500 mb-2">Columns</div>
                <div className="flex flex-wrap gap-2">
                  {(details?.summary?.columns || []).map((c) => (
                    <span key={c} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                      {c}
                    </span>
                  ))}
                  {(!details?.summary?.columns || details.summary.columns.length === 0) && (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {(details?.summary?.columns || Object.keys(details?.sampleRows?.[0] || {})).map((col) => (
                      <th key={col} className="text-left px-4 py-3 text-gray-700 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(details?.sampleRows || []).slice(0, 50).map((row, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      {Object.values(row).map((v, i) => (
                        <td key={i} className="px-4 py-3 text-gray-800">{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                  {(details?.sampleRows || []).length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-gray-500"
                        colSpan={(details?.summary?.columns || Object.keys(details?.sampleRows?.[0] || {})).length || 1}
                      >
                        No sample rows available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection reason (required only if rejecting)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3"
              placeholder="Provide a brief reason if you choose to Reject..."
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleApprove}
                disabled={submitting || meta.status === "Approved"}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                <Check className="h-4 w-4" /> Approve
              </button>
              <button
                onClick={handleReject}
                disabled={submitting || meta.status === "Rejected"}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                <AlertCircle className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

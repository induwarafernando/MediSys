import React, { useCallback, useMemo, useState } from 'react';
import { Upload as UploadIcon, FileText } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);   // File[]
  const [progress, setProgress] = useState({});             // { [fileName]: 0..100 }
  const [status, setStatus]   = useState({});               // { [fileName]: 'idle'|'uploading'|'done'|'error' }
  const [messages, setMessages] = useState({});             // { [fileName]: 'ok' | 'error text' }

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleDragOver = useCallback((e) => e.preventDefault(), []);

  const resetFile = (name) => {
    setProgress((p) => { const c = {...p}; delete c[name]; return c; });
    setStatus((s) => { const c = {...s}; delete c[name]; return c; });
    setMessages((m) => { const c = {...m}; delete c[name]; return c; });
    setSelectedFiles((arr) => arr.filter((f) => f.name !== name));
  };

  // ---- Upload (with progress via XHR) ----
  const uploadFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_BASE}/upload`;

      setStatus((s) => ({ ...s, [file.name]: 'uploading' }));
      setProgress((p) => ({ ...p, [file.name]: 0 }));
      setMessages((m) => ({ ...m, [file.name]: '' }));

      xhr.open('POST', url);

      // if your server requires any custom headers, set them here:
      // xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setProgress((p) => ({ ...p, [file.name]: pct }));
        }
      };

      xhr.onload = () => {
        // try to parse server JSON for a nicer message
        let payload = {};
        try { payload = JSON.parse(xhr.responseText || '{}'); } catch {}

        if (xhr.status >= 200 && xhr.status < 300) {
          setStatus((s) => ({ ...s, [file.name]: 'done' }));
          setProgress((p) => ({ ...p, [file.name]: 100 }));
          setMessages((m) => ({ ...m, [file.name]: payload.key ? `Uploaded → ${payload.key}` : 'Uploaded' }));
          resolve(payload);
        } else {
          const errText = payload?.error || `Upload failed (${xhr.status})`;
          setStatus((s) => ({ ...s, [file.name]: 'error' }));
          setMessages((m) => ({ ...m, [file.name]: errText }));
          reject(new Error(errText));
        }
      };

      xhr.onerror = () => {
        setStatus((s) => ({ ...s, [file.name]: 'error' }));
        setMessages((m) => ({ ...m, [file.name]: 'Network error' }));
        reject(new Error('Network error'));
      };

      const formData = new FormData();
      formData.append('report', file);
      xhr.send(formData);
    });
  }, []);

  const handleUploadAll = async () => {
    if (!selectedFiles.length) {
      alert('Pick at least one .csv/.xlsx file first.');
      return;
    }
    for (const file of selectedFiles) {
      try {
        const okExt = /\.(csv|xlsx|xls)$/i.test(file.name);
        if (!okExt) {
          setStatus((s) => ({ ...s, [file.name]: 'error' }));
          setMessages((m) => ({ ...m, [file.name]: 'Only CSV/XLS/XLSX allowed' }));
          continue;
        }
        await uploadFile(file);
      } catch {
        // error state already set
      }
    }
  };

  const hasUploading = useMemo(
    () => Object.values(status).some((v) => v === 'uploading'),
    [status]
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Diagnostic Reports</h2>

      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UploadIcon className="h-5 w-5 text-blue-600" />
            Upload Diagnostic Reports
          </h3>

          <div
            className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag & drop CSV/Excel files or</p>

            <label className="inline-block">
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                Browse Files
              </span>
            </label>

            <p className="text-xs text-gray-500 mt-2">
              Supported: CSV, Excel (.xlsx, .xls), max ~10MB each
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedFiles.map((file) => {
                const pct = progress[file.name] ?? 0;
                const st = status[file.name] ?? 'idle';
                const msg = messages[file.name] || '';
                const isError = st === 'error';
                const isDone = st === 'done';
                const isUploading = st === 'uploading';

                return (
                  <div key={file.name + file.lastModified} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDone && <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Uploaded</span>}
                        {isError && <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Error</span>}
                        <button
                          type="button"
                          onClick={() => resetFile(file.name)}
                          disabled={isUploading}
                          className={`px-2 py-1 text-xs rounded ${
                            isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {(isUploading || pct > 0 || msg) && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{isUploading ? 'Uploading…' : isDone ? 'Complete' : isError ? 'Failed' : 'Queued'}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-200 ${isError ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                        </div>
                        {msg && <div className={`text-xs mt-2 ${isError ? 'text-red-600' : 'text-gray-600'}`}>{msg}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={handleUploadAll}
              disabled={!selectedFiles.length || hasUploading}
              className={`px-4 py-2 rounded text-white ${
                !selectedFiles.length || hasUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {hasUploading ? 'Uploading…' : 'Upload Selected'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';

function UploadPage() {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('report', file);

    await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    alert('File uploaded successfully!');
  };

  return (
    <div>
      <h2>Upload Diagnostic Report</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv, .xlsx" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadPage;

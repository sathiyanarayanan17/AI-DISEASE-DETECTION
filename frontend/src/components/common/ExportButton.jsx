import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

export const ExportButton = ({ data, filename = 'vyaadhishield_data', label = 'Export CSV', format = 'csv' }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    if (!data || !data.length) return;

    let content = '';
    let mimeType = 'text/csv;charset=utf-8;';
    let ext = 'csv';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json;charset=utf-8;';
      ext = 'json';
    } else {
      // CSV Converter
      const headers = Object.keys(data[0]);
      const csvRows = [];
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map((header) => {
          const val = row[header];
          if (typeof val === 'object' && val !== null) {
            return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          }
          const escaped = ('' + (val ?? '')).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }
      content = csvRows.join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <button
      onClick={handleExport}
      className="btn btn-secondary text-xs"
      title="Download structured dataset"
    >
      {downloaded ? <Check size={14} className="text-emerald-500" /> : <Download size={14} />}
      <span>{downloaded ? 'Downloaded' : label}</span>
    </button>
  );
};

export default ExportButton;

import React from 'react';

export default function ExportButton({ data, filename, columns }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const cols = columns || Object.keys(data[0]);
    const header = cols.join(',');
    const rows = data.map(row =>
      cols.map(col => {
        const val = row[col] != null ? String(row[col]) : '';
        return val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = (filename || 'export') + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="btn-detail"
      style={{ fontSize: '0.74rem', padding: '6px 14px' }}
      title="Export as CSV"
    >
      Export CSV
    </button>
  );
}

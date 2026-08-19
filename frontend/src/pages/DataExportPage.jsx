import React, { useState, useCallback } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  File,
  Database,
  Calendar,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';

const EXPORT_FORMATS = [
  { id: 'csv', label: 'CSV', icon: FileText, color: '#22c55e' },
  { id: 'json', label: 'JSON', icon: FileJson, color: '#3b82f6' },
  { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: '#10b981' },
  { id: 'pdf', label: 'PDF', icon: File, color: '#ef4444' }
];

const DATA_SOURCES = [
  { id: 'districts', label: 'Districts Data', rows: 38 },
  { id: 'alerts', label: 'Alerts History', rows: 156 },
  { id: 'predictions', label: 'Predictions', rows: 1140 },
  { id: 'weather', label: 'Weather Data', rows: 2280 },
  { id: 'citizen', label: 'Citizen Reports', rows: 412 },
  { id: 'metrics', label: 'Model Metrics', rows: 24 }
];

const generateMockPreview = (sources) => {
  const rows = [];
  if (sources.includes('districts')) {
    DISTRICTS_DATA.slice(0, 3).forEach(d => {
      rows.push({
        district: d.name,
        riskScore: d.riskScore,
        riskLevel: d.riskLevel,
        dengue: d.dengueCases,
        cholera: d.choleraCases,
        malaria: d.malariaCases,
        rainfall: d.rainfall,
        temperature: d.temperature,
        humidity: d.humidity
      });
    });
  }
  if (sources.includes('alerts') && rows.length < 5) {
    rows.push(
      { district: 'Chennai', type: 'High Alert', date: '2026-08-18', message: 'Dengue surge detected' },
      { district: 'Madurai', type: 'Medium Alert', date: '2026-08-17', message: 'Cholera cases rising' }
    );
  }
  if (sources.includes('predictions') && rows.length < 5) {
    rows.push(
      { district: 'Coimbatore', predictedRisk: 72, confidence: 0.91, date: '2026-08-20' }
    );
  }
  return rows;
};

const generateCSVContent = (selectedSources, selectedDistricts, dateFrom, dateTo) => {
  const headers = ['District', 'Risk Score', 'Risk Level', 'Dengue Cases', 'Cholera Cases', 'Malaria Cases', 'Rainfall (mm)', 'Temperature (°C)', 'Humidity (%)', 'Date'];
  const rows = [];

  const filteredDistricts = selectedDistricts.length > 0
    ? DISTRICTS_DATA.filter(d => selectedDistricts.includes(d.id))
    : DISTRICTS_DATA;

  filteredDistricts.forEach(d => {
    const history = d.history || [];
    const filteredHistory = history.filter(h => {
      if (dateFrom && h.date < dateFrom) return false;
      if (dateTo && h.date > dateTo) return false;
      return true;
    });

    if (filteredHistory.length > 0) {
      filteredHistory.forEach(h => {
        rows.push([
          d.name, h.riskScore, d.riskLevel, h.dengue, h.cholera, h.malaria,
          h.rainfall, h.temperature, h.humidity, h.date
        ].join(','));
      });
    } else {
      rows.push([
        d.name, d.riskScore, d.riskLevel, d.dengueCases, d.choleraCases, d.malariaCases,
        d.rainfall, d.temperature, d.humidity, new Date().toISOString().split('T')[0]
      ].join(','));
    }
  });

  return [headers.join(','), ...rows].join('\n');
};

const DataExportPage = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedSources, setSelectedSources] = useState(['districts']);
  const [dateFrom, setDateFrom] = useState('2026-07-20');
  const [dateTo, setDateTo] = useState('2026-08-19');
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [exportHistory, setExportHistory] = useState([
    { id: 1, timestamp: '2026-08-19 09:30:12', format: 'CSV', size: '245 KB', rows: 1140, sources: 'Districts, Alerts' },
    { id: 2, timestamp: '2026-08-18 14:15:44', format: 'JSON', size: '512 KB', rows: 2280, sources: 'Weather Data' },
    { id: 3, timestamp: '2026-08-17 11:02:33', format: 'Excel', size: '1.2 MB', rows: 3420, sources: 'All Sources' },
    { id: 4, timestamp: '2026-08-16 08:45:09', format: 'PDF', size: '890 KB', rows: 456, sources: 'Predictions, Metrics' }
  ]);

  const toggleSource = (sourceId) => {
    setSelectedSources(prev =>
      prev.includes(sourceId) ? prev.filter(s => s !== sourceId) : [...prev, sourceId]
    );
  };

  const toggleDistrict = (districtId) => {
    setSelectedDistricts(prev =>
      prev.includes(districtId) ? prev.filter(d => d !== districtId) : [...prev, districtId]
    );
  };

  const previewData = generateMockPreview(selectedSources);

  const handleExport = useCallback(() => {
    const csvContent = generateCSVContent(selectedSources, selectedDistricts, dateFrom, dateTo);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vyaadhishield_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const sizeEstimate = (csvContent.length / 1024).toFixed(1);
    const rowCount = csvContent.split('\n').length - 1;

    setExportHistory(prev => [{
      id: Date.now(),
      timestamp: new Date().toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      format: selectedFormat.toUpperCase(),
      size: `${sizeEstimate} KB`,
      rows: rowCount,
      sources: selectedSources.map(s => DATA_SOURCES.find(ds => ds.id === s)?.label).join(', ')
    }, ...prev]);
  }, [selectedSources, selectedDistricts, selectedFormat, dateFrom, dateTo]);

  const clearHistory = (id) => {
    setExportHistory(prev => prev.filter(h => h.id !== id));
  };

  const totalRows = selectedSources.reduce((sum, sid) => {
    const src = DATA_SOURCES.find(s => s.id === sid);
    return sum + (src ? src.rows : 0);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Download size={24} style={{ color: '#6366f1' }} />
            <span>Data Export Hub</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Export surveillance data in multiple formats for offline analysis and reporting.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', padding: '8px 14px', borderRadius: '8px' }}>
          <Database size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {totalRows.toLocaleString()} rows selected across {selectedSources.length} source(s)
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left Column - Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Export Format Selector */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: '#6366f1' }} />
              Export Format
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {EXPORT_FORMATS.map(fmt => {
                const Icon = fmt.icon;
                const isActive = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '14px 10px',
                      borderRadius: '10px',
                      border: isActive ? `2px solid ${fmt.color}` : '2px solid transparent',
                      background: isActive ? `${fmt.color}15` : 'var(--bg-input)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={22} style={{ color: isActive ? fmt.color : 'var(--text-muted)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: isActive ? fmt.color : 'var(--text-secondary)' }}>
                      {fmt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Source Checkboxes */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} style={{ color: '#10b981' }} />
              Data Sources
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {DATA_SOURCES.map(src => {
                const isChecked = selectedSources.includes(src.id);
                return (
                  <label
                    key={src.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isChecked ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-input)',
                      border: isChecked ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSource(src.id)}
                      style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{src.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{src.rows.toLocaleString()} rows</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: '#f59e0b' }} />
              Date Range
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-control text-xs"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-control text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - District Filter + Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* District Filter Multi-Select */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex-between">
              <h2 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} style={{ color: '#8b5cf6' }} />
                District Filter
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {selectedDistricts.length === 0 ? 'All districts' : `${selectedDistricts.length} selected`}
              </span>
            </div>
            <div style={{
              maxHeight: '180px',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              padding: '4px'
            }}>
              {DISTRICTS_DATA.map(d => {
                const isChecked = selectedDistricts.includes(d.id);
                return (
                  <label
                    key={d.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isChecked ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDistrict(d.id)}
                      style={{ accentColor: '#8b5cf6', width: '14px', height: '14px' }}
                    />
                    {d.name}
                  </label>
                );
              })}
            </div>
            {selectedDistricts.length > 0 && (
              <button
                onClick={() => setSelectedDistricts([])}
                style={{
                  fontSize: '11px',
                  color: '#6366f1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  alignSelf: 'flex-start'
                }}
              >
                Clear selection
              </button>
            )}
          </div>

          {/* Preview Section */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex-between">
              <h2 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} style={{ color: '#06b6d4' }} />
                Data Preview
              </h2>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                Sample rows
              </span>
            </div>
            {previewData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', fontSize: '11px' }}>
                  <thead>
                    <tr>
                      {Object.keys(previewData[0]).map(key => (
                        <th key={key} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, vi) => (
                          <td key={vi} style={{ padding: '7px 10px', color: 'var(--text-secondary)' }}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Select at least one data source to preview
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="btn btn-primary"
            style={{
              padding: '14px 24px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%'
            }}
          >
            <Download size={18} />
            <span>Export {totalRows.toLocaleString()} rows as {selectedFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Export History Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <h2 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: '#f59e0b' }} />
            Export History
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {exportHistory.length} exports recorded
          </span>
        </div>
        {exportHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Timestamp</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Format</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Rows</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Sources</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exportHistory.map(exp => (
                  <tr key={exp.id}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={13} style={{ color: '#22c55e' }} />
                        {exp.timestamp}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: exp.format === 'CSV' ? 'rgba(34, 197, 94, 0.15)' :
                          exp.format === 'JSON' ? 'rgba(59, 130, 246, 0.15)' :
                          exp.format === 'Excel' ? 'rgba(16, 185, 129, 0.15)' :
                          'rgba(239, 68, 68, 0.15)',
                        color: exp.format === 'CSV' ? '#22c55e' :
                          exp.format === 'JSON' ? '#3b82f6' :
                          exp.format === 'Excel' ? '#10b981' :
                          '#ef4444'
                      }}>
                        {exp.format}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{exp.size}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>{exp.rows.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '11px' }}>{exp.sources}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => clearHistory(exp.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                        title="Remove from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No exports yet. Configure your export above and click the export button.
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExportPage;

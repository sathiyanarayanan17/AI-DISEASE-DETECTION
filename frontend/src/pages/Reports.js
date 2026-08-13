import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDistrictHistory, DISTRICT_COORDS, MOCK_DISTRICTS } from '../services/api';

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tt-val" style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); }
  catch { return iso; }
}

export default function Reports() {
  const [district, setDistrict] = useState('Chennai');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const districts = Object.keys(DISTRICT_COORDS);

  const generateReport = async () => {
    setLoading(true);
    try {
      const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      const history = await getDistrictHistory(district, Math.max(7, daysDiff));
      const snap = MOCK_DISTRICTS.find(d => d.district === district) || {};
      setReport({
        district,
        startDate,
        endDate,
        history: history || [],
        summary: snap,
        generated: new Date().toLocaleString('en-IN'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const avgRisk = report?.history?.length
    ? (report.history.reduce((s, d) => s + d.risk_score, 0) / report.history.length).toFixed(1)
    : 0;
  const maxRisk = report?.history?.length
    ? Math.max(...report.history.map(d => d.risk_score)).toFixed(0)
    : 0;
  const totalCases = report?.history?.length
    ? report.history.reduce((s, d) => s + (d.disease_cases || 0), 0)
    : 0;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          Report Generator
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Generate comprehensive district health reports for analysis and decision-making
        </p>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Report Configuration</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                District
              </label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              >
                {districts.map(d => (
                  <option key={d} value={d} style={{ background: '#111827' }}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              />
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="btn-detail"
              style={{ padding: '10px 24px', fontSize: '0.85rem' }}
            >
              {loading ? '...' : '📄 Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {report && (
        <div className="print-area">
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-head">
              <h3 className="card-head-title">
                📋 District Health Report - {report.district}
              </h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                  Generated: {report.generated}
                </span>
                <button onClick={handlePrint} className="btn-detail" style={{ padding: '4px 12px', fontSize: '0.72rem' }}>
                  🖨 Download PDF
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Summary */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
                  Executive Summary
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>
                  This report covers disease risk assessment for <strong style={{ color: '#f1f5f9' }}>{report.district}</strong> district 
                  from {report.startDate} to {report.endDate}. The current risk level is{' '}
                  <strong style={{ color: report.summary.risk_level === 'High' ? '#fca5a5' : report.summary.risk_level === 'Medium' ? '#fcd34d' : '#6ee7b7' }}>
                    {report.summary.risk_level || 'Unknown'}
                  </strong>{' '}
                  with a score of {report.summary.risk_score || '--'}/100.
                </p>
              </div>

              {/* Key Metrics */}
              <div className="detail-stats" style={{ marginBottom: 24 }}>
                <div className="ds-card">
                  <div className="ds-lbl">Avg Risk Score</div>
                  <div className="ds-val" style={{ color: '#93c5fd' }}>{avgRisk}</div>
                </div>
                <div className="ds-card">
                  <div className="ds-lbl">Peak Risk Score</div>
                  <div className="ds-val" style={{ color: '#fca5a5' }}>{maxRisk}</div>
                </div>
                <div className="ds-card">
                  <div className="ds-lbl">Total Cases</div>
                  <div className="ds-val" style={{ color: '#fcd34d' }}>{totalCases}</div>
                </div>
              </div>

              {/* Risk History Chart */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
                  Risk Score History
                </h4>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={(report.history || []).map(d => ({ ...d, dl: fmtDate(d.date) }))} margin={{ top: 4, right: 10, left: -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="dl" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<Tip />} />
                    <Area type="monotone" dataKey="risk_score" name="Risk Score" stroke="#60a5fa" strokeWidth={2} fill="url(#reportGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recommendations */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
                  AI Recommendations
                </h4>
                <div style={{
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: 10,
                  padding: '16px 20px',
                }}>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.8, margin: '0 0 12px' }}>
                    {report.summary.recommendation || 'Continue routine surveillance.'}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: '0.82rem', lineHeight: 2 }}>
                    <li>Monitor rainfall patterns and adjust vector control schedules accordingly</li>
                    <li>Ensure adequate stock of diagnostic kits and essential medicines</li>
                    <li>Coordinate with neighboring districts for cross-border surveillance</li>
                    <li>Review and update district emergency response plans quarterly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="empty">
          <div className="empty-icon">📄</div>
          <h3>No Report Generated</h3>
          <p>Select a district and date range above, then click Generate Report to create a comprehensive health report.</p>
        </div>
      )}
    </>
  );
}

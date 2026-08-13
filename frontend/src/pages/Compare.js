import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import RiskBadge from '../components/RiskBadge';
import { getCompareData, DISTRICT_COORDS } from '../services/api';

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

function StatCompare({ label, val1, val2, color1, color2, unit }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      gap: 16, alignItems: 'center', padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: color1 }}>{val1}{unit}</span>
      </div>
      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', minWidth: 100 }}>
        {label}
      </div>
      <div style={{ textAlign: 'left' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: color2 }}>{val2}{unit}</span>
      </div>
    </div>
  );
}

export default function Compare() {
  const [d1, setD1] = useState('Chennai');
  const [d2, setD2] = useState('Madurai');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const districts = Object.keys(DISTRICT_COORDS);

  useEffect(() => {
    if (d1 && d2 && d1 !== d2) {
      setLoading(true);
      getCompareData(d1, d2)
        .then(d => setData(d))
        .finally(() => setLoading(false));
    }
  }, [d1, d2]);

  // Merge histories for overlay chart
  const chartData = data ? (data.district1?.history || []).map((h, i) => ({
    dl: fmtDate(h.date),
    [d1]: h.risk_score,
    [d2]: data.district2?.history?.[i]?.risk_score || 0,
  })) : [];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          District Comparison
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Compare health metrics and risk scores between two districts side by side
        </p>
      </div>

      {/* Selectors */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                District 1
              </label>
              <select
                value={d1}
                onChange={e => setD1(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#93c5fd',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              >
                {districts.map(d => (
                  <option key={d} value={d} style={{ background: '#111827', color: '#f1f5f9' }}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: '1.4rem', color: '#475569', fontWeight: 800 }}>VS</div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                District 2
              </label>
              <select
                value={d2}
                onChange={e => setD2(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(139,92,246,0.06)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#c4b5fd',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
              >
                {districts.map(d => (
                  <option key={d} value={d} style={{ background: '#111827', color: '#f1f5f9' }}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {d1 === d2 && (
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 20,
          fontSize: '0.82rem',
          color: '#fcd34d',
        }}>
          Please select two different districts to compare.
        </div>
      )}

      {loading && (
        <div className="spin-wrap">
          <div className="spinner" />
          <span>Loading comparison data...</span>
        </div>
      )}

      {data && !loading && d1 !== d2 && (
        <>
          {/* Side by Side Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div className="card">
              <div className="card-head">
                <h3 className="card-head-title" style={{ color: '#93c5fd' }}>{d1}</h3>
                <RiskBadge level={data.district1?.risk_level || 'Low'} />
              </div>
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div className="ds-val" style={{ color: '#93c5fd', marginBottom: 8 }}>{data.district1?.risk_score}</div>
                <div className="ds-lbl">Risk Score</div>
                <div style={{ marginTop: 16, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Cases/day: <strong style={{ color: '#f1f5f9' }}>{data.district1?.avg_cases_7d}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
                  Confidence: <strong style={{ color: '#f1f5f9' }}>{((data.district1?.confidence || 0.75) * 100).toFixed(0)}%</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-head">
                <h3 className="card-head-title" style={{ color: '#c4b5fd' }}>{d2}</h3>
                <RiskBadge level={data.district2?.risk_level || 'Low'} />
              </div>
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div className="ds-val" style={{ color: '#c4b5fd', marginBottom: 8 }}>{data.district2?.risk_score}</div>
                <div className="ds-lbl">Risk Score</div>
                <div style={{ marginTop: 16, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Cases/day: <strong style={{ color: '#f1f5f9' }}>{data.district2?.avg_cases_7d}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
                  Confidence: <strong style={{ color: '#f1f5f9' }}>{((data.district2?.confidence || 0.75) * 100).toFixed(0)}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Overlaid Chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-head">
              <h3 className="card-head-title">Risk Score Comparison - 30 Days</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 4, right: 10, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dl" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<Tip />} />
                  <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                  <Line type="monotone" dataKey={d1} name={d1} stroke="#60a5fa" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey={d2} name={d2} stroke="#a78bfa" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metric Comparison Table */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-head-title">Key Metrics Comparison</h3>
            </div>
            <div className="card-body">
              <StatCompare label="Risk Score" val1={data.district1?.risk_score} val2={data.district2?.risk_score} color1="#93c5fd" color2="#c4b5fd" unit="/100" />
              <StatCompare label="Avg Cases/Day" val1={data.district1?.avg_cases_7d} val2={data.district2?.avg_cases_7d} color1="#93c5fd" color2="#c4b5fd" unit="" />
              <StatCompare label="Confidence" val1={((data.district1?.confidence || 0.75) * 100).toFixed(0)} val2={((data.district2?.confidence || 0.75) * 100).toFixed(0)} color1="#93c5fd" color2="#c4b5fd" unit="%" />
              <StatCompare label="Risk Level" val1={data.district1?.risk_level} val2={data.district2?.risk_level} color1={data.district1?.risk_level === 'High' ? '#fca5a5' : data.district1?.risk_level === 'Medium' ? '#fcd34d' : '#6ee7b7'} color2={data.district2?.risk_level === 'High' ? '#fca5a5' : data.district2?.risk_level === 'Medium' ? '#fcd34d' : '#6ee7b7'} unit="" />
            </div>
          </div>
        </>
      )}
    </>
  );
}

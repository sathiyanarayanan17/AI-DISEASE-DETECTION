import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area,
} from 'recharts';
import RiskBadge from '../components/RiskBadge';
import { getDistrictHistory, DISTRICT_COORDS, DISTRICT_STATE, MOCK_DISTRICTS } from '../services/api';

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
  try { return new Date(iso).toLocaleDateString('en-IN', { month:'short', day:'numeric' }); }
  catch { return iso; }
}

function riskColor(level) {
  return level === 'High' ? '#fca5a5' : level === 'Medium' ? '#fcd34d' : '#6ee7b7';
}

function riskGrad(level) {
  return level === 'High'
    ? 'linear-gradient(90deg,#ef4444,#f97316)'
    : level === 'Medium'
    ? 'linear-gradient(90deg,#f59e0b,#eab308)'
    : 'linear-gradient(90deg,#10b981,#06b6d4)';
}

export default function DistrictDetail() {
  const { name } = useParams();
  const nav = useNavigate();
  const district = decodeURIComponent(name);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const snap = MOCK_DISTRICTS.find(d => d.district === district) || {
    district, state: DISTRICT_STATE[district] || 'Tamil Nadu',
    risk_score: 0, risk_level: 'Low', avg_cases_7d: 0, confidence: 0,
    recommendation: 'No data available.',
  };

  useEffect(() => {
    let ok = true;
    setLoading(true);
    getDistrictHistory(district, 30)
      .then(data => { if (ok) { setHistory(Array.isArray(data) ? data : []); setLoading(false); } })
      .catch(err  => { if (ok) { setError(err.message); setLoading(false); } });
    return () => { ok = false; };
  }, [district]);

  const chartData = history.map(h => ({ ...h, dl: fmtDate(h.date) }));
  const latest = history[history.length - 1] || {};

  if (loading) return (
    <div className="spin-wrap">
      <div className="spinner" />
      <span>Loading {district} data...</span>
    </div>
  );

  return (
    <>
      <div className="detail-head">
        <button className="btn-back" onClick={() => nav(-1)}>← Back</button>
        <h1 className="detail-name">{district}</h1>
        <div className="detail-sub">{snap.state || 'Tamil Nadu'}</div>
        <RiskBadge level={snap.risk_level} size="large" />
      </div>

      {error && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 20,
          fontSize: '0.78rem', color: '#fcd34d',
        }}>
          Could not load live data - showing generated data.
        </div>
      )}

      <div className="detail-stats">
        <div className="ds-card">
          <div className="ds-lbl">Risk Score</div>
          <div className="ds-val" style={{ color: riskColor(snap.risk_level) }}>{snap.risk_score}</div>
          <div className="ds-unit">out of 100</div>
          <div style={{ marginTop: 14, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${snap.risk_score}%`, height: '100%', background: riskGrad(snap.risk_level), borderRadius: 3, transition: 'width .8s ease' }} />
          </div>
        </div>
        <div className="ds-card">
          <div className="ds-lbl">7-Day Avg Cases</div>
          <div className="ds-val" style={{ color: '#93c5fd' }}>{snap.avg_cases_7d ?? latest.disease_cases ?? '--'}</div>
          <div className="ds-unit">cases per day</div>
        </div>
        <div className="ds-card" style={{ textAlign: 'left' }}>
          <div className="ds-lbl">AI Recommendation</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7, marginTop: 8 }}>
            {snap.recommendation}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-head">
            <h3 className="card-head-title">Risk Score - Last 30 Days</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 10, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dl" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                <YAxis domain={[0,100]} tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                <Tooltip content={<Tip />} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'High', fill: '#fca5a5', fontSize: 10 }} />
                <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Medium', fill: '#fcd34d', fontSize: 10 }} />
                <Area type="monotone" dataKey="risk_score" name="Risk Score" stroke="#60a5fa" strokeWidth={2.5} fill="url(#riskGrad)" dot={false} activeDot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-head-title">Daily Cases - Last 30 Days</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 4, right: 10, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dl" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="disease_cases" name="Cases" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="weather-row">
        <div className="w-card">
          <div className="w-icon">🌧</div>
          <div className="w-val">{latest.rainfall != null ? latest.rainfall : '--'}</div>
          <div className="w-lbl">Rainfall (mm)</div>
        </div>
        <div className="w-card">
          <div className="w-icon">🌡</div>
          <div className="w-val">{latest.temperature != null ? `${latest.temperature}°` : '--'}</div>
          <div className="w-lbl">Temperature (°C)</div>
        </div>
        <div className="w-card">
          <div className="w-icon">💧</div>
          <div className="w-val">{latest.humidity != null ? `${latest.humidity}%` : '--'}</div>
          <div className="w-lbl">Humidity</div>
        </div>
      </div>

      {DISTRICT_COORDS[district] && (
        <div style={{ fontSize: '0.72rem', color: '#334155', textAlign: 'right', marginBottom: 24 }}>
          📍 {DISTRICT_COORDS[district][0]}°N, {DISTRICT_COORDS[district][1]}°E
        </div>
      )}
    </>
  );
}

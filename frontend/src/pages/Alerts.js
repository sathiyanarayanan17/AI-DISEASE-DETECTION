import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';

function scoreGradient(s) {
  if (s >= 70) return 'linear-gradient(90deg,#ef4444,#f97316)';
  if (s >= 40) return 'linear-gradient(90deg,#f59e0b,#eab308)';
  return 'linear-gradient(90deg,#10b981,#06b6d4)';
}

function AlertCard({ a }) {
  const nav = useNavigate();
  return (
    <div className={`alert-card risk-${(a.risk_level || 'low').toLowerCase()}`}>
      <div className="ac-head">
        <div>
          <div className="ac-name">{a.district}</div>
          <div className="ac-state">{a.state || 'Tamil Nadu'}</div>
        </div>
        <RiskBadge level={a.risk_level} />
      </div>
      <div className="ac-score-lbl">Risk Score: {a.risk_score}/100</div>
      <div className="ac-track">
        <div className="ac-fill" style={{ width: `${Math.min(a.risk_score,100)}%`, background: scoreGradient(a.risk_score) }} />
      </div>
      <div className="ac-rec">{a.recommendation || 'No recommendation available.'}</div>
      <button className="btn-detail" onClick={() => nav(`/district/${encodeURIComponent(a.district)}`)}>
        View Details →
      </button>
    </div>
  );
}

export default function Alerts({ alerts = [], loading }) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() =>
    filter === 'All' ? alerts : alerts.filter(a => a.risk_level === filter),
    [alerts, filter]
  );

  const counts = {
    High:   alerts.filter(a => a.risk_level === 'High').length,
    Medium: alerts.filter(a => a.risk_level === 'Medium').length,
    Low:    alerts.filter(a => a.risk_level === 'Low').length,
  };

  if (loading) return (
    <div className="alerts-grid">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="alert-card">
          <div className="skel" style={{ height: 18, width: '60%', marginBottom: 10 }} />
          <div className="skel" style={{ height: 12, width: '40%', marginBottom: 14 }} />
          <div className="skel" style={{ height: 6, marginBottom: 14 }} />
          <div className="skel" style={{ height: 32, width: '35%' }} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <span className="pill pill-red">🔴 High: {counts.High}</span>
        <span className="pill pill-amber">⚠ Medium: {counts.Medium}</span>
        <span className="pill pill-green">✓ Low: {counts.Low}</span>
      </div>

      <div className="filter-bar">
        {['All','High','Medium','Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-btn ${filter === f ? 'fb-' + f.toLowerCase() : ''}`}
          >
            {f === 'All' ? `All (${alerts.length})` : `${f} (${counts[f]})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">✅</div>
          <h3>No {filter !== 'All' ? filter + ' Risk' : ''} Alerts</h3>
          <p>All monitored districts are within normal parameters.</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {[...filtered].sort((a,b) => (b.risk_score||0)-(a.risk_score||0)).map(a => (
            <AlertCard key={a.district} a={a} />
          ))}
        </div>
      )}
    </>
  );
}

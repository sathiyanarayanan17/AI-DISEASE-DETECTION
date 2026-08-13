import React, { useState, useEffect, useRef, useCallback } from 'react';
import RiskBadge from '../components/RiskBadge';
import { getRealTimeFeed, getRealTimeLatest, connectWebSocket, DISTRICT_COORDS } from '../services/api';

function StatusDot({ connected }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: connected ? '#10b981' : '#ef4444',
        boxShadow: connected ? '0 0 12px rgba(16,185,129,0.5)' : '0 0 12px rgba(239,68,68,0.5)',
        animation: connected ? 'livePulse 1.4s ease-in-out infinite' : 'none',
      }} />
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: connected ? '#6ee7b7' : '#fca5a5' }}>
        {connected ? 'LIVE - Connected to Real-Time Feed' : 'OFFLINE - Attempting to connect...'}
      </span>
    </div>
  );
}

function FeedItem({ item, isNew }) {
  const bgColor = item.risk_level === 'High'
    ? 'rgba(239,68,68,0.06)'
    : item.risk_level === 'Medium'
    ? 'rgba(245,158,11,0.06)'
    : 'rgba(16,185,129,0.04)';

  return (
    <div style={{
      background: bgColor,
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '14px 18px',
      marginBottom: 10,
      transition: 'all 0.3s ease',
      opacity: isNew ? 1 : 0.8,
      transform: isNew ? 'translateX(0)' : 'none',
      animation: isNew ? 'slideIn 0.3s ease' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>{item.district}</span>
          <RiskBadge level={item.risk_level || 'Low'} />
        </div>
        <span style={{ fontSize: '0.72rem', color: '#475569' }}>
          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('en-IN') : '--'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 20, fontSize: '0.78rem', color: '#94a3b8' }}>
        <span>🌧 {item.rainfall_mm?.toFixed(1) ?? '--'} mm</span>
        <span>🌡 {item.temperature_c?.toFixed(1) ?? '--'}°C</span>
        <span>💧 {item.humidity_pct?.toFixed(0) ?? '--'}%</span>
        {item.risk_score != null && <span>Score: <strong style={{ color: '#f1f5f9' }}>{item.risk_score}</strong></span>}
      </div>
    </div>
  );
}

export default function RealTimeMonitor() {
  const [feed, setFeed] = useState([]);
  const [latest, setLatest] = useState(null);
  const [connected, setConnected] = useState(false);
  const [newAlerts, setNewAlerts] = useState(0);
  const wsRef = useRef(null);
  const refreshRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [feedData, latestData] = await Promise.all([getRealTimeFeed(), getRealTimeLatest()]);
      if (Array.isArray(feedData) && feedData.length > 0) {
        setFeed(feedData);
        setConnected(true);
      }
      if (latestData) setLatest(latestData);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Try WebSocket
    const ws = connectWebSocket(
      (data) => {
        setConnected(true);
        setFeed(prev => [data, ...prev].slice(0, 50));
        if (data.risk_level === 'High') {
          setNewAlerts(prev => prev + 1);
        }
      },
      () => setConnected(false)
    );
    wsRef.current = ws;

    // Polling fallback every 30 seconds
    refreshRef.current = setInterval(fetchData, 30000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (refreshRef.current) clearInterval(refreshRef.current);
    };
  }, [fetchData]);

  const districts = Object.keys(DISTRICT_COORDS);
  const highRiskFeed = feed.filter(f => f.risk_level === 'High');

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          Real-Time Monitor
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Live weather ingestion and disease risk prediction feed
        </p>
      </div>

      <StatusDot connected={connected} />

      {newAlerts > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: '1.2rem' }}>🚨</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5' }}>
            {newAlerts} new high-risk alert{newAlerts > 1 ? 's' : ''} detected!
          </span>
          <button
            onClick={() => setNewAlerts(0)}
            style={{
              marginLeft: 'auto', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 6, padding: '4px 12px', color: '#fca5a5', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter,sans-serif',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📡</div>
          <div>
            <div className="stat-num">{districts.length}</div>
            <div className="stat-lbl">Stations Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">🔄</div>
          <div>
            <div className="stat-num">{feed.length}</div>
            <div className="stat-lbl">Data Points</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">🚨</div>
          <div>
            <div className="stat-num" style={{ color: '#fca5a5' }}>{highRiskFeed.length}</div>
            <div className="stat-lbl">High Risk Events</div>
          </div>
        </div>
      </div>

      {latest && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-head">
            <h3 className="card-head-title">Latest Reading</h3>
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              {latest.timestamp ? new Date(latest.timestamp).toLocaleString('en-IN') : 'Just now'}
            </span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>District</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{latest.district}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Rainfall</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#93c5fd' }}>{latest.rainfall_mm?.toFixed(1)} mm</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Temperature</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24' }}>{latest.temperature_c?.toFixed(1)}°C</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Humidity</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#6ee7b7' }}>{latest.humidity_pct?.toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Live Feed</h3>
          <span style={{ fontSize: '0.72rem', color: '#475569' }}>
            Auto-refreshes every 30s
          </span>
        </div>
        <div className="card-body" style={{ maxHeight: 500, overflowY: 'auto' }}>
          {feed.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📡</div>
              <h3>Waiting for data...</h3>
              <p>Real-time weather data will appear here once the backend is connected.</p>
            </div>
          ) : (
            feed.slice(0, 20).map((item, i) => (
              <FeedItem key={`${item.district}-${item.timestamp}-${i}`} item={item} isNew={i < 3} />
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

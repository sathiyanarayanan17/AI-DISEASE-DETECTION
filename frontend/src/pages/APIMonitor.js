import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ENDPOINTS = [
  { path: '/predict/batch', method: 'POST', avgMs: 245, calls: 1842, status: 'healthy' },
  { path: '/alerts', method: 'GET', avgMs: 89, calls: 3215, status: 'healthy' },
  { path: '/history', method: 'GET', avgMs: 156, calls: 2456, status: 'healthy' },
  { path: '/forecast', method: 'GET', avgMs: 312, calls: 987, status: 'healthy' },
  { path: '/health', method: 'GET', avgMs: 12, calls: 8640, status: 'healthy' },
  { path: '/citizen/report', method: 'POST', avgMs: 178, calls: 432, status: 'healthy' },
  { path: '/analytics/metrics', method: 'GET', avgMs: 95, calls: 1254, status: 'healthy' },
  { path: '/resources', method: 'GET', avgMs: 203, calls: 678, status: 'degraded' },
  { path: '/realtime/feed', method: 'GET', avgMs: 67, calls: 4521, status: 'healthy' },
  { path: '/ws', method: 'WS', avgMs: 5, calls: 342, status: 'healthy' },
];

function generateHourlyData() {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const h = new Date(now);
    h.setHours(h.getHours() - i);
    data.push({
      hour: h.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      requests: Math.floor(200 + Math.random() * 800 + (h.getHours() >= 9 && h.getHours() <= 18 ? 400 : 0)),
    });
  }
  return data;
}

const HOURLY_DATA = generateHourlyData();

export default function APIMonitor() {
  const [totalRequests, setTotalRequests] = useState(24386);
  const [liveCounter, setLiveCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 1;
      setTotalRequests(prev => prev + increment);
      setLiveCounter(prev => prev + increment);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const avgLatency = Math.round(ENDPOINTS.reduce((s, e) => s + e.avgMs, 0) / ENDPOINTS.length);
  const uptime = 99.94;
  const errorRate = 0.12;

  return (
    <div>
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📊</div>
          <div>
            <div className="stat-num">{totalRequests.toLocaleString()}</div>
            <div className="stat-lbl">Requests Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">⚡</div>
          <div>
            <div className="stat-num">{avgLatency}ms</div>
            <div className="stat-lbl">Avg Latency</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">✓</div>
          <div>
            <div className="stat-num">{uptime}%</div>
            <div className="stat-lbl">Uptime</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">✗</div>
          <div>
            <div className="stat-num">{errorRate}%</div>
            <div className="stat-lbl">Error Rate</div>
          </div>
        </div>
      </div>

      {/* Live Counter */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="live-dot"></div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text1)' }}>
              Live Request Counter
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
            +{liveCounter} requests since page load
          </div>
        </div>
      </div>

      {/* Request Volume Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Request Volume (Last 24 Hours)</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={HOURLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#475569' }} interval={3} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }} />
              <Bar dataKey="requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Endpoint Breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Endpoint Breakdown</h3>
        </div>
        <div className="card-body">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Path</th>
                  <th>Method</th>
                  <th>Avg Response Time</th>
                  <th>Calls Today</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map(ep => (
                  <tr key={ep.path}>
                    <td>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%',
                        display: 'inline-block',
                        background: ep.status === 'healthy' ? 'var(--green)' : 'var(--amber)',
                        boxShadow: ep.status === 'healthy' ? '0 0 6px rgba(16,185,129,0.4)' : '0 0 6px rgba(245,158,11,0.4)',
                      }}></span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>{ep.path}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700,
                        background: ep.method === 'POST' ? 'rgba(99,102,241,0.08)' : ep.method === 'WS' ? 'rgba(139,92,246,0.08)' : 'var(--green-bg)',
                        color: ep.method === 'POST' ? '#6366f1' : ep.method === 'WS' ? '#7c3aed' : '#059669',
                      }}>
                        {ep.method}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 600, color: ep.avgMs > 200 ? 'var(--amber)' : 'var(--green)' }}>
                        {ep.avgMs}ms
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 500 }}>{ep.calls.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rate Limit Info */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Rate Limiting Policy</h3>
        </div>
        <div className="card-body" style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ padding: 16, background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>100</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Requests / Minute</div>
            </div>
            <div style={{ padding: 16, background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>5,000</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Requests / Hour</div>
            </div>
            <div style={{ padding: 16, background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>50,000</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>Requests / Day</div>
            </div>
          </div>
          <p style={{ marginTop: 14 }}>
            Rate limits are enforced per client IP. Exceeding the limit returns HTTP 429 (Too Many Requests). Health officers and admin accounts get 2x the standard limits.
          </p>
        </div>
      </div>
    </div>
  );
}

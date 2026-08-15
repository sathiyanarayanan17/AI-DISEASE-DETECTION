import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ActivitySquare,
  Server,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Radio,
  Cpu
} from 'lucide-react';

export const ApiMonitorPage = () => {
  const [pingCount, setPingCount] = useState(142850);

  useEffect(() => {
    const timer = setInterval(() => {
      setPingCount((prev) => prev + Math.floor(Math.random() * 4 + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const hourlyTraffic = [
    { hour: "00:00", requests: 4200 },
    { hour: "02:00", requests: 3100 },
    { hour: "04:00", requests: 2800 },
    { hour: "06:00", requests: 6400 },
    { hour: "08:00", requests: 12800 },
    { hour: "10:00", requests: 18400 },
    { hour: "12:00", requests: 16200 },
    { hour: "14:00", requests: 14900 },
    { hour: "16:00", requests: 17800 },
    { hour: "18:00", requests: 15400 },
    { hour: "20:00", requests: 11200 },
    { hour: "22:00", requests: 7600 }
  ];

  const endpoints = [
    { method: "GET", path: "/predict", desc: "Single District XGBoost Inference", latency: "12.4ms", status: "200 OK", uptime: "100%" },
    { method: "POST", path: "/predict/batch", desc: "37 District Batch Prediction", latency: "38.2ms", status: "200 OK", uptime: "99.98%" },
    { method: "GET", path: "/alerts", desc: "Outbreak Warning Directives", latency: "8.1ms", status: "200 OK", uptime: "100%" },
    { method: "GET", path: "/history", desc: "30-Day Epidemiological History", latency: "14.6ms", status: "200 OK", uptime: "100%" },
    { method: "GET", path: "/forecast", desc: "7-Day Multi-Horizon Bayesian", latency: "18.9ms", status: "200 OK", uptime: "99.95%" },
    { method: "POST", path: "/citizen/report", desc: "Crowdsourced Ingest Pipeline", latency: "16.0ms", status: "200 OK", uptime: "100%" },
    { method: "WS", path: "/ws", desc: "Live Sensor WebSocket Stream", latency: "2.1ms", status: "CONNECTED", uptime: "100%" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ActivitySquare size={24} className="text-emerald-400" />
            <span>FastAPI Server Health & API Telemetry Monitor</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Live endpoint response latencies, error budgets, and backend microservice health status.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="pulse-dot online" />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Live Requests Ingested:</span>
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--accent-emerald)' }}>
            {pingCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Mean Latency (p95)
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            14.8 ms
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            FastAPI Uvicorn C++ Engine
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            System Service Uptime
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            99.98%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Zero unplanned downtime in 30d
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            HTTP Error Rate
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            0.02%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            4xx/5xx responses well below SLA
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Backend Host URL
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            localhost:8000
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            Mock Interceptors Enabled
          </div>
        </div>
      </div>

      {/* 3. Hourly API Traffic Volume Chart */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>24-Hour Telemetry Request Distribution</h2>

        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                formatter={(val) => [`${val.toLocaleString()} Requests`, 'Volume']}
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Bar dataKey="requests" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Endpoint Routing & Health Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>REST & WebSocket Endpoint Registry</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>URI Route</th>
                <th>Service Description</th>
                <th>Response Latency</th>
                <th>Status</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep, idx) => (
                <tr key={idx}>
                  <td>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        background: ep.method === 'POST' ? 'rgba(99, 102, 241, 0.2)' : (ep.method === 'WS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.2)'),
                        color: ep.method === 'POST' ? '#6366f1' : (ep.method === 'WS' ? '#10b981' : '#06b6d4')
                      }}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{ep.path}</strong>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ep.desc}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{ep.latency}</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
                      <span>{ep.status}</span>
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-emerald)' }}>
                    {ep.uptime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiMonitorPage;

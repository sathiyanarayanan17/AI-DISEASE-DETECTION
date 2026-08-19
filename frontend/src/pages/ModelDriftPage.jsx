import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, BarChart, Bar
} from 'recharts';
import {
  Activity, RefreshCw, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Cpu, ShieldAlert, Calendar, Zap, Database, BarChart3
} from 'lucide-react';

const psiOverTimeData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 0.08 + Math.random() * 0.06;
  const spike = (day >= 22 && day <= 26) ? 0.1 + Math.random() * 0.08 : 0;
  return {
    day: `Day ${day}`,
    psi: parseFloat((base + spike).toFixed(3)),
    threshold: 0.2
  };
});

const featureDriftData = [
  { feature: 'rainfall_mm', psi: 0.31, ks: 0.18, driftDetected: true, action: 'Retrain recommended' },
  { feature: 'humidity_pct', psi: 0.24, ks: 0.15, driftDetected: true, action: 'Monitor closely' },
  { feature: 'temperature_c', psi: 0.12, ks: 0.08, driftDetected: false, action: 'None' },
  { feature: 'cases_7d_avg', psi: 0.19, ks: 0.11, driftDetected: false, action: 'None' },
  { feature: 'cases_14d_avg', psi: 0.09, ks: 0.05, driftDetected: false, action: 'None' },
  { feature: 'rainfall_7d_avg', psi: 0.27, ks: 0.16, driftDetected: true, action: 'Retrain recommended' },
  { feature: 'lag_7d_cases', psi: 0.14, ks: 0.09, driftDetected: false, action: 'None' },
  { feature: 'case_trend_7d', psi: 0.06, ks: 0.04, driftDetected: false, action: 'None' },
];

const trainingDistribution = [
  { bin: '0-20', training: 45, current: 30 },
  { bin: '20-40', training: 80, current: 55 },
  { bin: '40-60', training: 120, current: 95 },
  { bin: '60-80', training: 95, current: 130 },
  { bin: '80-100', training: 60, current: 110 },
  { bin: '100-120', training: 35, current: 75 },
  { bin: '120-150', training: 20, current: 50 },
  { bin: '150+', training: 10, current: 35 },
];

const driftAlertsLog = [
  { date: '2026-08-18', type: 'Data Drift', feature: 'rainfall_mm', severity: 'High', resolved: false },
  { date: '2026-08-17', type: 'Data Drift', feature: 'rainfall_7d_avg', severity: 'High', resolved: false },
  { date: '2026-08-16', type: 'Performance Degradation', feature: 'F1-Score', severity: 'Medium', resolved: false },
  { date: '2026-08-14', type: 'Data Drift', feature: 'humidity_pct', severity: 'Medium', resolved: true },
  { date: '2026-08-10', type: 'Concept Drift', feature: 'risk_label', severity: 'Low', resolved: true },
  { date: '2026-08-05', type: 'Data Drift', feature: 'temperature_c', severity: 'Low', resolved: true },
];

export default function ModelDriftPage() {
  const [retrainThreshold, setRetrainThreshold] = useState(0.2);
  const [autoRetrain, setAutoRetrain] = useState(true);

  const stats = [
    { label: 'Current Drift Score', value: '0.24', icon: Activity, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Days Since Retrain', value: '12', icon: Clock, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Feature Drift Count', value: '3 / 8', icon: TrendingUp, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Alert Status', value: 'Active', icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Data Drift': return '#6366f1';
      case 'Concept Drift': return '#f59e0b';
      case 'Performance Degradation': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu size={32} style={{ color: '#6366f1' }} />
          ML Model Drift Detection
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>
          Monitor model performance degradation, feature drift, and data distribution shifts
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>{stat.label}</span>
              <div style={{ background: stat.bg, borderRadius: '8px', padding: '8px' }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* PSI Over Time Chart */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} style={{ color: '#6366f1' }} />
          PSI (Population Stability Index) — Last 30 Days
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={psiOverTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={4} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 0.4]} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <ReferenceLine y={0.2} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Threshold (0.2)', fill: '#ef4444', fontSize: 12 }} />
            <Line type="monotone" dataKey="psi" stroke="#6366f1" strokeWidth={2} dot={false} name="PSI Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Drift Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} style={{ color: '#f59e0b' }} />
          Feature Drift Analysis
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature Name</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PSI Score</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KS Statistic</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drift Detected</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Required</th>
              </tr>
            </thead>
            <tbody>
              {featureDriftData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '500', fontFamily: 'monospace', fontSize: '13px' }}>{row.feature}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ color: row.psi >= 0.2 ? '#ef4444' : row.psi >= 0.15 ? '#f59e0b' : '#22c55e', fontWeight: '600' }}>
                      {row.psi.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#e2e8f0' }}>{row.ks.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className="risk-badge" style={{
                      background: row.driftDetected ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                      color: row.driftDetected ? '#ef4444' : '#22c55e',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {row.driftDetected ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: row.action !== 'None' ? '#f59e0b' : '#94a3b8' }}>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Comparison */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} style={{ color: '#22c55e' }} />
          Data Distribution Comparison — <span style={{ color: '#6366f1', fontFamily: 'monospace' }}>rainfall_mm</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
          Training distribution vs. current production data for the top drifted feature
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={trainingDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="bin" tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Rainfall (mm)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Bar dataKey="training" fill="#6366f1" name="Training Distribution" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Bar dataKey="current" fill="#f59e0b" name="Current Distribution" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Auto-Retrain Panel */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={20} style={{ color: '#6366f1' }} />
          Auto-Retrain Trigger Panel
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Threshold Setting */}
          <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(99,102,241,0.15)' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              PSI Threshold for Retrain
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={retrainThreshold}
                onChange={(e) => setRetrainThreshold(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#6366f1' }}
              />
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1', minWidth: '45px' }}>{retrainThreshold.toFixed(2)}</span>
            </div>
          </div>

          {/* Last Retrain */}
          <div style={{ background: 'rgba(34,197,94,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(34,197,94,0.15)' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              Last Retrain Date
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: '#22c55e' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#22c55e' }}>2026-08-07</span>
            </div>
          </div>

          {/* Next Scheduled */}
          <div style={{ background: 'rgba(245,158,11,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(245,158,11,0.15)' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              Next Scheduled Retrain
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>2026-08-21</span>
            </div>
          </div>

          {/* Auto-retrain toggle */}
          <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(99,102,241,0.15)' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
              Auto-Retrain Enabled
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                onClick={() => setAutoRetrain(!autoRetrain)}
                style={{
                  width: '48px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                  background: autoRetrain ? '#6366f1' : 'rgba(148,163,184,0.3)',
                  position: 'relative', transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: '2px', left: autoRetrain ? '26px' : '2px',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: autoRetrain ? '#6366f1' : '#94a3b8' }}>
                {autoRetrain ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Manual Trigger Button */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-primary" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', fontSize: '14px', fontWeight: '600',
            borderRadius: '8px', cursor: 'pointer'
          }}>
            <Zap size={16} />
            Trigger Manual Retrain
          </button>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
            This will initiate an immediate model retraining with latest data
          </span>
        </div>
      </div>

      {/* Drift Alerts Log */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} style={{ color: '#ef4444' }} />
          Drift Alerts Log
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolved</th>
              </tr>
            </thead>
            <tbody>
              {driftAlertsLog.map((alert, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#e2e8f0' }}>{alert.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: `${getTypeColor(alert.type)}20`,
                      color: getTypeColor(alert.type),
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {alert.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#e2e8f0' }}>{alert.feature}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className="risk-badge" style={{
                      background: `${getSeverityColor(alert.severity)}20`,
                      color: getSeverityColor(alert.severity),
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {alert.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {alert.resolved ? (
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                    ) : (
                      <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

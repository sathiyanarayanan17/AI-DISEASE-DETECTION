import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceDot
} from 'recharts';
import {
  AlertTriangle, Activity, Database, Cpu, TreePine,
  Search, Filter, TrendingUp, Shield
} from 'lucide-react';

const stats = [
  { label: 'Data Points Analyzed', value: '12,847', icon: Database, color: '#6366f1' },
  { label: 'Anomalies Detected', value: '43', icon: AlertTriangle, color: '#ef4444' },
  { label: 'Contamination Rate', value: '0.33%', icon: Activity, color: '#f59e0b' },
  { label: 'Model Score', value: '0.967', icon: Cpu, color: '#10b981' },
];

const anomalyLog = [
  { date: '2026-08-18', district: 'Chennai', feature: 'Rainfall (mm)', observed: 312, expected: '80–150', score: -0.92, severity: 'Critical' },
  { date: '2026-08-17', district: 'Coimbatore', feature: 'Dengue Cases', observed: 87, expected: '10–30', score: -0.88, severity: 'High' },
  { date: '2026-08-16', district: 'Madurai', feature: 'Temperature (°C)', observed: 44.2, expected: '32–38', score: -0.81, severity: 'High' },
  { date: '2026-08-15', district: 'Tiruchirappalli', feature: 'Humidity (%)', observed: 98, expected: '60–80', score: -0.76, severity: 'Medium' },
  { date: '2026-08-14', district: 'Salem', feature: 'Cholera Cases', observed: 24, expected: '0–5', score: -0.85, severity: 'Critical' },
  { date: '2026-08-13', district: 'Tirunelveli', feature: 'Mosquito Index', observed: 42, expected: '5–15', score: -0.72, severity: 'Medium' },
  { date: '2026-08-12', district: 'Vellore', feature: 'Malaria Cases', observed: 19, expected: '2–8', score: -0.69, severity: 'Medium' },
  { date: '2026-08-11', district: 'Erode', feature: 'Rainfall (mm)', observed: 278, expected: '80–150', score: -0.79, severity: 'High' },
];

const featureContributions = [
  { feature: 'Rainfall 7d Avg', contribution: 0.34 },
  { feature: 'Case Trend 7d', contribution: 0.28 },
  { feature: 'Humidity 14d Avg', contribution: 0.19 },
  { feature: 'Temperature Lag 7d', contribution: 0.15 },
  { feature: 'Mosquito Index', contribution: 0.12 },
  { feature: 'Is SW Monsoon', contribution: 0.09 },
  { feature: 'Week of Year', contribution: 0.06 },
  { feature: 'Is Coastal', contribution: 0.04 },
];

const timeSeriesData = [
  { date: 'Aug 01', value: 22, anomaly: false },
  { date: 'Aug 03', value: 25, anomaly: false },
  { date: 'Aug 05', value: 28, anomaly: false },
  { date: 'Aug 06', value: 31, anomaly: false },
  { date: 'Aug 07', value: 72, anomaly: true },
  { date: 'Aug 08', value: 35, anomaly: false },
  { date: 'Aug 09', value: 29, anomaly: false },
  { date: 'Aug 10', value: 27, anomaly: false },
  { date: 'Aug 11', value: 88, anomaly: true },
  { date: 'Aug 12', value: 33, anomaly: false },
  { date: 'Aug 13', value: 30, anomaly: false },
  { date: 'Aug 14', value: 26, anomaly: false },
  { date: 'Aug 15', value: 24, anomaly: false },
  { date: 'Aug 16', value: 95, anomaly: true },
  { date: 'Aug 17', value: 28, anomaly: false },
  { date: 'Aug 18', value: 32, anomaly: false },
  { date: 'Aug 19', value: 27, anomaly: false },
];

const anomalyPoints = timeSeriesData.filter(d => d.anomaly);

// Scatter plot mockup data - grid of points
const generateScatterData = () => {
  const points = [];
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const isAnomaly = (x > 80 && y > 75) || (x < 10 && y < 15) || (x > 85 && y < 10);
    points.push({ x, y, isAnomaly });
  }
  return points;
};

const scatterPoints = generateScatterData();

const getSeverityStyle = (severity) => {
  switch (severity) {
    case 'Critical': return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' };
    case 'High': return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' };
    case 'Medium': return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.4)' };
    default: return { background: 'rgba(107, 114, 128, 0.2)', color: '#6b7280', border: '1px solid rgba(107, 114, 128, 0.4)' };
  }
};

export default function AnomalyIsolationPage() {
  const [selectedFeature, setSelectedFeature] = useState('All');

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <TreePine size={28} color="#6366f1" />
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
            Isolation Forest Anomaly Detection
          </h1>
        </div>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
          Unsupervised anomaly detection using Isolation Forest — identifies outlier patterns in disease surveillance data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</span>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${stat.color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Row: Scatter Plot + Feature Contributions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Scatter Plot Mockup */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              <Search size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Anomaly Scatter Plot
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Feature Space Projection</span>
          </div>
          <div style={{
            position: 'relative', width: '100%', height: '280px',
            background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.15)', overflow: 'hidden'
          }}>
            {/* Axis labels */}
            <span style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: '#64748b' }}>
              Principal Component 1
            </span>
            <span style={{ position: 'absolute', top: '50%', left: '4px', transform: 'rotate(-90deg) translateX(-50%)', fontSize: '11px', color: '#64748b', transformOrigin: 'left' }}>
              PC 2
            </span>
            {scatterPoints.map((point, idx) => (
              <div key={idx} style={{
                position: 'absolute',
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: point.isAnomaly ? '10px' : '6px',
                height: point.isAnomaly ? '10px' : '6px',
                borderRadius: '50%',
                background: point.isAnomaly ? '#ef4444' : 'rgba(99, 102, 241, 0.6)',
                boxShadow: point.isAnomaly ? '0 0 8px rgba(239, 68, 68, 0.6)' : 'none',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.3s ease',
              }} />
            ))}
            {/* Legend */}
            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.6)' }} />
                Normal
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)' }} />
                Anomaly
              </div>
            </div>
          </div>
        </div>

        {/* Feature Contribution Bar Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              <TrendingUp size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Feature Contributions
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Anomaly Drivers</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureContributions} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 0.4]} />
              <YAxis type="category" dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#e2e8f0' }}
              />
              <Bar dataKey="contribution" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series with Anomaly Markers */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
            <Activity size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Time Series with Anomaly Markers
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '3px', background: '#6366f1', borderRadius: '2px' }} />
              Observed Values
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              Anomaly
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#e2e8f0' }}
            />
            <Line
              type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2}
              dot={false} activeDot={{ r: 5, fill: '#6366f1' }}
            />
            {anomalyPoints.map((point, idx) => (
              <ReferenceDot
                key={idx} x={point.date} y={point.value}
                r={7} fill="#ef4444" stroke="#fff" strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Log Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
            <AlertTriangle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Anomaly Detection Log
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '6px', padding: '6px 12px', color: '#e2e8f0', fontSize: '12px'
              }}
              aria-label="Filter by feature"
            >
              <option value="All">All Features</option>
              <option value="Rainfall">Rainfall</option>
              <option value="Temperature">Temperature</option>
              <option value="Cases">Cases</option>
            </select>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px',
              background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '6px', color: '#a5b4fc', fontSize: '12px', cursor: 'pointer'
            }}>
              <Filter size={12} /> Filter
            </button>
          </div>
        </div>
        <div className="data-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.15)' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Feature</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', color: '#94a3b8', fontWeight: 600 }}>Observed</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Expected Range</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', color: '#94a3b8', fontWeight: 600 }}>Score</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {anomalyLog.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                  <td style={{ padding: '10px 8px', color: '#e2e8f0' }}>{row.date}</td>
                  <td style={{ padding: '10px 8px', color: '#e2e8f0', fontWeight: 500 }}>{row.district}</td>
                  <td style={{ padding: '10px 8px', color: '#cbd5e1' }}>{row.feature}</td>
                  <td style={{ padding: '10px 8px', color: '#ef4444', textAlign: 'right', fontWeight: 600 }}>{row.observed}</td>
                  <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'center' }}>{row.expected}</td>
                  <td style={{ padding: '10px 8px', color: '#f59e0b', textAlign: 'right', fontFamily: 'monospace' }}>{row.score}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <span className="risk-badge" style={{
                      ...getSeverityStyle(row.severity),
                      padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600
                    }}>
                      {row.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Isolation Forest Explanation Panel */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
            <Shield size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            How Isolation Forest Works
          </h3>
          <span style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc',
            border: '1px solid rgba(99,102,241,0.3)'
          }}>
            Algorithm Explainer
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left - Explanation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#a5b4fc' }}>🌲 Core Principle</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                Isolation Forest isolates anomalies by randomly selecting a feature and a split value.
                Anomalies are <strong style={{ color: '#ef4444' }}>easier to isolate</strong> — they require fewer
                random splits to be separated from the rest of the data, resulting in shorter path lengths in the tree.
              </p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.15)' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#6ee7b7' }}>📐 Anomaly Score</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                Score = 2<sup>−E(h(x)) / c(n)</sup> where E(h(x)) is the average path length and c(n) is the
                normalization factor. Scores close to <strong style={{ color: '#ef4444' }}>1.0</strong> indicate anomalies;
                scores near <strong style={{ color: '#10b981' }}>0.5</strong> indicate normal points.
              </p>
            </div>
          </div>

          {/* Right - Visual Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: 1, title: 'Build Isolation Trees', desc: 'Randomly subsample data and build binary trees with random feature splits', color: '#6366f1' },
              { step: 2, title: 'Measure Path Length', desc: 'Count the number of edges from root to the node where a point is isolated', color: '#8b5cf6' },
              { step: 3, title: 'Average Across Forest', desc: 'Compute mean path length over all trees (100 estimators in our model)', color: '#a855f7' },
              { step: 4, title: 'Compute Anomaly Score', desc: 'Shorter average paths → higher anomaly score → flagged as outlier', color: '#ef4444' },
            ].map((item) => (
              <div key={item.step} style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '12px', borderRadius: '8px',
                background: `${item.color}08`, border: `1px solid ${item.color}25`
              }}>
                <div style={{
                  minWidth: '28px', height: '28px', borderRadius: '50%',
                  background: `${item.color}25`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: item.color
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '2px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Parameters */}
        <div style={{
          marginTop: '20px', padding: '12px 16px', borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(148,163,184,0.1)',
          display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '12px'
        }}>
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#e2e8f0' }}>n_estimators:</strong> 100
          </span>
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#e2e8f0' }}>contamination:</strong> 0.0033
          </span>
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#e2e8f0' }}>max_samples:</strong> 256
          </span>
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#e2e8f0' }}>max_features:</strong> 8
          </span>
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#e2e8f0' }}>random_state:</strong> 42
          </span>
          <span style={{ color: '#94a3b8' }}>
            <strong style={{ color: '#e2e8f0' }}>bootstrap:</strong> True
          </span>
        </div>
      </div>
    </div>
  );
}

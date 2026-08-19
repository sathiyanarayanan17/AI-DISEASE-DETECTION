import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Eye, Database,
  TrendingUp, Zap, Settings, FileWarning, Copy, BarChart3,
  ThumbsUp, ThumbsDown, RefreshCw, Filter, Bug, Sparkles
} from 'lucide-react';

const qualityTrendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 7, i + 1);
  return {
    date: `Aug ${i + 1}`,
    quality: Math.min(99, Math.max(85, 91 + Math.sin(i / 3) * 3 + Math.random() * 2)).toFixed(1),
    issues: Math.floor(Math.max(5, 30 - i * 0.5 + Math.random() * 10)),
    autoFixed: Math.floor(Math.max(3, 20 - i * 0.3 + Math.random() * 8)),
  };
});

const issueCategories = [
  { name: 'Missing Values', count: 47, severity: 'medium', color: '#f59e0b', icon: FileWarning },
  { name: 'Outliers', count: 23, severity: 'high', color: '#ef4444', icon: AlertTriangle },
  { name: 'Duplicates', count: 12, severity: 'low', color: '#3b82f6', icon: Copy },
  { name: 'Inconsistencies', count: 18, severity: 'high', color: '#ef4444', icon: Bug },
  { name: 'Format Errors', count: 9, severity: 'medium', color: '#f59e0b', icon: Settings },
];

const flaggedRecords = [
  { id: 'REC-4821', district: 'Nilgiris', field: 'rainfall_mm', value: '500', issueType: 'Outlier', suggestion: 'Replace with 50mm (sensor decimal error)', confidence: 96 },
  { id: 'REC-4833', district: 'Chennai', field: 'temperature_c', value: '-5', issueType: 'Impossible Value', suggestion: 'Replace with 35°C (August avg)', confidence: 99 },
  { id: 'REC-4847', district: 'Madurai', field: 'humidity_pct', value: '', issueType: 'Missing Value', suggestion: 'Impute 72% (7-day rolling avg)', confidence: 88 },
  { id: 'REC-4852', district: 'Coimbatore', field: 'dengue_cases', value: '1500', issueType: 'Outlier', suggestion: 'Verify with district office (10x above mean)', confidence: 82 },
  { id: 'REC-4861', district: 'Thanjavur', field: 'date', value: '2026-13-01', issueType: 'Format Error', suggestion: 'Correct to 2026-03-01 (month/day swap)', confidence: 91 },
  { id: 'REC-4870', district: 'Salem', field: 'cholera_cases', value: '45', issueType: 'Inconsistency', suggestion: 'Cross-check: no water quality alerts in Salem', confidence: 77 },
  { id: 'REC-4879', district: 'Tiruchirappalli', field: 'rainfall_mm', value: '250', issueType: 'Duplicate', suggestion: 'Duplicate of REC-4878 (same timestamp)', confidence: 95 },
];

const autoCorrectionLog = [
  { time: '13:42:01', record: 'REC-4790', field: 'humidity_pct', original: '105%', corrected: '100%', rule: 'Max cap at 100%' },
  { time: '13:38:22', record: 'REC-4785', field: 'temperature_c', original: '99.9', corrected: '39.9', rule: 'Decimal point restoration' },
  { time: '13:35:10', record: 'REC-4780', field: 'district', original: 'Channai', corrected: 'Chennai', rule: 'Fuzzy name matching' },
  { time: '13:30:55', record: 'REC-4772', field: 'date', original: '19-08-2026', corrected: '2026-08-19', rule: 'Date format normalization' },
  { time: '13:25:40', record: 'REC-4768', field: 'malaria_cases', original: '-3', corrected: '0', rule: 'Non-negative enforcement' },
  { time: '13:20:18', record: 'REC-4760', field: 'rainfall_mm', original: '  45.2  ', corrected: '45.2', rule: 'Whitespace trimming' },
];

const validationRules = [
  { field: 'rainfall_mm', rule: 'Range: 0–400mm', action: 'Flag if exceeded', enabled: true },
  { field: 'temperature_c', rule: 'Range: 10–50°C', action: 'Auto-reject if outside', enabled: true },
  { field: 'humidity_pct', rule: 'Range: 0–100%', action: 'Cap at boundaries', enabled: true },
  { field: 'dengue_cases', rule: 'Z-score < 3', action: 'Flag outliers', enabled: true },
  { field: 'district', rule: 'Must match TN-37 list', action: 'Fuzzy correct', enabled: true },
  { field: 'date', rule: 'ISO 8601 format', action: 'Auto-reformat', enabled: true },
  { field: 'cholera_cases', rule: 'Cross-validate with water alerts', action: 'Flag inconsistency', enabled: false },
];

const aiCatches = [
  {
    title: 'Sensor Decimal Error',
    description: 'Rainfall 500mm in Nilgiris desert zone — flagged as likely sensor error (decimal point shifted)',
    severity: 'high',
    icon: Zap,
  },
  {
    title: 'Impossible Climate Value',
    description: 'Temperature -5°C in Chennai August — impossible value for tropical coastal city',
    severity: 'critical',
    icon: AlertTriangle,
  },
  {
    title: 'Temporal Anomaly',
    description: 'Dengue cases spike 15x in Madurai with no rainfall increase — likely reporting batch upload error',
    severity: 'high',
    icon: TrendingUp,
  },
  {
    title: 'Geographic Mismatch',
    description: 'Coastal humidity reading of 12% in Ramanathapuram — physically implausible for coastal district',
    severity: 'medium',
    icon: Database,
  },
];

export default function DataQualityPage() {
  const [rules, setRules] = useState(validationRules);
  const [records, setRecords] = useState(flaggedRecords);

  const toggleRule = (index) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, enabled: !r.enabled } : r));
  };

  const handleAction = (id, action) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const stats = [
    { label: 'Records Checked', value: '12,847', icon: Database, color: '#3b82f6' },
    { label: 'Issues Found', value: '109', icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Auto-Fixed', value: '72', icon: Zap, color: '#10b981' },
    { label: 'Requires Review', value: '37', icon: Eye, color: '#ef4444' },
  ];

  const qualityScore = 94.2;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (qualityScore / 100) * circumference;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <ShieldCheck size={32} color="#10b981" />
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>AI-Powered Data Quality Checker</h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
            Automated validation, anomaly detection & auto-correction for disease surveillance data
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Run Check
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} /> Configure
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', opacity: 0.7 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quality Gauge + Issue Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '24px' }}>
        {/* Circular Gauge */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.7 }}>Overall Data Quality</h3>
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
              <circle
                cx="100" cy="100" r="80" fill="none"
                stroke={qualityScore >= 90 ? '#10b981' : qualityScore >= 70 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#10b981' }}>{qualityScore}%</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Excellent</div>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Good (≥90%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span> Fair (70-90%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> Poor (&lt;70%)
            </span>
          </div>
        </div>

        {/* Issue Categories */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} /> Issue Categories Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {issueCategories.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <cat.icon size={18} color={cat.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{cat.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{cat.count}</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: '6px', borderRadius: '3px' }}>
                    <div style={{
                      width: `${(cat.count / 50) * 100}%`, height: '100%',
                      borderRadius: '3px', background: cat.color, transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
                <span className="risk-badge" style={{
                  fontSize: '11px', padding: '2px 8px',
                  background: cat.severity === 'high' ? '#ef444420' : cat.severity === 'medium' ? '#f59e0b20' : '#3b82f620',
                  color: cat.severity === 'high' ? '#ef4444' : cat.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                  borderRadius: '12px', fontWeight: 600, textTransform: 'uppercase'
                }}>
                  {cat.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Catches Showcase */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#f59e0b" /> AI Catches — Smart Anomaly Detection
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {aiCatches.map((item, i) => (
            <div key={i} style={{
              padding: '16px', borderRadius: '12px',
              background: item.severity === 'critical' ? 'rgba(239,68,68,0.08)' : item.severity === 'high' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)',
              border: `1px solid ${item.severity === 'critical' ? 'rgba(239,68,68,0.2)' : item.severity === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <item.icon size={16} color={item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f59e0b' : '#3b82f6'} />
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.85, lineHeight: '1.5' }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Records Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#f59e0b" /> Flagged Records — Requires Human Review
          <span style={{
            marginLeft: '8px', background: '#ef444420', color: '#ef4444',
            padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600
          }}>
            {records.length} pending
          </span>
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', opacity: 0.7 }}>Record ID</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', opacity: 0.7 }}>District</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', opacity: 0.7 }}>Field</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', opacity: 0.7 }}>Value</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', opacity: 0.7 }}>Issue Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', opacity: 0.7 }}>AI Suggestion</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', opacity: 0.7 }}>Confidence</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', opacity: 0.7 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={rec.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '12px' }}>{rec.id}</td>
                  <td style={{ padding: '10px 12px' }}>{rec.district}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '12px' }}>{rec.field}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#ef4444' }}>{rec.value || '(empty)'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                      background: rec.issueType === 'Outlier' || rec.issueType === 'Impossible Value' ? '#ef444420' : '#f59e0b20',
                      color: rec.issueType === 'Outlier' || rec.issueType === 'Impossible Value' ? '#ef4444' : '#f59e0b'
                    }}>
                      {rec.issueType}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', maxWidth: '200px' }}>{rec.suggestion}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{
                      fontWeight: 600,
                      color: rec.confidence >= 90 ? '#10b981' : rec.confidence >= 80 ? '#f59e0b' : '#ef4444'
                    }}>
                      {rec.confidence}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        onClick={() => handleAction(rec.id, 'accept')}
                      >
                        <ThumbsUp size={12} /> Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        onClick={() => handleAction(rec.id, 'reject')}
                      >
                        <ThumbsDown size={12} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-Correction Log + Rules Engine */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Auto-Correction Log */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#10b981" /> Auto-Correction Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {autoCorrectionLog.map((entry, i) => (
              <div key={i} style={{
                padding: '12px', borderRadius: '8px', background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.6 }}>{entry.time}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{entry.record}</span>
                </div>
                <div style={{ fontSize: '13px' }}>
                  <span style={{ opacity: 0.7 }}>{entry.field}:</span>{' '}
                  <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>{entry.original}</span>
                  {' → '}
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{entry.corrected}</span>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>Rule: {entry.rule}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Engine Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="#8b5cf6" /> Validation Rules Engine
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rules.map((rule, i) => (
              <div key={i} style={{
                padding: '12px', borderRadius: '8px',
                background: rule.enabled ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${rule.enabled ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)'}`,
                opacity: rule.enabled ? 1 : 0.5
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                      {rule.field}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{rule.rule}</div>
                    <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '2px' }}>Action: {rule.action}</div>
                  </div>
                  <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleRule(i)}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: '12px',
                      background: rule.enabled ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                      transition: 'background 0.3s'
                    }} />
                    <span style={{
                      position: 'absolute', top: '3px', left: rule.enabled ? '23px' : '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Quality Trend Chart */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#3b82f6" /> Data Quality Trend — Last 30 Days
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={qualityTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} interval={4} />
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} domain={[80, 100]} unit="%" />
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="quality" name="Quality Score (%)" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="issues" name="Issues Found" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="autoFixed" name="Auto-Fixed" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

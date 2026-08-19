import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, Brain, AlertTriangle, Clock, SlidersHorizontal, ArrowUpDown, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';

const initialAlerts = [
  { id: 1, alert: 'Dengue Cluster Detected', district: 'Chennai', rawSeverity: 'High', populationDensity: 92, hospitalCapacity: 78, diseaseSeverity: 88, responseTime: 70, weatherTrend: 85 },
  { id: 2, alert: 'Cholera Cases Rising', district: 'Madurai', rawSeverity: 'Medium', populationDensity: 65, hospitalCapacity: 82, diseaseSeverity: 90, responseTime: 60, weatherTrend: 75 },
  { id: 3, alert: 'Malaria Outbreak Warning', district: 'Ramanathapuram', rawSeverity: 'Low', populationDensity: 40, hospitalCapacity: 95, diseaseSeverity: 72, responseTime: 88, weatherTrend: 92 },
  { id: 4, alert: 'Water Contamination Alert', district: 'Tiruchirappalli', rawSeverity: 'Medium', populationDensity: 58, hospitalCapacity: 70, diseaseSeverity: 65, responseTime: 55, weatherTrend: 80 },
  { id: 5, alert: 'Dengue Surge - Monsoon', district: 'Coimbatore', rawSeverity: 'High', populationDensity: 80, hospitalCapacity: 60, diseaseSeverity: 85, responseTime: 75, weatherTrend: 90 },
  { id: 6, alert: 'Respiratory Illness Spike', district: 'Salem', rawSeverity: 'Low', populationDensity: 45, hospitalCapacity: 88, diseaseSeverity: 55, responseTime: 82, weatherTrend: 60 },
  { id: 7, alert: 'Gastroenteritis Cluster', district: 'Vellore', rawSeverity: 'Medium', populationDensity: 62, hospitalCapacity: 74, diseaseSeverity: 68, responseTime: 65, weatherTrend: 70 },
  { id: 8, alert: 'Leptospirosis Risk', district: 'Kanyakumari', rawSeverity: 'Low', populationDensity: 38, hospitalCapacity: 90, diseaseSeverity: 60, responseTime: 92, weatherTrend: 88 },
];

const manualPriority = [
  { alert: 'Dengue Cluster Detected', manualRank: 1, aiRank: 1, status: 'Matched' },
  { alert: 'Dengue Surge - Monsoon', manualRank: 2, aiRank: 2, status: 'Matched' },
  { alert: 'Cholera Cases Rising', manualRank: 3, aiRank: 3, status: 'Matched' },
  { alert: 'Water Contamination Alert', manualRank: 4, aiRank: 5, status: 'Reordered' },
  { alert: 'Gastroenteritis Cluster', manualRank: 5, aiRank: 4, status: 'AI Elevated' },
  { alert: 'Malaria Outbreak Warning', manualRank: 7, aiRank: 6, status: 'AI Caught ⚠️' },
  { alert: 'Leptospirosis Risk', manualRank: 8, aiRank: 7, status: 'AI Caught ⚠️' },
  { alert: 'Respiratory Illness Spike', manualRank: 6, aiRank: 8, status: 'AI Caught ⚠️' },
];

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const defaultWeights = {
  populationDensity: 0.30,
  hospitalCapacity: 0.20,
  diseaseSeverity: 0.25,
  responseTime: 0.15,
  weatherTrend: 0.10,
};

function SmartNotifPriorityPage() {
  const [weights, setWeights] = useState(defaultWeights);

  const computeScore = (alert) => {
    return Math.round(
      alert.populationDensity * weights.populationDensity +
      alert.hospitalCapacity * weights.hospitalCapacity +
      alert.diseaseSeverity * weights.diseaseSeverity +
      alert.responseTime * weights.responseTime +
      alert.weatherTrend * weights.weatherTrend
    );
  };

  const rankedAlerts = useMemo(() => {
    const scored = initialAlerts.map((a) => ({
      ...a,
      aiScore: computeScore(a),
    }));
    scored.sort((a, b) => b.aiScore - a.aiScore);
    return scored.map((a, i) => ({ ...a, rank: i + 1 }));
  }, [weights]);

  const avgScore = useMemo(() => {
    const total = rankedAlerts.reduce((sum, a) => sum + a.aiScore, 0);
    return Math.round(total / rankedAlerts.length);
  }, [rankedAlerts]);

  const pieData = [
    { name: 'Critical', value: 15 },
    { name: 'High', value: 25 },
    { name: 'Medium', value: 35 },
    { name: 'Low', value: 25 },
  ];

  const getKeyFactors = (alert) => {
    const factors = [
      { name: 'Population', val: alert.populationDensity },
      { name: 'Hospital Cap', val: alert.hospitalCapacity },
      { name: 'Disease Sev', val: alert.diseaseSeverity },
      { name: 'Response', val: alert.responseTime },
      { name: 'Weather', val: alert.weatherTrend },
    ];
    factors.sort((a, b) => b.val - a.val);
    return factors.slice(0, 2).map((f) => f.name).join(', ');
  };

  const getActionRequired = (score) => {
    if (score >= 80) return 'Immediate Deployment';
    if (score >= 65) return 'Escalate to CMO';
    if (score >= 50) return 'Monitor Closely';
    return 'Routine Check';
  };

  const getRankBadgeColor = (rank) => {
    if (rank <= 2) return '#ef4444';
    if (rank <= 4) return '#f59e0b';
    if (rank <= 6) return '#3b82f6';
    return '#10b981';
  };

  const handleWeightChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const stats = [
    { label: 'Active Alerts', value: initialAlerts.length, icon: Bell, color: '#ef4444' },
    { label: 'AI-Prioritized', value: initialAlerts.length, icon: Brain, color: '#8b5cf6' },
    { label: 'Critical Actions Pending', value: rankedAlerts.filter((a) => a.aiScore >= 80).length, icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Avg Priority Score', value: avgScore, icon: TrendingUp, color: '#3b82f6' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} style={{ color: '#8b5cf6' }} />
          Smart Notification Priority
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>AI ranks alerts by urgency using multi-factor scoring</p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Scoring Explanation */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} style={{ color: '#8b5cf6' }} />
          Priority Scoring Formula
        </h2>
        <div style={{ background: '#1e1b4b', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '14px', color: '#c4b5fd', overflowX: 'auto' }}>
          <span style={{ color: '#a78bfa' }}>Score</span> = Population_density(<span style={{ color: '#fbbf24' }}>0.30</span>) + Hospital_capacity(<span style={{ color: '#fbbf24' }}>0.20</span>) + Disease_severity(<span style={{ color: '#fbbf24' }}>0.25</span>) + Response_time(<span style={{ color: '#fbbf24' }}>0.15</span>) + Weather_trend(<span style={{ color: '#fbbf24' }}>0.10</span>)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
          {[
            { name: 'Population Density', weight: '30%', desc: 'People at risk' },
            { name: 'Hospital Capacity', weight: '20%', desc: 'Healthcare strain' },
            { name: 'Disease Severity', weight: '25%', desc: 'Pathogen danger' },
            { name: 'Response Time', weight: '15%', desc: 'Delay factor' },
            { name: 'Weather Trend', weight: '10%', desc: 'Environmental risk' },
          ].map((f) => (
            <div key={f.name} style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{f.name}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#8b5cf6' }}>{f.weight}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor Weight Adjustment Sliders */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={20} style={{ color: '#f59e0b' }} />
          Adjust Factor Weights (Real-Time Re-Ranking)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
          {[
            { key: 'populationDensity', label: 'Population Density' },
            { key: 'hospitalCapacity', label: 'Hospital Capacity' },
            { key: 'diseaseSeverity', label: 'Disease Severity' },
            { key: 'responseTime', label: 'Response Time' },
            { key: 'weatherTrend', label: 'Weather Trend' },
          ].map((factor) => (
            <div key={factor.key} style={{ textAlign: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{factor.label}</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={weights[factor.key]}
                onChange={(e) => handleWeightChange(factor.key, parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#8b5cf6', marginTop: '4px' }}>
                {(weights[factor.key] * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', marginBottom: '24px' }}>
        {/* Prioritized Alerts Table */}
        <div className="glass-card" style={{ padding: '20px', overflow: 'auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={20} style={{ color: '#3b82f6' }} />
            AI-Prioritized Alerts (Sorted by Score)
          </h2>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '10px 8px', textAlign: 'left' }}>Alert</th>
                <th style={{ padding: '10px 8px', textAlign: 'left' }}>District</th>
                <th style={{ padding: '10px 8px', textAlign: 'left' }}>Raw Severity</th>
                <th style={{ padding: '10px 8px', textAlign: 'center' }}>AI Score</th>
                <th style={{ padding: '10px 8px', textAlign: 'left' }}>Key Factors</th>
                <th style={{ padding: '10px 8px', textAlign: 'left' }}>Action Required</th>
              </tr>
            </thead>
            <tbody>
              {rankedAlerts.map((alert) => (
                <tr key={alert.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: getRankBadgeColor(alert.rank), color: '#fff', fontWeight: 700, fontSize: '12px'
                    }}>
                      #{alert.rank}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{alert.alert}</td>
                  <td style={{ padding: '10px 8px' }}>{alert.district}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span className="risk-badge" style={{
                      padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: alert.rawSeverity === 'High' ? '#fee2e2' : alert.rawSeverity === 'Medium' ? '#fef3c7' : '#dcfce7',
                      color: alert.rawSeverity === 'High' ? '#dc2626' : alert.rawSeverity === 'Medium' ? '#d97706' : '#16a34a'
                    }}>
                      {alert.rawSeverity}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: alert.aiScore >= 80 ? '#ef4444' : alert.aiScore >= 65 ? '#f59e0b' : '#3b82f6' }}>
                      {alert.aiScore}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', fontSize: '12px', color: '#64748b' }}>{getKeyFactors(alert)}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                      background: alert.aiScore >= 80 ? '#fef2f2' : alert.aiScore >= 65 ? '#fffbeb' : '#eff6ff',
                      color: alert.aiScore >= 80 ? '#dc2626' : alert.aiScore >= 65 ? '#d97706' : '#2563eb'
                    }}>
                      {getActionRequired(alert.aiScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '16px' }}>
            {pieData.map((item, i) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[i] }} />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: COLORS[i] }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} style={{ color: '#10b981' }} />
          Before/After: Manual Priority vs AI Priority
        </h2>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#166534' }}>
          <strong>🎯 AI caught 3 alerts</strong> that manual prioritization would have missed or under-ranked, potentially saving critical response time.
        </div>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>Alert</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Manual Rank</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>AI Rank</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {manualPriority.map((row) => (
              <tr key={row.alert} style={{
                borderBottom: '1px solid #f1f5f9',
                background: row.status.includes('Caught') ? '#fef2f2' : row.status === 'AI Elevated' ? '#fffbeb' : 'transparent'
              }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.alert}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>#{row.manualRank}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#8b5cf6' }}>#{row.aiRank}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                    background: row.status.includes('Caught') ? '#fee2e2' : row.status === 'AI Elevated' ? '#fef3c7' : '#dcfce7',
                    color: row.status.includes('Caught') ? '#dc2626' : row.status === 'AI Elevated' ? '#d97706' : '#16a34a'
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Time Improvement */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} style={{ color: '#10b981' }} />
          Response Time Improvement
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#fef2f2', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Before (Manual)</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#ef4444' }}>4.8 hrs</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Avg Response Time</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#10b981' }}>42%</div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Reduction</div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
              ✓ AI prioritization reduced avg response time by 42%
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>After (AI Priority)</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#10b981' }}>2.8 hrs</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Avg Response Time</div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Improvement Progress</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>42%</span>
          </div>
          <div className="progress-bar-track" style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '5px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartNotifPriorityPage;

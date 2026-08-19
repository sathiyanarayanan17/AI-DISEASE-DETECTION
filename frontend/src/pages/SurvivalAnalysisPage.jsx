import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Activity, Clock, AlertTriangle, TrendingDown, Calendar,
  Shield, Target, BarChart3, Info
} from 'lucide-react';

const kaplanMeierData = [
  { day: 0, survival: 1.0, lower: 1.0, upper: 1.0 },
  { day: 3, survival: 0.96, lower: 0.93, upper: 0.99 },
  { day: 7, survival: 0.89, lower: 0.84, upper: 0.94 },
  { day: 10, survival: 0.82, lower: 0.76, upper: 0.88 },
  { day: 14, survival: 0.71, lower: 0.64, upper: 0.78 },
  { day: 18, survival: 0.61, lower: 0.53, upper: 0.69 },
  { day: 21, survival: 0.52, lower: 0.44, upper: 0.60 },
  { day: 25, survival: 0.41, lower: 0.33, upper: 0.49 },
  { day: 28, survival: 0.33, lower: 0.25, upper: 0.41 },
  { day: 32, survival: 0.24, lower: 0.17, upper: 0.31 },
  { day: 35, survival: 0.18, lower: 0.11, upper: 0.25 },
  { day: 40, survival: 0.11, lower: 0.05, upper: 0.17 },
  { day: 45, survival: 0.06, lower: 0.02, upper: 0.10 },
  { day: 50, survival: 0.03, lower: 0.01, upper: 0.05 },
  { day: 56, survival: 0.01, lower: 0.0, upper: 0.03 },
];

const hazardRateData = [
  { day: 1, hazard: 0.012 },
  { day: 3, hazard: 0.015 },
  { day: 5, hazard: 0.019 },
  { day: 7, hazard: 0.025 },
  { day: 10, hazard: 0.032 },
  { day: 12, hazard: 0.038 },
  { day: 14, hazard: 0.045 },
  { day: 17, hazard: 0.052 },
  { day: 21, hazard: 0.061 },
  { day: 25, hazard: 0.068 },
  { day: 28, hazard: 0.074 },
  { day: 32, hazard: 0.079 },
  { day: 35, hazard: 0.082 },
  { day: 40, hazard: 0.085 },
  { day: 45, hazard: 0.083 },
  { day: 50, hazard: 0.078 },
];

const diseaseSurvivalData = [
  { disease: 'Dengue', medianDuration: 24, ciLower: 19, ciUpper: 29, activeCount: 5, predictedEnd: '2026-09-12' },
  { disease: 'Cholera', medianDuration: 18, ciLower: 14, ciUpper: 22, activeCount: 3, predictedEnd: '2026-09-06' },
  { disease: 'Malaria', medianDuration: 31, ciLower: 26, ciUpper: 37, activeCount: 4, predictedEnd: '2026-09-19' },
];

const coxFactors = [
  { factor: 'Rainfall Decline', variable: 'rainfall_decline', hazardRatio: 1.82, ci: '1.45–2.28', pValue: '<0.001', effect: 'Accelerates end' },
  { factor: 'Intervention Speed', variable: 'intervention_speed', hazardRatio: 2.14, ci: '1.73–2.65', pValue: '<0.001', effect: 'Accelerates end' },
  { factor: 'Vaccination Coverage', variable: 'vaccination_coverage', hazardRatio: 1.56, ci: '1.22–1.99', pValue: '0.003', effect: 'Accelerates end' },
  { factor: 'Population Density', variable: 'population_density', hazardRatio: 0.72, ci: '0.58–0.89', pValue: '0.008', effect: 'Prolongs outbreak' },
  { factor: 'Humidity Level', variable: 'humidity_pct', hazardRatio: 0.65, ci: '0.51–0.83', pValue: '0.002', effect: 'Prolongs outbreak' },
];

const districtPredictions = [
  { district: 'Chennai', disease: 'Dengue', startDate: '2026-08-01', daysActive: 18, predictedEnd: '2026-09-02', confidence: 0.78, riskLevel: 'High' },
  { district: 'Coimbatore', disease: 'Malaria', startDate: '2026-07-28', daysActive: 22, predictedEnd: '2026-08-30', confidence: 0.82, riskLevel: 'Medium' },
  { district: 'Madurai', disease: 'Cholera', startDate: '2026-08-05', daysActive: 14, predictedEnd: '2026-08-28', confidence: 0.71, riskLevel: 'High' },
  { district: 'Tiruchirappalli', disease: 'Dengue', startDate: '2026-08-10', daysActive: 9, predictedEnd: '2026-09-08', confidence: 0.65, riskLevel: 'Medium' },
  { district: 'Salem', disease: 'Malaria', startDate: '2026-08-03', daysActive: 16, predictedEnd: '2026-09-05', confidence: 0.74, riskLevel: 'Low' },
  { district: 'Tirunelveli', disease: 'Dengue', startDate: '2026-08-08', daysActive: 11, predictedEnd: '2026-09-10', confidence: 0.68, riskLevel: 'Medium' },
  { district: 'Vellore', disease: 'Cholera', startDate: '2026-08-12', daysActive: 7, predictedEnd: '2026-09-01', confidence: 0.61, riskLevel: 'Low' },
];

const statsData = [
  { label: 'Median Outbreak Duration', value: '24 days', icon: Clock, color: '#6366f1' },
  { label: 'Current Active Outbreaks', value: '12', icon: AlertTriangle, color: '#f59e0b' },
  { label: 'Longest Active', value: '22 days', icon: Activity, color: '#ef4444' },
  { label: 'Predicted End Date', value: 'Sep 19, 2026', icon: Calendar, color: '#10b981' },
];

function getRiskBadge(level) {
  const colors = {
    High: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
    Low: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  };
  const style = colors[level] || colors.Low;
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: style.bg,
      color: style.color,
    }}>
      {level}
    </span>
  );
}

function SurvivalAnalysisPage() {
  const [selectedDisease, setSelectedDisease] = useState('All');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingDown size={28} color="#6366f1" />
              Outbreak Survival Analysis
            </h1>
            <p style={{ color: '#94a3b8', marginTop: '8px', maxWidth: '800px', lineHeight: 1.6 }}>
              Survival analysis models the expected duration of disease outbreaks using Kaplan-Meier estimation 
              and Cox proportional hazards regression. This predicts <strong>how long an active outbreak will persist</strong> based 
              on environmental factors, intervention timing, and historical patterns — enabling proactive resource planning 
              and response strategy.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Info size={16} color="#64748b" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Updated: Aug 19, 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {statsData.map((stat) => (
          <div className="glass-card" key={stat.label} style={{ padding: '20px' }}>
            <div className="flex-between">
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>{stat.label}</p>
                <p className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0 0 0' }}>
                  {stat.value}
                </p>
              </div>
              <stat.icon size={32} color={stat.color} style={{ opacity: 0.8 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Kaplan-Meier Survival Curve */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#6366f1" />
            Kaplan-Meier Survival Curve
          </h2>
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#e2e8f0',
              fontSize: '0.85rem',
            }}
          >
            <option value="All">All Diseases</option>
            <option value="Dengue">Dengue</option>
            <option value="Cholera">Cholera</option>
            <option value="Malaria">Malaria</option>
          </select>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '16px' }}>
          Probability of outbreak continuing beyond a given number of days. The median survival time (50% probability) indicates typical outbreak duration.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={kaplanMeierData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              label={{ value: 'Days Since Outbreak Start', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              stroke="#64748b"
              domain={[0, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px' }}
              formatter={(value, name) => {
                const labels = { survival: 'Survival Prob', upper: '95% CI Upper', lower: '95% CI Lower' };
                return [`${(value * 100).toFixed(1)}%`, labels[name] || name];
              }}
              labelFormatter={(day) => `Day ${day}`}
            />
            <Legend />
            <Area type="stepAfter" dataKey="upper" stroke="none" fill="rgba(99, 102, 241, 0.1)" name="95% CI Upper" />
            <Area type="stepAfter" dataKey="lower" stroke="none" fill="rgba(99, 102, 241, 0.1)" name="95% CI Lower" />
            <Line type="stepAfter" dataKey="survival" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} name="Survival Prob" />
            <ReferenceLine y={0.5} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Median', fill: '#f59e0b', fontSize: 11 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Disease Survival Table + Hazard Rate Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Disease Survival Table */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="#10b981" />
            Per-Disease Survival Estimates
          </h2>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Disease</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Median (days)</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>95% CI</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Active</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Predicted End</th>
              </tr>
            </thead>
            <tbody>
              {diseaseSurvivalData.map((row) => (
                <tr key={row.disease}>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.1)', fontWeight: 600 }}>{row.disease}</td>
                  <td className="font-mono" style={{ padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>{row.medianDuration}</td>
                  <td className="font-mono" style={{ padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>{row.ciLower}–{row.ciUpper}</td>
                  <td className="font-mono" style={{ padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>{row.activeCount}</td>
                  <td className="font-mono" style={{ padding: '10px 8px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontSize: '0.8rem' }}>{row.predictedEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hazard Rate Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#ef4444" />
            Hazard Rate (Daily End Probability)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '16px' }}>
            Instantaneous probability of an outbreak ending on each day, given it has survived until that day.
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hazardRateData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="day" stroke="#64748b" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}
                formatter={(value) => [`${(value * 100).toFixed(2)}%`, 'Hazard Rate']}
                labelFormatter={(day) => `Day ${day}`}
              />
              <Area type="monotone" dataKey="hazard" stroke="#ef4444" fill="rgba(239, 68, 68, 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cox Regression Factors */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#f59e0b" />
          Cox Proportional Hazards — Regression Factors
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '16px' }}>
          Hazard Ratio {'>'} 1 means the factor accelerates outbreak resolution. HR {'<'} 1 means it prolongs the outbreak.
        </p>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Factor</th>
              <th style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Variable</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Hazard Ratio</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>95% CI</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>p-value</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Effect</th>
            </tr>
          </thead>
          <tbody>
            {coxFactors.map((row) => (
              <tr key={row.variable}>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', fontWeight: 600 }}>{row.factor}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', fontSize: '0.8rem', color: '#94a3b8' }}>{row.variable}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontWeight: 700, color: row.hazardRatio > 1 ? '#10b981' : '#ef4444' }}>{row.hazardRatio.toFixed(2)}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>{row.ci}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontSize: '0.8rem' }}>{row.pValue}</td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: row.hazardRatio > 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: row.hazardRatio > 1 ? '#10b981' : '#ef4444',
                  }}>
                    {row.effect}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* District-Level Predictions */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#6366f1" />
          District-Level Outbreak End Predictions
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '16px' }}>
          Predicted resolution dates for currently active outbreaks across Tamil Nadu districts based on survival model estimates.
        </p>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>District</th>
              <th style={{ textAlign: 'left', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Disease</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Start Date</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Days Active</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Predicted End</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Confidence</th>
              <th style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {districtPredictions.map((row) => (
              <tr key={`${row.district}-${row.disease}`}>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', fontWeight: 600 }}>{row.district}</td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>{row.disease}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontSize: '0.8rem' }}>{row.startDate}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontWeight: 700 }}>{row.daysActive}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center', fontSize: '0.8rem' }}>{row.predictedEnd}</td>
                <td className="font-mono" style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>
                  <span style={{ color: row.confidence >= 0.75 ? '#10b981' : row.confidence >= 0.65 ? '#f59e0b' : '#ef4444' }}>
                    {(row.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>
                  {getRiskBadge(row.riskLevel)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SurvivalAnalysisPage;

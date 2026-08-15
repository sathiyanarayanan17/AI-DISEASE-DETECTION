import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { GitCompare, ArrowRightLeft, Droplets, Thermometer, Wind, Users, Activity } from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

export const ComparePage = () => {
  const [districtAName, setDistrictAName] = useState('Chennai');
  const [districtBName, setDistrictBName] = useState('Coimbatore');

  const districtA = getDistrictByName(districtAName);
  const districtB = getDistrictByName(districtBName);

  // Combine 30-day histories for dual-series line chart
  const comparisonChartData = districtA.history30d.map((pt, i) => ({
    date: pt.shortDate,
    [districtA.name]: pt.riskScore,
    [districtB.name]: districtB.history30d[i]?.riskScore || 50
  }));

  const metrics = [
    { label: "XGBoost Risk Score", a: `${districtA.riskScore} / 100`, b: `${districtB.riskScore} / 100` },
    { label: "7-Day Total Cases", a: districtA.totalCases7d, b: districtB.totalCases7d },
    { label: "Dengue Active Cases", a: districtA.dengueCases, b: districtB.dengueCases },
    { label: "Cholera Active Cases", a: districtA.choleraCases, b: districtB.choleraCases },
    { label: "Malaria Active Cases", a: districtA.malariaCases, b: districtB.malariaCases },
    { label: "Cumulative Rainfall", a: `${districtA.weather.rainfall} mm`, b: `${districtB.weather.rainfall} mm` },
    { label: "Mean Temperature", a: `${districtA.weather.temperature} °C`, b: `${districtB.weather.temperature} °C` },
    { label: "Relative Humidity", a: `${districtA.weather.humidity} %`, b: `${districtB.weather.humidity} %` },
    { label: "Population Census", a: districtA.population.toLocaleString(), b: districtB.population.toLocaleString() },
    { label: "Model Confidence", a: `${districtA.confidence} %`, b: `${districtB.confidence} %` }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitCompare size={24} className="text-cyan-400" />
            <span>Side-by-Side District Comparative Analytics</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Cross-district epidemiological benchmarking and micro-climate vulnerability overlay.
          </p>
        </div>
      </div>

      {/* 2. District Selectors Row */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Primary District (A):</label>
          <select
            value={districtAName}
            onChange={(e) => setDistrictAName(e.target.value)}
            className="input-control input-select"
            style={{ fontWeight: 600, borderColor: '#6366f1' }}
          >
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.name}>{d.name} ({d.tamilName})</option>
            ))}
          </select>
        </div>

        <ArrowRightLeft size={24} className="text-indigo-400" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Comparison District (B):</label>
          <select
            value={districtBName}
            onChange={(e) => setDistrictBName(e.target.value)}
            className="input-control input-select"
            style={{ fontWeight: 600, borderColor: '#06b6d4' }}
          >
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.name}>{d.name} ({d.tamilName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Dual Stat Cards */}
      <div className="grid-cols-2">
        {/* District A Summary */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #6366f1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '20px' }}>{districtA.name}</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{districtA.tamilName}</span>
            </div>
            <RiskBadge level={districtA.riskLevel} score={districtA.riskScore} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>7d Cases</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{districtA.totalCases7d}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rainfall</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{districtA.weather.rainfall}mm</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{districtA.confidence}%</div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '10px', borderRadius: '8px', lineHeight: 1.4 }}>
            {districtA.recommendation}
          </p>
        </div>

        {/* District B Summary */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #06b6d4', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '20px' }}>{districtB.name}</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{districtB.tamilName}</span>
            </div>
            <RiskBadge level={districtB.riskLevel} score={districtB.riskScore} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>7d Cases</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{districtB.totalCases7d}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rainfall</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{districtB.weather.rainfall}mm</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{districtB.confidence}%</div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '10px', borderRadius: '8px', lineHeight: 1.4 }}>
            {districtB.recommendation}
          </p>
        </div>
      </div>

      {/* 4. Overlaid Dual-Series 30-Day Line Chart */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>30-Day Outbreak Risk Trajectory Comparison</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overlaid trajectory of {districtA.name} (#6366f1) versus {districtB.name} (#06b6d4).
            </p>
          </div>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey={districtA.name} stroke="#6366f1" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey={districtB.name} stroke="#06b6d4" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Metrics Comparison Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Side-by-Side Parameter Matrix</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Surveillance Parameter</th>
                <th style={{ color: '#6366f1', fontWeight: 700 }}>{districtA.name}</th>
                <th style={{ color: '#06b6d4', fontWeight: 700 }}>{districtB.name}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{m.label}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m.a}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;

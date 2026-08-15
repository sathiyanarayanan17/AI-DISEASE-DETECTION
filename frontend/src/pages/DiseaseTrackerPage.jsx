import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  Flame,
  Droplet,
  Bug,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getDiseaseData } from '../data/diseaseData';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';
import ExportButton from '../components/common/ExportButton';

export const DiseaseTrackerPage = () => {
  const { disease } = useParams();
  const data = getDiseaseData(disease || 'dengue');

  // Find top 10 affected districts for this disease
  const top10Districts = [...DISTRICTS_DATA]
    .sort((a, b) => {
      const field = data.id === 'dengue' ? 'dengueCases' : (data.id === 'cholera' ? 'choleraCases' : 'malariaCases');
      return b[field] - a[field];
    })
    .slice(0, 10);

  const getDiseaseIcon = () => {
    if (data.id === 'cholera') return <Droplet size={24} className="text-cyan-400" />;
    if (data.id === 'malaria') return <Bug size={24} className="text-emerald-400" />;
    return <Flame size={24} className="text-rose-400" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header with Disease Switcher Tabs */}
      <div className="flex-between flex-wrap gap-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${data.color}`
            }}
          >
            {getDiseaseIcon()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px' }}>{data.name}</h1>
              <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>({data.tamilName})</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {data.pathogen} | Vector: {data.vector}
            </div>
          </div>
        </div>

        {/* Tab Pills to Switch Diseases */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to="/disease/dengue"
            className={`btn text-xs ${data.id === 'dengue' ? 'btn-danger' : 'btn-secondary'}`}
          >
            <Flame size={14} />
            <span>Dengue</span>
          </Link>
          <Link
            to="/disease/cholera"
            className={`btn text-xs ${data.id === 'cholera' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Droplet size={14} />
            <span>Cholera</span>
          </Link>
          <Link
            to="/disease/malaria"
            className={`btn text-xs ${data.id === 'malaria' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Bug size={14} />
            <span>Malaria</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Stats Row */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Active Cases Statewide
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: data.color }}>
            {data.totalCasesActive.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Hospitalized Rate: <strong>{data.hospitalizationRate}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Peak Season Period
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} className="text-amber-400" />
            <span>{data.peakSeason}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Monsoon Vector Replication Cycle
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Clinical Incubation
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {data.incubation}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Case Fatality: <strong>{data.mortalityRate}</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Transmission Vector
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {data.transmission}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            Source Reduction Active
          </div>
        </div>
      </div>

      {/* 3. 90-DAY TREND LINE CHART */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>90-Day Epidemiological Trend & Model Forecast</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Reported cases versus XGBoost projected surge trajectory with epidemic threshold.
            </p>
          </div>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trends90d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              <ReferenceLine y={data.trends90d[0]?.threshold} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: "Epidemic Alert Threshold", fill: "#f43f5e", fontSize: 11 }} />
              <Line type="monotone" dataKey="cases" name="Observed Cases" stroke={data.color} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="predicted" name="XGBoost Predicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. TOP 10 AFFECTED DISTRICTS TABLE */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>Top 10 Affected Districts for {data.name}</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ranked by active case clusters and localized transmission index.</p>
          </div>
          <ExportButton data={top10Districts} filename={`top10_${data.id}_districts`} label="Export Top 10 CSV" />
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>District</th>
                <th>Active {data.name} Cases</th>
                <th>Total 7d Burden</th>
                <th>Rainfall (mm)</th>
                <th>Risk Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {top10Districts.map((d, index) => {
                const cases = data.id === 'dengue' ? d.dengueCases : (data.id === 'cholera' ? d.choleraCases : d.malariaCases);
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>#{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{d.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.tamilName}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: data.color, fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                        {cases}
                      </span>
                    </td>
                    <td>{d.totalCases7d}</td>
                    <td>{d.weather.rainfall} mm</td>
                    <td>
                      <RiskBadge level={d.riskLevel} score={d.riskScore} size="sm" />
                    </td>
                    <td>
                      <Link to={`/district/${d.name.toLowerCase()}`} className="btn btn-secondary text-xs" style={{ padding: '4px 8px' }}>
                        <span>Inspect</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FOUR CLINICAL INFO CARDS */}
      <div className="grid-cols-2">
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} className="text-amber-400" />
            <span>Clinical Symptoms Checklist</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.symptoms.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Community Prevention & Vector Controls</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.prevention.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} className="text-emerald-400" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseTrackerPage;

import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  Search,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';
import ExportButton from '../components/common/ExportButton';

export const AnomalyPage = () => {
  // Generate normal and anomalous data points for scatter plot
  const scatterData = [];
  const anomaliesList = [
    {
      id: "ANOM-881",
      district: "Chennai",
      disease: "Dengue",
      zScore: "+3.84",
      observedCases: 142,
      expectedCases: 64,
      severity: "CRITICAL",
      date: "2026-08-14",
      description: "Sudden 120% spike in Tondiarpet ward following heavy unseasonal rainfall."
    },
    {
      id: "ANOM-882",
      district: "Madurai",
      disease: "Cholera",
      zScore: "+3.12",
      observedCases: 42,
      expectedCases: 14,
      severity: "HIGH",
      date: "2026-08-13",
      description: "Pipeline contamination suspected near Vaigai riverbed residential sector."
    },
    {
      id: "ANOM-883",
      district: "Chengalpattu",
      disease: "Dengue",
      zScore: "+3.45",
      observedCases: 118,
      expectedCases: 45,
      severity: "CRITICAL",
      date: "2026-08-14",
      description: "Cluster outbreak identified in high-density IT corridor construction zone."
    },
    {
      id: "ANOM-884",
      district: "Cuddalore",
      disease: "Dengue",
      zScore: "+2.89",
      observedCases: 82,
      expectedCases: 35,
      severity: "HIGH",
      date: "2026-08-12",
      description: "Post-rain water stagnation in coastal fishing hamlets creating Aedes surge."
    },
    {
      id: "ANOM-885",
      district: "Nagapattinam",
      disease: "Cholera",
      zScore: "+2.95",
      observedCases: 41,
      expectedCases: 16,
      severity: "HIGH",
      date: "2026-08-13",
      description: "Waterlogging following 44mm deluge causing enteric pathogen alert."
    }
  ];

  // Scatter plot points: X = Rainfall, Y = Cases
  DISTRICTS_DATA.forEach((d) => {
    const isAnomaly = anomaliesList.some((a) => a.district === d.name);
    scatterData.push({
      district: d.name,
      rainfall: d.weather.rainfall,
      cases: d.totalCases7d,
      isAnomaly,
      zScore: isAnomaly ? "+3.2" : "+0.4"
    });
  });

  const normalPoints = scatterData.filter((p) => !p.isAnomaly);
  const anomalyPoints = scatterData.filter((p) => p.isAnomaly);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} className="text-amber-400" />
            <span>Statistical Outlier & Anomaly Detection</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Z-score standard deviation anomaly tracking identifying unexpected epidemiological surges.
          </p>
        </div>

        <ExportButton data={anomaliesList} filename="outlier_anomalies_tn" label="Export Anomalies CSV" />
      </div>

      {/* 2. Stats Row */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--risk-high)', fontWeight: 600, textTransform: 'uppercase' }}>
            Active Outliers Detected
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>
            {anomaliesList.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Z-Score &gt; +2.5 Standard Deviations
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Districts Affected
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            5 Districts
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Coastal & Urban Municipalities
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Max Anomaly Z-Score
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            +3.84 σ
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Chennai (Tondiarpet / Royapuram)
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Baseline Method
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            Isolation Forest + CUSUM
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Cumulative Sum Control Chart
          </div>
        </div>
      </div>

      {/* 3. Scatter Plot: Normal vs Anomalous */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>Meteorological vs Case Volume Distribution</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Green dots represent expected regression bounds; Red dots indicate anomalous statistical spikes.
            </p>
          </div>
        </div>

        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis type="number" dataKey="rainfall" name="Rainfall (mm)" unit="mm" stroke="var(--text-muted)" fontSize={11} />
              <YAxis type="number" dataKey="cases" name="7-Day Cases" stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ background: 'var(--bg-card)', padding: '10px', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.district}</div>
                        <div>Rainfall: {data.rainfall} mm</div>
                        <div>7d Cases: {data.cases}</div>
                        <div style={{ color: data.isAnomaly ? '#f43f5e' : '#10b981', fontWeight: 600 }}>
                          {data.isAnomaly ? `ANOMALY SPIKE (${data.zScore})` : 'Normal Distribution'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter name="Nominal Baseline" data={normalPoints} fill="#10b981" />
              <Scatter name="Anomalous Spike" data={anomalyPoints} fill="#f43f5e" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Anomaly Detail Cards */}
      <div>
        <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Active Anomaly Investigation Queue</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {anomaliesList.map((anom) => (
            <div
              key={anom.id}
              className="glass-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderLeft: '4px solid var(--risk-high)'
              }}
            >
              <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{anom.district}</span>
                  <span className="risk-badge high" style={{ fontSize: '10px', padding: '2px 8px' }}>{anom.severity}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--risk-high)' }}>
                  Z = {anom.zScore}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: 'var(--bg-input)', padding: '8px 12px', borderRadius: '6px' }}>
                <span>Observed: <strong style={{ color: 'var(--risk-high)' }}>{anom.observedCases}</strong></span>
                <span>Expected: <strong>{anom.expectedCases}</strong></span>
                <span>Disease: <strong>{anom.disease}</strong></span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {anom.description}
              </p>

              <div className="flex-between" style={{ fontSize: '11px', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>{anom.date} | {anom.id}</span>
                <Link to={`/district/${anom.district.toLowerCase()}`} style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Investigate District</span>
                  <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnomalyPage;

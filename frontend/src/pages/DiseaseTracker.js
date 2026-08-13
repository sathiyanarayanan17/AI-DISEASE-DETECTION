import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDiseaseData } from '../services/api';
import ExportButton from '../components/ExportButton';

const DISEASE_INFO = {
  dengue: {
    icon: '🦟',
    color: '#f59e0b',
    name: 'Dengue Fever',
    symptoms: ['High fever (40C/104F)', 'Severe headache', 'Pain behind eyes', 'Muscle and joint pain', 'Nausea/vomiting', 'Skin rash', 'Fatigue'],
    prevention: ['Eliminate standing water', 'Use mosquito repellent', 'Wear long-sleeved clothing', 'Use bed nets', 'Install window screens', 'Community fogging drives'],
    incubation: '4-10 days',
    vector: 'Aedes aegypti mosquito',
    risk_factors: ['Stagnant water near homes', 'Tropical/subtropical climate', 'Urbanization with poor drainage', 'Previous dengue infection', 'Monsoon season (Oct-Dec in TN)'],
  },
  cholera: {
    icon: '💧',
    color: '#3b82f6',
    name: 'Cholera',
    symptoms: ['Profuse watery diarrhea', 'Vomiting', 'Rapid dehydration', 'Leg cramps', 'Restlessness', 'Low blood pressure', 'Rapid heart rate'],
    prevention: ['Drink safe/boiled water', 'Proper sanitation', 'Hand washing with soap', 'Cook food thoroughly', 'Avoid raw seafood', 'ORS at first sign'],
    incubation: '12 hours to 5 days',
    vector: 'Vibrio cholerae (waterborne)',
    risk_factors: ['Contaminated water supply', 'Poor sanitation infrastructure', 'Flooding events', 'Overcrowded areas', 'Post-disaster conditions'],
  },
  malaria: {
    icon: '🩸',
    color: '#10b981',
    name: 'Malaria',
    symptoms: ['Cyclic fever with chills', 'Sweating', 'Headache', 'Nausea/vomiting', 'Body aches', 'Anemia', 'Jaundice (severe cases)'],
    prevention: ['Sleep under insecticide-treated nets', 'Indoor residual spraying', 'Antimalarial prophylaxis', 'Eliminate breeding sites', 'Wear protective clothing at dusk/dawn'],
    incubation: '7-30 days',
    vector: 'Anopheles mosquito',
    risk_factors: ['Proximity to stagnant water bodies', 'Rural/forested areas', 'Lack of bed nets', 'Rainy season', 'Travel to endemic zones'],
  },
};

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tt-val" style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); }
  catch { return iso; }
}

export default function DiseaseTracker({ disease }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const info = DISEASE_INFO[disease] || DISEASE_INFO.dengue;

  useEffect(() => {
    setLoading(true);
    getDiseaseData(disease)
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, [disease]);

  if (loading) return (
    <div className="spin-wrap">
      <div className="spinner" />
      <span>Loading {info.name} data...</span>
    </div>
  );

  const chartData = (data?.trend_90d || []).map(d => ({ ...d, dl: fmtDate(d.date) }));

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          {info.icon} {info.name} Tracker
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Comprehensive monitoring and information for {info.name} in Tamil Nadu
        </p>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">{info.icon}</div>
          <div>
            <div className="stat-num" style={{ color: info.color }}>{data?.total_cases || 0}</div>
            <div className="stat-lbl">Total Active Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">📈</div>
          <div>
            <div className="stat-num" style={{ color: data?.trend === 'rising' ? '#fca5a5' : '#6ee7b7' }}>
              {data?.trend === 'rising' ? '↑' : '↓'}
            </div>
            <div className="stat-lbl">Current Trend</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📅</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1.4rem' }}>{data?.peak_month || 'Nov'}</div>
            <div className="stat-lbl">Peak Month</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">⏱</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1.2rem' }}>{info.incubation}</div>
            <div className="stat-lbl">Incubation Period</div>
          </div>
        </div>
      </div>

      {/* 90-day Trend Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">90-Day Case Trend</h3>
          <span style={{ fontSize: '0.72rem', color: '#475569' }}>Daily reported cases</span>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 4, right: 10, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="dl" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} interval={14} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="cases" name="Cases" stroke={info.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Districts Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Top 10 Affected Districts</h3>
          <ExportButton data={data?.top_districts || []} filename={`${disease}_districts`} columns={['district', 'cases', 'trend', 'last_updated']} />
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>District</th>
                <th>Active Cases</th>
                <th>Trend</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {(data?.top_districts || []).map((d, i) => (
                <tr key={d.district}>
                  <td style={{ fontWeight: 700, color: '#64748b' }}>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{d.district}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: info.color }}>{d.cases}</span>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: d.trend === 'rising' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                      color: d.trend === 'rising' ? '#fca5a5' : '#6ee7b7',
                    }}>
                      {d.trend === 'rising' ? '↑ Rising' : '↓ Declining'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{d.last_updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Symptoms */}
        <div className="card">
          <div className="card-head">
            <h3 className="card-head-title">🩺 Symptoms</h3>
          </div>
          <div className="card-body">
            {info.symptoms.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: i < info.symptoms.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: info.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention */}
        <div className="card">
          <div className="card-head">
            <h3 className="card-head-title">🛡 Prevention Tips</h3>
          </div>
          <div className="card-body">
            {info.prevention.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: i < info.prevention.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">⚠ Risk Factors</h3>
          <span style={{ fontSize: '0.72rem', color: '#475569' }}>Vector: {info.vector}</span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {info.risk_factors.map((r, i) => (
            <div key={i} style={{
              padding: '8px 16px',
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.15)',
              borderRadius: 20,
              fontSize: '0.8rem',
              color: '#fcd34d',
              fontWeight: 500,
            }}>
              {r}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

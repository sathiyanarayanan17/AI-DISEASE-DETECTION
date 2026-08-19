import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Legend
} from 'recharts';
import {
  Activity, TrendingUp, TrendingDown, AlertTriangle, Shield,
  Calculator, Info, Thermometer, Bug, Droplets, MapPin
} from 'lucide-react';

// Generate 30-day R0 trend data
const generateTrendData = () => {
  const data = [];
  let r0 = 1.6;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    r0 += (Math.random() - 0.52) * 0.15;
    r0 = Math.max(0.4, Math.min(2.5, r0));
    data.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      r0: parseFloat(r0.toFixed(2)),
    });
  }
  return data;
};

const trendData = generateTrendData();
const currentR0 = trendData[trendData.length - 1].r0;

const diseaseR0Data = [
  { name: 'Dengue', r0: 1.8, icon: Bug, color: '#ef4444', cases: 342 },
  { name: 'Cholera', r0: 1.2, icon: Droplets, color: '#f59e0b', cases: 128 },
  { name: 'Malaria', r0: 1.5, icon: Thermometer, color: '#8b5cf6', cases: 256 },
];

const districtR0Data = [
  { district: 'Chennai', r0: 1.6, trend: [1.2, 1.3, 1.5, 1.4, 1.6], status: 'rising' },
  { district: 'Coimbatore', r0: 0.8, trend: [1.1, 1.0, 0.9, 0.85, 0.8], status: 'declining' },
  { district: 'Madurai', r0: 1.3, trend: [1.0, 1.1, 1.2, 1.25, 1.3], status: 'rising' },
  { district: 'Tiruchirappalli', r0: 1.1, trend: [1.3, 1.2, 1.15, 1.1, 1.1], status: 'stable' },
  { district: 'Salem', r0: 0.7, trend: [1.0, 0.9, 0.85, 0.75, 0.7], status: 'declining' },
  { district: 'Tirunelveli', r0: 1.4, trend: [1.1, 1.2, 1.3, 1.35, 1.4], status: 'rising' },
  { district: 'Erode', r0: 0.9, trend: [1.1, 1.05, 1.0, 0.95, 0.9], status: 'declining' },
  { district: 'Vellore', r0: 1.2, trend: [0.9, 1.0, 1.1, 1.15, 1.2], status: 'rising' },
  { district: 'Thanjavur', r0: 0.6, trend: [0.9, 0.8, 0.75, 0.65, 0.6], status: 'declining' },
  { district: 'Kanchipuram', r0: 1.7, trend: [1.3, 1.4, 1.5, 1.6, 1.7], status: 'rising' },
];

function getR0Color(value) {
  if (value >= 1.5) return '#ef4444';
  if (value >= 1.0) return '#f59e0b';
  return '#10b981';
}

function getR0Label(value) {
  if (value >= 1.5) return 'Critical Spread';
  if (value >= 1.0) return 'Active Spread';
  return 'Declining';
}

// Mini sparkline component
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function R0CalculatorPage() {
  const [beta, setBeta] = useState(0.3);
  const [contactRate, setContactRate] = useState(8);
  const [infectiousDays, setInfectiousDays] = useState(6);

  const computedR0 = useMemo(() => {
    return parseFloat((beta * contactRate * infectiousDays).toFixed(2));
  }, [beta, contactRate, infectiousDays]);

  const herdImmunityThreshold = useMemo(() => {
    if (computedR0 <= 1) return 0;
    return parseFloat(((1 - 1 / computedR0) * 100).toFixed(1));
  }, [computedR0]);

  const currentHIT = currentR0 > 1 ? ((1 - 1 / currentR0) * 100).toFixed(1) : 0;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={28} color="#6366f1" />
            R₀/Rₜ Reproduction Number Calculator
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
            Real-time effective reproduction number monitoring across Tamil Nadu districts
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          Live Updated
        </div>
      </div>

      {/* Top Row: Current R0 Gauge + Herd Immunity + Trend Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 260px 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Current R0 Display */}
        <div className="glass-card" style={{ padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: getR0Color(currentR0)
          }} />
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Current Rₜ (Effective)
          </p>
          <div style={{
            fontSize: '3.5rem', fontWeight: 800, color: getR0Color(currentR0),
            fontFamily: 'monospace', lineHeight: 1.1
          }}>
            {currentR0}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            marginTop: '12px', padding: '6px 14px', borderRadius: '20px',
            background: `${getR0Color(currentR0)}20`, color: getR0Color(currentR0),
            fontSize: '0.8rem', fontWeight: 600
          }}>
            {currentR0 >= 1 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {getR0Label(currentR0)}
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
            {currentR0 >= 1
              ? `Each case infects ~${currentR0} others`
              : 'Outbreak is declining'}
          </div>
        </div>

        {/* Herd Immunity Threshold */}
        <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
          <Shield size={24} color="#6366f1" style={{ marginBottom: '8px' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Herd Immunity Threshold
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
            {currentHIT}%
          </div>
          <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '8px 0 0 0' }}>
            Population immunity needed to halt spread
          </p>
          <div style={{
            marginTop: '16px', background: '#1e293b', borderRadius: '8px',
            height: '8px', overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(currentHIT, 100)}%`, height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              borderRadius: '8px', transition: 'width 0.5s ease'
            }} />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '6px' }}>
            Formula: 1 − 1/R₀
          </p>
        </div>

        {/* 30-Day R0 Trend Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="#6366f1" />
            30-Day Rₜ Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="r0Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval={5} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <ReferenceLine y={1} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'R₀=1', fill: '#ef4444', fontSize: 11 }} />
              <Area type="monotone" dataKey="r0" stroke="#6366f1" fill="url(#r0Gradient)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-Disease R0 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {diseaseR0Data.map((disease) => {
          const Icon = disease.icon;
          const color = getR0Color(disease.r0);
          return (
            <div className="glass-card" key={disease.name} style={{ padding: '20px', borderLeft: `3px solid ${disease.color}` }}>
              <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={20} color={disease.color} />
                  <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{disease.name}</span>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                  background: `${color}20`, color: color
                }}>
                  {disease.r0 >= 1 ? 'Spreading' : 'Declining'}
                </span>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: 'monospace' }}>
                  {disease.r0}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>R₀</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                <span>Active cases: {disease.cases}</span>
                <span>HIT: {((1 - 1 / disease.r0) * 100).toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Calculator + Formula */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Interactive Calculator */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="#6366f1" />
            Interactive R₀ Calculator
          </h3>

          {/* Transmission Rate (β) */}
          <div style={{ marginBottom: '18px' }}>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Transmission Rate (β)</label>
              <span className="font-mono" style={{ color: '#e2e8f0', fontWeight: 600 }}>{beta}</span>
            </div>
            <input
              type="range" min="0.01" max="1" step="0.01" value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <div className="flex-between" style={{ fontSize: '0.7rem', color: '#64748b' }}>
              <span>0.01</span><span>1.0</span>
            </div>
          </div>

          {/* Contact Rate (c) */}
          <div style={{ marginBottom: '18px' }}>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Contact Rate (c) — contacts/day</label>
              <span className="font-mono" style={{ color: '#e2e8f0', fontWeight: 600 }}>{contactRate}</span>
            </div>
            <input
              type="range" min="1" max="30" step="1" value={contactRate}
              onChange={(e) => setContactRate(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <div className="flex-between" style={{ fontSize: '0.7rem', color: '#64748b' }}>
              <span>1</span><span>30</span>
            </div>
          </div>

          {/* Infectious Period (D) */}
          <div style={{ marginBottom: '18px' }}>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Infectious Period (D) — days</label>
              <span className="font-mono" style={{ color: '#e2e8f0', fontWeight: 600 }}>{infectiousDays}</span>
            </div>
            <input
              type="range" min="1" max="21" step="1" value={infectiousDays}
              onChange={(e) => setInfectiousDays(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <div className="flex-between" style={{ fontSize: '0.7rem', color: '#64748b' }}>
              <span>1 day</span><span>21 days</span>
            </div>
          </div>

          {/* Computed Result */}
          <div style={{
            background: '#0f172a', borderRadius: '12px', padding: '20px', textAlign: 'center',
            border: `1px solid ${getR0Color(computedR0)}40`
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 4px 0' }}>Computed R₀</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: getR0Color(computedR0), fontFamily: 'monospace' }}>
              {computedR0}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
              Herd Immunity Needed: <strong style={{ color: '#e2e8f0' }}>{herdImmunityThreshold}%</strong>
            </div>
            <div style={{
              marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '16px',
              background: `${getR0Color(computedR0)}15`, color: getR0Color(computedR0),
              fontSize: '0.75rem', fontWeight: 600
            }}>
              {computedR0 >= 1.5 && <><AlertTriangle size={12} /> Epidemic Growth</>}
              {computedR0 >= 1 && computedR0 < 1.5 && <><TrendingUp size={12} /> Sustained Transmission</>}
              {computedR0 < 1 && <><TrendingDown size={12} /> Outbreak Declining</>}
            </div>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} color="#6366f1" />
            R₀ Formula Explanation
          </h3>

          {/* Main Formula */}
          <div style={{
            background: '#0f172a', borderRadius: '12px', padding: '24px', textAlign: 'center',
            marginBottom: '20px', border: '1px solid #334155'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Basic Reproduction Number
            </p>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
              R₀ = β × c × D
            </div>
          </div>

          {/* Parameter Explanations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#1e293b', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#6366f1', fontSize: '1.1rem', minWidth: '20px' }}>β</span>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>Transmission Rate</p>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                  Probability of infection per contact. Depends on pathogen virulence, host immunity, and environmental conditions.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#1e293b', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b', fontSize: '1.1rem', minWidth: '20px' }}>c</span>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>Contact Rate</p>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                  Average number of contacts per person per day. Affected by population density, social behavior, and interventions.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#1e293b', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10b981', fontSize: '1.1rem', minWidth: '20px' }}>D</span>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>Infectious Period</p>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
                  Duration (in days) that an infected individual can transmit the disease. Reduced by early treatment and isolation.
                </p>
              </div>
            </div>
          </div>

          {/* Interpretation Guide */}
          <div style={{ marginTop: '20px', padding: '14px', background: '#1e293b', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 8px 0', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>Interpretation:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ color: '#94a3b8' }}><strong style={{ color: '#ef4444' }}>R₀ {'>'} 1.5</strong> — Rapid epidemic growth, urgent intervention needed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ color: '#94a3b8' }}><strong style={{ color: '#f59e0b' }}>R₀ = 1–1.5</strong> — Sustained transmission, monitoring required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: '#94a3b8' }}><strong style={{ color: '#10b981' }}>R₀ {'<'} 1</strong> — Outbreak declining, containment effective</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District-wise R0 Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="#6366f1" />
          District-wise Rₜ Values
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>District</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Current Rₜ</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Trend (5-day)</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>HIT Required</th>
              </tr>
            </thead>
            <tbody>
              {districtR0Data.map((d) => {
                const color = getR0Color(d.r0);
                const hit = d.r0 > 1 ? ((1 - 1 / d.r0) * 100).toFixed(0) : 0;
                return (
                  <tr key={d.district} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color="#64748b" />
                        {d.district}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span className="font-mono" style={{ fontWeight: 700, color, fontSize: '1rem' }}>{d.r0}</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Sparkline data={d.trend} color={color} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600,
                        background: d.status === 'rising' ? '#ef444420' : d.status === 'declining' ? '#10b98120' : '#f59e0b20',
                        color: d.status === 'rising' ? '#ef4444' : d.status === 'declining' ? '#10b981' : '#f59e0b'
                      }}>
                        {d.status === 'rising' ? '↑ Rising' : d.status === 'declining' ? '↓ Declining' : '→ Stable'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {hit > 0 ? `${hit}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

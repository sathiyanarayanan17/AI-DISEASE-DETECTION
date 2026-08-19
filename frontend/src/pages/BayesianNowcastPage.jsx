import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Activity, TrendingUp, Clock, ShieldCheck, Calendar,
  BarChart3, Info, AlertTriangle
} from 'lucide-react';

const nowcastData = [
  { date: 'Aug 05', reported: 42, estimated: 58, lower: 50, upper: 67 },
  { date: 'Aug 06', reported: 38, estimated: 54, lower: 46, upper: 63 },
  { date: 'Aug 07', reported: 45, estimated: 61, lower: 53, upper: 70 },
  { date: 'Aug 08', reported: 51, estimated: 68, lower: 59, upper: 78 },
  { date: 'Aug 09', reported: 34, estimated: 55, lower: 46, upper: 65 },
  { date: 'Aug 10', reported: 29, estimated: 52, lower: 43, upper: 62 },
  { date: 'Aug 11', reported: 47, estimated: 62, lower: 54, upper: 71 },
  { date: 'Aug 12', reported: 53, estimated: 69, lower: 60, upper: 79 },
  { date: 'Aug 13', reported: 58, estimated: 74, lower: 65, upper: 84 },
  { date: 'Aug 14', reported: 61, estimated: 78, lower: 68, upper: 89 },
  { date: 'Aug 15', reported: 44, estimated: 71, lower: 61, upper: 82 },
  { date: 'Aug 16', reported: 36, estimated: 64, lower: 54, upper: 75 },
  { date: 'Aug 17', reported: 55, estimated: 72, lower: 63, upper: 82 },
  { date: 'Aug 18', reported: 63, estimated: 82, lower: 71, upper: 94 },
  { date: 'Aug 19', reported: 48, estimated: 85, lower: 72, upper: 99 },
];

const delayDistribution = [
  { days: '0', count: 32, pct: 18 },
  { days: '1', count: 54, pct: 30 },
  { days: '2', count: 38, pct: 21 },
  { days: '3', count: 24, pct: 13 },
  { days: '4', count: 15, pct: 8 },
  { days: '5', count: 9, pct: 5 },
  { days: '6', count: 5, pct: 3 },
  { days: '7+', count: 3, pct: 2 },
];

const districtNowcast = [
  { district: 'Chennai', reported: 12, estimated: 19, ratio: 1.58, delay: 2.1 },
  { district: 'Coimbatore', reported: 8, estimated: 13, ratio: 1.63, delay: 2.4 },
  { district: 'Madurai', reported: 6, estimated: 10, ratio: 1.67, delay: 2.8 },
  { district: 'Tiruchirappalli', reported: 5, estimated: 8, ratio: 1.60, delay: 2.3 },
  { district: 'Salem', reported: 4, estimated: 7, ratio: 1.75, delay: 3.1 },
  { district: 'Tirunelveli', reported: 3, estimated: 6, ratio: 2.00, delay: 3.5 },
  { district: 'Erode', reported: 3, estimated: 5, ratio: 1.67, delay: 2.6 },
  { district: 'Vellore', reported: 2, estimated: 5, ratio: 2.50, delay: 3.8 },
  { district: 'Thanjavur', reported: 3, estimated: 5, ratio: 1.67, delay: 2.5 },
  { district: 'Dindigul', reported: 2, estimated: 4, ratio: 2.00, delay: 3.2 },
];

const dayOfWeekFactors = [
  { day: 'Monday', factor: 1.05, avgDelay: 1.8, color: '#10b981' },
  { day: 'Tuesday', factor: 1.02, avgDelay: 1.6, color: '#10b981' },
  { day: 'Wednesday', factor: 1.03, avgDelay: 1.7, color: '#10b981' },
  { day: 'Thursday', factor: 1.04, avgDelay: 1.9, color: '#10b981' },
  { day: 'Friday', factor: 1.12, avgDelay: 2.3, color: '#f59e0b' },
  { day: 'Saturday', factor: 1.45, avgDelay: 3.4, color: '#ef4444' },
  { day: 'Sunday', factor: 1.62, avgDelay: 4.1, color: '#ef4444' },
];

export default function BayesianNowcastPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const stats = [
    {
      label: 'Reported Cases Today',
      value: '48',
      icon: Activity,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Estimated True Cases',
      value: '85',
      icon: TrendingUp,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
    },
    {
      label: 'Reporting Lag (days)',
      value: '2.4',
      icon: Clock,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Confidence Level',
      value: '89%',
      icon: ShieldCheck,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart3 size={32} style={{ color: '#8b5cf6' }} />
          Bayesian Nowcasting
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
          Estimating true case counts by adjusting for reporting delays using Bayesian inference
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
              <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{stat.label}</p>
                  <p className="font-mono" style={{ fontSize: '28px', fontWeight: 700, margin: '4px 0 0', color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{ background: stat.bg, borderRadius: '10px', padding: '10px' }}>
                  <Icon size={22} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nowcast Chart */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: '#8b5cf6' }} />
          Nowcast: Reported vs Estimated True Cases
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={nowcastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEstimated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#colorConfidence)"
              name="Upper Bound (95% CI)"
              fillOpacity={1}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#0f172a"
              name="Lower Bound (95% CI)"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="estimated"
              stroke="#8b5cf6"
              fill="url(#colorEstimated)"
              strokeWidth={2}
              name="Estimated True Cases"
            />
            <Area
              type="monotone"
              dataKey="reported"
              stroke="#3b82f6"
              fill="none"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Reported Cases"
            />
            <ReferenceLine x="Aug 19" stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Today', fill: '#ef4444', fontSize: 11 }} />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>
          Shaded region represents 95% credible interval. Gap between reported and estimated widens near present due to incomplete reporting.
        </p>
      </div>

      {/* Two-column: Delay Distribution + Day-of-Week Factors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Reporting Delay Distribution */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} style={{ color: '#f59e0b' }} />
            Reporting Delay Distribution
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={delayDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="days" stroke="#64748b" fontSize={12} label={{ value: 'Days to Report', position: 'bottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value, name) => [name === 'count' ? `${value} cases` : `${value}%`, name === 'count' ? 'Cases' : 'Percentage']}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="count" />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>
            Median delay: <span className="font-mono" style={{ color: '#f59e0b', fontWeight: 600 }}>1.8 days</span> — 70% of cases reported within 2 days
          </p>
        </div>

        {/* Day-of-Week Adjustment Factors */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: '#10b981' }} />
            Day-of-Week Adjustment Factors
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dayOfWeekFactors.map((item) => (
              <div key={item.day} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '90px', fontSize: '13px', color: '#cbd5e1' }}>{item.day}</span>
                <div style={{ flex: 1, height: '24px', background: 'rgba(148,163,184,0.08)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      width: `${((item.factor - 1) / 0.62) * 100}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: '6px',
                      opacity: 0.7,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span className="font-mono" style={{ fontSize: '13px', color: item.color, width: '45px', textAlign: 'right' }}>
                  ×{item.factor.toFixed(2)}
                </span>
                <span className="font-mono" style={{ fontSize: '12px', color: '#64748b', width: '60px', textAlign: 'right' }}>
                  {item.avgDelay}d avg
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={14} style={{ color: '#ef4444' }} />
              <span style={{ color: '#f87171', fontSize: '12px' }}>
                Weekend reporting lag is 1.5–1.6× higher — nowcast applies larger corrections for Sat/Sun reports
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* District-wise Nowcast Table */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} style={{ color: '#3b82f6' }} />
          District-wise Nowcast Estimates
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.15)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>District</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reported</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ratio</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delay (days)</th>
              </tr>
            </thead>
            <tbody>
              {districtNowcast.map((row, idx) => (
                <tr key={row.district} style={{ borderBottom: '1px solid rgba(148,163,184,0.07)', background: idx % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.02)' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>{row.district}</td>
                  <td className="font-mono" style={{ padding: '12px 16px', textAlign: 'right', color: '#3b82f6' }}>{row.reported}</td>
                  <td className="font-mono" style={{ padding: '12px 16px', textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>{row.estimated}</td>
                  <td className="font-mono" style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{
                      color: row.ratio >= 2 ? '#ef4444' : row.ratio >= 1.6 ? '#f59e0b' : '#10b981',
                      background: row.ratio >= 2 ? 'rgba(239,68,68,0.1)' : row.ratio >= 1.6 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '13px',
                    }}>
                      ×{row.ratio.toFixed(2)}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>{row.delay.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology Panel */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} style={{ color: '#a78bfa' }} />
          Methodology: Bayesian Nowcasting
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Prior */}
          <div style={{ padding: '16px', background: 'rgba(139,92,246,0.05)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.15)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#a78bfa', margin: '0 0 8px' }}>Prior Distribution</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
              Based on historical reporting patterns for each district. Encodes our belief about true case counts
              <em> before</em> observing today's data. Uses negative binomial distribution parameterized by district-specific
              mean delay and overdispersion.
            </p>
            <div className="font-mono" style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '12px', color: '#a78bfa' }}>
              P(N<sub>true</sub>) ~ NegBin(μ<sub>hist</sub>, φ)
            </div>
          </div>

          {/* Likelihood */}
          <div style={{ padding: '16px', background: 'rgba(59,130,246,0.05)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#60a5fa', margin: '0 0 8px' }}>Likelihood Function</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
              Probability of observing today's reported count given the true count and reporting delay distribution.
              Models the fraction of cases reported by day <em>d</em> as a cumulative distribution parameterized by
              day-of-week and district effects.
            </p>
            <div className="font-mono" style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '12px', color: '#60a5fa' }}>
              P(N<sub>obs</sub> | N<sub>true</sub>) ~ Binom(N<sub>true</sub>, p<sub>d</sub>)
            </div>
          </div>

          {/* Posterior */}
          <div style={{ padding: '16px', background: 'rgba(16,185,129,0.05)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#34d399', margin: '0 0 8px' }}>Posterior Estimate</h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
              Combines prior knowledge with observed data via Bayes' theorem. The posterior mean gives our best estimate
              of true cases; the 95% credible interval quantifies uncertainty. Updated daily as more reports arrive.
            </p>
            <div className="font-mono" style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '12px', color: '#34d399' }}>
              P(N<sub>true</sub> | N<sub>obs</sub>) ∝ P(N<sub>obs</sub> | N<sub>true</sub>) · P(N<sub>true</sub>)
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '14px 16px', background: 'rgba(148,163,184,0.05)', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.1)' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
            <strong style={{ color: '#e2e8f0' }}>How it works:</strong> Each day, reported case counts are incomplete due to reporting delays.
            The Bayesian nowcast model estimates the "true" number of cases that have occurred but haven't yet been reported.
            It uses historical delay distributions (stratified by day-of-week and district) as prior information,
            combined with the observed incomplete data, to produce a posterior distribution over true case counts.
            The model automatically applies larger corrections for recent days (where data is most incomplete) and for weekends
            (where reporting is systematically delayed).
          </p>
        </div>
      </div>
    </div>
  );
}

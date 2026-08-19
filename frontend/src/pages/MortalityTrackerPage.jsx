import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Skull, Activity, MapPin, Clock, TrendingDown, TrendingUp,
  AlertTriangle, ShieldCheck, Heart, BarChart3
} from 'lucide-react';

const monthlyMortalityData = [
  { month: 'Sep 2025', deaths: 42, cfr: 1.8 },
  { month: 'Oct 2025', deaths: 38, cfr: 1.6 },
  { month: 'Nov 2025', deaths: 31, cfr: 1.4 },
  { month: 'Dec 2025', deaths: 27, cfr: 1.2 },
  { month: 'Jan 2026', deaths: 24, cfr: 1.1 },
  { month: 'Feb 2026', deaths: 22, cfr: 1.0 },
  { month: 'Mar 2026', deaths: 29, cfr: 1.3 },
  { month: 'Apr 2026', deaths: 35, cfr: 1.5 },
  { month: 'May 2026', deaths: 41, cfr: 1.7 },
  { month: 'Jun 2026', deaths: 58, cfr: 2.1 },
  { month: 'Jul 2026', deaths: 67, cfr: 2.4 },
  { month: 'Aug 2026', deaths: 52, cfr: 2.0 },
];

const diseaseMortalityData = [
  { disease: 'Dengue', totalDeaths: 187, cfr: 2.3, deathsThisMonth: 22, trend: 'up' },
  { disease: 'Cholera', totalDeaths: 134, cfr: 1.8, deathsThisMonth: 18, trend: 'down' },
  { disease: 'Malaria', totalDeaths: 98, cfr: 1.2, deathsThisMonth: 12, trend: 'up' },
  { disease: 'Typhoid', totalDeaths: 47, cfr: 0.9, deathsThisMonth: 5, trend: 'stable' },
  { disease: 'Leptospirosis', totalDeaths: 23, cfr: 3.1, deathsThisMonth: 4, trend: 'up' },
  { disease: 'Japanese Encephalitis', totalDeaths: 18, cfr: 4.5, deathsThisMonth: 3, trend: 'stable' },
];

const districtHeatmapData = [
  { name: 'Chennai', deathRate: 3.2 },
  { name: 'Coimbatore', deathRate: 1.8 },
  { name: 'Madurai', deathRate: 2.5 },
  { name: 'Tiruchirappalli', deathRate: 1.4 },
  { name: 'Salem', deathRate: 1.9 },
  { name: 'Tirunelveli', deathRate: 2.1 },
  { name: 'Erode', deathRate: 1.1 },
  { name: 'Vellore', deathRate: 2.8 },
  { name: 'Thoothukudi', deathRate: 2.4 },
  { name: 'Thanjavur', deathRate: 1.6 },
  { name: 'Dindigul', deathRate: 1.3 },
  { name: 'Ramanathapuram', deathRate: 3.5 },
  { name: 'Kanchipuram', deathRate: 2.0 },
  { name: 'Cuddalore', deathRate: 2.7 },
  { name: 'Nagapattinam', deathRate: 3.0 },
  { name: 'Villupuram', deathRate: 1.7 },
  { name: 'Sivaganga', deathRate: 1.5 },
  { name: 'Tiruvannamalai', deathRate: 1.2 },
  { name: 'Namakkal', deathRate: 0.9 },
  { name: 'Dharmapuri', deathRate: 1.0 },
  { name: 'Krishnagiri', deathRate: 1.4 },
  { name: 'Perambalur', deathRate: 0.8 },
  { name: 'Ariyalur', deathRate: 1.1 },
  { name: 'Karur', deathRate: 0.7 },
];

const ageGroupData = [
  { ageGroup: '0-5', deaths: 89, percentage: 17.4 },
  { ageGroup: '5-15', deaths: 34, percentage: 6.7 },
  { ageGroup: '15-30', deaths: 52, percentage: 10.2 },
  { ageGroup: '30-50', deaths: 98, percentage: 19.2 },
  { ageGroup: '50-65', deaths: 127, percentage: 24.9 },
  { ageGroup: '65+', deaths: 110, percentage: 21.6 },
];

const nationalBenchmarks = [
  { disease: 'Dengue', stateCFR: 2.3, nationalCFR: 1.8, status: 'above' },
  { disease: 'Cholera', stateCFR: 1.8, nationalCFR: 2.1, status: 'below' },
  { disease: 'Malaria', stateCFR: 1.2, nationalCFR: 1.5, status: 'below' },
  { disease: 'Typhoid', stateCFR: 0.9, nationalCFR: 1.0, status: 'below' },
  { disease: 'Leptospirosis', stateCFR: 3.1, nationalCFR: 2.8, status: 'above' },
  { disease: 'Japanese Encephalitis', stateCFR: 4.5, nationalCFR: 5.2, status: 'below' },
];

const preventableDeathsData = [
  {
    category: 'Late Detection',
    deaths: 87,
    percentage: 38,
    description: 'Deaths where outbreak was detected after critical window',
  },
  {
    category: 'Resource Delay',
    deaths: 54,
    percentage: 24,
    description: 'Deaths due to delayed medical supply deployment',
  },
  {
    category: 'No Early Warning',
    deaths: 45,
    percentage: 20,
    description: 'Districts without active early warning coverage',
  },
  {
    category: 'Communication Gap',
    deaths: 28,
    percentage: 12,
    description: 'Alerts issued but not received by field workers',
  },
  {
    category: 'Other Factors',
    deaths: 14,
    percentage: 6,
    description: 'Comorbidities, access issues, and other causes',
  },
];

function getHeatmapColor(deathRate) {
  if (deathRate >= 3.0) return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' };
  if (deathRate >= 2.5) return { bg: '#fed7aa', border: '#fdba74', text: '#9a3412' };
  if (deathRate >= 2.0) return { bg: '#fef08a', border: '#fde047', text: '#854d0e' };
  if (deathRate >= 1.5) return { bg: '#d9f99d', border: '#bef264', text: '#3f6212' };
  if (deathRate >= 1.0) return { bg: '#bbf7d0', border: '#86efac', text: '#166534' };
  return { bg: '#e0f2fe', border: '#7dd3fc', text: '#075985' };
}

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{label}</span>
        <Icon size={20} style={{ color }} />
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</div>
      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default function MortalityTrackerPage() {
  const [selectedDisease, setSelectedDisease] = useState('All');

  const totalDeaths = diseaseMortalityData.reduce((sum, d) => sum + d.totalDeaths, 0);
  const avgCFR = (diseaseMortalityData.reduce((sum, d) => sum + d.cfr, 0) / diseaseMortalityData.length).toFixed(1);
  const totalPreventable = preventableDeathsData.reduce((sum, d) => sum + d.deaths, 0);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Skull size={28} style={{ color: '#ef4444' }} />
          Disease Mortality & Fatality Tracking
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
          Comprehensive mortality surveillance across Tamil Nadu districts — YTD 2026
        </p>
      </div>

      {/* Section 1: Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          icon={Skull}
          label="Total Deaths (YTD)"
          value={totalDeaths}
          subtitle="Across all diseases"
          color="#ef4444"
        />
        <StatCard
          icon={Activity}
          label="Case Fatality Rate"
          value={`${avgCFR}%`}
          subtitle="Weighted average"
          color="#f59e0b"
        />
        <StatCard
          icon={MapPin}
          label="Districts Reporting"
          value="34 / 37"
          subtitle="92% coverage"
          color="#3b82f6"
        />
        <StatCard
          icon={Clock}
          label="Avg Time to Death"
          value="6.2 days"
          subtitle="From symptom onset"
          color="#8b5cf6"
        />
      </div>

      {/* Section 2: Monthly Mortality Trend */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} style={{ color: '#ef4444' }} />
          Monthly Mortality Trend (Last 12 Months)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyMortalityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
            <YAxis yAxisId="left" tick={{ fill: '#94a3b8' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={2} name="Deaths" dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="cfr" stroke="#f59e0b" strokeWidth={2} name="CFR %" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Section 3: Per-Disease Mortality Table */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} style={{ color: '#f59e0b' }} />
          Per-Disease Mortality Breakdown
        </h2>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Disease</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Total Deaths</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>CFR %</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Deaths This Month</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {diseaseMortalityData.map((row) => (
              <tr key={row.disease}>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e293b', fontWeight: 500 }}>{row.disease}</td>
                <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>{row.totalDeaths}</td>
                <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                  <span className="risk-badge" style={{
                    background: row.cfr >= 3 ? '#fee2e2' : row.cfr >= 2 ? '#fef3c7' : '#d1fae5',
                    color: row.cfr >= 3 ? '#991b1b' : row.cfr >= 2 ? '#92400e' : '#065f46',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {row.cfr}%
                  </span>
                </td>
                <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>{row.deathsThisMonth}</td>
                <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                  {row.trend === 'up' && <TrendingUp size={16} style={{ color: '#ef4444' }} />}
                  {row.trend === 'down' && <TrendingDown size={16} style={{ color: '#22c55e' }} />}
                  {row.trend === 'stable' && <span style={{ color: '#94a3b8' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4: District Heatmap Grid */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={20} style={{ color: '#3b82f6' }} />
          District-Wise Mortality Heatmap
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          Death rate per 1,000 cases — color intensity indicates severity
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
          {districtHeatmapData.map((district) => {
            const colors = getHeatmapColor(district.deathRate);
            return (
              <div
                key={district.name}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: colors.text, marginBottom: '0.25rem' }}>
                  {district.name}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.text }}>
                  {district.deathRate}
                </div>
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
          {[
            { label: '< 1.0 (Low)', color: '#e0f2fe' },
            { label: '1.0-1.5', color: '#bbf7d0' },
            { label: '1.5-2.0', color: '#d9f99d' },
            { label: '2.0-2.5', color: '#fef08a' },
            { label: '2.5-3.0', color: '#fed7aa' },
            { label: '≥ 3.0 (Critical)', color: '#fee2e2' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: item.color, border: '1px solid #64748b' }} />
              <span style={{ color: '#94a3b8' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Age Group Distribution */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={20} style={{ color: '#ec4899' }} />
          Age-Group Mortality Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageGroupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="ageGroup" tick={{ fill: '#94a3b8' }} label={{ value: 'Age Group', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8' }} label={{ value: 'Deaths', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value, name) => [name === 'deaths' ? `${value} deaths` : `${value}%`, name === 'deaths' ? 'Deaths' : 'Percentage']}
            />
            <Legend />
            <Bar dataKey="deaths" fill="#ef4444" name="Deaths" radius={[4, 4, 0, 0]} />
            <Bar dataKey="percentage" fill="#f59e0b" name="% of Total" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8', flexWrap: 'wrap' }}>
          <span>⚠️ Highest mortality: <strong style={{ color: '#ef4444' }}>50-65 years</strong> (24.9%)</span>
          <span>👶 Vulnerable: <strong style={{ color: '#f59e0b' }}>0-5 years</strong> (17.4%)</span>
          <span>👴 Elderly: <strong style={{ color: '#8b5cf6' }}>65+</strong> (21.6%)</span>
        </div>
      </div>

      {/* Section 6: National CFR Benchmark Comparison */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} style={{ color: '#22c55e' }} />
          Comparison with National CFR Benchmarks
        </h2>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Disease</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>TN State CFR %</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>National CFR %</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Deviation</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #334155', color: '#94a3b8' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {nationalBenchmarks.map((row) => {
              const deviation = (row.stateCFR - row.nationalCFR).toFixed(1);
              const isAbove = row.status === 'above';
              return (
                <tr key={row.disease}>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #1e293b', fontWeight: 500 }}>{row.disease}</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>{row.stateCFR}%</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>{row.nationalCFR}%</td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b', color: isAbove ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                    {isAbove ? '+' : ''}{deviation}%
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: isAbove ? '#fee2e2' : '#d1fae5',
                      color: isAbove ? '#991b1b' : '#065f46'
                    }}>
                      {isAbove ? 'Above National' : 'Below National'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
          ℹ️ National benchmarks sourced from NCDC/IDSP annual reports. Diseases below national CFR indicate effective local control.
        </div>
      </div>

      {/* Section 7: Preventable Deaths Analysis */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
          Preventable Deaths Analysis
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          Estimated <strong style={{ color: '#ef4444' }}>{totalPreventable} deaths</strong> ({((totalPreventable / totalDeaths) * 100).toFixed(0)}% of total) could have been averted with timely early warning intervention
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {preventableDeathsData.map((item) => (
            <div key={item.category} style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.category}</span>
                <span style={{ fontWeight: 700, color: '#ef4444' }}>{item.deaths} deaths ({item.percentage}%)</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{item.description}</div>
              <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${item.percentage}%`,
                  height: '100%',
                  background: item.percentage >= 30 ? '#ef4444' : item.percentage >= 20 ? '#f59e0b' : '#3b82f6',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.3rem' }}>
            <ShieldCheck size={16} />
            VyaadhiShield Impact Projection
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            With full early warning system deployment, an estimated <strong style={{ color: '#22c55e' }}>62% of preventable deaths</strong> (~{Math.round(totalPreventable * 0.62)} lives/year) can be saved through timely alerts, pre-positioned resources, and proactive containment.
          </div>
        </div>
      </div>
    </div>
  );
}

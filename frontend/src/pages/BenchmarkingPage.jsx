import React, { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  BarChart3, Trophy, TrendingUp, AlertTriangle, Star, Target,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Lightbulb, MapPin
} from 'lucide-react';

const stateComparisonData = [
  { state: 'Tamil Nadu', abbr: 'TN', detectionSpeed: 2.1, responseTime: 4.2, cfr: 0.8, coverage: 94, vaccination: 89, overallScore: 87 },
  { state: 'Karnataka', abbr: 'KA', detectionSpeed: 2.8, responseTime: 5.1, cfr: 1.1, coverage: 91, vaccination: 85, overallScore: 82 },
  { state: 'Kerala', abbr: 'KL', detectionSpeed: 1.6, responseTime: 3.4, cfr: 0.5, coverage: 97, vaccination: 94, overallScore: 93 },
  { state: 'Andhra Pradesh', abbr: 'AP', detectionSpeed: 3.2, responseTime: 5.8, cfr: 1.3, coverage: 88, vaccination: 81, overallScore: 76 },
  { state: 'Maharashtra', abbr: 'MH', detectionSpeed: 2.5, responseTime: 4.8, cfr: 1.0, coverage: 90, vaccination: 83, overallScore: 80 },
  { state: 'Uttar Pradesh', abbr: 'UP', detectionSpeed: 4.5, responseTime: 7.2, cfr: 2.1, coverage: 72, vaccination: 68, overallScore: 61 },
  { state: 'West Bengal', abbr: 'WB', detectionSpeed: 3.8, responseTime: 6.5, cfr: 1.6, coverage: 79, vaccination: 74, overallScore: 70 },
];

const radarData = [
  { metric: 'Detection Speed', tn: 85, nationalAvg: 68, bestState: 95 },
  { metric: 'Response Time', tn: 80, nationalAvg: 62, bestState: 92 },
  { metric: 'Case Fatality Rate', tn: 88, nationalAvg: 70, bestState: 96 },
  { metric: 'Coverage', tn: 94, nationalAvg: 78, bestState: 97 },
  { metric: 'Vaccination', tn: 89, nationalAvg: 74, bestState: 94 },
  { metric: 'Surveillance', tn: 82, nationalAvg: 65, bestState: 91 },
];

const trendData = [
  { month: 'Sep', tn: 78, national: 65 },
  { month: 'Oct', tn: 80, national: 66 },
  { month: 'Nov', tn: 79, national: 64 },
  { month: 'Dec', tn: 82, national: 67 },
  { month: 'Jan', tn: 83, national: 68 },
  { month: 'Feb', tn: 84, national: 69 },
  { month: 'Mar', tn: 85, national: 70 },
  { month: 'Apr', tn: 84, national: 69 },
  { month: 'May', tn: 86, national: 71 },
  { month: 'Jun', tn: 85, national: 70 },
  { month: 'Jul', tn: 87, national: 72 },
  { month: 'Aug', tn: 87, national: 72 },
];

const bestPractices = [
  { state: 'Kerala', practice: 'Community-level micro-surveillance with ASHAs reporting daily via mobile app', impact: 'Reduced detection time to 1.6 days' },
  { state: 'Kerala', practice: 'Integrated lab network with 4-hour turnaround for priority samples', impact: '96% confirmation rate within 24h' },
  { state: 'Maharashtra', practice: 'AI-powered resource pre-positioning during monsoon season', impact: '30% reduction in response time' },
  { state: 'Karnataka', practice: 'Cross-department data sharing protocol with IMD and municipal bodies', impact: 'Real-time environmental risk assessment' },
  { state: 'Kerala', practice: 'Mandatory post-outbreak review with published findings', impact: 'Continuous system improvement loop' },
];

const gapAnalysis = [
  { area: 'Rural Surveillance Coverage', tnScore: 78, bestScore: 95, gap: 17, recommendation: 'Deploy mobile reporting units in 12 underserved taluks with <70% coverage' },
  { area: 'Lab Turnaround Time', tnScore: 72, bestScore: 96, gap: 24, recommendation: 'Establish 5 additional rapid diagnostic centers in tier-2 districts' },
  { area: 'Inter-department Coordination', tnScore: 68, bestScore: 91, gap: 23, recommendation: 'Implement unified data-sharing protocol with IMD, municipal, and veterinary departments' },
  { area: 'Community Engagement', tnScore: 74, bestScore: 94, gap: 20, recommendation: 'Launch citizen health reporter program with incentive-based mobile app' },
  { area: 'Post-Outbreak Analysis', tnScore: 70, bestScore: 92, gap: 22, recommendation: 'Mandate 48-hour post-event review and publish district-level learnings' },
];

export default function BenchmarkingPage() {
  const [selectedMetric, setSelectedMetric] = useState('overallScore');

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getGapSeverity = (gap) => {
    if (gap >= 20) return { color: '#ef4444', label: 'Critical' };
    if (gap >= 15) return { color: '#f59e0b', label: 'Moderate' };
    return { color: '#10b981', label: 'Minor' };
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart3 size={32} style={{ color: '#6366f1' }} />
          State Benchmarking & Comparison
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
          Compare Tamil Nadu's disease surveillance performance against other states and national benchmarks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>States Compared</p>
              <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '4px 0' }}>7</h2>
              <p style={{ color: '#6366f1', fontSize: '12px', margin: 0 }}>Top populous states</p>
            </div>
            <MapPin size={20} style={{ color: '#6366f1' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>TN Rank</p>
              <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '4px 0' }}>#2</h2>
              <p style={{ color: '#10b981', fontSize: '12px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={12} /> Up from #3 last quarter
              </p>
            </div>
            <Trophy size={20} style={{ color: '#f59e0b' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Best Performing Metric</p>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0' }}>Coverage</h2>
              <p style={{ color: '#10b981', fontSize: '12px', margin: 0 }}>94% — 2nd nationally</p>
            </div>
            <Star size={20} style={{ color: '#10b981' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Areas to Improve</p>
              <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '4px 0' }}>3</h2>
              <p style={{ color: '#f59e0b', fontSize: '12px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={12} /> Lab speed, coordination, community
              </p>
            </div>
            <Target size={20} style={{ color: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* State Comparison Table */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} style={{ color: '#6366f1' }} />
          State Performance Comparison
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>State</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Detection Speed (days)</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Response Time (hrs)</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>CFR (%)</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Coverage (%)</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Vaccination (%)</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Overall Score</th>
              </tr>
            </thead>
            <tbody>
              {stateComparisonData
                .sort((a, b) => b.overallScore - a.overallScore)
                .map((row, idx) => (
                  <tr
                    key={row.abbr}
                    style={{
                      borderBottom: '1px solid rgba(148,163,184,0.1)',
                      backgroundColor: row.abbr === 'TN' ? 'rgba(99,102,241,0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: row.abbr === 'TN' ? 700 : 400, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700,
                        backgroundColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7c2f' : 'rgba(148,163,184,0.2)',
                        color: idx < 3 ? '#fff' : '#94a3b8'
                      }}>
                        {idx + 1}
                      </span>
                      {row.state} ({row.abbr})
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.detectionSpeed}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.responseTime}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: row.cfr <= 1.0 ? '#10b981' : '#ef4444' }}>{row.cfr}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.coverage}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.vaccination}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '12px', fontWeight: 600, fontSize: '13px',
                        backgroundColor: `${getScoreColor(row.overallScore)}22`,
                        color: getScoreColor(row.overallScore)
                      }}>
                        {row.overallScore}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Radar Chart */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
            TN vs National Average vs Best State
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(148,163,184,0.2)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Tamil Nadu" dataKey="tn" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="National Avg" dataKey="nationalAvg" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
              <Radar name="Best State (KL)" dataKey="bestState" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Line Chart */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
            TN vs National — 12 Month Trend
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="tn" name="Tamil Nadu" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="national" name="National Average" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Practices Panel */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} style={{ color: '#f59e0b' }} />
          Best Practices from Top-Performing States
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {bestPractices.map((bp, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '14px 16px', borderRadius: '8px',
                backgroundColor: 'rgba(99,102,241,0.04)',
                border: '1px solid rgba(99,102,241,0.1)'
              }}
            >
              <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                    backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1'
                  }}>
                    {bp.state}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{bp.practice}</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#10b981' }}>
                  <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Impact: {bp.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          Gap Analysis & Recommendations
        </h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {gapAnalysis.map((item, idx) => {
            const severity = getGapSeverity(item.gap);
            return (
              <div
                key={idx}
                style={{
                  padding: '16px', borderRadius: '10px',
                  border: `1px solid ${severity.color}33`,
                  backgroundColor: `${severity.color}08`
                }}
              >
                <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{item.area}</h4>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                      backgroundColor: `${severity.color}22`, color: severity.color
                    }}>
                      {severity.label} Gap
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Gap: <strong style={{ color: severity.color }}>{item.gap} pts</strong>
                  </span>
                </div>

                {/* Progress bars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>TN Score</span>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.tnScore}%</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(148,163,184,0.15)' }}>
                      <div style={{ height: '100%', borderRadius: '3px', width: `${item.tnScore}%`, backgroundColor: '#6366f1' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Best State</span>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.bestScore}%</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(148,163,184,0.15)' }}>
                      <div style={{ height: '100%', borderRadius: '3px', width: `${item.bestScore}%`, backgroundColor: '#10b981' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.06)' }}>
                  <Lightbulb size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0' }}>
                    <strong>Recommendation:</strong> {item.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Target, TrendingUp, TrendingDown, Activity, Shield, Clock,
  CheckCircle, Users, Heart, DollarSign, Smile, Zap, AlertTriangle,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';

const overallScore = 78;

const kpiData = [
  { name: 'Detection Speed', value: 2.3, unit: 'days', target: 2.0, icon: Clock, color: '#f59e0b', trend: 'down', change: -0.4 },
  { name: 'Response Time', value: 4.8, unit: 'hours', target: 6.0, icon: Zap, color: '#10b981', trend: 'up', change: -1.2 },
  { name: 'Alert Accuracy', value: 91.2, unit: '%', target: 90, icon: Target, color: '#6366f1', trend: 'up', change: 3.1 },
  { name: 'Coverage', value: 84.5, unit: '%', target: 95, icon: Shield, color: '#3b82f6', trend: 'up', change: 2.8 },
  { name: 'Vaccination Rate', value: 72.3, unit: '%', target: 85, icon: Heart, color: '#ec4899', trend: 'up', change: 5.2 },
  { name: 'Mortality Reduction', value: 34.7, unit: '%', target: 40, icon: Activity, color: '#14b8a6', trend: 'up', change: 4.1 },
  { name: 'Budget Utilization', value: 68.9, unit: '%', target: 80, icon: DollarSign, color: '#f97316', trend: 'down', change: -2.3 },
  { name: 'Citizen Satisfaction', value: 76.4, unit: '%', target: 80, icon: Smile, color: '#8b5cf6', trend: 'up', change: 1.9 },
];

const monthlyTrendData = [
  { month: 'Jan', detection: 3.8, response: 7.2, accuracy: 82, coverage: 74, vaccination: 60 },
  { month: 'Feb', detection: 3.5, response: 6.8, accuracy: 83, coverage: 76, vaccination: 62 },
  { month: 'Mar', detection: 3.2, response: 6.5, accuracy: 85, coverage: 78, vaccination: 64 },
  { month: 'Apr', detection: 3.0, response: 6.1, accuracy: 86, coverage: 79, vaccination: 66 },
  { month: 'May', detection: 2.8, response: 5.8, accuracy: 87, coverage: 80, vaccination: 68 },
  { month: 'Jun', detection: 2.7, response: 5.5, accuracy: 88, coverage: 81, vaccination: 69 },
  { month: 'Jul', detection: 2.5, response: 5.2, accuracy: 89, coverage: 82, vaccination: 70 },
  { month: 'Aug', detection: 2.3, response: 4.8, accuracy: 91, coverage: 84, vaccination: 72 },
];

const districtRankingData = [
  { district: 'Chennai', overall: 88, detection: 92, response: 90, coverage: 89 },
  { district: 'Coimbatore', overall: 85, detection: 88, response: 86, coverage: 84 },
  { district: 'Madurai', overall: 82, detection: 84, response: 80, coverage: 78 },
  { district: 'Tiruchirappalli', overall: 79, detection: 80, response: 76, coverage: 75 },
  { district: 'Salem', overall: 76, detection: 78, response: 74, coverage: 72 },
  { district: 'Thanjavur', overall: 74, detection: 72, response: 70, coverage: 68 },
  { district: 'Vellore', overall: 72, detection: 70, response: 68, coverage: 66 },
  { district: 'Erode', overall: 70, detection: 68, response: 66, coverage: 64 },
  { district: 'Tirunelveli', overall: 68, detection: 66, response: 64, coverage: 62 },
  { district: 'Kancheepuram', overall: 65, detection: 64, response: 62, coverage: 60 },
];

const targetsVsActuals = [
  { kpi: 'Detection', target: 100, actual: 85 },
  { kpi: 'Response', target: 100, actual: 92 },
  { kpi: 'Accuracy', target: 100, actual: 91 },
  { kpi: 'Coverage', target: 100, actual: 84 },
  { kpi: 'Vaccination', target: 100, actual: 72 },
  { kpi: 'Mortality Red.', target: 100, actual: 87 },
  { kpi: 'Budget Util.', target: 100, actual: 69 },
  { kpi: 'Satisfaction', target: 100, actual: 76 },
];

const historicalComparison = [
  { period: 'This Month', score: 78, detection: 2.3, response: 4.8, accuracy: 91.2, coverage: 84.5 },
  { period: 'Last Month', score: 74, detection: 2.5, response: 5.2, accuracy: 89.0, coverage: 82.0 },
  { period: 'Last Year', score: 61, detection: 3.8, response: 7.2, accuracy: 82.0, coverage: 74.0 },
];

const recommendations = [
  { kpi: 'Vaccination Rate', severity: 'high', message: 'Vaccination rate at 72.3% is significantly below 85% target. Prioritize drive scheduling in rural districts.', icon: Heart },
  { kpi: 'Budget Utilization', severity: 'high', message: 'Budget utilization dropped to 68.9%. Review procurement bottlenecks and expedite pending allocations.', icon: DollarSign },
  { kpi: 'Coverage', severity: 'medium', message: 'Coverage at 84.5% vs 95% target. Expand surveillance to underserved districts like Kancheepuram and Tirunelveli.', icon: Shield },
  { kpi: 'Citizen Satisfaction', severity: 'medium', message: 'Satisfaction at 76.4%. Improve response communication and mobile app accessibility.', icon: Smile },
  { kpi: 'Detection Speed', severity: 'low', message: 'Detection at 2.3 days vs 2.0 target. Enhance real-time data ingestion from PHCs for faster detection.', icon: Clock },
];

function CircularGauge({ score, size = 200 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'relative', marginTop: -size * 0.65, textAlign: 'center',
        marginBottom: size * 0.25
      }}>
        <div style={{ fontSize: size * 0.25, fontWeight: 700, color }}>{score}</div>
        <div style={{ fontSize: size * 0.08, color: 'rgba(255,255,255,0.6)' }}>out of 100</div>
      </div>
    </div>
  );
}

function MiniProgressBar({ value, max = 100, color = '#3b82f6' }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-bar-track" style={{ height: 8, borderRadius: 4, width: 80 }}>
      <div
        className="progress-bar-fill"
        style={{
          width: `${pct}%`, height: '100%', borderRadius: 4,
          background: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444',
          transition: 'width 0.5s ease'
        }}
      />
    </div>
  );
}

export default function KPIScorecardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const getTrendIcon = (trend, change) => {
    if (trend === 'up') return <ArrowUp size={14} style={{ color: '#10b981' }} />;
    if (trend === 'down' && change < 0) return <ArrowDown size={14} style={{ color: '#ef4444' }} />;
    return <Minus size={14} style={{ color: '#6b7280' }} />;
  };

  const getSeverityColor = (severity) => {
    if (severity === 'high') return '#ef4444';
    if (severity === 'medium') return '#f59e0b';
    return '#3b82f6';
  };

  const getStatusColor = (value, target, lowerIsBetter = false) => {
    const ratio = lowerIsBetter ? target / value : value / target;
    if (ratio >= 1) return '#10b981';
    if (ratio >= 0.8) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={28} style={{ color: '#6366f1' }} />
            KPI Performance Scorecard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>
            Health system performance metrics — August 2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['weekly', 'monthly', 'quarterly'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: selectedPeriod === p ? '#6366f1' : 'rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 13, fontWeight: 500, textTransform: 'capitalize'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Score + Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Overall Health System Score
          </h3>
          <CircularGauge score={overallScore} size={180} />
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Last Month</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#f59e0b' }}>74</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Last Year</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>61</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Change</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#10b981' }}>+17</div>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid-cols-4" style={{ gap: 12 }}>
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            const isLowerBetter = kpi.name === 'Detection Speed' || kpi.name === 'Response Time';
            const statusColor = getStatusColor(kpi.value, kpi.target, isLowerBetter);
            return (
              <div key={kpi.name} className="glass-card" style={{ padding: 16 }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <Icon size={18} style={{ color: kpi.color }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {getTrendIcon(kpi.trend, kpi.change)}
                    <span style={{ fontSize: 11, color: kpi.change > 0 ? '#10b981' : '#ef4444' }}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change}{kpi.unit === 'days' || kpi.unit === 'hours' ? kpi.unit[0] : '%'}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: statusColor }}>
                  {kpi.value}<span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}> {kpi.unit}</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{kpi.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  Target: {kpi.target}{kpi.unit === 'days' || kpi.unit === 'hours' ? ` ${kpi.unit}` : kpi.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trend + Targets vs Actuals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} style={{ color: '#10b981' }} />
            Monthly KPI Trends
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={false} name="Accuracy %" />
              <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} dot={false} name="Coverage %" />
              <Line type="monotone" dataKey="vaccination" stroke="#ec4899" strokeWidth={2} dot={false} name="Vaccination %" />
              <Line type="monotone" dataKey="detection" stroke="#f59e0b" strokeWidth={2} dot={false} name="Detection (days)" />
              <Line type="monotone" dataKey="response" stroke="#10b981" strokeWidth={2} dot={false} name="Response (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={18} style={{ color: '#f59e0b' }} />
            Targets vs Actuals
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={targetsVsActuals} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.5)" fontSize={11} />
              <YAxis dataKey="kpi" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={90} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="target" fill="rgba(99,102,241,0.3)" name="Target" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" fill="#6366f1" name="Actual" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Ranking Table + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} style={{ color: '#3b82f6' }} />
            District Performance Ranking
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>District</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Overall</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Detection</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Response</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {districtRankingData.map((d, idx) => (
                  <tr key={d.district} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600, color: idx < 3 ? '#10b981' : 'rgba(255,255,255,0.7)' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 500 }}>{d.district}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600 }}>{d.overall}</span>
                        <MiniProgressBar value={d.overall} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span>{d.detection}</span>
                        <MiniProgressBar value={d.detection} color="#6366f1" />
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span>{d.response}</span>
                        <MiniProgressBar value={d.response} color="#10b981" />
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span>{d.coverage}</span>
                        <MiniProgressBar value={d.coverage} color="#3b82f6" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
            Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendations.map((rec, idx) => {
              const Icon = rec.icon;
              return (
                <div
                  key={idx}
                  style={{
                    padding: 14, borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: `3px solid ${getSeverityColor(rec.severity)}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Icon size={14} style={{ color: getSeverityColor(rec.severity) }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: getSeverityColor(rec.severity), textTransform: 'uppercase' }}>
                      {rec.severity} priority
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>{rec.kpi}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    {rec.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Improvement */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} style={{ color: '#14b8a6' }} />
          Historical Improvement Comparison
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {historicalComparison.map((period, idx) => (
            <div
              key={period.period}
              style={{
                padding: 20, borderRadius: 12, textAlign: 'center',
                background: idx === 0 ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                border: idx === 0 ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 500 }}>
                {period.period}
              </div>
              <div style={{
                fontSize: 36, fontWeight: 700, marginBottom: 12,
                color: period.score >= 75 ? '#10b981' : period.score >= 60 ? '#f59e0b' : '#ef4444'
              }}>
                {period.score}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Detection</div>
                  <div style={{ fontWeight: 600 }}>{period.detection}d</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Response</div>
                  <div style={{ fontWeight: 600 }}>{period.response}h</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Accuracy</div>
                  <div style={{ fontWeight: 600 }}>{period.accuracy}%</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Coverage</div>
                  <div style={{ fontWeight: 600 }}>{period.coverage}%</div>
                </div>
              </div>
              {idx === 0 && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <CheckCircle size={14} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 500 }}>Current Period</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: 12, borderRadius: 8,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <TrendingUp size={16} style={{ color: '#10b981' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
            Overall improvement of <strong style={{ color: '#10b981' }}>+17 points</strong> compared to last year.
            Detection speed improved by <strong style={{ color: '#10b981' }}>39%</strong>, response time by <strong style={{ color: '#10b981' }}>33%</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import RiskBadge from '../components/RiskBadge';
import { MOCK_DISTRICTS } from '../services/api';

function riskColor(level) {
  return level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
}

function generateWeeklyData(period) {
  return MOCK_DISTRICTS.map(d => {
    const variance = period === 'last_week' ? -5 : period === 'last_month' ? -10 : 0;
    const prevScore = Math.max(0, Math.min(100, d.risk_score + variance + Math.round((Math.random() - 0.5) * 15)));
    const change = d.risk_score - prevScore;
    const trend = change > 3 ? 'up' : change < -3 ? 'down' : 'stable';
    return {
      ...d,
      prevScore,
      change,
      trend,
    };
  }).sort((a, b) => b.risk_score - a.risk_score);
}

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 60;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function getMedal(rank) {
  if (rank === 1) return '#1';
  if (rank === 2) return '#2';
  if (rank === 3) return '#3';
  if (rank === 4) return '4';
  if (rank === 5) return '5';
  return '';
}

export default function DistrictRanking() {
  const [period, setPeriod] = useState('this_week');
  const rankings = useMemo(() => generateWeeklyData(period), [period]);
  const top10 = rankings.slice(0, 10);

  const chartData = top10.map(d => ({
    name: d.district.length > 10 ? d.district.slice(0, 10) + '...' : d.district,
    score: d.risk_score,
    level: d.risk_level,
  }));

  return (
    <div>
      {/* Period Filter */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">District Risk Rankings</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'this_week', label: 'This Week' },
              { key: 'last_week', label: 'Last Week' },
              { key: 'last_month', label: 'Last Month' },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: period === p.key ? '#6366f1' : 'rgba(0,0,0,0.1)',
                  background: period === p.key ? 'rgba(99,102,241,0.08)' : 'transparent',
                  color: period === p.key ? '#6366f1' : '#64748b',
                  fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Bar Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Top 10 Districts by Risk Score</h3>
        </div>
        <div className="card-body" style={{ padding: '16px 16px 8px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-20} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={riskColor(entry.level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Ranking Table */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Full Leaderboard</h3>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{rankings.length} districts</span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>District</th>
                <th>Risk Level</th>
                <th>Score</th>
                <th>Trend</th>
                <th>W-o-W Change</th>
                <th>7-Day Trend</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((d, i) => {
                const rank = i + 1;
                const sparkData = Array.from({ length: 7 }, (_, j) =>
                  Math.max(0, Math.min(100, d.risk_score + (Math.random() - 0.5) * 20 - (6 - j) * (d.trend === 'up' ? 2 : d.trend === 'down' ? -2 : 0)))
                );
                return (
                  <tr key={d.district} style={{ background: rank <= 5 ? 'rgba(239,68,68,0.02)' : 'transparent' }}>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: rank <= 5 ? '1rem' : '0.85rem' }}>
                        {rank <= 5 ? getMedal(rank) : rank}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{d.district}</td>
                    <td><RiskBadge level={d.risk_level} /></td>
                    <td>
                      <span style={{ fontWeight: 700, color: riskColor(d.risk_level) }}>{d.risk_score}</span>
                    </td>
                    <td style={{ fontSize: '1.1rem' }}>
                      {d.trend === 'up' && <span style={{ color: '#ef4444' }}>&#8593;</span>}
                      {d.trend === 'down' && <span style={{ color: '#10b981' }}>&#8595;</span>}
                      {d.trend === 'stable' && <span style={{ color: '#94a3b8' }}>&#8594;</span>}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 600, fontSize: '0.82rem',
                        color: d.change > 0 ? '#ef4444' : d.change < 0 ? '#10b981' : '#94a3b8'
                      }}>
                        {d.change > 0 ? '+' : ''}{d.change}
                      </span>
                    </td>
                    <td>
                      <Sparkline data={sparkData} color={riskColor(d.risk_level)} />
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

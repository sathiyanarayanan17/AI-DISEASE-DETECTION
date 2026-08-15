import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Medal,
  Calendar
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';
import Sparkline from '../components/common/Sparkline';
import ExportButton from '../components/common/ExportButton';

export const DistrictRankingPage = () => {
  const [period, setPeriod] = useState('week'); // 'week' | 'last_week' | 'month'

  const rankedDistricts = [...DISTRICTS_DATA].sort((a, b) => b.riskScore - a.riskScore);
  const top5 = rankedDistricts.slice(0, 5);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span style={{ background: '#eab308', color: '#000000', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '11px' }}>#1 GOLD</span>;
    if (rank === 2) return <span style={{ background: '#94a3b8', color: '#000000', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '11px' }}>#2 SILVER</span>;
    if (rank === 3) return <span style={{ background: '#d97706', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '11px' }}>#3 BRONZE</span>;
    return <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{rank}</span>;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp size={14} className="text-rose-500" />;
    if (trend === 'decreasing') return <TrendingDown size={14} className="text-emerald-500" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Period Filter */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} className="text-amber-400" />
            <span>District Outbreak Severity Leaderboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Comparative ranking of all 37 districts by composite vector contagion vulnerability.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setPeriod('week')}
              className={`btn text-xs ${period === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('last_week')}
              className={`btn text-xs ${period === 'last_week' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Last Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`btn text-xs ${period === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Last Month
            </button>
          </div>

          <ExportButton data={rankedDistricts} filename="tn_district_rankings" label="Export Leaderboard" />
        </div>
      </div>

      {/* 2. Top 5 Spotlight Medals Grid */}
      <div>
        <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Top 5 Outbreak Vulnerability Hotspots</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {top5.map((d, index) => (
            <div
              key={d.id}
              className="glass-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: `4px solid ${index === 0 ? '#eab308' : (index === 1 ? '#94a3b8' : (index === 2 ? '#d97706' : 'var(--risk-high)'))}`
              }}
            >
              <div className="flex-between">
                {getRankBadge(index + 1)}
                <RiskBadge level={d.riskLevel} size="sm" showIcon={false} />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{d.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.tamilName}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--risk-high)' }}>
                  {d.riskScore}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {d.totalCases7d} Cases (7d)
                </span>
              </div>

              <div className="flex-between" style={{ paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                <Sparkline data={d.history30d.slice(-10)} width={70} height={20} color="#f43f5e" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {getTrendIcon(d.trend)} {d.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Comprehensive Leaderboard Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Complete 37-District Rank Table</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>District</th>
                <th>Risk Score</th>
                <th>Risk Classification</th>
                <th>Weekly Trend</th>
                <th>7-Day Case Volume</th>
                <th>Monsoon Rainfall</th>
                <th>Confidence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rankedDistricts.map((dist, idx) => (
                <tr key={dist.id}>
                  <td>{getRankBadge(idx + 1)}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{dist.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dist.tamilName}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                      {dist.riskScore} / 100
                    </span>
                  </td>
                  <td>
                    <RiskBadge level={dist.riskLevel} score={dist.riskScore} size="sm" />
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: dist.trend === 'increasing' ? 'var(--risk-high)' : 'var(--text-secondary)' }}>
                      {getTrendIcon(dist.trend)}
                      <span>{dist.change}</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{dist.totalCases7d}</span>
                  </td>
                  <td>{dist.weather.rainfall} mm</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{dist.confidence}%</span>
                  </td>
                  <td>
                    <Link to={`/district/${dist.name.toLowerCase()}`} className="btn btn-secondary text-xs" style={{ padding: '4px 8px' }}>
                      <span>View</span>
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DistrictRankingPage;

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Activity,
  ShieldAlert,
  Search,
  ArrowUpDown,
  ExternalLink,
  Droplets,
  Thermometer,
  Wind
} from 'lucide-react';
import { DISTRICTS_DATA, getHighRiskDistricts, getMediumRiskDistricts, getLowRiskDistricts } from '../data/districtsData';
import TamilNaduMap from '../components/maps/TamilNaduMap';
import RiskBadge from '../components/common/RiskBadge';
import ExportButton from '../components/common/ExportButton';
import Sparkline from '../components/common/Sparkline';

export const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');

  const highRisk = getHighRiskDistricts();
  const mediumRisk = getMediumRiskDistricts();
  const lowRisk = getLowRiskDistricts();

  // Disease totals for pie chart
  const diseaseTotals = useMemo(() => {
    let dengue = 0;
    let cholera = 0;
    let malaria = 0;

    DISTRICTS_DATA.forEach((d) => {
      dengue += d.dengueCases;
      cholera += d.choleraCases;
      malaria += d.malariaCases;
    });

    return [
      { name: 'Dengue Fever', value: dengue, color: '#f43f5e' },
      { name: 'Cholera Outbreak', value: cholera, color: '#06b6d4' },
      { name: 'Malaria Surveillance', value: malaria, color: '#10b981' }
    ];
  }, []);

  const totalCasesStatewide = useMemo(() => {
    return diseaseTotals.reduce((acc, curr) => acc + curr.value, 0);
  }, [diseaseTotals]);

  // Filter and sort districts
  const processedDistricts = useMemo(() => {
    return DISTRICTS_DATA
      .filter((d) => {
        const matchesQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             d.tamilName.includes(searchQuery);
        const matchesLevel = filterLevel === 'all' || d.riskLevel === filterLevel;
        return matchesQuery && matchesLevel;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === 'rainfall') {
          valA = a.weather.rainfall;
          valB = b.weather.rainfall;
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [searchQuery, sortField, sortAsc, filterLevel]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. TOP HEADER & EXPORT */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={24} className="text-indigo-500" />
            <span>Tamil Nadu Outbreak Surveillance Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Real-time XGBoost ML surveillance across 37 districts and union territory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ExportButton data={DISTRICTS_DATA} filename="tn_outbreak_surveillance" label="Export Districts CSV" />
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Districts Monitored
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>37</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>100% Online</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            All Tamil Nadu administrative divisions
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--risk-high)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot high" />
            <span>High Risk Outbreaks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>
              {highRisk.length}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--risk-high)', fontWeight: 600 }}>Action Required</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Scores greater than or equal to 70/100
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--risk-medium)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot medium" />
            <span>Medium Warning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--risk-medium)', fontFamily: 'var(--font-mono)' }}>
              {mediumRisk.length}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--risk-medium)', fontWeight: 600 }}>Surveillance</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Scores between 40 and 69/100
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot low" />
            <span>Model Confidence</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              97.4%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>XGBoost v2.4</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            F1-Score 97.2% | ROC-AUC 99.8%
          </div>
        </div>
      </div>

      {/* 3. MAP & DISEASE PIE SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px' }} className="grid-cols-2">
        {/* Interactive Map */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} className="text-indigo-400" />
              <h2 style={{ fontSize: '16px' }}>Tamil Nadu Outbreak Map</h2>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Center [10.8, 78.5] Zoom 7
            </div>
          </div>

          <div style={{ height: '480px', width: '100%' }}>
            <TamilNaduMap height="100%" />
          </div>
        </div>

        {/* Disease Breakdown Pie */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="flex-between">
            <h2 style={{ fontSize: '16px' }}>Statewide Disease Breakdown</h2>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
              {totalCasesStatewide.toLocaleString()} Total Cases
            </span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseTotals}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diseaseTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-strong)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Disease breakdown details cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {diseaseTotals.map((dis) => (
              <div
                key={dis.name}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: dis.color }} />
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{dis.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                    {dis.value.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({Math.round((dis.value / totalCasesStatewide) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SORTABLE DISTRICT MONITORING TABLE */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex-between flex-wrap gap-4">
          <div>
            <h2 style={{ fontSize: '16px' }}>District Risk & Surveillance Register</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {processedDistricts.length} of 37 districts
            </div>
          </div>

          {/* Filter and Search controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter district name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-control text-xs"
                style={{ paddingLeft: '32px' }}
              />
            </div>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="input-control input-select text-xs"
              style={{ width: '130px' }}
            >
              <option value="all">All Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>District</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('riskScore')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Risk Score</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Risk Level</th>
                <th onClick={() => handleSort('totalCases7d')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>7-Day Cases</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('rainfall')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Rainfall</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Confidence</th>
                <th>30-Day Trend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {processedDistricts.map((dist) => (
                <tr key={dist.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dist.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dist.tamilName}</div>
                  </td>

                  <td style={{ minWidth: '150px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', minWidth: '24px' }}>
                        {dist.riskScore}
                      </span>
                      <div className="progress-bar-track">
                        <div
                          className={`progress-bar-fill ${dist.riskLevel}`}
                          style={{ width: `${dist.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <RiskBadge level={dist.riskLevel} score={dist.riskScore} size="sm" />
                  </td>

                  <td>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{dist.totalCases7d}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>cases</span>
                  </td>

                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                      <Droplets size={12} className="text-cyan-400" />
                      <span>{dist.weather.rainfall} mm</span>
                    </span>
                  </td>

                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                      {dist.confidence}%
                    </span>
                  </td>

                  <td>
                    <Sparkline
                      data={dist.history30d.slice(-10)}
                      width={80}
                      height={20}
                      color={dist.riskLevel === 'high' ? '#f43f5e' : (dist.riskLevel === 'medium' ? '#f59e0b' : '#10b981')}
                    />
                  </td>

                  <td>
                    <Link
                      to={`/district/${dist.name.toLowerCase()}`}
                      className="btn btn-secondary text-xs"
                      style={{ padding: '4px 8px' }}
                    >
                      <span>Deep Dive</span>
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

export default DashboardPage;

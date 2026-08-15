import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  ArrowLeft,
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  ShieldAlert,
  Users,
  Activity,
  Sliders,
  FileText
} from 'lucide-react';
import { getDistrictByName } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';
import ExportButton from '../components/common/ExportButton';

export const DistrictDetailPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const district = getDistrictByName(name || 'Chennai');

  const historyData = district.history30d || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Navigation & District Meta */}
      <div className="flex-between flex-wrap gap-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-icon"
            title="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px' }}>{district.name}</h1>
              <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>({district.tamilName})</span>
              <RiskBadge level={district.riskLevel} score={district.riskScore} size="md" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} className="text-indigo-400" />
                <span>Tamil Nadu, India | [{district.coordinates[0]}, {district.coordinates[1]}]</span>
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} className="text-slate-400" />
                <span>Pop: {district.population.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            to={`/what-if?district=${district.name}`}
            className="btn btn-primary text-xs"
          >
            <Sliders size={14} />
            <span>Simulate Climate Impact</span>
          </Link>
          <ExportButton data={historyData} filename={`${district.name}_30d_history`} label="Export 30-Day CSV" />
        </div>
      </div>

      {/* 2. Three Primary Stat Cards */}
      <div className="grid-cols-3">
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Risk Index
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: district.riskLevel === 'high' ? 'var(--risk-high)' : 'var(--accent-primary)' }}>
              {district.riskScore}/100
            </span>
            <RiskBadge level={district.riskLevel} showIcon={false} size="sm" />
          </div>
          <div className="progress-bar-track" style={{ marginTop: '4px' }}>
            <div className={`progress-bar-fill ${district.riskLevel}`} style={{ width: `${district.riskScore}%` }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            XGBoost ML model confidence: <strong>{district.confidence}%</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            7-Day Clinical Cases
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {district.totalCases7d}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--risk-high)' }}>
              {district.change} this week
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            <span>Dengue: <strong>{district.dengueCases}</strong></span>
            <span>Cholera: <strong>{district.choleraCases}</strong></span>
            <span>Malaria: <strong>{district.malariaCases}</strong></span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} className="text-indigo-400" />
            <span>AI Public Health Recommendation</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5, background: 'var(--bg-input)', padding: '10px 12px', borderRadius: '8px', flex: 1 }}>
            {district.recommendation}
          </p>
        </div>
      </div>

      {/* 3. Weather Micro-Climate Telemetry */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Meteorological Sensor Readings
        </div>
        <div className="grid-cols-4">
          <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Droplets size={24} className="text-cyan-400" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rainfall (7d Cumulative)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{district.weather.rainfall} mm</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Thermometer size={24} className="text-amber-400" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mean Temperature</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{district.weather.temperature} °C</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wind size={24} className="text-indigo-400" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Relative Humidity</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{district.weather.humidity} %</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={24} className="text-emerald-400" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Wind Velocity</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{district.weather.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 30-DAY RISK AREA CHART */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>30-Day Outbreak Risk Trajectory</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Historical XGBoost risk index with warning (40) and epidemic (70) thresholds.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
            <span style={{ color: '#f43f5e' }}>--- Threshold High (70)</span>
            <span style={{ color: '#f59e0b' }}>--- Threshold Warning (40)</span>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="shortDate" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" />
              <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="riskScore"
                name="Risk Score"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#riskGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. 30-DAY CASES BREAKDOWN BAR CHART */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>30-Day Disease Case Volume</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Stacked daily reports for Dengue, Cholera, and Malaria.
            </p>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="shortDate" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              <Bar dataKey="dengue" name="Dengue" stackId="a" fill="#f43f5e" />
              <Bar dataKey="cholera" name="Cholera" stackId="a" fill="#06b6d4" />
              <Bar dataKey="malaria" name="Malaria" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DistrictDetailPage;

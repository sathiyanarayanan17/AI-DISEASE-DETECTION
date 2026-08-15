import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  Calendar,
  ShieldAlert,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName } from '../data/districtsData';
import { api } from '../services/api';
import RiskBadge from '../components/common/RiskBadge';

export const ForecastPage = () => {
  const [selectedDistrictName, setSelectedDistrictName] = useState('Chennai');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      const res = await api.getForecast(selectedDistrictName, 7);
      setForecastData(res);
      setLoading(false);
    };
    fetchForecast();
  }, [selectedDistrictName]);

  const district = getDistrictByName(selectedDistrictName);
  const forecastList = forecastData?.forecast || [];
  const hasOutbreakAlert = forecastList.some((d) => d.riskScore >= 70);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & District Selector */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} className="text-cyan-400" />
            <span>7-Day Predictive Outbreak Forecast</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Ensemble multi-horizon time-series forecasting with 95% confidence interval bands.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target District:</span>
          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            className="input-control input-select"
            style={{ width: '220px', fontWeight: 600 }}
          >
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.tamilName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Critical Alert Banner if risk > 70% */}
      {hasOutbreakAlert && (
        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--risk-high-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 0 20px var(--risk-high-glow)'
          }}
        >
          <AlertTriangle size={28} className="text-rose-500" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--risk-high)' }}>
              Outbreak Threshold Exceeded (Projected Risk greater than or equal to 70%)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Meteorological models predict high precipitation over {district.name} causing rapid vector breeding. Recommended immediate larvicide deployment.
            </div>
          </div>
        </div>
      )}

      {/* 3. 7-Day Area Chart with Confidence Bands */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>{district.name}: 7-Day Risk Trajectory & Bounds</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Solid line indicates point estimate; shaded ribbon represents 95% confidence variance bounds.
            </p>
          </div>
          <RiskBadge level={district.riskLevel} score={district.riskScore} />
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Epidemic Risk (70)", fill: "#f43f5e", fontSize: 11 }} />
              <Area type="monotone" dataKey="upperBound" name="Upper Confidence Band" stroke="transparent" fill="#6366f1" fillOpacity={0.15} />
              <Area type="monotone" dataKey="lowerBound" name="Lower Confidence Band" stroke="transparent" fill="#6366f1" fillOpacity={0.0} />
              <Area type="monotone" dataKey="riskScore" name="Predicted Outbreak Score" stroke="#06b6d4" strokeWidth={3} fill="url(#forecastGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Daily Weather & Risk Cards */}
      <div>
        <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Day-by-Day Forecast Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {forecastList.map((day, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: `4px solid ${day.riskScore >= 70 ? 'var(--risk-high)' : (day.riskScore >= 40 ? 'var(--risk-medium)' : 'var(--risk-low)')}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{day.day}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{day.date}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {day.riskScore}
                </span>
                <RiskBadge level={day.riskScore >= 70 ? 'high' : (day.riskScore >= 40 ? 'medium' : 'low')} size="sm" showIcon={false} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={12} className="text-cyan-400" /> Rain: <strong>{day.rainfall} mm</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={12} className="text-amber-400" /> Temp: <strong>{day.temperature} °C</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={12} className="text-indigo-400" /> Hum: <strong>{day.humidity} %</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;

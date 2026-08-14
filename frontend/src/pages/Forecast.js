import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getForecast, DISTRICT_COORDS } from '../services/api';

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tt-val" style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }); }
  catch { return iso; }
}

const WEATHER_ICONS = {
  'Sunny': 'Sun',
  'Partly Cloudy': 'P.Cloud',
  'Rainy': 'Rain',
  'Overcast': 'Cloud',
  'Thunderstorm': 'Storm',
};

export default function Forecast() {
  const [district, setDistrict] = useState('Chennai');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const districts = Object.keys(DISTRICT_COORDS);

  useEffect(() => {
    setLoading(true);
    getForecast(district)
      .then(d => setForecast(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [district]);

  const chartData = forecast.map(d => ({
    ...d,
    dl: fmtDate(d.date),
  }));

  // Detect rising trend
  const isRising = forecast.length >= 3 &&
    forecast[forecast.length - 1].risk_score > forecast[0].risk_score + 10;
  const peakDay = forecast.reduce((max, d) => d.risk_score > max.risk_score ? d : max, forecast[0] || {});
  const daysToOutbreak = isRising ? Math.max(1, forecast.findIndex(d => d.risk_score >= 70) + 1) : null;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          7-Day Risk Forecast
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          AI-powered disease risk prediction for the upcoming week
        </p>
      </div>

      {/* District Selector */}
      <div style={{ marginBottom: 24 }}>
        <select
          value={district}
          onChange={e => setDistrict(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '10px 18px',
            color: '#f1f5f9',
            fontSize: '0.88rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            outline: 'none',
            minWidth: 220,
          }}
        >
          {districts.map(d => (
            <option key={d} value={d} style={{ background: '#111827' }}>{d}</option>
          ))}
        </select>
      </div>

      {/* Outbreak Alert */}
      {isRising && daysToOutbreak && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12,
          padding: '16px 22px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{ fontSize: '1.8rem', color: '#ef4444', fontWeight: 700 }}>ALERT</span>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>
              AI Predicts Potential Outbreak in {daysToOutbreak} Day{daysToOutbreak > 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Risk score trending upward for {district}. Peak predicted score: {peakDay?.risk_score?.toFixed(0)}/100. 
              Recommend activating enhanced surveillance protocols.
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spin-wrap">
          <div className="spinner" />
          <span>Generating forecast...</span>
        </div>
      ) : (
        <>
          {/* Forecast Chart with Confidence Bands */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-head">
              <h3 className="card-head-title">Risk Score Forecast - {district}</h3>
              <span style={{ fontSize: '0.72rem', color: '#475569' }}>With confidence intervals</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dl" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<Tip />} />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'High Risk', fill: '#fca5a5', fontSize: 10 }} />
                  <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Medium', fill: '#fcd34d', fontSize: 10 }} />
                  <Area type="monotone" dataKey="confidence_high" name="Upper Bound" stroke="none" fill="url(#confGrad)" />
                  <Area type="monotone" dataKey="confidence_low" name="Lower Bound" stroke="none" fill="transparent" />
                  <Area type="monotone" dataKey="risk_score" name="Predicted Risk" stroke="#60a5fa" strokeWidth={2.5} fill="url(#forecastGrad)" dot={{ r: 5, fill: '#60a5fa', strokeWidth: 0 }} activeDot={{ r: 7 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weather Forecast Cards */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-head">
              <h3 className="card-head-title">Weather Forecast</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
                {forecast.map((day, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '16px 10px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#475569', marginBottom: 8, fontWeight: 600 }}>
                      {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>
                      {WEATHER_ICONS[day.weather_condition] || 'Fair'}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                      {day.temperature}°
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      {day.rainfall} mm
                    </div>
                    <div style={{
                      marginTop: 8,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: day.risk_score >= 70 ? '#fca5a5' : day.risk_score >= 40 ? '#fcd34d' : '#6ee7b7',
                    }}>
                      Risk: {day.risk_score.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="detail-stats">
            <div className="ds-card">
              <div className="ds-lbl">Avg Predicted Risk</div>
              <div className="ds-val" style={{ color: '#93c5fd' }}>
                {(forecast.reduce((s, d) => s + d.risk_score, 0) / forecast.length).toFixed(0)}
              </div>
              <div className="ds-unit">out of 100</div>
            </div>
            <div className="ds-card">
              <div className="ds-lbl">Peak Risk Day</div>
              <div className="ds-val" style={{ color: '#fca5a5', fontSize: '1.2rem' }}>
                {peakDay?.date ? fmtDate(peakDay.date) : '--'}
              </div>
              <div className="ds-unit">Score: {peakDay?.risk_score?.toFixed(0)}</div>
            </div>
            <div className="ds-card">
              <div className="ds-lbl">Trend Direction</div>
              <div className="ds-val" style={{ color: isRising ? '#fca5a5' : '#6ee7b7' }}>
                {isRising ? 'Rising' : 'Stable'}
              </div>
              <div className="ds-unit">7-day outlook</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

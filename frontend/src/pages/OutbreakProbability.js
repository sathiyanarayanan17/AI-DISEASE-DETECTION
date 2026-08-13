import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RiskBadge from '../components/RiskBadge';
import { MOCK_DISTRICTS } from '../services/api';

const DISTRICTS = MOCK_DISTRICTS.map(d => d.district);

function generateProbabilityData(district) {
  const snap = MOCK_DISTRICTS.find(d => d.district === district);
  const baseScore = snap ? snap.risk_score : 50;
  const data = [];

  for (let day = 1; day <= 14; day++) {
    // Declining probability curve from current risk score
    const decay = Math.exp(-0.08 * day);
    const probability = Math.min(100, Math.max(5, baseScore * decay + (Math.random() - 0.5) * 10));
    const confidenceLow = Math.max(0, probability - 8 - Math.random() * 5);
    const confidenceHigh = Math.min(100, probability + 8 + Math.random() * 5);

    data.push({
      day: `Day ${day}`,
      dayNum: day,
      probability: parseFloat(probability.toFixed(1)),
      confidenceLow: parseFloat(confidenceLow.toFixed(1)),
      confidenceHigh: parseFloat(confidenceHigh.toFixed(1)),
    });
  }
  return data;
}

function getContributingFactors(district) {
  const factors = [
    { feature: 'Rainfall (7-day cumulative)', contribution: 0.34, direction: 'increases' },
    { feature: 'Humidity above 80%', contribution: 0.28, direction: 'increases' },
    { feature: 'Stagnant water reports', contribution: 0.19, direction: 'increases' },
    { feature: 'Temperature above 35C', contribution: 0.12, direction: 'increases' },
    { feature: 'Vaccination coverage', contribution: 0.07, direction: 'decreases' },
  ];
  return factors.slice(0, 3);
}

export default function OutbreakProbability() {
  const [district, setDistrict] = useState('Chennai');
  const [probData, setProbData] = useState([]);
  const [factors, setFactors] = useState([]);

  useEffect(() => {
    const data = generateProbabilityData(district);
    setProbData(data);
    setFactors(getContributingFactors(district));
  }, [district]);

  const peakProb = probData.length > 0 ? Math.max(...probData.map(d => d.probability)) : 0;
  const highProbDay = probData.find(d => d.probability > 70);
  const showAlert = peakProb > 70;

  return (
    <div>
      {/* Alert Banner */}
      {showAlert && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: '1.3rem' }}>🚨</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ef4444' }}>
              HIGH PROBABILITY: {peakProb.toFixed(0)}% chance of outbreak in {district} within {highProbDay ? highProbDay.dayNum : 5} days
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
              Immediate preventive action recommended. Alert district health officer.
            </div>
          </div>
        </div>
      )}

      {/* District Selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Outbreak Probability Timeline</h3>
        </div>
        <div className="card-body" style={{ padding: '16px 24px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 8 }}>
            Select District
          </label>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            style={{
              width: '100%', maxWidth: 320, padding: '10px 14px', borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem', color: '#1e293b',
              background: '#f8fafc', outline: 'none'
            }}
          >
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Probability Chart with Confidence Interval */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">14-Day Outbreak Probability - {district}</h3>
          <div style={{ display: 'flex', gap: 14, fontSize: '0.72rem', fontWeight: 600 }}>
            <span style={{ color: '#6366f1' }}>Probability</span>
            <span style={{ color: 'rgba(99,102,241,0.3)' }}>Confidence Band</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: '16px 16px 8px' }}>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={probData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
                formatter={(value) => [`${value}%`]}
              />
              <Area
                type="monotone" dataKey="confidenceHigh" stackId="1"
                stroke="none" fill="rgba(99,102,241,0.1)"
              />
              <Area
                type="monotone" dataKey="confidenceLow" stackId="1"
                stroke="none" fill="#fff"
              />
              <Line
                type="monotone" dataKey="probability" stroke="#6366f1"
                strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }}
              />
              {/* 70% threshold line */}
              <Line
                type="monotone"
                dataKey={() => 70}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Threshold"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            Red dashed line = 70% alert threshold
          </div>
        </div>
      </div>

      {/* Contributing Factors */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Top Contributing Factors</h3>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          {factors.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
              borderBottom: i < factors.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(99,102,241,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.82rem', color: '#6366f1'
              }}>
                #{i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{f.feature}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {f.direction === 'increases' ? 'Increases' : 'Decreases'} outbreak probability
                </div>
              </div>
              <div style={{
                background: 'rgba(99,102,241,0.08)', borderRadius: 8,
                padding: '4px 10px', fontWeight: 700, fontSize: '0.82rem', color: '#6366f1'
              }}>
                {(f.contribution * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">📊</div>
          <div>
            <div className="stat-num" style={{ color: peakProb > 70 ? '#ef4444' : '#f59e0b' }}>{peakProb.toFixed(0)}%</div>
            <div className="stat-lbl">Peak Probability</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📅</div>
          <div>
            <div className="stat-num">Day 1</div>
            <div className="stat-lbl">Highest Risk Day</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">🎯</div>
          <div>
            <div className="stat-num">87%</div>
            <div className="stat-lbl">Model Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import RiskBadge from '../components/RiskBadge';
import { predictDistrict, MOCK_DISTRICTS } from '../services/api';

const DISTRICTS = MOCK_DISTRICTS.map(d => d.district);

function riskColor(level) {
  return level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
}

export default function WhatIfSimulator() {
  const [district, setDistrict] = useState('Chennai');
  const [rainfall, setRainfall] = useState(50);
  const [temperature, setTemperature] = useState(32);
  const [humidity, setHumidity] = useState(70);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [baseline, setBaseline] = useState(null);
  const [impactText, setImpactText] = useState('');

  // Set baseline from mock data
  useEffect(() => {
    const snap = MOCK_DISTRICTS.find(d => d.district === district);
    if (snap) {
      setBaseline({ risk_score: snap.risk_score, risk_level: snap.risk_level });
    }
  }, [district]);

  // Debounced API call
  const fetchPrediction = useCallback(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await predictDistrict(district, { rainfall, temperature, humidity });
        setPrediction(result);
        if (baseline) {
          const scoreDiff = result.risk_score - baseline.risk_score;
          const direction = scoreDiff > 0 ? 'increases' : 'decreases';
          if (result.risk_level !== baseline.risk_level) {
            setImpactText(
              `Adjusting parameters ${direction} risk from ${baseline.risk_level} to ${result.risk_level} (score change: ${scoreDiff > 0 ? '+' : ''}${scoreDiff})`
            );
          } else {
            setImpactText(
              `Risk remains ${result.risk_level} with a score change of ${scoreDiff > 0 ? '+' : ''}${scoreDiff}`
            );
          }
        }
      } catch {
        // Fallback mock prediction
        const score = Math.min(100, Math.max(0, Math.round(rainfall * 0.3 + (temperature - 25) * 2 + (humidity - 50) * 0.4)));
        const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low';
        setPrediction({ risk_score: score, risk_level: level });
        if (baseline) {
          const diff = score - baseline.risk_score;
          if (level !== baseline.risk_level) {
            setImpactText(
              `Increasing rainfall by ${rainfall} mm changes risk from ${baseline.risk_level} to ${level}`
            );
          } else {
            setImpactText(`Risk remains ${level} with a score change of ${diff > 0 ? '+' : ''}${diff}`);
          }
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [district, rainfall, temperature, humidity, baseline]);

  useEffect(() => {
    const cleanup = fetchPrediction();
    return cleanup;
  }, [fetchPrediction]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">What-If Scenario Simulator</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Adjust parameters to predict outbreak risk</span>
        </div>
        <div className="card-body" style={{ padding: 24 }}>
          {/* District Selector */}
          <div style={{ marginBottom: 24 }}>
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

          {/* Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                Rainfall: {rainfall} mm
              </label>
              <input
                type="range" min={0} max={200} value={rainfall}
                onChange={e => setRainfall(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>0 mm</span><span>200 mm</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                Temperature: {temperature} C
              </label>
              <input
                type="range" min={20} max={45} value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>20 C</span><span>45 C</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                Humidity: {humidity}%
              </label>
              <input
                type="range" min={30} max={100} value={humidity}
                onChange={e => setHumidity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>30%</span><span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before / After Comparison */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📊</div>
          <div>
            <div className="stat-lbl">Baseline (Current)</div>
            <div className="stat-num" style={{ color: baseline ? riskColor(baseline.risk_level) : '#94a3b8' }}>
              {baseline ? baseline.risk_score : '--'}
            </div>
            {baseline && <RiskBadge level={baseline.risk_level} />}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">🔮</div>
          <div>
            <div className="stat-lbl">Predicted (Simulated)</div>
            <div className="stat-num" style={{ color: prediction ? riskColor(prediction.risk_level) : '#94a3b8' }}>
              {loading ? '...' : prediction ? prediction.risk_score : '--'}
            </div>
            {prediction && !loading && <RiskBadge level={prediction.risk_level} />}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">📈</div>
          <div>
            <div className="stat-lbl">Change</div>
            <div className="stat-num" style={{ color: '#6366f1' }}>
              {prediction && baseline
                ? `${prediction.risk_score - baseline.risk_score > 0 ? '+' : ''}${prediction.risk_score - baseline.risk_score}`
                : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Analysis */}
      {impactText && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-head">
            <h3 className="card-head-title">Impact Analysis</h3>
          </div>
          <div className="card-body" style={{ padding: 20 }}>
            <div style={{
              background: 'rgba(99,102,241,0.06)', borderRadius: 12, padding: 16,
              border: '1px solid rgba(99,102,241,0.15)', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.6
            }}>
              {impactText}
            </div>
            <div style={{ marginTop: 16, fontSize: '0.78rem', color: '#64748b' }}>
              <strong>Scenario Parameters:</strong> Rainfall {rainfall}mm | Temperature {temperature}C | Humidity {humidity}%
            </div>
          </div>
        </div>
      )}

      {/* Current Prediction Detail */}
      {prediction && !loading && (
        <div className="card">
          <div className="card-head">
            <h3 className="card-head-title">Prediction Detail</h3>
          </div>
          <div className="card-body" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: riskColor(prediction.risk_level) + '18',
                border: `3px solid ${riskColor(prediction.risk_level)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 800, color: riskColor(prediction.risk_level)
              }}>
                {prediction.risk_score}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{district}</div>
                <RiskBadge level={prediction.risk_level} size="large" />
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Under the simulated conditions (rainfall: {rainfall}mm, temperature: {temperature}C, humidity: {humidity}%),
              the model predicts a {prediction.risk_level.toLowerCase()} risk level for {district} with a score of {prediction.risk_score}/100.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

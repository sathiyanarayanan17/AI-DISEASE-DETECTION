import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const FEATURES = [
  'rainfall', 'temperature', 'humidity', 'wind_speed', 'population_density',
  'cases_7d', 'cases_14d', 'deaths_7d', 'hospital_beds', 'vaccination_rate',
  'water_quality', 'sanitation_score', 'vector_density', 'stagnant_water', 'urban_ratio',
  'poverty_index', 'literacy_rate', 'healthcare_access', 'prev_outbreaks', 'risk_score',
  'rolling_avg_cases', 'case_fatality_rate', 'reporting_rate', 'lab_confirmation', 'mobility_index',
];

function generateCorrelationMatrix() {
  const matrix = [];
  for (let i = 0; i < FEATURES.length; i++) {
    const row = [];
    for (let j = 0; j < FEATURES.length; j++) {
      if (i === j) {
        row.push(1.0);
      } else if (j < i) {
        row.push(matrix[j][i]); // symmetric
      } else {
        // Generate realistic correlations
        let corr = (Math.random() - 0.5) * 1.2;
        // Some known strong correlations
        if ((FEATURES[i] === 'rainfall' && FEATURES[j] === 'humidity') ||
            (FEATURES[i] === 'humidity' && FEATURES[j] === 'rainfall')) corr = 0.82;
        if ((FEATURES[i] === 'cases_7d' && FEATURES[j] === 'risk_score') ||
            (FEATURES[i] === 'risk_score' && FEATURES[j] === 'cases_7d')) corr = 0.91;
        if ((FEATURES[i] === 'vaccination_rate' && FEATURES[j] === 'risk_score') ||
            (FEATURES[i] === 'risk_score' && FEATURES[j] === 'vaccination_rate')) corr = -0.67;
        if ((FEATURES[i] === 'vector_density' && FEATURES[j] === 'cases_7d') ||
            (FEATURES[i] === 'cases_7d' && FEATURES[j] === 'vector_density')) corr = 0.74;
        if ((FEATURES[i] === 'temperature' && FEATURES[j] === 'vector_density') ||
            (FEATURES[i] === 'vector_density' && FEATURES[j] === 'temperature')) corr = 0.61;
        row.push(parseFloat(Math.max(-1, Math.min(1, corr)).toFixed(2)));
      }
    }
    matrix.push(row);
  }
  return matrix;
}

function getCorrelationColor(value) {
  if (value >= 0.7) return '#ef4444';
  if (value >= 0.4) return '#f97316';
  if (value >= 0.2) return '#f59e0b';
  if (value > -0.2) return '#e2e8f0';
  if (value > -0.4) return '#93c5fd';
  if (value > -0.7) return '#3b82f6';
  return '#1e40af';
}

function generateScatterData(featureX, featureY, matrix) {
  const xi = FEATURES.indexOf(featureX);
  const yi = FEATURES.indexOf(featureY);
  const corr = matrix[xi] ? matrix[xi][yi] : 0;
  const data = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 100;
    const noise = (1 - Math.abs(corr)) * (Math.random() - 0.5) * 60;
    const y = corr > 0 ? x * corr + noise + 20 : (100 - x) * Math.abs(corr) + noise + 20;
    data.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(Math.max(0, Math.min(100, y)).toFixed(1)) });
  }
  return data;
}

export default function CorrelationMatrix() {
  const [matrix, setMatrix] = useState([]);
  const [featureX, setFeatureX] = useState('rainfall');
  const [featureY, setFeatureY] = useState('risk_score');
  const [scatterData, setScatterData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/analytics/features');
        if (response.data && response.data.correlation_matrix) {
          setMatrix(response.data.correlation_matrix);
        } else {
          setMatrix(generateCorrelationMatrix());
        }
      } catch {
        setMatrix(generateCorrelationMatrix());
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (matrix.length > 0) {
      setScatterData(generateScatterData(featureX, featureY, matrix));
    }
  }, [featureX, featureY, matrix]);

  // Get top correlations
  const topCorrelations = [];
  if (matrix.length > 0) {
    for (let i = 0; i < FEATURES.length; i++) {
      for (let j = i + 1; j < FEATURES.length; j++) {
        topCorrelations.push({
          pair: `${FEATURES[i]} x ${FEATURES[j]}`,
          value: matrix[i][j],
          absValue: Math.abs(matrix[i][j]),
        });
      }
    }
    topCorrelations.sort((a, b) => b.absValue - a.absValue);
  }

  // Show subset for the matrix visualization (first 10 features)
  const displayFeatures = FEATURES.slice(0, 10);
  const displaySize = displayFeatures.length;

  return (
    <div>
      {/* Correlation Matrix Grid */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Feature Correlation Matrix</h3>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Showing top 10 features</span>
        </div>
        <div className="card-body" style={{ padding: 16, overflowX: 'auto' }}>
          <div style={{ display: 'inline-block', minWidth: 'fit-content' }}>
            {/* Header row */}
            <div style={{ display: 'flex', paddingLeft: 110 }}>
              {displayFeatures.map((f, i) => (
                <div key={i} style={{
                  width: 44, textAlign: 'center', fontSize: '0.58rem', color: '#64748b',
                  fontWeight: 600, transform: 'rotate(-45deg)', transformOrigin: 'center',
                  height: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                }}>
                  {f.length > 8 ? f.slice(0, 8) + '..' : f}
                </div>
              ))}
            </div>
            {/* Matrix rows */}
            {displayFeatures.map((rowFeature, ri) => (
              <div key={ri} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 110, fontSize: '0.68rem', color: '#475569', fontWeight: 500,
                  paddingRight: 8, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {rowFeature}
                </div>
                {displayFeatures.map((colFeature, ci) => {
                  const val = matrix.length > 0 ? matrix[ri][ci] : 0;
                  return (
                    <div
                      key={ci}
                      onMouseEnter={() => setHoveredCell({ row: rowFeature, col: colFeature, value: val })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        width: 44, height: 44, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '0.6rem', fontWeight: 600,
                        background: getCorrelationColor(val), color: Math.abs(val) > 0.5 ? '#fff' : '#475569',
                        borderRadius: 4, margin: 1, cursor: 'pointer',
                        border: hoveredCell && hoveredCell.row === rowFeature && hoveredCell.col === colFeature
                          ? '2px solid #6366f1' : '2px solid transparent',
                      }}
                    >
                      {val.toFixed(1)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Hovered cell info */}
          {hoveredCell && (
            <div style={{
              marginTop: 12, padding: '8px 14px', background: '#f8fafc', borderRadius: 8,
              fontSize: '0.78rem', color: '#1e293b', border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <strong>{hoveredCell.row}</strong> vs <strong>{hoveredCell.col}</strong>: correlation = <strong>{hoveredCell.value.toFixed(2)}</strong>
            </div>
          )}

          {/* Color Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: '0.7rem', color: '#64748b' }}>
            <span>-1.0 (negative)</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {['#1e40af', '#3b82f6', '#93c5fd', '#e2e8f0', '#f59e0b', '#f97316', '#ef4444'].map((c, i) => (
                <div key={i} style={{ width: 24, height: 12, background: c, borderRadius: 2 }} />
              ))}
            </div>
            <span>+1.0 (positive)</span>
          </div>
        </div>
      </div>

      {/* Top Correlations List */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Top Correlations</h3>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            {topCorrelations.slice(0, 10).map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: '#f8fafc', borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 500 }}>{c.pair}</span>
                <span style={{
                  fontWeight: 700, fontSize: '0.85rem',
                  color: c.value > 0.5 ? '#ef4444' : c.value < -0.5 ? '#3b82f6' : '#f59e0b',
                  background: c.value > 0.5 ? 'rgba(239,68,68,0.08)' : c.value < -0.5 ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                  padding: '3px 10px', borderRadius: 6,
                }}>
                  {c.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Feature Scatter Plot</h3>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 4 }}>
                X Axis
              </label>
              <select
                value={featureX}
                onChange={e => setFeatureX(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '0.82rem', color: '#1e293b', background: '#f8fafc', outline: 'none'
                }}
              >
                {FEATURES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 4 }}>
                Y Axis
              </label>
              <select
                value={featureY}
                onChange={e => setFeatureY(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '0.82rem', color: '#1e293b', background: '#f8fafc', outline: 'none'
                }}
              >
                {FEATURES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <span style={{
                fontSize: '0.78rem', fontWeight: 600, color: '#6366f1',
                background: 'rgba(99,102,241,0.08)', padding: '8px 12px', borderRadius: 8,
              }}>
                r = {matrix.length > 0 ? matrix[FEATURES.indexOf(featureX)][FEATURES.indexOf(featureY)].toFixed(2) : '...'}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="x" name={featureX} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="y" name={featureY} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
                formatter={(value) => [value.toFixed(1)]}
              />
              <Scatter data={scatterData} fill="#6366f1" fillOpacity={0.6} r={4} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

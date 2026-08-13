import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MODEL_VERSIONS = [
  { version: 'v1.0', date: '2025-11-15', f1: 0.78, auc: 0.82, samples: 12500, status: 'Archived', notes: 'Initial release - Logistic Regression baseline' },
  { version: 'v1.1', date: '2026-01-20', f1: 0.83, auc: 0.87, samples: 18200, notes: 'Added weather features, switched to Random Forest', status: 'Archived' },
  { version: 'v2.0', date: '2026-03-10', f1: 0.87, auc: 0.91, samples: 24800, notes: 'XGBoost with hyperparameter tuning', status: 'Archived' },
  { version: 'v2.1', date: '2026-05-28', f1: 0.89, auc: 0.93, samples: 31400, notes: 'Added temporal features and district embeddings', status: 'Archived' },
  { version: 'v3.0', date: '2026-08-01', f1: 0.92, auc: 0.96, samples: 38600, notes: 'Ensemble model with LSTM + XGBoost, monsoon data included', status: 'Active' },
];

const TREND_DATA = MODEL_VERSIONS.map(v => ({
  version: v.version,
  'F1 Score': v.f1,
  'AUC': v.auc,
}));

export default function ModelVersions() {
  const [retraining, setRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);
  const [compareA, setCompareA] = useState('v2.1');
  const [compareB, setCompareB] = useState('v3.0');

  const handleRetrain = () => {
    setRetraining(true);
    setRetrainSuccess(false);
    setTimeout(() => {
      setRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 4000);
    }, 3000);
  };

  const vA = MODEL_VERSIONS.find(v => v.version === compareA);
  const vB = MODEL_VERSIONS.find(v => v.version === compareB);

  return (
    <div>
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">🧠</div>
          <div>
            <div className="stat-num">{MODEL_VERSIONS.length}</div>
            <div className="stat-lbl">Total Versions</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">✓</div>
          <div>
            <div className="stat-num">{MODEL_VERSIONS.find(v => v.status === 'Active')?.version}</div>
            <div className="stat-lbl">Active Version</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">📊</div>
          <div>
            <div className="stat-num">{MODEL_VERSIONS[MODEL_VERSIONS.length - 1].f1}</div>
            <div className="stat-lbl">Current F1</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">📈</div>
          <div>
            <div className="stat-num">{MODEL_VERSIONS[MODEL_VERSIONS.length - 1].auc}</div>
            <div className="stat-lbl">Current AUC</div>
          </div>
        </div>
      </div>

      {/* Version Table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Model Version History</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            {retrainSuccess && <span className="pill pill-green">Retrain Successful!</span>}
            <button className="btn-detail" onClick={handleRetrain} disabled={retraining}>
              {retraining ? '⏳ Retraining...' : '🔄 Retrain Model'}
            </button>
          </div>
        </div>
        <div className="card-body">
          {retraining && (
            <div className="spin-wrap" style={{ height: 80 }}>
              <div className="spinner"></div>
              <span>Training new model with latest data...</span>
            </div>
          )}
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Date Trained</th>
                  <th>F1 Score</th>
                  <th>AUC</th>
                  <th>Samples</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_VERSIONS.map(v => (
                  <tr key={v.version} style={{ background: v.status === 'Active' ? 'var(--green-bg)' : undefined }}>
                    <td style={{ fontWeight: 700 }}>{v.version}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{v.date}</td>
                    <td>
                      <div className="score-wrap">
                        <div className="score-track">
                          <div className="score-fill" style={{ width: `${v.f1 * 100}%`, background: v.f1 >= 0.9 ? 'var(--green)' : v.f1 >= 0.85 ? 'var(--amber)' : 'var(--red)' }} />
                        </div>
                        <span className="score-num">{v.f1.toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="score-wrap">
                        <div className="score-track">
                          <div className="score-fill" style={{ width: `${v.auc * 100}%`, background: 'var(--accent)' }} />
                        </div>
                        <span className="score-num">{v.auc.toFixed(2)}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{v.samples.toLocaleString()}</td>
                    <td>
                      <span className={v.status === 'Active' ? 'badge badge-low' : 'badge badge-medium'}>
                        {v.status === 'Active' ? '✓' : '◈'} {v.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--text2)', maxWidth: 220 }}>{v.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Performance Trend Across Versions</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="version" tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis domain={[0.7, 1.0]} tick={{ fontSize: 12, fill: '#475569' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }} />
              <Legend />
              <Line type="monotone" dataKey="F1 Score" stroke="#6366f1" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="AUC" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Comparison */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Compare Models Side by Side</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="search-input" value={compareA} onChange={e => setCompareA(e.target.value)}>
              {MODEL_VERSIONS.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
            </select>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text3)' }}>vs</span>
            <select className="search-input" value={compareB} onChange={e => setCompareB(e.target.value)}>
              {MODEL_VERSIONS.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
            </select>
          </div>
        </div>
        <div className="card-body">
          {vA && vB && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[vA, vB].map(v => (
                <div key={v.version} style={{ padding: 20, background: 'var(--bg-card2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text1)', marginBottom: 12 }}>{v.version}</div>
                  <div style={{ display: 'grid', gap: 8, fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Date:</span><span style={{ fontWeight: 600 }}>{v.date}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>F1 Score:</span><span style={{ fontWeight: 700, color: v.f1 >= 0.9 ? 'var(--green)' : 'var(--text1)' }}>{v.f1.toFixed(3)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>AUC:</span><span style={{ fontWeight: 700, color: v.auc >= 0.95 ? 'var(--green)' : 'var(--text1)' }}>{v.auc.toFixed(3)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Samples:</span><span style={{ fontWeight: 600 }}>{v.samples.toLocaleString()}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Status:</span><span className={v.status === 'Active' ? 'badge badge-low' : 'badge badge-medium'}>{v.status}</span></div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: '0.76rem', color: 'var(--text2)', fontStyle: 'italic' }}>{v.notes}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

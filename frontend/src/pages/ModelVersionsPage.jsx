import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  History,
  RotateCcw,
  CheckCircle,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { MODEL_VERSIONS } from '../data/mlAnalyticsData';
import { useAlerts } from '../context/AlertContext';

export const ModelVersionsPage = () => {
  const { addToast } = useAlerts();
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainStep, setRetrainStep] = useState(0);
  const [versions, setVersions] = useState(MODEL_VERSIONS);

  const retrainSteps = [
    "Ingesting 1.48M Tamil Nadu clinical telemetry records...",
    "Synchronizing Sentinel-2 remote sensing moisture indexes...",
    "Fitting 500 Gradient Boosted Trees with depth 8...",
    "Computing 10-Fold Stratified Cross-Validation F1 metric...",
    "Registering Model weights artifact: v2.4.3-prod (F1: 97.6%)"
  ];

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < retrainSteps.length) {
        setRetrainStep(step);
      } else {
        clearInterval(interval);
        setIsRetraining(false);
        const newVersion = {
          version: "v2.4.3-prod",
          releaseDate: new Date().toISOString().split('T')[0],
          algorithm: "XGBoost 2.0.3 + Sentinel-2 Remote Sensing",
          f1Score: 97.6,
          aucRoc: 99.9,
          accuracy: 97.8,
          status: "ACTIVE_PRODUCTION",
          changelog: "Nightly automated retraining on latest August 2026 telemetry data."
        };

        const updated = [
          newVersion,
          ...versions.map(v => v.version === "v2.4.2-prod" ? { ...v, status: "ARCHIVED" } : v)
        ];
        setVersions(updated);
        addToast("Model Retrained", "XGBoost v2.4.3 successfully deployed to production inference cluster.");
      }
    }, 1200);
  };

  const chartData = [...versions].reverse().map((v) => ({
    version: v.version,
    f1Score: v.f1Score,
    aucRoc: v.aucRoc,
    accuracy: v.accuracy
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Retrain Action */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} className="text-indigo-400" />
            <span>ML Model Version Registry & Retraining Engine</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Production model artifact lineage, historical metrics, and automated retraining pipelines.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="btn btn-primary"
          style={{ minWidth: '180px' }}
        >
          <RotateCcw size={15} className={isRetraining ? 'animate-spin' : ''} />
          <span>{isRetraining ? 'Retraining Model...' : 'Retrain Production Model'}</span>
        </button>
      </div>

      {/* 2. Retraining Progress Modal/Banner */}
      {isRetraining && (
        <div
          className="glass-card"
          style={{
            padding: '24px',
            border: '1px solid var(--accent-primary)',
            background: 'linear-gradient(135deg, rgba(15, 22, 41, 0.95), rgba(99, 102, 241, 0.15))',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px' }}>
              <Cpu size={18} className="text-indigo-400 animate-pulse" />
              <span>Automated Model Retraining in Progress (Step {retrainStep + 1} of 5)</span>
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>
              {Math.round(((retrainStep + 1) / 5) * 100)}% Complete
            </span>
          </div>

          <div className="progress-bar-track" style={{ height: '8px' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${((retrainStep + 1) / 5) * 100}%`,
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)'
              }}
            />
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            &gt; {retrainSteps[retrainStep]}
          </div>
        </div>
      )}

      {/* 3. Performance Trend Over Versions Chart */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>Model Metric Progression Across Releases</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Historical evolution from baseline logistic regression to v2.4 ensemble.</p>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="version" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="f1Score" name="F1-Score" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="aucRoc" name="ROC-AUC" stroke="#6366f1" strokeWidth={3} />
              <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#06b6d4" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Model Versions Registry Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Version Lineage & Deployment Status</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Version</th>
                <th>Release Date</th>
                <th>F1-Score</th>
                <th>ROC-AUC</th>
                <th>Accuracy</th>
                <th>Architecture / Features</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((ver) => (
                <tr key={ver.version}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{ver.version}</strong>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ver.releaseDate}</td>
                  <td>
                    <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{ver.f1Score}%</strong>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{ver.aucRoc}%</strong>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{ver.accuracy}%</strong>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <div>{ver.algorithm}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ver.changelog}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: ver.status === 'ACTIVE_PRODUCTION' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-input)',
                        color: ver.status === 'ACTIVE_PRODUCTION' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                        border: ver.status === 'ACTIVE_PRODUCTION' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {ver.status}
                    </span>
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

export default ModelVersionsPage;

import React from 'react';
import {
  BarChart,
  Bar,
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
  BrainCircuit,
  Cpu,
  Zap,
  Target,
  CheckCircle,
  Layers,
  Database,
  BarChart3
} from 'lucide-react';
import { ML_METRICS, FEATURE_IMPORTANCE_TOP15, CONFUSION_MATRIX } from '../data/mlAnalyticsData';
import { DISEASE_DATA } from '../data/diseaseData';
import ExportButton from '../components/common/ExportButton';

export const AnalyticsPage = () => {
  // Combine 30 day trends across diseases for comparison chart
  const combinedTrends = DISEASE_DATA.dengue.trends90d.slice(-30).map((pt, i) => {
    return {
      date: pt.date,
      dengue: pt.cases,
      cholera: DISEASE_DATA.cholera.trends90d.slice(-30)[i]?.cases || 20,
      malaria: DISEASE_DATA.malaria.trends90d.slice(-30)[i]?.cases || 10
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={24} className="text-indigo-400" />
            <span>AI Model Performance & Feature Analytics</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Benchmarking XGBoost Gradient Boosted Decision Trees on 1.48M epidemiological training rows.
          </p>
        </div>

        <ExportButton data={FEATURE_IMPORTANCE_TOP15} filename="xgboost_feature_importance" label="Export Features CSV" />
      </div>

      {/* 2. Primary Metrics Row */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            F1-Score
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {ML_METRICS.f1Score}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Harmonic mean of precision and recall
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            ROC - AUC Score
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            {ML_METRICS.aucRoc}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Area under the ROC discrimination curve
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Validation Accuracy
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            {ML_METRICS.accuracy}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Stratified 10-Fold Cross-Validation
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Inference Latency
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {ML_METRICS.inferenceLatencyMs}ms
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            FastAPI C++ Optimized Pipeline
          </div>
        </div>
      </div>

      {/* 3. FEATURE IMPORTANCE HORIZONTAL BAR CHART */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>Top 15 Feature Importances (Gain Metric)</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Relative contribution of meteorological, epidemiological, and geospatial features in tree splits.
            </p>
          </div>
        </div>

        <div style={{ height: '440px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={[...FEATURE_IMPORTANCE_TOP15].reverse()}
              margin={{ top: 10, right: 30, left: 160, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} domain={[0, 0.22]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke="var(--text-muted)" fontSize={11} width={150} />
              <RechartsTooltip
                formatter={(val) => [`${(val * 100).toFixed(1)}% Relative Gain`, 'Importance']}
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Bar dataKey="importance" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. MULTI-LINE DISEASE TRENDS OVERLAY */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div>
            <h2 style={{ fontSize: '16px' }}>Multi-Disease 30-Day Vector Surge Comparison</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simultaneous progression tracking for Dengue, Cholera, and Malaria.</p>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
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
              <Line type="monotone" dataKey="dengue" name="Dengue Fever" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="cholera" name="Cholera Outbreak" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="malaria" name="Malaria Cases" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. MODEL ARCHITECTURE & CONFUSION MATRIX */}
      <div className="grid-cols-2">
        {/* Model Specs Table */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} className="text-indigo-400" />
            <span>Model Specifications & Hyperparameters</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Algorithm Architecture:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{ML_METRICS.algorithm}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Training Corpus:</span>
              <span>{ML_METRICS.trainingSamples} Verified Reports</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Split Strategy:</span>
              <span>{ML_METRICS.validationSplit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Maximum Tree Depth:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{ML_METRICS.treeDepth} Levels</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Learning Rate (Eta):</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{ML_METRICS.learningRate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Multi-Class Log Loss:</span>
              <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{ML_METRICS.logLoss}</span>
            </div>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} className="text-cyan-400" />
            <span>Multi-Class Confusion Matrix (Test Set N=3,600)</span>
          </h3>

          <div className="data-table-container">
            <table className="data-table" style={{ textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Actual \ Predicted</th>
                  <th>Low Risk</th>
                  <th>Medium Warning</th>
                  <th>Severe Outbreak</th>
                </tr>
              </thead>
              <tbody>
                {CONFUSION_MATRIX.matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ fontWeight: 700, textAlign: 'left' }}>{CONFUSION_MATRIX.classes[rIdx]}</td>
                    {row.map((val, cIdx) => (
                      <td
                        key={cIdx}
                        style={{
                          background: rIdx === cIdx ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                          color: rIdx === cIdx ? 'var(--accent-emerald)' : 'var(--text-muted)',
                          fontWeight: rIdx === cIdx ? 700 : 500,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

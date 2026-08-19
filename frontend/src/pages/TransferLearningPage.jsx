import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Brain, ArrowRight, CheckCircle, Clock, Database, TrendingUp, Zap, Layers, Target, RefreshCw } from 'lucide-react';

const statsData = [
  { label: 'Source States', value: '5', icon: Database, color: '#6366f1' },
  { label: 'Target Accuracy', value: '94.2%', icon: Target, color: '#10b981' },
  { label: 'Fine-tuning Epochs', value: '25', icon: RefreshCw, color: '#f59e0b' },
  { label: 'Data Reduction', value: '68%', icon: TrendingUp, color: '#ef4444' },
];

const accuracyComparison = [
  { tnData: '5%', fromScratch: 42.1, transferLearning: 78.6 },
  { tnData: '10%', fromScratch: 56.3, transferLearning: 85.4 },
  { tnData: '50%', fromScratch: 78.9, transferLearning: 91.7 },
  { tnData: '100%', fromScratch: 87.2, transferLearning: 94.2 },
];

const featureTransferData = [
  { feature: 'Rainfall Patterns', transferability: 92, status: 'transfers' },
  { feature: 'Temperature Trends', transferability: 88, status: 'transfers' },
  { feature: 'Humidity Cycles', transferability: 85, status: 'transfers' },
  { feature: 'Monsoon Dynamics', transferability: 79, status: 'transfers' },
  { feature: 'Disease Seasonality', transferability: 74, status: 'partial' },
  { feature: 'Urban Density Impact', transferability: 61, status: 'partial' },
  { feature: 'Coastal Effects', transferability: 45, status: 'relearn' },
  { feature: 'Local Water Bodies', transferability: 32, status: 'relearn' },
  { feature: 'District Demographics', transferability: 21, status: 'relearn' },
  { feature: 'Regional Diet Patterns', transferability: 15, status: 'relearn' },
];

const domainAdaptationMetrics = [
  { metric: 'MMD Score', before: 0.82, after: 0.23 },
  { metric: 'Domain Discrepancy', before: 0.74, after: 0.18 },
  { metric: 'Feature Alignment', before: 0.41, after: 0.89 },
  { metric: 'Distribution Match', before: 0.38, after: 0.91 },
  { metric: 'Class Overlap', before: 0.52, after: 0.87 },
];

const timeCostSavings = [
  { metric: 'Training Time', withoutTL: '14.2 hours', withTL: '3.8 hours', savings: '73%' },
  { metric: 'Data Required', withoutTL: '3 years', withTL: '~1 year', savings: '68%' },
  { metric: 'Compute Cost', withoutTL: '$48.50', withTL: '$12.30', savings: '75%' },
  { metric: 'Convergence Epochs', withoutTL: '150', withTL: '25', savings: '83%' },
  { metric: 'Labeling Effort', withoutTL: '800 hours', withTL: '250 hours', savings: '69%' },
];

const pipelineSteps = [
  { label: 'Pre-trained Model', subtitle: '5 States Data', icon: Brain, color: '#6366f1' },
  { label: 'Feature Extraction', subtitle: 'Shared Layers', icon: Layers, color: '#8b5cf6' },
  { label: 'Fine-tune', subtitle: 'TN-specific Data', icon: RefreshCw, color: '#f59e0b' },
  { label: 'TN Specific Model', subtitle: '37 Districts', icon: Target, color: '#10b981' },
];

export default function TransferLearningPage() {
  const [activeTab, setActiveTab] = useState('comparison');

  const getStatusColor = (status) => {
    if (status === 'transfers') return '#10b981';
    if (status === 'partial') return '#f59e0b';
    return '#ef4444';
  };

  const getStatusLabel = (status) => {
    if (status === 'transfers') return 'Transfers Well';
    if (status === 'partial') return 'Partial Transfer';
    return 'Needs Relearning';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
          <Brain size={32} style={{ color: '#6366f1' }} />
          Transfer Learning Pipeline
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '15px' }}>
          Leveraging pre-trained models from 5 Indian states to accelerate Tamil Nadu disease prediction
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        {statsData.map((stat, idx) => (
          <div className="glass-card" key={idx} style={{ padding: '20px', textAlign: 'center' }}>
            <stat.icon size={28} style={{ color: stat.color, marginBottom: '8px' }} />
            <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Diagram */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} style={{ color: '#f59e0b' }} />
          Transfer Learning Pipeline
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {pipelineSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                background: `${step.color}15`,
                border: `2px solid ${step.color}40`,
                borderRadius: '16px',
                padding: '20px 24px',
                textAlign: 'center',
                minWidth: '160px',
                transition: 'transform 0.2s',
              }}>
                <step.icon size={32} style={{ color: step.color, marginBottom: '8px' }} />
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{step.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{step.subtitle}</div>
              </div>
              {idx < pipelineSteps.length - 1 && (
                <ArrowRight size={24} style={{ color: '#64748b', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center', padding: '12px', background: '#6366f115', borderRadius: '8px', fontSize: '13px', color: '#94a3b8' }}>
          Source States: <strong style={{ color: '#e2e8f0' }}>Maharashtra, Karnataka, Kerala, Andhra Pradesh, West Bengal</strong> → Target: <strong style={{ color: '#10b981' }}>Tamil Nadu (37 Districts)</strong>
        </div>
      </div>

      {/* Accuracy Comparison Table */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: '#10b981' }} />
          Accuracy Comparison: From Scratch vs Transfer Learning
        </h2>
        <div className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>TN Data Used</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>From Scratch</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Transfer Learning</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>Improvement</th>
              </tr>
            </thead>
            <tbody>
              {accuracyComparison.map((row, idx) => {
                const improvement = (row.transferLearning - row.fromScratch).toFixed(1);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{row.tnData}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{ color: '#ef4444', fontWeight: '600' }}>{row.fromScratch}%</span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>{row.transferLearning}%</span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{
                        background: '#10b98120',
                        color: '#10b981',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>+{improvement}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Transfer Visualization */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} style={{ color: '#8b5cf6' }} />
          Feature Transfer Visualization
        </h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            <span style={{ color: '#94a3b8' }}>Transfers Well (≥70%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <span style={{ color: '#94a3b8' }}>Partial Transfer (50-69%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
            <span style={{ color: '#94a3b8' }}>Needs Relearning (&lt;50%)</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {featureTransferData.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '180px', fontSize: '13px', fontWeight: '500', flexShrink: 0 }}>{item.feature}</div>
              <div className="progress-bar-track" style={{ flex: 1, height: '24px', borderRadius: '12px', position: 'relative' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${item.transferability}%`,
                    height: '100%',
                    borderRadius: '12px',
                    background: getStatusColor(item.status),
                    opacity: 0.8,
                    transition: 'width 0.6s ease',
                  }}
                ></div>
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#e2e8f0',
                }}>{item.transferability}%</span>
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 8px',
                borderRadius: '8px',
                background: `${getStatusColor(item.status)}20`,
                color: getStatusColor(item.status),
                whiteSpace: 'nowrap',
                minWidth: '110px',
                textAlign: 'center',
              }}>
                {getStatusLabel(item.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Adaptation Metrics Chart */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} style={{ color: '#6366f1' }} />
          Domain Adaptation Metrics
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          Measuring distribution alignment before and after transfer learning adaptation
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={domainAdaptationMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 1]} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="before" name="Before Adaptation" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="after" name="After Adaptation" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '16px', padding: '12px', background: '#10b98110', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            <strong style={{ color: '#10b981' }}>Key Insight:</strong> After domain adaptation, feature alignment improved from 0.41 → 0.89 and distribution match from 0.38 → 0.91, indicating successful knowledge transfer.
          </span>
        </div>
      </div>

      {/* Time/Cost Savings Panel */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} style={{ color: '#f59e0b' }} />
          Time & Cost Savings
        </h2>
        <div style={{
          background: 'linear-gradient(135deg, #6366f115, #10b98115)',
          border: '1px solid #6366f130',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <Zap size={28} style={{ color: '#f59e0b', marginBottom: '8px' }} />
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b' }}>
            Transfer learning reduces training time by 73%
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>
            From 14.2 hours down to 3.8 hours with equivalent or better accuracy
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {timeCostSavings.map((item, idx) => (
            <div key={idx} style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div className="flex-between" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.metric}</span>
                <span style={{
                  background: '#10b98120',
                  color: '#10b981',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                }}>-{item.savings}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Without TL</div>
                  <div style={{ color: '#ef4444', fontWeight: '600' }}>{item.withoutTL}</div>
                </div>
                <ArrowRight size={16} style={{ color: '#64748b', alignSelf: 'center' }} />
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>With TL</div>
                  <div style={{ color: '#10b981', fontWeight: '600' }}>{item.withTL}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

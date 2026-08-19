import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, Server, Globe, Lock, Activity, Wifi, Database, Cpu, ArrowRight, ArrowDown } from 'lucide-react';

const accuracyData = [
  { round: 1, federated: 72.1, centralized: 74.5 },
  { round: 2, federated: 76.8, centralized: 78.2 },
  { round: 3, federated: 80.3, centralized: 81.0 },
  { round: 4, federated: 83.5, centralized: 84.1 },
  { round: 5, federated: 85.9, centralized: 86.3 },
  { round: 6, federated: 87.4, centralized: 87.8 },
  { round: 7, federated: 89.1, centralized: 89.4 },
  { round: 8, federated: 90.2, centralized: 90.5 },
  { round: 9, federated: 91.0, centralized: 91.2 },
  { round: 10, federated: 91.6, centralized: 91.8 },
];

const trainingRounds = [
  { round: 1, nodes: 5, localAccuracy: '72.1%', globalAccuracy: '72.1%', time: '4m 32s' },
  { round: 2, nodes: 5, localAccuracy: '76.8%', globalAccuracy: '76.8%', time: '4m 18s' },
  { round: 3, nodes: 4, localAccuracy: '80.9%', globalAccuracy: '80.3%', time: '3m 55s' },
  { round: 4, nodes: 5, localAccuracy: '83.2%', globalAccuracy: '83.5%', time: '4m 10s' },
  { round: 5, nodes: 5, localAccuracy: '86.1%', globalAccuracy: '85.9%', time: '4m 05s' },
  { round: 6, nodes: 4, localAccuracy: '87.8%', globalAccuracy: '87.4%', time: '3m 48s' },
  { round: 7, nodes: 5, localAccuracy: '89.3%', globalAccuracy: '89.1%', time: '4m 22s' },
  { round: 8, nodes: 5, localAccuracy: '90.0%', globalAccuracy: '90.2%', time: '4m 01s' },
  { round: 9, nodes: 5, localAccuracy: '91.2%', globalAccuracy: '91.0%', time: '3m 57s' },
  { round: 10, nodes: 5, localAccuracy: '91.8%', globalAccuracy: '91.6%', time: '4m 14s' },
];

const stateNodes = [
  { id: 'TN', name: 'Tamil Nadu', color: '#3b82f6', status: 'active', dataPoints: '12,450' },
  { id: 'KA', name: 'Karnataka', color: '#10b981', status: 'active', dataPoints: '10,820' },
  { id: 'KL', name: 'Kerala', color: '#f59e0b', status: 'active', dataPoints: '9,340' },
  { id: 'AP', name: 'Andhra Pradesh', color: '#ef4444', status: 'active', dataPoints: '11,200' },
  { id: 'MH', name: 'Maharashtra', color: '#8b5cf6', status: 'active', dataPoints: '14,680' },
];

export default function FederatedLearningPage() {
  const [selectedNode, setSelectedNode] = useState(null);

  const stats = [
    { label: 'Participating States', value: '5', icon: Globe, color: '#3b82f6' },
    { label: 'Training Rounds', value: '10', icon: Activity, color: '#10b981' },
    { label: 'Global Model Accuracy', value: '91.6%', icon: Cpu, color: '#f59e0b' },
    { label: 'Privacy Score', value: '98.5%', icon: Shield, color: '#8b5cf6' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="#8b5cf6" />
          Federated Learning
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Privacy-preserving collaborative model training across state health departments
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="glass-card" key={stat.label} style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{stat.label}</span>
                <Icon size={20} color={stat.color} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Architecture Diagram */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={20} color="#3b82f6" />
          Federated Architecture
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* State Nodes Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {stateNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${node.color}`,
                  background: selectedNode === node.id ? `${node.color}20` : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: '130px',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 0 12px ${node.color}30`,
                }}
              >
                <Database size={24} color={node.color} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '700', fontSize: '16px', color: node.color }}>{node.id}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{node.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{node.dataPoints} records</div>
                <div style={{
                  marginTop: '8px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#10b98120',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: '600',
                }}>
                  ● Active
                </div>
              </div>
            ))}
          </div>

          {/* Connection Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
            <ArrowDown size={20} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Encrypted Model Weights Only</span>
            <ArrowDown size={20} />
          </div>

          {/* Central Aggregator */}
          <div style={{
            padding: '24px 40px',
            borderRadius: '16px',
            border: '2px solid #f59e0b',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
            textAlign: 'center',
            boxShadow: '0 0 24px rgba(245,158,11,0.2)',
          }}>
            <Server size={32} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: '700', fontSize: '18px', color: '#f59e0b' }}>Central Aggregator</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Federated Averaging (FedAvg)</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              Aggregates model updates • No raw data access
            </div>
          </div>

          {/* Output Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
            <ArrowDown size={20} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Updated Global Model</span>
            <ArrowDown size={20} />
          </div>

          {/* Global Model */}
          <div style={{
            padding: '16px 32px',
            borderRadius: '12px',
            border: '2px solid #10b981',
            background: 'rgba(16,185,129,0.08)',
            textAlign: 'center',
          }}>
            <Globe size={24} color="#10b981" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#10b981' }}>Global Disease Prediction Model</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Accuracy: 91.6% | F1: 0.91</div>
          </div>
        </div>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '24px', gap: '24px' }}>
        {/* Training Progress Table */}
        <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#10b981" />
            Training Progress
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontWeight: '600' }}>Round</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontWeight: '600' }}>Nodes</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontWeight: '600' }}>Local Acc.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontWeight: '600' }}>Global Acc.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', fontWeight: '600' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {trainingRounds.map((row) => (
                  <tr key={row.round} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '600' }}>#{row.round}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ background: row.nodes === 5 ? '#10b98120' : '#f59e0b20', color: row.nodes === 5 ? '#10b981' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        {row.nodes}/5
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{row.localAccuracy}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '600', color: '#10b981' }}>{row.globalAccuracy}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#94a3b8' }}>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Metrics Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="#8b5cf6" />
            Privacy Metrics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Differential Privacy</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6' }}>ε = 0.5</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Strong privacy guarantee</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Data Sharing</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>No Raw Data Shared</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Only encrypted gradients exchanged</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Aggregation Method</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>Model Weight Averaging</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>FedAvg with secure aggregation</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Noise Injection</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>Gaussian (σ = 1.2)</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Calibrated for ε=0.5 at δ=10⁻⁵</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Privacy Budget Used</div>
              <div style={{ marginTop: '8px' }}>
                <div className="progress-bar-track" style={{ height: '8px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)' }}>
                  <div style={{ width: '35%', height: '100%', borderRadius: '4px', background: '#ef4444' }}></div>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>35% consumed (6.5 of 18.5 budget)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Improvement Chart */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#3b82f6" />
          Accuracy: Federated vs Centralized Training
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={accuracyData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis
              dataKey="round"
              stroke="#64748b"
              fontSize={12}
              label={{ value: 'Training Round', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              domain={[70, 95]}
              label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ fontSize: '13px' }} />
            <Line
              type="monotone"
              dataKey="federated"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              name="Federated Learning"
            />
            <Line
              type="monotone"
              dataKey="centralized"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Centralized (Baseline)"
            />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
          Federated learning achieves <span style={{ color: '#10b981', fontWeight: '600' }}>99.8%</span> of centralized accuracy while preserving data privacy
        </div>
      </div>

      {/* Communication Overhead */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wifi size={20} color="#f59e0b" />
          Communication Overhead
        </h2>
        <div className="grid-cols-4" style={{ gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Per-Round Upload</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#3b82f6' }}>2.4 MB</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>per node</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Per-Round Download</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#10b981' }}>2.4 MB</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>global model</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Total Data Transferred</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b' }}>240 MB</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>all 10 rounds</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Compression Ratio</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#8b5cf6' }}>8.3x</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>gradient compression</div>
          </div>
        </div>
        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={16} color="#10b981" />
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            <strong style={{ color: '#10b981' }}>99.6% bandwidth savings</strong> compared to sharing raw datasets (~58 GB combined across 5 states)
          </span>
        </div>
      </div>
    </div>
  );
}

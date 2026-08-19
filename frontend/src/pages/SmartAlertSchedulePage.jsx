import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Clock, Bell, TrendingUp, Zap, Send, Pause, XCircle,
  CalendarClock, Brain, CheckCircle2, AlertTriangle, Activity
} from 'lucide-react';

const stats = [
  { label: 'Alerts Scheduled Today', value: '24', icon: CalendarClock, color: '#6366f1' },
  { label: 'Optimal Delivery Rate', value: '94.2%', icon: TrendingUp, color: '#10b981' },
  { label: 'Avg Open Rate', value: '87.6%', icon: Bell, color: '#f59e0b' },
  { label: 'Time Savings', value: '3.2 hrs', icon: Clock, color: '#8b5cf6' }
];

const hourlyEffectiveness = [
  { hour: '12AM', effectiveness: 12, responses: 5 },
  { hour: '1AM', effectiveness: 8, responses: 3 },
  { hour: '2AM', effectiveness: 6, responses: 2 },
  { hour: '3AM', effectiveness: 5, responses: 2 },
  { hour: '4AM', effectiveness: 10, responses: 6 },
  { hour: '5AM', effectiveness: 35, responses: 20 },
  { hour: '6AM', effectiveness: 92, responses: 85 },
  { hour: '7AM', effectiveness: 78, responses: 70 },
  { hour: '8AM', effectiveness: 65, responses: 55 },
  { hour: '9AM', effectiveness: 58, responses: 48 },
  { hour: '10AM', effectiveness: 52, responses: 42 },
  { hour: '11AM', effectiveness: 48, responses: 38 },
  { hour: '12PM', effectiveness: 45, responses: 35 },
  { hour: '1PM', effectiveness: 42, responses: 32 },
  { hour: '2PM', effectiveness: 44, responses: 34 },
  { hour: '3PM', effectiveness: 50, responses: 40 },
  { hour: '4PM', effectiveness: 58, responses: 48 },
  { hour: '5PM', effectiveness: 72, responses: 62 },
  { hour: '6PM', effectiveness: 88, responses: 80 },
  { hour: '7PM', effectiveness: 68, responses: 55 },
  { hour: '8PM', effectiveness: 45, responses: 32 },
  { hour: '9PM', effectiveness: 30, responses: 20 },
  { hour: '10PM', effectiveness: 18, responses: 10 },
  { hour: '11PM', effectiveness: 14, responses: 7 }
];

const scheduledAlerts = [
  { id: 1, alert: 'Dengue spike warning', district: 'Chennai', severity: 'High', time: '6:00 AM', reason: 'Before health worker shift start', channel: 'SMS + WhatsApp', status: 'Scheduled' },
  { id: 2, alert: 'Cholera risk elevation', district: 'Tiruvallur', severity: 'Critical', time: '6:00 AM', reason: 'Pre-field deployment briefing', channel: 'Voice + SMS', status: 'Scheduled' },
  { id: 3, alert: 'Malaria cluster detected', district: 'Ramanathapuram', severity: 'Medium', time: '6:00 PM', reason: 'End-of-day summary report', channel: 'Email', status: 'Scheduled' },
  { id: 4, alert: 'Water contamination alert', district: 'Madurai', severity: 'Critical', time: 'Immediate', reason: 'Emergency — immediate dispatch', channel: 'All Channels', status: 'Sent' },
  { id: 5, alert: 'Breeding site surge', district: 'Coimbatore', severity: 'Medium', time: '7:00 AM', reason: 'Field team deployment hour', channel: 'WhatsApp', status: 'Scheduled' },
  { id: 6, alert: 'Vaccination coverage gap', district: 'Salem', severity: 'Low', time: '6:00 PM', reason: 'End-of-day planning window', channel: 'Email', status: 'Pending' },
  { id: 7, alert: 'Temperature anomaly', district: 'Vellore', severity: 'Medium', time: '6:00 AM', reason: 'Morning decision-making window', channel: 'SMS', status: 'Scheduled' }
];

const schedulingRules = [
  { time: '6:00 AM', label: 'Work Shift Start', description: 'High-priority alerts sent before health workers begin shifts', icon: '🌅', color: '#6366f1' },
  { time: '7:00 AM', label: 'Field Deployment', description: 'Operational alerts for field teams heading to districts', icon: '🚗', color: '#10b981' },
  { time: '6:00 PM', label: 'End of Day Report', description: 'Summary alerts and non-urgent updates for planning', icon: '📋', color: '#f59e0b' },
  { time: 'Immediate', label: 'Emergency Override', description: 'Critical alerts bypass scheduling — sent instantly', icon: '🚨', color: '#ef4444' }
];

const deliveryAnalytics = [
  { slot: '6:00 AM', openRate: '94%', responseTime: '4 min', ackRate: '91%' },
  { slot: '7:00 AM', openRate: '88%', responseTime: '6 min', ackRate: '85%' },
  { slot: '12:00 PM', openRate: '52%', responseTime: '22 min', ackRate: '45%' },
  { slot: '6:00 PM', openRate: '89%', responseTime: '5 min', ackRate: '87%' },
  { slot: '9:00 PM', openRate: '35%', responseTime: '45 min', ackRate: '28%' }
];

const severityColor = (severity) => {
  switch (severity) {
    case 'Critical': return '#ef4444';
    case 'High': return '#f59e0b';
    case 'Medium': return '#6366f1';
    case 'Low': return '#10b981';
    default: return '#64748b';
  }
};

const statusColor = (status) => {
  switch (status) {
    case 'Sent': return '#10b981';
    case 'Scheduled': return '#6366f1';
    case 'Pending': return '#f59e0b';
    default: return '#64748b';
  }
};

export default function SmartAlertSchedulePage() {
  const [alerts, setAlerts] = useState(scheduledAlerts);

  const handleForceSend = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Sent', time: 'Now' } : a));
  };

  const handleDelay = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Delayed +1hr' } : a));
  };

  const handleCancel = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={32} style={{ color: '#6366f1' }} />
          Predictive Alert Scheduling
        </h1>
        <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '14px' }}>
          AI decides the optimal time to send alerts for maximum effectiveness
        </p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: `${stat.color}20`, borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Scheduling Logic Display */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', borderLeft: '4px solid #6366f1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Brain size={20} style={{ color: '#6366f1' }} />
          <span style={{ fontWeight: 600, fontSize: '15px' }}>AI Scheduling Decision</span>
        </div>
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', padding: '16px', fontSize: '15px', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} style={{ color: '#f59e0b' }} />
            <strong>Alert for Chennai dengue spike scheduled for 6:00 AM</strong>
            <span style={{ color: '#94a3b8' }}>(before health worker shift start)</span>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>
            Reasoning: Historical data shows 94% open rate at 6:00 AM for SMS alerts to Chennai district health officers.
            Average response time is 4 minutes vs. 22 minutes if sent at noon. AI selected optimal window based on
            recipient behavior patterns, alert severity, and channel-specific engagement metrics.
          </div>
        </div>
      </div>

      {/* Schedule Optimization Chart */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} style={{ color: '#6366f1' }} />
          Alert Effectiveness by Hour of Day
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyEffectiveness} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9' }}
            />
            <Legend />
            <Bar dataKey="effectiveness" name="Effectiveness %" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="responses" name="Response Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600 }}>📈 Peak: 6:00 AM (92% effectiveness)</span>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>📈 Peak: 6:00 PM (88% effectiveness)</span>
        </div>
      </div>

      {/* Active Scheduled Alerts Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarClock size={18} style={{ color: '#f59e0b' }} />
          Active Scheduled Alerts
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Alert</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Severity</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Scheduled Time</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Reason for Timing</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Channel</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{row.alert}</td>
                  <td style={{ padding: '12px 8px' }}>{row.district}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="risk-badge" style={{ background: `${severityColor(row.severity)}20`, color: severityColor(row.severity), padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                      {row.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>{row.time}</td>
                  <td style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '12px' }}>{row.reason}</td>
                  <td style={{ padding: '12px 8px', fontSize: '12px' }}>{row.channel}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ background: `${statusColor(row.status)}20`, color: statusColor(row.status), padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleForceSend(row.id)}
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#6366f1', color: '#fff' }}
                        title="Force Send Now"
                      >
                        <Send size={12} /> Send
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDelay(row.id)}
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#f59e0b', color: '#fff' }}
                        title="Delay 1 Hour"
                      >
                        <Pause size={12} /> Delay
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancel(row.id)}
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#ef4444', color: '#fff' }}
                        title="Cancel Alert"
                      >
                        <XCircle size={12} /> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduling Rules + Delivery Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Scheduling Rules Panel */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: '#10b981' }} />
            Scheduling Rules
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {schedulingRules.map((rule, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(148,163,184,0.05)', borderRadius: '10px', borderLeft: `3px solid ${rule.color}` }}>
                <span style={{ fontSize: '24px' }}>{rule.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: rule.color }}>{rule.time}</span>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{rule.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{rule.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Analytics */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#f59e0b' }} />
            Delivery Analytics by Time Slot
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '8px 12px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Time Slot</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Open Rate</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Resp. Time</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Ack. Rate</span>
            </div>
            {deliveryAnalytics.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 12px', background: i % 2 === 0 ? 'rgba(148,163,184,0.03)' : 'transparent', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{row.slot}</span>
                <span style={{ fontSize: '13px', color: parseFloat(row.openRate) > 80 ? '#10b981' : parseFloat(row.openRate) > 50 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                  {row.openRate}
                </span>
                <span style={{ fontSize: '13px', color: parseInt(row.responseTime) < 10 ? '#10b981' : parseInt(row.responseTime) < 30 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                  {row.responseTime}
                </span>
                <span style={{ fontSize: '13px', color: parseFloat(row.ackRate) > 80 ? '#10b981' : parseFloat(row.ackRate) > 50 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                  {row.ackRate}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', fontSize: '12px', color: '#10b981' }}>
            <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            <strong>Insight:</strong> 6:00 AM and 6:00 PM slots consistently achieve {'>'}85% open rate and {'<'}6 min response time.
          </div>
        </div>
      </div>

      {/* Override Controls Summary */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          Override Controls
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Manual overrides bypass AI scheduling. Use for emergencies or time-sensitive decisions.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#6366f1', color: '#fff', fontWeight: 600 }}>
            <Send size={16} /> Force Send All Pending Now
          </button>
          <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#f59e0b', color: '#fff', fontWeight: 600 }}>
            <Pause size={16} /> Delay All by 1 Hour
          </button>
          <button className="btn btn-danger" style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#ef4444', color: '#fff', fontWeight: 600 }}>
            <XCircle size={16} /> Cancel All Scheduled
          </button>
        </div>
      </div>
    </div>
  );
}

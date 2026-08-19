import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  Shield, Activity, Clock, Server, AlertTriangle, Ban,
  CheckCircle, XCircle, Key, Globe, Lock, Zap, Users,
  RefreshCw, Eye, Wifi, WifiOff
} from 'lucide-react';

const trafficData = [
  { hour: '00:00', requests: 120, rateLimit: 500 },
  { hour: '01:00', requests: 85, rateLimit: 500 },
  { hour: '02:00', requests: 60, rateLimit: 500 },
  { hour: '03:00', requests: 45, rateLimit: 500 },
  { hour: '04:00', requests: 55, rateLimit: 500 },
  { hour: '05:00', requests: 90, rateLimit: 500 },
  { hour: '06:00', requests: 180, rateLimit: 500 },
  { hour: '07:00', requests: 320, rateLimit: 500 },
  { hour: '08:00', requests: 450, rateLimit: 500 },
  { hour: '09:00', requests: 520, rateLimit: 500 },
  { hour: '10:00', requests: 480, rateLimit: 500 },
  { hour: '11:00', requests: 510, rateLimit: 500 },
  { hour: '12:00', requests: 490, rateLimit: 500 },
  { hour: '13:00', requests: 530, rateLimit: 500 },
  { hour: '14:00', requests: 470, rateLimit: 500 },
  { hour: '15:00', requests: 440, rateLimit: 500 },
  { hour: '16:00', requests: 410, rateLimit: 500 },
  { hour: '17:00', requests: 380, rateLimit: 500 },
  { hour: '18:00', requests: 350, rateLimit: 500 },
  { hour: '19:00', requests: 300, rateLimit: 500 },
  { hour: '20:00', requests: 260, rateLimit: 500 },
  { hour: '21:00', requests: 220, rateLimit: 500 },
  { hour: '22:00', requests: 180, rateLimit: 500 },
  { hour: '23:00', requests: 140, rateLimit: 500 },
];

const rateLimitConfig = [
  { group: '/predict', reqPerMin: 60, burstLimit: 100, currentUsage: 42, status: 'normal' },
  { group: '/alerts', reqPerMin: 120, burstLimit: 200, currentUsage: 88, status: 'normal' },
  { group: '/realtime', reqPerMin: 200, burstLimit: 350, currentUsage: 195, status: 'warning' },
  { group: '/analytics', reqPerMin: 80, burstLimit: 150, currentUsage: 35, status: 'normal' },
  { group: '/forecast', reqPerMin: 40, burstLimit: 80, currentUsage: 38, status: 'warning' },
  { group: '/citizen', reqPerMin: 100, burstLimit: 180, currentUsage: 55, status: 'normal' },
  { group: '/resources', reqPerMin: 60, burstLimit: 100, currentUsage: 60, status: 'critical' },
  { group: '/water-quality', reqPerMin: 50, burstLimit: 90, currentUsage: 22, status: 'normal' },
  { group: '/mosquito', reqPerMin: 50, burstLimit: 90, currentUsage: 18, status: 'normal' },
  { group: '/notifications', reqPerMin: 150, burstLimit: 250, currentUsage: 110, status: 'normal' },
];

const blockedRequests = [
  { time: '13:42:18', ip: '192.168.45.112', endpoint: '/predict', reason: 'Rate limit exceeded', action: 'Throttled 429' },
  { time: '13:38:05', ip: '10.0.0.88', endpoint: '/alerts/all', reason: 'Invalid API key', action: 'Blocked 401' },
  { time: '13:35:22', ip: '203.94.12.7', endpoint: '/citizen/report', reason: 'IP blacklisted', action: 'Blocked 403' },
  { time: '13:30:11', ip: '172.16.0.55', endpoint: '/realtime/feed', reason: 'Burst limit exceeded', action: 'Throttled 429' },
  { time: '13:28:44', ip: '45.33.92.156', endpoint: '/forecast', reason: 'Suspicious pattern', action: 'Blocked 403' },
  { time: '13:22:09', ip: '103.21.58.201', endpoint: '/analytics/metrics', reason: 'Rate limit exceeded', action: 'Throttled 429' },
  { time: '13:18:33', ip: '192.168.1.200', endpoint: '/vaccination/register', reason: 'CORS violation', action: 'Blocked 403' },
  { time: '13:15:57', ip: '78.46.91.3', endpoint: '/predict/batch', reason: 'DDoS detected', action: 'Blocked + IP ban' },
];

const apiKeyUsage = [
  { client: 'TN Health Dept', key: 'tn-health-***a4f2', calls: 12450, quota: 50000, lastUsed: '2 min ago' },
  { client: 'District Collector Office', key: 'dc-office-***b8e1', calls: 8320, quota: 30000, lastUsed: '5 min ago' },
  { client: 'IHIP Integration', key: 'ihip-sync-***c3d7', calls: 5680, quota: 20000, lastUsed: '12 min ago' },
  { client: 'Mobile App (Android)', key: 'mob-andr-***f9a0', calls: 18900, quota: 100000, lastUsed: '1 min ago' },
  { client: 'Research Portal', key: 'res-port-***e5b3', calls: 3200, quota: 10000, lastUsed: '1 hr ago' },
  { client: 'Public Dashboard', key: 'pub-dash-***d2c8', calls: 22100, quota: 80000, lastUsed: 'Just now' },
];

const securityRules = {
  whitelist: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '103.21.58.0/24'],
  blacklist: ['45.33.92.156', '203.94.12.7', '78.46.91.3', '91.108.4.0/24'],
  cors: ['https://vyaadhishield.tn.gov.in', 'https://admin.vyaadhishield.in', 'http://localhost:3000'],
  authRequirements: [
    { endpoint: '/predict', auth: 'API Key + JWT', level: 'High' },
    { endpoint: '/alerts', auth: 'API Key', level: 'Medium' },
    { endpoint: '/citizen/report', auth: 'Aadhaar OTP', level: 'High' },
    { endpoint: '/analytics', auth: 'JWT (Admin)', level: 'Critical' },
    { endpoint: '/realtime', auth: 'WebSocket Token', level: 'High' },
  ],
};

const ddosMetrics = {
  status: 'Active',
  mitigated: 3,
  lastAttack: '2 hours ago',
  peakTraffic: '12,400 req/s',
  avgLatency: '2.1ms',
  firewallRules: 48,
};

function getStatusColor(status) {
  switch (status) {
    case 'normal': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    default: return '#6b7280';
  }
}

function getUsagePercent(current, limit) {
  return Math.round((current / limit) * 100);
}

export default function RateLimitingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total API Calls Today', value: '84,320', icon: Activity, color: '#6366f1', change: '+12%' },
    { label: 'Rate Limited Requests', value: '247', icon: Ban, color: '#ef4444', change: '+3.2%' },
    { label: 'Avg Response Time', value: '45ms', icon: Clock, color: '#f59e0b', change: '-8%' },
    { label: 'Uptime', value: '99.97%', icon: Server, color: '#10b981', change: '0%' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Shield size={28} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>API Rate Limiting & Security</h1>
        </div>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Monitor API traffic, enforce rate limits, and manage security rules
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <stat.icon size={20} style={{ color: stat.color }} />
              <span style={{
                fontSize: '12px',
                color: stat.change.startsWith('+') && stat.label.includes('Limited') ? '#ef4444' :
                  stat.change.startsWith('-') ? '#10b981' : '#10b981',
                fontWeight: 600
              }}>
                {stat.change}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#6366f1' }} />
            API Traffic (24 Hours)
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '3px', background: '#6366f1', borderRadius: '2px', display: 'inline-block' }} />
              Requests
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '3px', background: '#ef4444', borderRadius: '2px', display: 'inline-block', borderStyle: 'dashed' }} />
              Rate Limit Threshold
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trafficData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <ReferenceLine y={500} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Rate Limit', fill: '#ef4444', fontSize: 11 }} />
            <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} fill="url(#trafficGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rate Limit Configuration Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} style={{ color: '#f59e0b' }} />
          Rate Limit Configuration
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Endpoint Group</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Requests/Min</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Burst Limit</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Current Usage</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Usage %</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rateLimitConfig.map((row, i) => {
                const usagePct = getUsagePercent(row.currentUsage, row.reqPerMin);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 500, fontFamily: 'monospace', fontSize: '13px' }}>{row.group}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.reqPerMin}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.burstLimit}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{row.currentUsage}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <div style={{ width: '60px', height: '6px', background: 'rgba(148,163,184,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(usagePct, 100)}%`,
                            height: '100%',
                            background: getStatusColor(row.status),
                            borderRadius: '3px',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', color: getStatusColor(row.status), fontWeight: 600 }}>{usagePct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className="risk-badge" style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: `${getStatusColor(row.status)}22`,
                        color: getStatusColor(row.status),
                        textTransform: 'capitalize'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout: Blocked Requests + Security Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Blocked Requests Log */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ban size={18} style={{ color: '#ef4444' }} />
            Blocked Requests Log
          </h2>
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {blockedRequests.map((req, i) => (
              <div key={i} style={{
                padding: '12px',
                borderBottom: '1px solid rgba(148,163,184,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div className="flex-between">
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{req.time}</span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: req.action.includes('ban') ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: req.action.includes('ban') ? '#ef4444' : '#f59e0b',
                    fontWeight: 500
                  }}>
                    {req.action}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'monospace', color: '#e2e8f0' }}>{req.ip}</span>
                  <span style={{ fontSize: '12px', color: '#6366f1' }}>{req.endpoint}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#f87171' }}>{req.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Rules Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} style={{ color: '#10b981' }} />
            Security Rules
          </h2>

          {/* IP Whitelist */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> IP Whitelist
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {securityRules.whitelist.map((ip, i) => (
                <span key={i} style={{
                  fontSize: '11px', fontFamily: 'monospace', padding: '3px 8px',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '6px', color: '#10b981'
                }}>{ip}</span>
              ))}
            </div>
          </div>

          {/* IP Blacklist */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={14} /> IP Blacklist
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {securityRules.blacklist.map((ip, i) => (
                <span key={i} style={{
                  fontSize: '11px', fontFamily: 'monospace', padding: '3px 8px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '6px', color: '#ef4444'
                }}>{ip}</span>
              ))}
            </div>
          </div>

          {/* CORS */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} /> CORS Origins
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {securityRules.cors.map((origin, i) => (
                <span key={i} style={{
                  fontSize: '11px', fontFamily: 'monospace', padding: '3px 8px',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '6px', color: '#a5b4fc'
                }}>{origin}</span>
              ))}
            </div>
          </div>

          {/* Auth Requirements */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} /> Authentication Requirements
            </h3>
            {securityRules.authRequirements.map((rule, i) => (
              <div key={i} className="flex-between" style={{ padding: '6px 0', borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{rule.endpoint}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{rule.auth}</span>
                  <span style={{
                    fontSize: '10px', padding: '2px 6px', borderRadius: '6px', fontWeight: 600,
                    background: rule.level === 'Critical' ? 'rgba(239,68,68,0.15)' : rule.level === 'High' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                    color: rule.level === 'Critical' ? '#ef4444' : rule.level === 'High' ? '#f59e0b' : '#6366f1'
                  }}>{rule.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DDoS Protection + API Key Usage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* DDoS Protection */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: '#10b981' }} />
            DDoS Protection
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Wifi size={16} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>Protection Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Attacks Mitigated (24h)', value: ddosMetrics.mitigated, color: '#ef4444' },
              { label: 'Last Attack', value: ddosMetrics.lastAttack, color: '#f59e0b' },
              { label: 'Peak Traffic Handled', value: ddosMetrics.peakTraffic, color: '#6366f1' },
              { label: 'Mitigation Latency', value: ddosMetrics.avgLatency, color: '#10b981' },
              { label: 'Active Firewall Rules', value: ddosMetrics.firewallRules, color: '#8b5cf6' },
            ].map((item, i) => (
              <div key={i} className="flex-between">
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginBottom: '4px' }}>Auto-Scaling</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Rate limits auto-adjust during detected attacks. Current multiplier: 0.5x (restrictive mode)</div>
          </div>
        </div>

        {/* API Key Usage */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} style={{ color: '#8b5cf6' }} />
            API Key Usage by Client
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Client</th>
                  <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>API Key</th>
                  <th style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Calls Today</th>
                  <th style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Quota</th>
                  <th style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Usage</th>
                  <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>Last Used</th>
                </tr>
              </thead>
              <tbody>
                {apiKeyUsage.map((client, i) => {
                  const usagePct = Math.round((client.calls / client.quota) * 100);
                  const color = usagePct > 80 ? '#ef4444' : usagePct > 50 ? '#f59e0b' : '#10b981';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                      <td style={{ padding: '10px', fontWeight: 500, fontSize: '13px' }}>{client.client}</td>
                      <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>{client.key}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>{client.calls.toLocaleString()}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>{client.quota.toLocaleString()}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <div style={{ width: '50px', height: '6px', background: 'rgba(148,163,184,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${usagePct}%`, height: '100%', background: color, borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{usagePct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}>{client.lastUsed}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

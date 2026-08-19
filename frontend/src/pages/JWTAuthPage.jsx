import React, { useState } from 'react';
import {
  Shield,
  Key,
  Users,
  Clock,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ArrowRight,
  User,
  Activity,
  Globe,
  FileText
} from 'lucide-react';

const JWTAuthPage = () => {
  const [jwtInput, setJwtInput] = useState('');
  const [decodedToken, setDecodedToken] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [decodeError, setDecodeError] = useState('');

  const stats = [
    { label: 'Active Sessions', value: '1,247', icon: Users, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Token Expiry', value: '24h', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Roles Configured', value: '4', icon: Shield, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { label: 'API Keys Active', value: '18', icon: Key, color: '#ec4899', bg: 'rgba(236,72,153,0.15)' }
  ];

  const authFlowSteps = [
    { label: 'Login', desc: 'User submits credentials', color: '#6366f1' },
    { label: 'Validate', desc: 'Server verifies identity', color: '#8b5cf6' },
    { label: 'Generate JWT', desc: 'Create signed token', color: '#a855f7' },
    { label: 'Return Token', desc: 'Send to client', color: '#d946ef' },
    { label: 'Client Stores', desc: 'Save in localStorage', color: '#ec4899' },
    { label: 'Attach to Requests', desc: 'Authorization header', color: '#f43f5e' }
  ];

  const currentSession = {
    user: 'Dr. Sathiyanarayanan S',
    email: 'sathiya@tn.gov.in',
    role: 'Admin',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRyLiBTYXRoaXlhbmFyYXlhbmFuIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0MDYzNjAwLCJleHAiOjE3MjQxNTAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    issuedAt: '2026-08-19 08:00:00 IST',
    expiresAt: '2026-08-20 08:00:00 IST',
    refreshStatus: 'Active'
  };

  const roles = [
    {
      role: 'Admin',
      permissions: ['Full System Access', 'User Management', 'Model Retraining', 'API Key Generation', 'Audit Logs'],
      users: 3,
      color: '#ef4444'
    },
    {
      role: 'District Officer',
      permissions: ['View Dashboard', 'Manage Alerts', 'Generate Reports', 'Resource Allocation'],
      users: 37,
      color: '#f59e0b'
    },
    {
      role: 'Health Worker',
      permissions: ['View Assigned District', 'Citizen Reports', 'Vaccination Tracking', 'Field Data Entry'],
      users: 892,
      color: '#10b981'
    },
    {
      role: 'Citizen',
      permissions: ['View Public Dashboard', 'Submit Symptom Report', 'View Prevention Tips'],
      users: 15420,
      color: '#6366f1'
    }
  ];

  const apiKeys = [
    { id: 1, name: 'IMD Weather Sync', key: 'vshield_imd_****7f3a', scopes: ['weather:read', 'realtime:write'], created: '2026-06-15', lastUsed: '2026-08-19 13:30' },
    { id: 2, name: 'IHIP Data Fetch', key: 'vshield_ihip_****2b9e', scopes: ['disease:read', 'history:read'], created: '2026-07-01', lastUsed: '2026-08-19 12:45' },
    { id: 3, name: 'SMS Gateway', key: 'vshield_sms_****a1c4', scopes: ['notifications:write', 'alerts:read'], created: '2026-07-20', lastUsed: '2026-08-19 11:00' },
    { id: 4, name: 'Mobile App', key: 'vshield_app_****e8d2', scopes: ['predict:read', 'citizen:write'], created: '2026-08-01', lastUsed: '2026-08-19 13:44' },
    { id: 5, name: 'Analytics Export', key: 'vshield_exp_****5f7b', scopes: ['analytics:read', 'export:write'], created: '2026-08-10', lastUsed: '2026-08-18 22:00' }
  ];

  const securityLogs = [
    { id: 1, event: 'Login Success', user: 'Dr. Sathiyanarayanan S', ip: '192.168.1.45', time: '2026-08-19 13:40', type: 'success' },
    { id: 2, event: 'Token Refreshed', user: 'Officer Priya K', ip: '10.0.2.18', time: '2026-08-19 13:35', type: 'info' },
    { id: 3, event: 'Failed Login Attempt', user: 'unknown@test.com', ip: '203.45.67.89', time: '2026-08-19 13:28', type: 'danger' },
    { id: 4, event: 'API Key Used', user: 'IMD Weather Sync', ip: '10.0.1.5', time: '2026-08-19 13:25', type: 'info' },
    { id: 5, event: 'Role Changed', user: 'Rajesh M', ip: '192.168.1.50', time: '2026-08-19 13:15', type: 'warning' },
    { id: 6, event: 'Logout', user: 'Health Worker Anitha', ip: '10.0.3.22', time: '2026-08-19 13:10', type: 'info' },
    { id: 7, event: 'Failed Login Attempt', user: 'admin@fake.com', ip: '185.22.33.44', time: '2026-08-19 13:02', type: 'danger' },
    { id: 8, event: 'Token Expired', user: 'Officer Karthik R', ip: '10.0.2.30', time: '2026-08-19 12:55', type: 'warning' }
  ];

  const decodeJWT = (token) => {
    setDecodeError('');
    setDecodedToken(null);
    if (!token.trim()) {
      setDecodeError('Please paste a JWT token');
      return;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      setDecodeError('Invalid JWT format. A JWT must have 3 parts separated by dots.');
      return;
    }
    try {
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setDecodedToken({
        header,
        payload,
        signature: parts[2]
      });
    } catch (e) {
      setDecodeError('Failed to decode token. Ensure it is a valid Base64-encoded JWT.');
    }
  };

  const maskToken = (token) => {
    if (showToken) return token;
    return token.substring(0, 20) + '••••••••••••••••••••' + token.substring(token.length - 10);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} color="#10b981" />;
      case 'danger': return <XCircle size={16} color="#ef4444" />;
      case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
      default: return <Activity size={16} color="#6366f1" />;
    }
  };

  const getEventBg = (type) => {
    switch (type) {
      case 'success': return 'rgba(16,185,129,0.1)';
      case 'danger': return 'rgba(239,68,68,0.1)';
      case 'warning': return 'rgba(245,158,11,0.1)';
      default: return 'rgba(99,102,241,0.1)';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={32} color="#6366f1" />
          JWT Authentication
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '6px', fontSize: '14px' }}>
          Token-based authentication, role management, and security monitoring
        </p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        {stats.map((stat, i) => (
          <div className="glass-card" key={i} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Authentication Flow Diagram */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={20} color="#6366f1" />
          Authentication Flow
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', padding: '16px 0' }}>
          {authFlowSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                border: `1px solid ${step.color}44`,
                textAlign: 'center',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: step.color, marginBottom: '4px' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{step.desc}</div>
              </div>
              {i < authFlowSteps.length - 1 && (
                <ArrowRight size={20} color="#64748b" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Session + RBAC */}
      <div className="grid-cols-3" style={{ marginBottom: '28px', gridTemplateColumns: '1fr 2fr' }}>
        {/* Current Session */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#10b981" />
            Current Session
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>User</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{currentSession.user}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Email</div>
              <div style={{ fontSize: '14px' }}>{currentSession.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Role</div>
              <span className="risk-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                {currentSession.role}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Token
                <button onClick={() => setShowToken(!showToken)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                  {showToken ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
                </button>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', wordBreak: 'break-all', color: '#e2e8f0' }}>
                {maskToken(currentSession.token)}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Issued At</div>
                <div style={{ fontSize: '12px' }}>{currentSession.issuedAt}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Expires At</div>
                <div style={{ fontSize: '12px' }}>{currentSession.expiresAt}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Refresh Token</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#10b981" />
                <span style={{ fontSize: '13px', color: '#10b981' }}>{currentSession.refreshStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Access Control */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="#f59e0b" />
            Role-Based Access Control
          </h2>
          <div className="data-table" style={{ width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Permissions</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Users</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: `${r.color}22`, color: r.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                        {r.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {r.permissions.map((p, j) => (
                          <span key={j} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontWeight: 600, fontSize: '14px' }}>
                      {r.users.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Token Decoder */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#a855f7" />
          JWT Token Decoder
        </h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            className="input-control"
            type="text"
            placeholder="Paste a JWT token here (e.g., eyJhbGciOiJIUzI1NiIs...)"
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', fontSize: '13px', fontFamily: 'monospace' }}
          />
          <button
            className="btn btn-primary"
            onClick={() => decodeJWT(jwtInput)}
            style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Unlock size={16} />
            Decode
          </button>
        </div>
        {decodeError && (
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#ef4444" />
            {decodeError}
          </div>
        )}
        {decodedToken && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1', marginBottom: '8px' }}>HEADER</div>
              <pre style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e2e8f0', whiteSpace: 'pre-wrap', margin: 0 }}>
                {JSON.stringify(decodedToken.header, null, 2)}
              </pre>
            </div>
            <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#a855f7', marginBottom: '8px' }}>PAYLOAD</div>
              <pre style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e2e8f0', whiteSpace: 'pre-wrap', margin: 0 }}>
                {JSON.stringify(decodedToken.payload, null, 2)}
              </pre>
            </div>
            <div style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#ec4899', marginBottom: '8px' }}>SIGNATURE</div>
              <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e2e8f0', wordBreak: 'break-all' }}>
                {decodedToken.signature}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Key Management */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Key size={20} color="#ec4899" />
            API Key Management
          </h2>
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={14} />
            Generate New Key
          </button>
        </div>
        <div className="data-table">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Key</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Scopes</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Created</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Last Used</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{key.name}</td>
                  <td style={{ padding: '12px' }}>
                    <code style={{ fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', color: '#94a3b8' }}>
                      {key.key}
                    </code>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {key.scopes.map((scope, j) => (
                        <span key={j} style={{ fontSize: '10px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px' }}>
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8' }}>{key.created}</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#94a3b8' }}>{key.lastUsed}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={12} />
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Log */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#10b981" />
          Security Log
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {securityLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: getEventBg(log.type),
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {getEventIcon(log.type)}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{log.event}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '12px' }}>{log.user}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                <Globe size={12} />
                {log.ip}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', minWidth: '150px', textAlign: 'right' }}>
                {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JWTAuthPage;

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Globe,
  RefreshCw,
  CheckCircle,
  XCircle,
  Database,
  ArrowRight,
  Shield,
  Clock,
  Server,
  Activity
} from 'lucide-react';

const SYNC_LOG = [
  { id: 1, timestamp: '2026-08-17 14:15:00', records: 1284, status: 'success' },
  { id: 2, timestamp: '2026-08-17 12:00:00', records: 1156, status: 'success' },
  { id: 3, timestamp: '2026-08-17 08:00:00', records: 1342, status: 'success' },
  { id: 4, timestamp: '2026-08-16 20:00:00', records: 1089, status: 'success' },
  { id: 5, timestamp: '2026-08-16 16:00:00', records: 987, status: 'failed' },
  { id: 6, timestamp: '2026-08-16 12:00:00', records: 1201, status: 'success' },
  { id: 7, timestamp: '2026-08-16 08:00:00', records: 1345, status: 'success' },
  { id: 8, timestamp: '2026-08-15 20:00:00', records: 1178, status: 'success' },
  { id: 9, timestamp: '2026-08-15 16:00:00', records: 0, status: 'failed' },
  { id: 10, timestamp: '2026-08-15 12:00:00', records: 1267, status: 'success' }
];

const CONNECTED_DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul',
  'Kanchipuram', 'Villupuram', 'Cuddalore', 'Nagapattinam', 'Theni',
  'Sivaganga', 'Ramanathapuram', 'Virudhunagar', 'Thoothukudi', 'Tiruvannamalai',
  'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Perambalur', 'Ariyalur',
  'Karur', 'Pudukkottai', 'Nilgiris', 'Tiruppur', 'Kanyakumari',
  'Tiruvarur', 'Kallakurichi', 'Ranipet', 'Tenaksi', 'Chengalpattu'
];

const COVERAGE_DATA = [
  { name: 'Connected', count: 35 },
  { name: 'Pending', count: 2 }
];

export const IHIPIntegrationPage = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState(SYNC_LOG);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newEntry = {
        id: 0,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        records: 1398,
        status: 'success'
      };
      setSyncLog([newEntry, ...syncLog.slice(0, 9)]);
      setIsSyncing(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>IHIP Integration Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Integrated Health Information Platform - National Health Data Sync
          </p>
        </div>
        <button
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="btn btn-primary"
          style={{ minWidth: '160px' }}
        >
          <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Connection Status</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>Connected</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Clock size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Last Sync</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>14:15 IST</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>17 Aug 2026</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Database size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Data Points Synced</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>2,84,619</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cumulative total</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Activity size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Districts Connected</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>35 / 37</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>94.6% coverage</p>
        </div>
      </div>

      {/* API Configuration */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} style={{ color: 'var(--accent-primary)' }} />
          API Endpoint Configuration
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>IHIP Base URL</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>https://ihip.nhp.gov.in/api/v2</td>
                <td><span style={{ color: '#10b981', fontSize: '12px' }}>Active</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Auth Token</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>eyJhbG...****...xK9w</td>
                <td><span style={{ color: '#10b981', fontSize: '12px' }}>Valid</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Sync Interval</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Every 4 hours</td>
                <td><span style={{ color: '#10b981', fontSize: '12px' }}>Scheduled</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Data Format</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>HL7 FHIR R4 JSON</td>
                <td><span style={{ color: '#10b981', fontSize: '12px' }}>Compliant</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '16px' }}>Data Flow Architecture</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', padding: '20px 0' }}>
          <div style={{ padding: '16px 24px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--accent-primary)', borderRadius: '8px', textAlign: 'center' }}>
            <Database size={24} style={{ color: 'var(--accent-primary)', marginBottom: '6px' }} />
            <p style={{ fontSize: '13px', fontWeight: 600 }}>VyaadhiShield AI</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Local Disease Data</p>
          </div>
          <ArrowRight size={24} style={{ color: 'var(--text-muted)' }} />
          <div style={{ padding: '16px 24px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06b6d4', borderRadius: '8px', textAlign: 'center' }}>
            <Server size={24} style={{ color: '#06b6d4', marginBottom: '6px' }} />
            <p style={{ fontSize: '13px', fontWeight: 600 }}>IHIP API Gateway</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Secure REST Endpoint</p>
          </div>
          <ArrowRight size={24} style={{ color: 'var(--text-muted)' }} />
          <div style={{ padding: '16px 24px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
            <Globe size={24} style={{ color: '#10b981', marginBottom: '6px' }} />
            <p style={{ fontSize: '13px', fontWeight: 600 }}>National Health Dashboard</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MoHFW India</p>
          </div>
        </div>
      </div>

      {/* Sync Log */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
          Sync Log (Last 10 Events)
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Records Pushed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {syncLog.map((entry, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{entry.timestamp}</td>
                  <td style={{ fontWeight: 600 }}>{entry.records.toLocaleString()}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {entry.status === 'success' ? (
                        <CheckCircle size={14} style={{ color: '#10b981' }} />
                      ) : (
                        <XCircle size={14} style={{ color: '#ef4444' }} />
                      )}
                      <span style={{ color: entry.status === 'success' ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                        {entry.status}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* District Coverage */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>IHIP-Connected Districts</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CONNECTED_DISTRICTS.map((d) => (
                <span key={d} style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  {d}
                </span>
              ))}
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                Mayiladuthurai (Pending)
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                Tenkasi (Pending)
              </span>
            </div>
          </div>
          <div style={{ width: '250px', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COVERAGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-strong)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Compliance Card */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} style={{ color: '#10b981' }} />
          Compliance and Standards
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>ABDM Standards</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Fully compliant with Ayushman Bharat Digital Mission data exchange protocols.
            </p>
          </div>
          <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>HL7 FHIR R4</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              All data payloads conform to HL7 FHIR R4 resource specifications for interoperability.
            </p>
          </div>
          <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Data Encryption</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              TLS 1.3 in transit, AES-256 at rest. All PII fields are tokenized before transmission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IHIPIntegrationPage;

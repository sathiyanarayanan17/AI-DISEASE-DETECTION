import React, { useState } from 'react';
import {
  MapPin, Shield, Users, Bell, Circle, Plus, Send,
  Smartphone, CheckCircle, XCircle, AlertTriangle,
  Radio, Target, Navigation, Clock, UserCheck, UserX
} from 'lucide-react';

const GeoFencingPage = () => {
  const [newZone, setNewZone] = useState({
    name: '',
    district: 'Chennai',
    radius: 5,
    riskThreshold: 'High',
    message: ''
  });

  const stats = [
    { label: 'Active Geo-Fences', value: 24, icon: Shield, color: '#6366f1' },
    { label: 'Citizens in Zones', value: '1,847', icon: Users, color: '#10b981' },
    { label: 'Alerts Triggered Today', value: 63, icon: Bell, color: '#f59e0b' },
    { label: 'Zones Monitored', value: 37, icon: Radio, color: '#ec4899' }
  ];

  const zones = [
    { name: 'Chennai Central Dengue Zone', district: 'Chennai', radius: 3.5, risk: 'Critical', citizens: 412, status: 'Active' },
    { name: 'Coimbatore Malaria Belt', district: 'Coimbatore', radius: 5.0, risk: 'High', citizens: 287, status: 'Active' },
    { name: 'Madurai Cholera Watch', district: 'Madurai', radius: 4.2, risk: 'Medium', citizens: 198, status: 'Active' },
    { name: 'Salem Dengue Cluster', district: 'Salem', radius: 2.8, risk: 'High', citizens: 156, status: 'Paused' },
    { name: 'Tiruchirappalli Flood Zone', district: 'Tiruchirappalli', radius: 6.0, risk: 'Medium', citizens: 324, status: 'Active' },
    { name: 'Tirunelveli Waterborne', district: 'Tirunelveli', radius: 3.0, risk: 'Low', citizens: 89, status: 'Paused' },
    { name: 'Vellore Vector Watch', district: 'Vellore', radius: 4.5, risk: 'High', citizens: 201, status: 'Active' },
    { name: 'Erode Seasonal Alert', district: 'Erode', radius: 3.2, risk: 'Medium', citizens: 180, status: 'Active' }
  ];

  const mapZones = [
    { name: 'Chennai', x: 78, y: 28, radius: 28, risk: 'Critical' },
    { name: 'Coimbatore', x: 35, y: 55, radius: 24, risk: 'High' },
    { name: 'Madurai', x: 52, y: 70, radius: 22, risk: 'Medium' },
    { name: 'Salem', x: 42, y: 42, radius: 18, risk: 'High' },
    { name: 'Tiruchirappalli', x: 52, y: 55, radius: 26, risk: 'Medium' },
    { name: 'Tirunelveli', x: 48, y: 88, radius: 16, risk: 'Low' },
    { name: 'Vellore', x: 65, y: 22, radius: 20, risk: 'High' },
    { name: 'Erode', x: 38, y: 48, radius: 18, risk: 'Medium' }
  ];

  const alertLog = [
    { time: '13:24', citizenId: 'CZ-4821', zone: 'Chennai Central Dengue Zone', type: 'Zone Entry', sent: true },
    { time: '13:18', citizenId: 'CZ-1092', zone: 'Coimbatore Malaria Belt', type: 'Risk Escalation', sent: true },
    { time: '13:05', citizenId: 'CZ-7734', zone: 'Madurai Cholera Watch', type: 'Zone Entry', sent: true },
    { time: '12:51', citizenId: 'CZ-3301', zone: 'Vellore Vector Watch', type: 'Proximity Warning', sent: false },
    { time: '12:44', citizenId: 'CZ-5590', zone: 'Salem Dengue Cluster', type: 'Zone Entry', sent: true },
    { time: '12:30', citizenId: 'CZ-2287', zone: 'Tiruchirappalli Flood Zone', type: 'Risk Escalation', sent: true }
  ];

  const optInStats = {
    totalRegistered: 12480,
    optedIn: 10236,
    optedOut: 2244,
    pendingConsent: 418
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
    'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Dindigul',
    'Kanchipuram', 'Cuddalore', 'Nagapattinam', 'Ramanathapuram'
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin size={28} style={{ color: '#6366f1' }} />
          Geo-Fencing Disease Alerts
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>
          Location-based alert zones for proactive citizen health notifications
        </p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between">
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 700 }}>{s.value}</p>
              </div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <s.icon size={24} style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Management Table + Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Table */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} style={{ color: '#6366f1' }} />
            Zone Management
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>District</th>
                  <th>Radius</th>
                  <th>Risk Level</th>
                  <th>Citizens</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, fontSize: '13px' }}>{z.name}</td>
                    <td>{z.district}</td>
                    <td>{z.radius} km</td>
                    <td>
                      <span className="risk-badge" style={{
                        background: `${getRiskColor(z.risk)}20`,
                        color: getRiskColor(z.risk),
                        padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600
                      }}>
                        {z.risk}
                      </span>
                    </td>
                    <td>{z.citizens}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        color: z.status === 'Active' ? '#10b981' : '#f59e0b',
                        fontSize: '13px', fontWeight: 500
                      }}>
                        <span className={z.status === 'Active' ? 'pulse-dot' : ''} style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: z.status === 'Active' ? '#10b981' : '#f59e0b',
                          display: 'inline-block'
                        }} />
                        {z.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grid Map */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={18} style={{ color: '#10b981' }} />
            Zone Map (Tamil Nadu)
          </h3>
          <div style={{
            position: 'relative', width: '100%', height: '340px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(16,185,129,0.05))',
            borderRadius: '12px', border: '1px solid rgba(148,163,184,0.15)', overflow: 'hidden'
          }}>
            {/* TN outline suggestion */}
            <div style={{
              position: 'absolute', top: '10px', left: '10px',
              fontSize: '11px', color: '#64748b', background: 'rgba(30,41,59,0.6)',
              padding: '4px 8px', borderRadius: '6px'
            }}>
              Tamil Nadu Districts
            </div>
            {mapZones.map((zone, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${zone.x}%`, top: `${zone.y}%`,
                transform: 'translate(-50%, -50%)'
              }}>
                {/* Outer pulse ring */}
                <div style={{
                  width: `${zone.radius * 2}px`, height: `${zone.radius * 2}px`,
                  borderRadius: '50%',
                  background: `${getRiskColor(zone.risk)}15`,
                  border: `2px solid ${getRiskColor(zone.risk)}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse 2s infinite'
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: getRiskColor(zone.risk)
                  }} />
                </div>
                <div style={{
                  position: 'absolute', top: '100%', left: '50%',
                  transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                  fontSize: '10px', color: '#94a3b8', marginTop: '4px', fontWeight: 500
                }}>
                  {zone.name}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center' }}>
            {['Critical', 'High', 'Medium', 'Low'].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                <Circle size={10} fill={getRiskColor(r)} stroke="none" />
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Log + Push Notification Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Alert Log */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: '#f59e0b' }} />
            Alert Log (Today)
          </h3>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Citizen ID</th>
                <th>Zone Entered</th>
                <th>Alert Type</th>
                <th>Sent</th>
              </tr>
            </thead>
            <tbody>
              {alertLog.map((a, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{a.time}</td>
                  <td style={{ fontWeight: 500 }}>{a.citizenId}</td>
                  <td style={{ fontSize: '12px' }}>{a.zone}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                      background: a.type === 'Risk Escalation' ? '#ef444420' : a.type === 'Proximity Warning' ? '#f59e0b20' : '#6366f120',
                      color: a.type === 'Risk Escalation' ? '#ef4444' : a.type === 'Proximity Warning' ? '#f59e0b' : '#6366f1'
                    }}>
                      {a.type}
                    </span>
                  </td>
                  <td>
                    {a.sent
                      ? <CheckCircle size={16} style={{ color: '#10b981' }} />
                      : <XCircle size={16} style={{ color: '#ef4444' }} />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Push Notification Preview */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} style={{ color: '#ec4899' }} />
            Push Notification Preview
          </h3>
          <div style={{
            background: '#1e293b', borderRadius: '24px', padding: '16px',
            border: '2px solid #334155', maxWidth: '300px', margin: '0 auto'
          }}>
            {/* Phone status bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '12px', padding: '0 4px' }}>
              <span>1:33 PM</span>
              <span>●●●●○ 85%</span>
            </div>
            {/* Notification card */}
            <div style={{
              background: 'rgba(99,102,241,0.15)', borderRadius: '14px', padding: '14px',
              border: '1px solid rgba(99,102,241,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AlertTriangle size={14} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>VyaadhiShield Alert</p>
                  <p style={{ fontSize: '10px', color: '#64748b' }}>now</p>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                ⚠️ <strong>Dengue Risk Zone Alert</strong><br />
                You have entered a high-risk dengue area in Chennai Central. Use mosquito repellent and avoid stagnant water areas.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button style={{
                  flex: 1, padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                  background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer'
                }}>View Details</button>
                <button style={{
                  flex: 1, padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                  background: 'rgba(148,163,184,0.2)', color: '#94a3b8', border: 'none', cursor: 'pointer'
                }}>Dismiss</button>
              </div>
            </div>
            {/* Second notification */}
            <div style={{
              background: 'rgba(245,158,11,0.12)', borderRadius: '14px', padding: '14px',
              border: '1px solid rgba(245,158,11,0.25)', marginTop: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MapPin size={14} style={{ color: '#f59e0b' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#fbbf24' }}>Proximity Warning</p>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                You are 500m from a cholera outbreak zone in Madurai. Consider alternate routes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Creation Form + Opt-In/Out Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Zone Creation Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: '#10b981' }} />
            Create New Geo-Fence Zone
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Zone Name</label>
              <input
                className="input-control"
                type="text"
                placeholder="e.g., Dengue Hotspot Zone A"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>District</label>
              <select
                className="input-control"
                value={newZone.district}
                onChange={(e) => setNewZone({ ...newZone, district: e.target.value })}
                style={{ width: '100%' }}
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                Radius: {newZone.radius} km
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={newZone.radius}
                onChange={(e) => setNewZone({ ...newZone, radius: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                <span>1 km</span>
                <span>15 km</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Risk Threshold</label>
              <select
                className="input-control"
                value={newZone.riskThreshold}
                onChange={(e) => setNewZone({ ...newZone, riskThreshold: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Notification Message</label>
              <textarea
                className="input-control"
                rows={3}
                placeholder="Alert message to send to citizens entering this zone..."
                value={newZone.message}
                onChange={(e) => setNewZone({ ...newZone, message: e.target.value })}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} />
              Create Zone
            </button>
            <button className="btn" style={{
              background: 'rgba(148,163,184,0.15)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)',
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <Send size={16} />
              Test Notification
            </button>
          </div>
        </div>

        {/* Opt-In/Opt-Out Statistics */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} style={{ color: '#10b981' }} />
            Opt-In / Opt-Out Statistics
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Registered Citizens</span>
              <span style={{ fontWeight: 700, fontSize: '18px' }}>{optInStats.totalRegistered.toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(148,163,184,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${(optInStats.optedIn / optInStats.totalRegistered) * 100}%`,
                height: '100%', background: 'linear-gradient(90deg, #10b981, #6366f1)', borderRadius: '4px'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
              background: 'rgba(16,185,129,0.08)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)'
            }}>
              <UserCheck size={20} style={{ color: '#10b981' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Opted In</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{optInStats.optedIn.toLocaleString()}</p>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>
                {((optInStats.optedIn / optInStats.totalRegistered) * 100).toFixed(1)}%
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
              background: 'rgba(239,68,68,0.08)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)'
            }}>
              <UserX size={20} style={{ color: '#ef4444' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Opted Out</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{optInStats.optedOut.toLocaleString()}</p>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444' }}>
                {((optInStats.optedOut / optInStats.totalRegistered) * 100).toFixed(1)}%
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
              background: 'rgba(245,158,11,0.08)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)'
            }}>
              <Clock size={20} style={{ color: '#f59e0b' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Pending Consent</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>{optInStats.pendingConsent.toLocaleString()}</p>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>
                {((optInStats.pendingConsent / optInStats.totalRegistered) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div style={{
            marginTop: '16px', padding: '12px', borderRadius: '10px',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '12px', color: '#94a3b8', lineHeight: '1.6'
          }}>
            <strong style={{ color: '#a5b4fc' }}>Privacy Notice:</strong> Geo-fence alerts require explicit citizen consent.
            Location data is anonymized and not stored beyond real-time processing.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoFencingPage;

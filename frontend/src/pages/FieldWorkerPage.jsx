import React, { useState } from 'react';
import { Users, MapPin, Activity, Clock, CheckCircle, AlertTriangle, Navigation, Clipboard, Send } from 'lucide-react';

const mockWorkers = [
  { id: 'FW-001', name: 'Rajesh Kumar', district: 'Chennai', status: 'Active', location: 'T. Nagar', visitsToday: 8, lastCheckin: '13:15', lat: 3, col: 7 },
  { id: 'FW-002', name: 'Priya Shankar', district: 'Coimbatore', status: 'Active', location: 'RS Puram', visitsToday: 6, lastCheckin: '13:02', lat: 5, col: 3 },
  { id: 'FW-003', name: 'Murugan S', district: 'Madurai', status: 'Break', location: 'Meenakshi Amman', visitsToday: 5, lastCheckin: '12:30', lat: 7, col: 5 },
  { id: 'FW-004', name: 'Lakshmi R', district: 'Tiruchirappalli', status: 'Active', location: 'Srirangam', visitsToday: 7, lastCheckin: '13:10', lat: 6, col: 4 },
  { id: 'FW-005', name: 'Anand V', district: 'Salem', status: 'Active', location: 'Fairlands', visitsToday: 9, lastCheckin: '13:20', lat: 4, col: 3 },
  { id: 'FW-006', name: 'Deepa M', district: 'Tirunelveli', status: 'Off-duty', location: 'Palayamkottai', visitsToday: 0, lastCheckin: '08:00', lat: 9, col: 5 },
  { id: 'FW-007', name: 'Karthik N', district: 'Vellore', status: 'Active', location: 'Katpadi', visitsToday: 6, lastCheckin: '13:05', lat: 2, col: 5 },
  { id: 'FW-008', name: 'Saranya P', district: 'Thanjavur', status: 'Active', location: 'Big Temple', visitsToday: 7, lastCheckin: '12:58', lat: 7, col: 6 },
  { id: 'FW-009', name: 'Vignesh K', district: 'Erode', status: 'Break', location: 'Perundurai', visitsToday: 4, lastCheckin: '12:15', lat: 4, col: 2 },
  { id: 'FW-010', name: 'Meena S', district: 'Kancheepuram', status: 'Active', location: 'Silk Town', visitsToday: 8, lastCheckin: '13:18', lat: 3, col: 6 },
  { id: 'FW-011', name: 'Suresh B', district: 'Dindigul', status: 'Active', location: 'Kodaikanal Rd', visitsToday: 5, lastCheckin: '12:45', lat: 6, col: 4 },
  { id: 'FW-012', name: 'Revathi A', district: 'Nagapattinam', status: 'Off-duty', location: 'Velankanni', visitsToday: 0, lastCheckin: '07:45', lat: 8, col: 7 },
];

const activityLog = [
  { worker: 'Rajesh Kumar', time: '13:15', activity: 'Survey', location: 'T. Nagar Ward 5' },
  { worker: 'Priya Shankar', time: '13:02', activity: 'Fogging', location: 'RS Puram Block B' },
  { worker: 'Lakshmi R', time: '13:10', activity: 'Sample Collection', location: 'Srirangam Water Tank' },
  { worker: 'Anand V', time: '13:20', activity: 'Vaccination', location: 'Fairlands PHC' },
  { worker: 'Karthik N', time: '13:05', activity: 'Survey', location: 'Katpadi Slum Area' },
  { worker: 'Saranya P', time: '12:58', activity: 'Sample Collection', location: 'Big Temple Canal' },
  { worker: 'Meena S', time: '13:18', activity: 'Fogging', location: 'Silk Town Ward 3' },
  { worker: 'Suresh B', time: '12:45', activity: 'Vaccination', location: 'Kodaikanal Rd Clinic' },
  { worker: 'Rajesh Kumar', time: '12:30', activity: 'Sample Collection', location: 'T. Nagar Lake' },
  { worker: 'Anand V', time: '12:10', activity: 'Survey', location: 'Fairlands Ward 2' },
];

const performanceMetrics = [
  { worker: 'Rajesh Kumar', avgVisits: 7.8, coverage: 94, responseTime: '12 min' },
  { worker: 'Priya Shankar', avgVisits: 6.2, coverage: 88, responseTime: '15 min' },
  { worker: 'Anand V', avgVisits: 8.1, coverage: 96, responseTime: '10 min' },
  { worker: 'Lakshmi R', avgVisits: 7.0, coverage: 91, responseTime: '13 min' },
  { worker: 'Karthik N', avgVisits: 6.5, coverage: 85, responseTime: '18 min' },
  { worker: 'Saranya P', avgVisits: 7.3, coverage: 92, responseTime: '11 min' },
];

const districts = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Thanjavur', 'Erode', 'Kancheepuram', 'Dindigul', 'Nagapattinam'];

export default function FieldWorkerPage() {
  const [assignWorker, setAssignWorker] = useState('');
  const [assignDistrict, setAssignDistrict] = useState('');
  const [assignPriority, setAssignPriority] = useState('Medium');
  const [assignments, setAssignments] = useState([]);

  const activeWorkers = mockWorkers.filter(w => w.status === 'Active').length;
  const districtsCovert = new Set(mockWorkers.filter(w => w.status !== 'Off-duty').map(w => w.district)).size;
  const totalVisits = mockWorkers.reduce((sum, w) => sum + w.visitsToday, 0);
  const avgResponse = '13 min';

  const getStatusColor = (status) => {
    if (status === 'Active') return '#10b981';
    if (status === 'Break') return '#f59e0b';
    return '#6b7280';
  };

  const getStatusBg = (status) => {
    if (status === 'Active') return 'rgba(16,185,129,0.15)';
    if (status === 'Break') return 'rgba(245,158,11,0.15)';
    return 'rgba(107,114,128,0.15)';
  };

  const getActivityColor = (activity) => {
    if (activity === 'Survey') return '#6366f1';
    if (activity === 'Fogging') return '#f59e0b';
    if (activity === 'Sample Collection') return '#06b6d4';
    if (activity === 'Vaccination') return '#10b981';
    return '#8b5cf6';
  };

  const handleAssign = () => {
    if (assignWorker && assignDistrict) {
      setAssignments(prev => [...prev, { worker: assignWorker, district: assignDistrict, priority: assignPriority, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
      setAssignWorker('');
      setAssignDistrict('');
      setAssignPriority('Medium');
    }
  };

  const gridSize = 10;

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Navigation size={28} color="#6366f1" />
          Field Health Worker GPS Tracking
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Real-time monitoring of field health workers across Tamil Nadu districts</p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Active Workers', value: activeWorkers, icon: <Users size={22} />, color: '#10b981' },
          { label: 'Districts Covered', value: districtsCovert, icon: <MapPin size={22} />, color: '#6366f1' },
          { label: 'Visits Today', value: totalVisits, icon: <Activity size={22} />, color: '#f59e0b' },
          { label: 'Avg Response Time', value: avgResponse, icon: <Clock size={22} />, color: '#06b6d4' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between">
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
              </div>
              <div style={{ background: `${stat.color}20`, padding: '12px', borderRadius: '12px', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Worker List Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#6366f1" /> Worker Directory
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>District</th>
                <th>Status</th>
                <th>Current Location</th>
                <th>Visits Today</th>
                <th>Last Check-in</th>
              </tr>
            </thead>
            <tbody>
              {mockWorkers.map((w, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{w.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{w.id}</td>
                  <td>{w.district}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: getStatusBg(w.status), color: getStatusColor(w.status),
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      <span className="pulse-dot" style={{ background: getStatusColor(w.status), width: '8px', height: '8px', borderRadius: '50%' }}></span>
                      {w.status}
                    </span>
                  </td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#6366f1" /> {w.location}
                  </td>
                  <td style={{ fontWeight: 600 }}>{w.visitsToday}</td>
                  <td>{w.lastCheckin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Grid + Activity Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Map-like Grid */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#10b981" /> Worker Position Grid — Tamil Nadu
          </h2>
          <div style={{
            display: 'grid', gridTemplateRows: `repeat(${gridSize}, 1fr)`, gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '2px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', padding: '12px',
            border: '1px solid rgba(99,102,241,0.15)', minHeight: '320px'
          }}>
            {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
              const row = Math.floor(idx / gridSize);
              const col = idx % gridSize;
              const worker = mockWorkers.find(w => w.lat === row && w.col === col);
              return (
                <div key={idx} style={{
                  width: '100%', aspectRatio: '1', borderRadius: '4px',
                  background: worker ? 'transparent' : 'rgba(148,163,184,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(148,163,184,0.08)',
                  position: 'relative'
                }}>
                  {worker && (
                    <div title={`${worker.name} — ${worker.district}`} style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: getStatusColor(worker.status),
                      boxShadow: `0 0 8px ${getStatusColor(worker.status)}80`,
                      cursor: 'pointer', transition: 'transform 0.2s',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> Active
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span> Break
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6b7280' }}></span> Off-duty
            </span>
          </div>
        </div>

        {/* Daily Activity Log */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clipboard size={18} color="#f59e0b" /> Daily Activity Log
          </h2>
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {activityLog.map((log, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                borderBottom: '1px solid rgba(148,163,184,0.1)', transition: 'background 0.2s'
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: getActivityColor(log.activity), flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{log.worker}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{log.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{
                      fontSize: '0.78rem', padding: '2px 8px', borderRadius: '8px',
                      background: `${getActivityColor(log.activity)}20`, color: getActivityColor(log.activity), fontWeight: 600
                    }}>{log.activity}</span>
                    <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{log.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            {['Survey', 'Fogging', 'Sample Collection', 'Vaccination'].map(a => (
              <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getActivityColor(a) }}></span> {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics + Task Assignment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* Performance Metrics */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#06b6d4" /> Performance Metrics
          </h2>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Avg Visits/Day</th>
                  <th>Coverage %</th>
                  <th>Response Time</th>
                </tr>
              </thead>
              <tbody>
                {performanceMetrics.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{m.worker}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: m.avgVisits >= 7 ? '#10b981' : '#f59e0b' }}>
                        {m.avgVisits}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(148,163,184,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${m.coverage}%`, height: '100%', background: m.coverage >= 90 ? '#10b981' : '#f59e0b', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: m.coverage >= 90 ? '#10b981' : '#f59e0b' }}>{m.coverage}%</span>
                      </div>
                    </td>
                    <td>{m.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(99,102,241,0.05)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981' }}>7.2</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Team Avg Visits/Day</p>
              </div>
              <div>
                <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6366f1' }}>91%</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Team Avg Coverage</p>
              </div>
              <div>
                <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#06b6d4' }}>13 min</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Team Avg Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Assignment Panel */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#8b5cf6" /> Task Assignment
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Worker</label>
              <select
                className="input-control"
                value={assignWorker}
                onChange={e => setAssignWorker(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.2)', color: 'inherit' }}
              >
                <option value="">Select Worker</option>
                {mockWorkers.filter(w => w.status === 'Active').map(w => (
                  <option key={w.id} value={w.name}>{w.name} ({w.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Assign to District</label>
              <select
                className="input-control"
                value={assignDistrict}
                onChange={e => setAssignDistrict(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.2)', color: 'inherit' }}
              >
                <option value="">Select District</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Priority</label>
              <select
                className="input-control"
                value={assignPriority}
                onChange={e => setAssignPriority(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(148,163,184,0.2)', color: 'inherit' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAssign}
              style={{ marginTop: '4px', padding: '10px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Send size={16} /> Assign Task
            </button>
          </div>

          {assignments.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>Recent Assignments</p>
              <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {assignments.slice().reverse().map((a, i) => (
                  <div key={i} style={{
                    padding: '8px 10px', marginBottom: '6px', borderRadius: '8px',
                    background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
                    fontSize: '0.82rem'
                  }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: 500 }}>{a.worker}</span>
                      <span style={{
                        fontSize: '0.72rem', padding: '2px 6px', borderRadius: '6px',
                        background: a.priority === 'Critical' ? 'rgba(239,68,68,0.15)' : a.priority === 'High' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.1)',
                        color: a.priority === 'Critical' ? '#ef4444' : a.priority === 'High' ? '#f59e0b' : '#6366f1',
                        fontWeight: 600
                      }}>{a.priority}</span>
                    </div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>
                      → {a.district} at {a.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

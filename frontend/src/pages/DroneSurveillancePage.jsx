import React, { useState } from 'react';
import {
  Plane,
  MapPin,
  Bug,
  Droplets,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Calendar,
  Navigation,
  Activity,
  Eye
} from 'lucide-react';

const stats = [
  { label: 'Drones Active', value: 12, icon: Plane, color: '#6366f1' },
  { label: 'Areas Scanned (km²)', value: 348, icon: MapPin, color: '#10b981' },
  { label: 'Breeding Sites Found', value: 87, icon: Bug, color: '#f59e0b' },
  { label: 'Water Bodies Mapped', value: 214, icon: Droplets, color: '#3b82f6' }
];

const missionLog = [
  { droneId: 'DRN-001', district: 'Chennai', area: 'Tondiarpet', startTime: '2026-08-19 06:30', duration: '1h 20m', sitesFound: 5, status: 'Completed' },
  { droneId: 'DRN-003', district: 'Coimbatore', area: 'RS Puram', startTime: '2026-08-19 07:00', duration: '55m', sitesFound: 3, status: 'Completed' },
  { droneId: 'DRN-007', district: 'Madurai', area: 'Periyar Nagar', startTime: '2026-08-19 08:15', duration: '1h 05m', sitesFound: 7, status: 'Completed' },
  { droneId: 'DRN-002', district: 'Tiruchirappalli', area: 'Srirangam', startTime: '2026-08-19 09:00', duration: '42m', sitesFound: 2, status: 'In Progress' },
  { droneId: 'DRN-005', district: 'Salem', area: 'Hasthampatti', startTime: '2026-08-19 09:30', duration: '—', sitesFound: 0, status: 'In Progress' },
  { droneId: 'DRN-009', district: 'Vellore', area: 'Katpadi', startTime: '2026-08-19 10:00', duration: '—', sitesFound: 0, status: 'Queued' },
  { droneId: 'DRN-004', district: 'Thanjavur', area: 'Kumbakonam', startTime: '2026-08-19 10:30', duration: '—', sitesFound: 0, status: 'Queued' }
];

const detectionResults = [
  { id: 1, type: 'Water Puddle Detected', confidence: 94.2, location: 'Tondiarpet, Chennai', severity: 'high' },
  { id: 2, type: 'Stagnant Pool', confidence: 88.7, location: 'RS Puram, Coimbatore', severity: 'high' },
  { id: 3, type: 'Open Tank', confidence: 91.5, location: 'Periyar Nagar, Madurai', severity: 'medium' },
  { id: 4, type: 'Water Puddle Detected', confidence: 76.3, location: 'Srirangam, Trichy', severity: 'medium' },
  { id: 5, type: 'Stagnant Pool', confidence: 82.1, location: 'Katpadi, Vellore', severity: 'high' },
  { id: 6, type: 'Open Tank', confidence: 69.8, location: 'Kumbakonam, Thanjavur', severity: 'low' }
];

const confusionMatrix = {
  truePositive: 142,
  falsePositive: 8,
  falseNegative: 11,
  trueNegative: 339,
  accuracy: 96.2,
  precision: 94.7,
  recall: 92.8,
  f1Score: 93.7
};

const coverageGrid = [
  ['scanned', 'scanned', 'scanned', 'pending', 'pending', 'scanned', 'scanned', 'pending'],
  ['scanned', 'scanned', 'pending', 'pending', 'scanned', 'scanned', 'scanned', 'scanned'],
  ['pending', 'scanned', 'scanned', 'scanned', 'scanned', 'pending', 'pending', 'scanned'],
  ['scanned', 'pending', 'scanned', 'scanned', 'scanned', 'scanned', 'pending', 'pending'],
  ['scanned', 'scanned', 'scanned', 'pending', 'pending', 'scanned', 'scanned', 'scanned'],
  ['pending', 'pending', 'scanned', 'scanned', 'scanned', 'scanned', 'scanned', 'pending']
];

const scheduledMissions = [
  { droneId: 'DRN-006', district: 'Kancheepuram', area: 'Sriperumbudur', scheduledTime: '2026-08-19 14:00', priority: 'High' },
  { droneId: 'DRN-008', district: 'Tirunelveli', area: 'Palayamkottai', scheduledTime: '2026-08-19 15:30', priority: 'Medium' },
  { droneId: 'DRN-010', district: 'Erode', area: 'Bhavani', scheduledTime: '2026-08-19 16:00', priority: 'Medium' },
  { droneId: 'DRN-011', district: 'Dindigul', area: 'Oddanchatram', scheduledTime: '2026-08-20 06:00', priority: 'Low' },
  { droneId: 'DRN-012', district: 'Nagapattinam', area: 'Velankanni', scheduledTime: '2026-08-20 07:00', priority: 'High' }
];

export default function DroneSurveillancePage() {
  const [selectedTab, setSelectedTab] = useState('missions');

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
      'In Progress': { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
      'Queued': { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' }
    };
    const c = colors[status] || colors['Queued'];
    return (
      <span style={{ background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'High': { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
      'Medium': { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
      'Low': { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' }
    };
    const c = colors[priority] || colors['Low'];
    return (
      <span style={{ background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
        {priority}
      </span>
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plane size={28} color="#6366f1" />
          Drone-Based Breeding Site Detection
        </h1>
        <p style={{ margin: '6px 0 0', opacity: 0.7, fontSize: 14 }}>
          AI-powered aerial surveillance for mosquito breeding site identification using CNN image classification
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: 28 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Log Table */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Navigation size={20} color="#6366f1" />
          Mission Log
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Drone ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>District</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Area</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Start Time</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Duration</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Sites Found</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {missionLog.map((mission, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{mission.droneId}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{mission.district}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{mission.area}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{mission.startTime}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{mission.duration}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{mission.sitesFound}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{getStatusBadge(mission.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detection Results Grid */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Camera size={20} color="#f59e0b" />
          Detection Results
        </h2>
        <div className="grid-cols-3" style={{ gap: 16 }}>
          {detectionResults.map((result) => (
            <div key={result.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', border: `1px solid ${getSeverityColor(result.severity)}30` }}>
              {/* Thumbnail placeholder */}
              <div style={{
                height: 140,
                background: `linear-gradient(135deg, ${getSeverityColor(result.severity)}15, ${getSeverityColor(result.severity)}05)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
                borderBottom: `1px solid ${getSeverityColor(result.severity)}20`
              }}>
                <Eye size={32} color={getSeverityColor(result.severity)} style={{ opacity: 0.6 }} />
                <span style={{ fontSize: 11, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>Aerial Image</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{result.type}</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>
                  <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {result.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>Confidence</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: getSeverityColor(result.severity) }}>
                    {result.confidence}%
                  </span>
                </div>
                <div className="progress-bar-track" style={{ height: 6, borderRadius: 3, marginTop: 8, background: 'rgba(255,255,255,0.1)' }}>
                  <div style={{
                    height: '100%',
                    width: `${result.confidence}%`,
                    borderRadius: 3,
                    background: getSeverityColor(result.severity),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Image Classification Panel + Coverage Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* AI Classification Panel */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="#8b5cf6" />
            AI Image Classification (CNN)
          </h2>
          <p style={{ fontSize: 13, opacity: 0.7, margin: '0 0 16px' }}>
            Convolutional Neural Network classifies aerial drone images as breeding site or non-breeding site.
          </p>

          {/* Confusion Matrix */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, opacity: 0.8 }}>Confusion Matrix</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 2 }}>
              <div style={{ padding: 8 }} />
              <div style={{ padding: 8, textAlign: 'center', fontSize: 11, fontWeight: 600, opacity: 0.7 }}>Pred: Breeding</div>
              <div style={{ padding: 8, textAlign: 'center', fontSize: 11, fontWeight: 600, opacity: 0.7 }}>Pred: No Breeding</div>

              <div style={{ padding: 8, fontSize: 11, fontWeight: 600, opacity: 0.7, display: 'flex', alignItems: 'center' }}>Actual: Breeding</div>
              <div style={{ padding: 12, textAlign: 'center', background: 'rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 18, fontWeight: 700, color: '#10b981' }}>
                {confusionMatrix.truePositive}
              </div>
              <div style={{ padding: 12, textAlign: 'center', background: 'rgba(239,68,68,0.15)', borderRadius: 8, fontSize: 18, fontWeight: 700, color: '#ef4444' }}>
                {confusionMatrix.falseNegative}
              </div>

              <div style={{ padding: 8, fontSize: 11, fontWeight: 600, opacity: 0.7, display: 'flex', alignItems: 'center' }}>Actual: No Breeding</div>
              <div style={{ padding: 12, textAlign: 'center', background: 'rgba(239,68,68,0.15)', borderRadius: 8, fontSize: 18, fontWeight: 700, color: '#ef4444' }}>
                {confusionMatrix.falsePositive}
              </div>
              <div style={{ padding: 12, textAlign: 'center', background: 'rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 18, fontWeight: 700, color: '#10b981' }}>
                {confusionMatrix.trueNegative}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Accuracy', value: confusionMatrix.accuracy },
              { label: 'Precision', value: confusionMatrix.precision },
              { label: 'Recall', value: confusionMatrix.recall },
              { label: 'F1-Score', value: confusionMatrix.f1Score }
            ].map((metric) => (
              <div key={metric.label} style={{ padding: 12, borderRadius: 8, background: 'rgba(99,102,241,0.08)' }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{metric.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#6366f1' }}>{metric.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Map */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={20} color="#10b981" />
            Coverage Map
          </h2>
          <p style={{ fontSize: 13, opacity: 0.7, margin: '0 0 16px' }}>
            Grid showing scanned (green) vs pending (gray) areas across the district.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, marginBottom: 16 }}>
            {coverageGrid.flat().map((cell, idx) => (
              <div
                key={idx}
                style={{
                  aspectRatio: '1',
                  borderRadius: 6,
                  background: cell === 'scanned' ? 'rgba(16,185,129,0.4)' : 'rgba(107,114,128,0.2)',
                  border: cell === 'scanned' ? '1px solid rgba(16,185,129,0.6)' : '1px solid rgba(107,114,128,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cell === 'scanned' && <CheckCircle2 size={12} color="#10b981" />}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(16,185,129,0.4)', border: '1px solid rgba(16,185,129,0.6)' }} />
              <span style={{ opacity: 0.8 }}>Scanned</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(107,114,128,0.2)', border: '1px solid rgba(107,114,128,0.3)' }} />
              <span style={{ opacity: 0.8 }}>Pending</span>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(16,185,129,0.08)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Coverage</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>67%</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Scanned Cells</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>32 / 48</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Remaining</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#6b7280' }}>16</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling Panel */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} color="#3b82f6" />
          Scheduled Missions
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {scheduledMissions.map((mission, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 10,
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plane size={18} color="#3b82f6" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{mission.droneId}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{mission.area}, {mission.district}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    {mission.scheduledTime}
                  </div>
                </div>
                {getPriorityBadge(mission.priority)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

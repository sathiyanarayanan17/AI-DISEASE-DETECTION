import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, MapPin, Users, Clock, AlertTriangle, Send, ThermometerSun, Bug, Droplets } from 'lucide-react';

const mockStats = {
  totalReportsToday: 1284,
  activeClusters: 7,
  districtsReporting: 31,
  avgResponseTime: '12 min'
};

const districts = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul',
  'Kancheepuram', 'Cuddalore', 'Thoothukudi', 'Tiruvannamalai', 'Viluppuram',
  'Nagapattinam', 'Ramanathapuram', 'Sivaganga', 'Karur', 'Namakkal',
  'Perambalur', 'Ariyalur', 'Tirupur', 'Krishnagiri', 'Dharmapuri',
  'Theni', 'Virudhunagar', 'Pudukkottai', 'Nilgiris', 'Kallakurichi',
  'Ranipet', 'Tirupattur', 'Tenkasi', 'Chengalpattu', 'Mayiladuthurai',
  'Kanyakumari', 'Tiruvallur'
];

const heatmapData = districts.map(d => ({
  district: d,
  density: Math.floor(Math.random() * 100)
}));

const recentReports = [
  { id: 1, name: 'Priya K.', symptoms: 'Fever, Headache', district: 'Chennai', time: '2 min ago' },
  { id: 2, name: 'Rajesh M.', symptoms: 'Vomiting, Diarrhea', district: 'Madurai', time: '4 min ago' },
  { id: 3, name: 'Anitha S.', symptoms: 'Fever, Rash, Joint Pain', district: 'Coimbatore', time: '5 min ago' },
  { id: 4, name: 'Kumar V.', symptoms: 'Headache, Fever', district: 'Salem', time: '7 min ago' },
  { id: 5, name: 'Lakshmi R.', symptoms: 'Diarrhea, Vomiting', district: 'Thanjavur', time: '8 min ago' },
  { id: 6, name: 'Suresh P.', symptoms: 'Fever, Joint Pain', district: 'Tiruchirappalli', time: '10 min ago' },
  { id: 7, name: 'Deepa N.', symptoms: 'Rash, Fever', district: 'Chennai', time: '11 min ago' },
  { id: 8, name: 'Ganesh T.', symptoms: 'Headache, Vomiting', district: 'Vellore', time: '13 min ago' },
  { id: 9, name: 'Meena L.', symptoms: 'Fever, Diarrhea', district: 'Erode', time: '14 min ago' },
  { id: 10, name: 'Arun D.', symptoms: 'Joint Pain, Rash', district: 'Dindigul', time: '16 min ago' },
  { id: 11, name: 'Kavitha B.', symptoms: 'Fever, Headache', district: 'Kancheepuram', time: '18 min ago' },
  { id: 12, name: 'Siva R.', symptoms: 'Vomiting, Fever', district: 'Cuddalore', time: '20 min ago' },
];

const symptomBreakdown = [
  { name: 'Fever', value: 412, color: '#ef4444' },
  { name: 'Headache', value: 287, color: '#f97316' },
  { name: 'Vomiting', value: 198, color: '#eab308' },
  { name: 'Rash', value: 156, color: '#a855f7' },
  { name: 'Joint Pain', value: 134, color: '#3b82f6' },
  { name: 'Diarrhea', value: 97, color: '#14b8a6' },
];

const clusterAlerts = [
  { id: 1, severity: 'critical', message: 'Possible dengue cluster detected in Chennai — 47 fever+rash reports in 24h', time: '15 min ago' },
  { id: 2, severity: 'high', message: 'Gastroenteritis cluster in Madurai — 32 vomiting+diarrhea reports in 12h', time: '42 min ago' },
  { id: 3, severity: 'medium', message: 'Unusual fever spike in Coimbatore — 28 reports above baseline', time: '1h ago' },
  { id: 4, severity: 'low', message: 'Minor headache cluster in Salem — monitoring 18 reports', time: '2h ago' },
];

const hourlyPattern = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  reports: i >= 6 && i <= 22
    ? Math.floor(30 + Math.random() * 70 + (i >= 8 && i <= 11 ? 40 : 0) + (i >= 17 && i <= 20 ? 30 : 0))
    : Math.floor(5 + Math.random() * 15)
}));

const symptomOptions = ['Fever', 'Headache', 'Vomiting', 'Rash', 'Joint Pain', 'Diarrhea'];

function getDensityColor(density) {
  if (density >= 80) return '#dc2626';
  if (density >= 60) return '#ea580c';
  if (density >= 40) return '#eab308';
  if (density >= 20) return '#84cc16';
  return '#22c55e';
}

function getSeverityStyle(severity) {
  switch (severity) {
    case 'critical': return { background: 'rgba(239,68,68,0.15)', borderLeft: '4px solid #ef4444', color: '#fca5a5' };
    case 'high': return { background: 'rgba(249,115,22,0.15)', borderLeft: '4px solid #f97316', color: '#fdba74' };
    case 'medium': return { background: 'rgba(234,179,8,0.15)', borderLeft: '4px solid #eab308', color: '#fde047' };
    case 'low': return { background: 'rgba(34,197,94,0.15)', borderLeft: '4px solid #22c55e', color: '#86efac' };
    default: return {};
  }
}

export default function SymptomHeatmapPage() {
  const feedRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', district: '', symptoms: [], notes: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (feedRef.current) {
        feedRef.current.scrollTop += 1;
        if (feedRef.current.scrollTop >= feedRef.current.scrollHeight - feedRef.current.clientHeight) {
          feedRef.current.scrollTop = 0;
        }
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', district: '', symptoms: [], notes: '' });
    }, 3000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThermometerSun size={32} color="#ef4444" />
          Crowd-Sourced Symptom Reporting Heatmap
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>
          Real-time citizen symptom reports aggregated into district-level heatmaps for early outbreak detection
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <Users size={24} color="#3b82f6" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}>{mockStats.totalReportsToday.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Total Reports Today</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <Bug size={24} color="#ef4444" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{mockStats.activeClusters}</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Active Clusters</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <MapPin size={24} color="#22c55e" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>{mockStats.districtsReporting}</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Districts Reporting</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <Clock size={24} color="#a855f7" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#a855f7' }}>{mockStats.avgResponseTime}</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Avg Response Time</div>
        </div>
      </div>

      {/* Heatmap + Recent Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* District Heatmap Grid */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#f97316" />
            Symptom Density by District
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {heatmapData.map(item => (
              <div
                key={item.district}
                title={`${item.district}: ${item.density} reports`}
                style={{
                  background: getDensityColor(item.density),
                  borderRadius: '6px',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: item.density >= 40 ? '#000' : '#fff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  minHeight: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px'
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {item.district.length > 8 ? item.district.slice(0, 7) + '…' : item.district}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.density}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
            <span>Low</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {['#22c55e', '#84cc16', '#eab308', '#ea580c', '#dc2626'].map(c => (
                <div key={c} style={{ width: '24px', height: '10px', borderRadius: '2px', background: c }} />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>

        {/* Recent Reports Feed */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={18} color="#3b82f6" />
            Live Reports Feed
            <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          </h3>
          <div
            ref={feedRef}
            style={{ flex: 1, overflow: 'hidden', maxHeight: '360px', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {recentReports.map(report => (
              <div
                key={report.id}
                style={{
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #3b82f6',
                  fontSize: '13px'
                }}
              >
                <div className="flex-between" style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{report.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{report.time}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  <span style={{ color: '#f97316' }}>{report.symptoms}</span> — {report.district}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pie Chart + Cluster Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Symptom Breakdown Pie */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Symptom Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={symptomBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {symptomBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cluster Detection Alerts */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#eab308" />
            Cluster Detection Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clusterAlerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  ...getSeverityStyle(alert.severity)
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{alert.message}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{alert.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Pattern Bar Chart + Quick Report Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Time-of-Day Reporting Pattern */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Time-of-Day Reporting Pattern</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hourlyPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="hour"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval={2}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Report Form */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#22c55e" />
            Report Symptoms
          </h3>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e' }}>Report Submitted!</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>Thank you for contributing to community health surveillance.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                className="input-control"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '13px' }}
              />
              <select
                className="input-control"
                value={formData.district}
                onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                required
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '13px' }}
              >
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Select Symptoms:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {symptomOptions.map(s => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => handleSymptomToggle(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        border: formData.symptoms.includes(s) ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)',
                        background: formData.symptoms.includes(s) ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                        color: formData.symptoms.includes(s) ? '#93c5fd' : '#94a3b8',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="input-control"
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '13px', resize: 'none' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={14} />
                Submit Report
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

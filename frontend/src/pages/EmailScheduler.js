import React, { useState, useEffect } from 'react';
import { MOCK_DISTRICTS } from '../services/api';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'];
const TIMES = ['06:00', '08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const DISTRICT_NAMES = MOCK_DISTRICTS.map(d => d.district);

function getNextSend(frequency, time) {
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  if (next <= now) {
    if (frequency === 'Daily') next.setDate(next.getDate() + 1);
    else if (frequency === 'Weekly') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
  }
  return next.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function EmailScheduler() {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('09:00');
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [schedules, setSchedules] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('emailSchedules') || '[]');
    } catch { return []; }
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    localStorage.setItem('emailSchedules', JSON.stringify(schedules));
  }, [schedules]);

  const toggleDistrict = (name) => {
    setSelectedDistricts(prev =>
      prev.includes(name) ? prev.filter(d => d !== name) : [...prev, name]
    );
  };

  const addSchedule = () => {
    if (!email || selectedDistricts.length === 0) return;
    const newSchedule = {
      id: Date.now(),
      email,
      frequency,
      time,
      districts: selectedDistricts,
      nextSend: getNextSend(frequency, time),
      status: 'Active',
    };
    setSchedules(prev => [...prev, newSchedule]);
    setEmail('');
    setSelectedDistricts([]);
  };

  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const highRisk = MOCK_DISTRICTS.filter(d => d.risk_level === 'High');

  return (
    <div>
      {/* Schedule Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Schedule Email Report</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Recipient Email
              </label>
              <input
                type="email"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="officer@health.tn.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Frequency
              </label>
              <select
                className="search-input"
                style={{ width: '100%' }}
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
              >
                {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Send Time
              </label>
              <select
                className="search-input"
                style={{ width: '100%' }}
                value={time}
                onChange={e => setTime(e.target.value)}
              >
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* District multi-select */}
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
            Districts to Include ({selectedDistricts.length} selected)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, maxHeight: 120, overflowY: 'auto', padding: 8, background: 'var(--bg-card2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            {DISTRICT_NAMES.map(name => (
              <button
                key={name}
                onClick={() => toggleDistrict(name)}
                className="filter-btn"
                style={{
                  background: selectedDistricts.includes(name) ? 'var(--accent)' : 'transparent',
                  color: selectedDistricts.includes(name) ? '#fff' : 'var(--text2)',
                  borderColor: selectedDistricts.includes(name) ? 'var(--accent)' : 'var(--border)',
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <button className="btn-detail" onClick={addSchedule}>
            Schedule Report
          </button>
          <button className="btn-detail" style={{ marginLeft: 10 }} onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </div>

      {/* Email Preview */}
      {showPreview && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-head">
            <h3 className="card-head-title">Email Preview</h3>
          </div>
          <div className="card-body" style={{ background: '#fafafa', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.8 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
              <div><strong>From:</strong> noreply@vyaadhishield.tn.gov.in</div>
              <div><strong>To:</strong> {email || 'recipient@email.com'}</div>
              <div><strong>Subject:</strong> VyaadhiShield {frequency} Risk Report - {new Date().toLocaleDateString('en-IN')}</div>
            </div>
            <div style={{ padding: 10, background: '#fff', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: '1rem', color: 'var(--accent)' }}>VyaadhiShield Disease Risk Report</strong>
              </div>
              <p>Dear Health Officer,</p>
              <p>Here is your {frequency.toLowerCase()} disease risk summary for Tamil Nadu:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '0.7rem' }}>District</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '0.7rem' }}>Risk Score</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: '0.7rem' }}>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedDistricts.length > 0 ? selectedDistricts : ['Chennai', 'Madurai', 'Coimbatore']).slice(0, 5).map(name => {
                    const d = MOCK_DISTRICTS.find(dd => dd.district === name);
                    return d ? (
                      <tr key={name} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '6px 10px', fontSize: '0.75rem' }}>{d.district}</td>
                        <td style={{ padding: '6px 10px', fontSize: '0.75rem' }}>{d.risk_score}</td>
                        <td style={{ padding: '6px 10px', fontSize: '0.75rem' }}>{d.risk_level}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
              <p style={{ marginTop: 12, fontSize: '0.72rem', color: '#666' }}>
                This is an automated report from the VyaadhiShield Disease Outbreak Warning System.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Reports Table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Scheduled Reports ({schedules.length})</h3>
        </div>
        <div className="card-body">
          {schedules.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">--</div>
              <h3>No Scheduled Reports</h3>
              <p>Create a schedule above to receive automated risk reports.</p>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Frequency</th>
                    <th>Next Send</th>
                    <th>Districts</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontSize: '0.8rem' }}>{s.email}</td>
                      <td><span className="pill pill-green">{s.frequency}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{s.nextSend}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{s.districts.slice(0, 3).join(', ')}{s.districts.length > 3 ? ` +${s.districts.length - 3}` : ''}</td>
                      <td><span className="pill pill-green">Active</span></td>
                      <td>
                        <button
                          onClick={() => deleteSchedule(s.id)}
                          style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.15)', color: '#dc2626', padding: '4px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Integration Info */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Email Integration Setup</h3>
        </div>
        <div className="card-body" style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 16, background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text1)', marginBottom: 8 }}>SendGrid</div>
              <p>Recommended for high-volume email delivery. Supports templates, analytics, and delivery tracking. Free tier: 100 emails/day.</p>
            </div>
            <div style={{ padding: 16, background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text1)', marginBottom: 8 }}>Amazon SES</div>
              <p>Cost-effective for AWS-hosted deployments. Pay per email ($0.10/1000). Integrates natively with Lambda for scheduling.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

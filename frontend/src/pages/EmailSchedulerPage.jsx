import React, { useState, useEffect } from 'react';
import {
  Mail,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  Send
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import { useAlerts } from '../context/AlertContext';

export const EmailSchedulerPage = () => {
  const { addToast } = useAlerts();
  const [email, setEmail] = useState('health.officer@tn.gov.in');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('06:00');
  const [districtSelection, setDistrictSelection] = useState('all');

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('vyaadhi_email_schedules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "SCH-01",
        email: "health.secretary@tn.gov.in",
        frequency: "Daily (06:00 IST)",
        districts: "All 37 Districts",
        format: "Comprehensive PDF",
        active: true
      },
      {
        id: "SCH-02",
        email: "cmo.chennai@tn.gov.in",
        frequency: "Real-time High Alert Trigger",
        districts: "Chennai, Chengalpattu",
        format: "HTML Summary",
        active: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('vyaadhi_email_schedules', JSON.stringify(schedules));
  }, [schedules]);

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const newSchedule = {
      id: `SCH-${Date.now().toString().slice(-4)}`,
      email,
      frequency: `${frequency.toUpperCase()} at ${time} IST`,
      districts: districtSelection === 'all' ? 'All 37 Districts' : districtSelection,
      format: "Executive HTML + PDF",
      active: true
    };

    setSchedules([...schedules, newSchedule]);
    addToast("Email Report Scheduled", `Automated briefing scheduled for ${email}`);
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={24} className="text-indigo-400" />
            <span>Automated Email Report Scheduler</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Configure recurring epidemiological digest broadcasts delivered directly to public health leadership.
          </p>
        </div>
      </div>

      {/* 2. Schedule Form & Live Email Preview */}
      <div className="grid-cols-2">
        {/* Form */}
        <form onSubmit={handleAddSchedule} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px' }}>Create Scheduled Digest Job</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recipient Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@tn.gov.in"
              className="input-control text-xs"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Broadcast Cadence:</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="input-control input-select text-xs"
              >
                <option value="daily">Daily Dawn Digest</option>
                <option value="weekly">Weekly Monday Briefing</option>
                <option value="realtime">Immediate Threshold Spike Alert</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Delivery Time (IST):</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-control text-xs"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Jurisdiction:</label>
            <select
              value={districtSelection}
              onChange={(e) => setDistrictSelection(e.target.value)}
              className="input-control input-select text-xs"
            >
              <option value="all">Statewide (All 37 Districts)</option>
              {DISTRICTS_DATA.map((d) => (
                <option key={d.id} value={d.name}>{d.name} Only</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Plus size={15} />
            <span>Save & Activate Email Schedule</span>
          </button>
        </form>

        {/* Live Email HTML Preview */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <h2 style={{ fontSize: '16px' }}>Email Layout Preview</h2>
            <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>HTML MIME</span>
          </div>

          <div
            style={{
              background: '#ffffff',
              color: '#1e293b',
              padding: '18px',
              borderRadius: '10px',
              fontSize: '12px',
              lineHeight: 1.5,
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ borderBottom: '2px solid #6366f1', paddingBottom: '10px', marginBottom: '12px' }}>
              <div style={{ color: '#6366f1', fontWeight: 800, fontSize: '14px' }}>
                VyaadhiShield AI - Daily Surveillance Digest
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                To: {email} | Date: 15 Aug 2026 06:00 IST
              </div>
            </div>

            <p style={{ marginBottom: '10px' }}>
              <strong>Dear Public Health Officer,</strong><br />
              Here is your daily early warning intelligence briefing for {districtSelection === 'all' ? 'all 37 Tamil Nadu districts' : districtSelection}.
            </p>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#e11d48', fontWeight: 700 }}>HIGH ALERT WARDS: 9 Districts</div>
              <div>Top Surge: Chennai (Risk 88), Chengalpattu (Risk 84), Madurai (Risk 82)</div>
            </div>

            <p style={{ color: '#475569', fontSize: '11px' }}>
              Attached: Full 30-day vector regression PDF and hospital bed occupancy roster.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Schedules List Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Active Scheduled Digest Jobs</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Recipient Email</th>
                <th>Frequency</th>
                <th>Jurisdiction</th>
                <th>Dossier Format</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.email}</td>
                  <td>{item.frequency}</td>
                  <td>{item.districts}</td>
                  <td>{item.format}</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} />
                      <span>Active</span>
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-secondary text-xs"
                      style={{ padding: '4px 8px', color: 'var(--risk-high)' }}
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailSchedulerPage;

import React, { useState, useMemo } from 'react';
import { MOCK_DISTRICTS } from '../services/api';

const ACTION_TYPES = ['Prediction requested', 'Alert generated', 'Report downloaded', 'Model retrained', 'SMS sent'];
const USERS = ['Dr. Ramesh', 'Dr. Priya', 'Admin Kumar', 'System', 'Dr. Lakshmi', 'Officer Raj'];
const DISTRICT_NAMES = MOCK_DISTRICTS.map(d => d.district);

const ACTION_COLORS = {
  'Prediction requested': { bg: 'rgba(99,102,241,0.08)', color: '#6366f1', border: 'rgba(99,102,241,0.15)' },
  'Alert generated': { bg: 'var(--red-bg)', color: '#dc2626', border: 'rgba(239,68,68,0.15)' },
  'Report downloaded': { bg: 'var(--green-bg)', color: '#059669', border: 'rgba(16,185,129,0.15)' },
  'Model retrained': { bg: 'rgba(139,92,246,0.08)', color: '#7c3aed', border: 'rgba(139,92,246,0.15)' },
  'SMS sent': { bg: 'var(--amber-bg)', color: '#d97706', border: 'rgba(245,158,11,0.15)' },
};

function generateAuditEntries() {
  const entries = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - i * 47 - Math.floor(Math.random() * 30));
    const action = ACTION_TYPES[Math.floor(Math.random() * ACTION_TYPES.length)];
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    const district = DISTRICT_NAMES[Math.floor(Math.random() * DISTRICT_NAMES.length)];

    let details = '';
    if (action === 'Prediction requested') details = `Risk prediction for ${district} completed. Score: ${(30 + Math.random() * 60).toFixed(0)}`;
    else if (action === 'Alert generated') details = `High risk alert triggered for ${district}. Notified health officer.`;
    else if (action === 'Report downloaded') details = `${['Daily', 'Weekly', 'Monthly'][Math.floor(Math.random() * 3)]} report exported as PDF.`;
    else if (action === 'Model retrained') details = `Model v${(1 + i * 0.1).toFixed(1)} trained with ${(1000 + Math.floor(Math.random() * 4000))} new samples.`;
    else if (action === 'SMS sent') details = `Alert SMS sent to ${district} district health officer.`;

    entries.push({
      id: i + 1,
      timestamp: date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      rawDate: date,
      user,
      action,
      details,
      district,
    });
  }
  return entries;
}

const AUDIT_DATA = generateAuditEntries();

export default function AuditTrail() {
  const [filterAction, setFilterAction] = useState('All');
  const [searchDistrict, setSearchDistrict] = useState('');

  const filtered = useMemo(() => {
    return AUDIT_DATA.filter(entry => {
      if (filterAction !== 'All' && entry.action !== filterAction) return false;
      if (searchDistrict && !entry.district.toLowerCase().includes(searchDistrict.toLowerCase())) return false;
      return true;
    });
  }, [filterAction, searchDistrict]);

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Details', 'District'];
    const rows = filtered.map(e => [e.timestamp, e.user, e.action, `"${e.details}"`, e.district]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📋</div>
          <div>
            <div className="stat-num">{AUDIT_DATA.length}</div>
            <div className="stat-lbl">Total Activities</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">⚠</div>
          <div>
            <div className="stat-num">{AUDIT_DATA.filter(e => e.action === 'Alert generated').length}</div>
            <div className="stat-lbl">Alerts Generated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">📥</div>
          <div>
            <div className="stat-num">{AUDIT_DATA.filter(e => e.action === 'Report downloaded').length}</div>
            <div className="stat-lbl">Reports Downloaded</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">📱</div>
          <div>
            <div className="stat-num">{AUDIT_DATA.filter(e => e.action === 'SMS sent').length}</div>
            <div className="stat-lbl">SMS Sent</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Activity Log</h3>
          <button className="btn-detail" onClick={exportCSV}>
            📥 Export CSV
          </button>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="search-input"
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
            >
              <option value="All">All Actions</option>
              {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search district..."
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
              Showing {filtered.length} of {AUDIT_DATA.length} entries
            </span>
          </div>

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>District</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(entry => {
                  const actionStyle = ACTION_COLORS[entry.action] || {};
                  return (
                    <tr key={entry.id}>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>{entry.timestamp}</td>
                      <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{entry.user}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          background: actionStyle.bg,
                          color: actionStyle.color,
                          border: `1px solid ${actionStyle.border}`,
                        }}>
                          {entry.action}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text2)', maxWidth: 280 }}>{entry.details}</td>
                      <td style={{ fontSize: '0.82rem', fontWeight: 500 }}>{entry.district}</td>
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

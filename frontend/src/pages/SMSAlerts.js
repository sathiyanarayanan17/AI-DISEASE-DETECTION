import React, { useState } from 'react';
import RiskBadge from '../components/RiskBadge';
import { MOCK_DISTRICTS } from '../services/api';

const SMS_TEMPLATES = {
  High: '[URGENT] Disease outbreak HIGH RISK alert for {{district}}. Risk Score: {{score}}/100. Deploy rapid response teams. Contact DHO immediately. - TN Health Dept',
  Medium: '[ALERT] Disease outbreak MEDIUM risk detected in {{district}}. Risk Score: {{score}}/100. Enhanced surveillance recommended. Review hospital capacity. - TN Health Dept',
  Low: '[INFO] Routine update for {{district}}. Risk Score: {{score}}/100. Status: Low risk. Continue standard monitoring protocols. - TN Health Dept',
};

function generateInitialAlerts() {
  const highRisk = MOCK_DISTRICTS.filter(d => d.risk_level === 'High').slice(0, 5);
  const now = new Date();
  return highRisk.map((d, i) => {
    const t = new Date(now);
    t.setMinutes(t.getMinutes() - i * 15);
    return {
      id: i + 1,
      timestamp: t.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      district: d.district,
      recipient: `District Health Officer, ${d.district}`,
      message: SMS_TEMPLATES.High.replace('{{district}}', d.district).replace('{{score}}', d.risk_score),
      status: i < 3 ? 'Delivered' : 'Pending',
      risk_level: d.risk_level,
    };
  });
}

export default function SMSAlerts() {
  const [alerts, setAlerts] = useState(generateInitialAlerts);
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedLevel, setSelectedLevel] = useState('High');

  const totalSentToday = alerts.filter(a => a.status === 'Delivered').length;
  const deliveryRate = alerts.length > 0 ? Math.round((totalSentToday / alerts.length) * 100) : 0;

  const handleSendAlert = () => {
    const snap = MOCK_DISTRICTS.find(d => d.district === selectedDistrict);
    const score = snap ? snap.risk_score : 50;
    const message = SMS_TEMPLATES[selectedLevel].replace('{{district}}', selectedDistrict).replace('{{score}}', score);
    const now = new Date();

    const newAlert = {
      id: Date.now(),
      timestamp: now.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      district: selectedDistrict,
      recipient: `District Health Officer, ${selectedDistrict}`,
      message,
      status: 'Pending',
      risk_level: selectedLevel,
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Simulate delivery after 2 seconds
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === newAlert.id ? { ...a, status: 'Delivered' } : a));
    }, 2000);
  };

  const previewMessage = () => {
    const snap = MOCK_DISTRICTS.find(d => d.district === selectedDistrict);
    const score = snap ? snap.risk_score : 50;
    return SMS_TEMPLATES[selectedLevel].replace('{{district}}', selectedDistrict).replace('{{score}}', score);
  };

  return (
    <div>
      {/* Stats Row */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue"></div>
          <div>
            <div className="stat-num">{alerts.length}</div>
            <div className="stat-lbl">Total Sent Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green"></div>
          <div>
            <div className="stat-num" style={{ color: '#10b981' }}>{deliveryRate}%</div>
            <div className="stat-lbl">Delivery Rate</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber"></div>
          <div>
            <div className="stat-num">2.3s</div>
            <div className="stat-lbl">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Send Alert Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Send SMS Alert</h3>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end', marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem', color: '#1e293b',
                  background: '#f8fafc', outline: 'none'
                }}
              >
                {MOCK_DISTRICTS.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                Alert Level
              </label>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem', color: '#1e293b',
                  background: '#f8fafc', outline: 'none'
                }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <button
              onClick={handleSendAlert}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: '#6366f1', color: '#fff', fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer', height: 42,
              }}
            >
              Send Alert
            </button>
          </div>

          {/* Message Preview */}
          <div style={{
            background: '#f8fafc', borderRadius: 10, padding: 14,
            border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.82rem', color: '#475569',
            lineHeight: 1.6, fontFamily: 'monospace',
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>
              MESSAGE PREVIEW
            </div>
            {previewMessage()}
          </div>
        </div>
      </div>

      {/* SMS Templates */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">SMS Templates</h3>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          {Object.entries(SMS_TEMPLATES).map(([level, template]) => (
            <div key={level} style={{
              background: level === 'High' ? 'rgba(239,68,68,0.04)' : level === 'Medium' ? 'rgba(245,158,11,0.04)' : 'rgba(16,185,129,0.04)',
              borderRadius: 10, padding: 14, marginBottom: 10,
              border: `1px solid ${level === 'High' ? 'rgba(239,68,68,0.12)' : level === 'Medium' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <RiskBadge level={level} />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {template}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sent Alerts Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Sent Alerts Log</h3>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>District</th>
                <th>Recipient</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id}>
                  <td style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>{a.timestamp}</td>
                  <td style={{ fontWeight: 600 }}>{a.district}</td>
                  <td style={{ fontSize: '0.78rem', color: '#475569' }}>{a.recipient}</td>
                  <td style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.message}
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
                      background: a.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: a.status === 'Delivered' ? '#10b981' : '#f59e0b',
                    }}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Info */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Integration Setup</h3>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          <div style={{
            background: 'rgba(99,102,241,0.05)', borderRadius: 12, padding: 16,
            border: '1px solid rgba(99,102,241,0.12)',
          }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#1e293b' }}>SMS Gateway Integration</h4>
            <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
              This system supports integration with Twilio and MSG91 for production SMS delivery.
              Current mode: <strong>Simulation</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.78rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Twilio Setup</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#64748b', lineHeight: 1.8 }}>
                  <li>Account SID + Auth Token in .env</li>
                  <li>Verified sender phone number</li>
                  <li>Messaging Service SID</li>
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>MSG91 Setup</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#64748b', lineHeight: 1.8 }}>
                  <li>API Key + Sender ID in .env</li>
                  <li>DLT Template registration</li>
                  <li>Route configuration (Transactional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

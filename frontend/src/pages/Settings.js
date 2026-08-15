import React, { useState } from 'react';
import { getHealth } from '../services/api';

export default function Settings() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    highRisk: true,
    mediumRisk: true,
    dailyDigest: false,
    weeklyReport: true,
  });
  const [apiStatus, setApiStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.body.classList.toggle('light-theme', next === 'light');
  };

  const checkApi = async () => {
    setChecking(true);
    try {
      const result = await getHealth();
      setApiStatus({ status: 'online', data: result });
    } catch {
      setApiStatus({ status: 'offline', data: null });
    } finally {
      setChecking(false);
    }
  };

  const toggleStyle = (enabled) => ({
    width: 44,
    height: 24,
    borderRadius: 12,
    background: enabled ? 'rgba(59,130,246,0.8)' : 'rgba(255,255,255,0.1)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: enabled ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
    flexShrink: 0,
  });

  const toggleDotStyle = (enabled) => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: 2,
    left: enabled ? 22 : 2,
    transition: 'left 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  });

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          Settings
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Configure application preferences and system options
        </p>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Appearance</h3>
        </div>
        <div className="card-body">
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>Theme</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Switch between dark and light mode</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              <div style={toggleStyle(theme === 'dark')} onClick={toggleTheme}>
                <div style={toggleDotStyle(theme === 'dark')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Language</h3>
        </div>
        <div className="card-body">
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>Display Language</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Select your preferred language</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ id: 'en', label: 'English' }, { id: 'ta', label: 'Tamil' }].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 8,
                    border: language === lang.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    background: language === lang.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: language === lang.id ? '#93c5fd' : '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Notifications</h3>
        </div>
        <div className="card-body">
          {[
            { key: 'highRisk', label: 'High Risk Alerts', desc: 'Get notified when a district reaches high risk' },
            { key: 'mediumRisk', label: 'Medium Risk Alerts', desc: 'Get notified for medium risk level changes' },
            { key: 'dailyDigest', label: 'Daily Digest', desc: 'Receive a daily summary of all district statuses' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly comprehensive analysis report' },
          ].map(item => (
            <div key={item.key} style={rowStyle}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{item.desc}</div>
              </div>
              <div
                style={toggleStyle(notifications[item.key])}
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
              >
                <div style={toggleDotStyle(notifications[item.key])} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Status */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">API Connection</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={checkApi}
              disabled={checking}
              className="btn-detail"
              style={{ padding: '8px 20px' }}
            >
              {checking ? 'Checking...' : 'Check API Status'}
            </button>
            {apiStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: apiStatus.status === 'online' ? '#10b981' : '#ef4444',
                  boxShadow: apiStatus.status === 'online' ? '0 0 8px rgba(16,185,129,0.5)' : '0 0 8px rgba(239,68,68,0.5)',
                }} />
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: apiStatus.status === 'online' ? '#6ee7b7' : '#fca5a5',
                }}>
                  {apiStatus.status === 'online' ? 'API Online - Connected' : 'API Offline - Using Demo Data'}
                </span>
              </div>
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#475569' }}>
            Endpoint: http://localhost:8000
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">About</h3>
        </div>
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Application', 'VyaadhiShield AI - Disease Outbreak Early Warning System'],
                ['Version', '2.0.0'],
                ['Platform', 'Smart India Hackathon 2024'],
                ['Region', 'Tamil Nadu, India (37 Districts)'],
                ['AI Model', 'XGBoost + Ensemble (Tuned)'],
                ['Stack', 'React 18 + FastAPI + Python ML'],
                ['Data Sources', 'IMD Weather, IDSP Disease Reports, Census Demographics'],
                ['License', 'MIT License'],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 16px', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, width: '30%' }}>{k}</td>
                  <td style={{ padding: '10px 16px', fontSize: '0.82rem', color: '#f1f5f9' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

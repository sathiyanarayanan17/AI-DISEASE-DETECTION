import React, { useState } from 'react';

const ROLES = [
  { value: 'health_officer', label: 'Health Officer', icon: '', access: ['District dashboards', 'Real-time alerts', 'Resource allocation', 'Citizen reports'] },
  { value: 'state_admin', label: 'State Admin', icon: '', access: ['All district data', 'Model management', 'Budget estimator', 'Audit trail', 'System settings'] },
  { value: 'public', label: 'Public', icon: '', access: ['Prevention tips', 'District risk overview', 'Citizen report submission', 'WhatsApp bot'] },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('health_officer');
  const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem('userRole'));
  const [currentRole, setCurrentRole] = useState(() => sessionStorage.getItem('userRole') || '');
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('userName') || '');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) return;
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userName', username);
    setCurrentRole(role);
    setCurrentUser(username);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    setLoggedIn(false);
    setCurrentRole('');
    setCurrentUser('');
    setUsername('');
    setPassword('');
  };

  const roleInfo = ROLES.find(r => r.value === currentRole);

  if (loggedIn) {
    return (
      <div>
        {/* Welcome Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>{roleInfo?.icon || ''}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text1)', marginBottom: 6 }}>
              Welcome, {currentUser}!
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 6 }}>
              {currentRole === 'health_officer' && 'You have access to district-level monitoring, alerts, and resource management tools.'}
              {currentRole === 'state_admin' && 'You have full administrative access to all system features including model management and audit trails.'}
              {currentRole === 'public' && 'You can view public risk information, submit citizen reports, and access prevention tips.'}
            </p>
            <span className="pill pill-green" style={{ fontSize: '0.78rem' }}>
              Role: {roleInfo?.label}
            </span>
            <div style={{ marginTop: 20 }}>
              <button className="btn-detail" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Role Access Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {ROLES.map(r => (
            <div key={r.value} className="card" style={{ border: r.value === currentRole ? '2px solid var(--accent)' : undefined }}>
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text1)', marginBottom: 10 }}>{r.label}</div>
                {r.value === currentRole && (
                  <span className="badge badge-low" style={{ marginBottom: 10, display: 'inline-block' }}>Current</span>
                )}
                <ul style={{ textAlign: 'left', fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 2, listStyle: 'none', padding: 0 }}>
                  {r.access.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="card" style={{ width: 400, maxWidth: '100%' }}>
        <div className="card-body" style={{ padding: 36 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}>
              EA
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text1)', marginBottom: 4 }}>
              EarlyAlert Login
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
              Disease Outbreak Warning System
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Username
              </label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Role
              </label>
              <select
                className="search-input"
                style={{ width: '100%' }}
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text3)', marginTop: 16 }}>
            Demo mode: any credentials will work. Select a role to experience different access levels.
          </p>
        </div>
      </div>
    </div>
  );
}

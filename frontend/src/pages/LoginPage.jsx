import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogIn,
  ShieldCheck,
  User,
  Lock,
  CheckCircle2,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';

export const LoginPage = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { addToast } = useAlerts();
  const navigate = useNavigate();

  const [role, setRole] = useState('officer');
  const [username, setUsername] = useState('kavitha.sundaram@tn.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'officer') {
      setUsername('kavitha.sundaram@tn.gov.in');
    } else if (selectedRole === 'admin') {
      setUsername('admin.health@tn.gov.in');
    } else {
      setUsername('citizen.resident@tn.gov.in');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(role);
    addToast("Authentication Success", `Logged in as ${role === 'officer' ? 'Health Surveillance Officer' : (role === 'admin' ? 'System Administrator' : 'Public Citizen')}`);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    addToast("Logged Out", "You have been logged out of the surveillance platform.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogIn size={24} className="text-indigo-400" />
            <span>Role-Based Access Control & Identity Portal</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Secure identity verification for Directorate of Public Health medical personnel and citizens.
          </p>
        </div>
      </div>

      {/* 2. Login Form & Role Cards */}
      <div className="grid-cols-2">
        {/* Login Box */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Lock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px' }}>Security Login</h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Multi-Factor SSO Authentication</div>
            </div>
          </div>

          {/* Role selector pill buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Select Role Persona:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleRoleSelect('officer')}
                className={`btn text-xs ${role === 'officer' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 4px', fontSize: '11px' }}
              >
                Health Officer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`btn text-xs ${role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 4px', fontSize: '11px' }}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('public')}
                className={`btn text-xs ${role === 'public' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 4px', fontSize: '11px' }}
              >
                Public Resident
              </button>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Official Government Email / ID:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-control text-xs"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Password / Security PIN:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-control text-xs"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              <LogIn size={15} />
              <span>Authenticate & Enter Dashboard</span>
            </button>
          </form>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-xs"
              style={{ color: 'var(--risk-high)' }}
            >
              Sign Out of Active Session ({user.name})
            </button>
          )}

          <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Create Account</Link>
          </div>
        </div>

        {/* Role Privileges Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>1. Health Surveillance Officer</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Full access to 37 district vector risk monitors, What-If climate stress simulators, Voice/SMS alert dispatch, and hospital bed reservation logistics.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #a855f7' }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>2. Principal Secretary & System Admin</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              ML model retraining engine access, threshold calibration, automated audit trail inspection, budget appropriation approval, and system telemetry monitoring.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>3. Public Resident / Citizen</div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Open citizen dashboard access, community symptom reporting, nearby government hospital finder, and 24/7 free telemedicine routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

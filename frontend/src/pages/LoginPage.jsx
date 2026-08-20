import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogIn,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Briefcase,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';

export const LoginPage = () => {
  const { user, loginWithEmail, loginWithGoogle, loginWithGithub, loginAsRole, logout, isAuthenticated, loginError, setLoginError } = useAuth();
  const { addToast } = useAlerts();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const success = loginWithEmail(email, password);
    setIsLoading(false);
    if (success) {
      addToast('Login Successful', `Welcome back! Redirecting to dashboard...`);
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setLoginError('');
    const success = await loginWithGoogle();
    setGoogleLoading(false);
    if (success) {
      addToast('Google Login Successful', 'Authenticated via Google OAuth 2.0');
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setLoginError('');
    const success = await loginWithGithub();
    setGithubLoading(false);
    if (success) {
      addToast('GitHub Login Successful', 'Authenticated via GitHub OAuth');
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  const handleQuickLogin = (role) => {
    loginAsRole(role);
    addToast('Quick Login', `Logged in as ${role === 'officer' ? 'Health Officer' : role === 'admin' ? 'Administrator' : role === 'health_worker' ? 'Field Worker' : 'Citizen'}`);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    addToast('Logged Out', 'You have been signed out successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '480px', margin: '0 auto', paddingTop: '20px' }}>
      
      {/* Branding Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            <ShieldAlert size={26} color="#fff" />
          </div>
        </div>
        <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Welcome to VyaadhiShield</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Sign in to access Tamil Nadu's disease surveillance platform
        </p>
      </div>

      {/* Already authenticated */}
      {isAuthenticated && (
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '16px'
          }}>{user.avatar}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.roleName}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{user.email}</div>
            {user.loginMethod && (
              <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', marginTop: '4px', fontWeight: 600 }}>
                Signed in via {user.loginMethod === 'google' ? 'Google' : user.loginMethod === 'github' ? 'GitHub' : user.loginMethod === 'email' ? 'Email' : 'Quick Login'}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ fontSize: '12px' }}>
              Go to Dashboard
            </button>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '12px', color: 'var(--risk-high)' }}>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      {!isAuthenticated && (
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                background: 'var(--bg-input)', border: '1.5px solid var(--border-base)',
                color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px',
                transition: 'all 200ms', fontFamily: 'inherit', width: '100%'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
            >
              {googleLoading ? (
                <span className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* GitHub */}
            <button
              onClick={handleGithubLogin}
              disabled={githubLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                background: 'var(--bg-input)', border: '1.5px solid var(--border-base)',
                color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px',
                transition: 'all 200ms', fontFamily: 'inherit', width: '100%'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
            >
              {githubLoading ? (
                <span className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              )}
              <span>{githubLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-base)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>OR SIGN IN WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-base)' }} />
          </div>

          {/* Email + Password Form */}
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                  placeholder="kavitha@tn.gov.in"
                  className="input-control"
                  style={{ paddingLeft: '36px' }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Password</label>
                <button type="button" style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  placeholder="Enter password"
                  className="input-control"
                  style={{ paddingLeft: '36px', paddingRight: '40px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: '8px',
                background: 'var(--accent-rose-light)', border: '1px solid var(--risk-high-border)',
                fontSize: '12px', color: 'var(--risk-high)'
              }}>
                <AlertCircle size={14} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ padding: '12px', fontSize: '14px', marginTop: '4px' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px' }} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials info */}
          <div style={{
            padding: '12px 14px', borderRadius: '8px',
            background: 'var(--accent-primary-light)', border: '1px solid rgba(99, 102, 241, 0.15)',
            fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>Demo Credentials:</div>
            <div><strong>Admin:</strong> admin@vyaadhishield.in / Admin@123</div>
            <div><strong>Officer:</strong> kavitha@tn.gov.in / Officer@123</div>
            <div><strong>Worker:</strong> fieldworker@tn.gov.in / Field@123</div>
            <div><strong>Citizen:</strong> citizen@gmail.com / Citizen@123</div>
          </div>
        </div>
      )}

      {/* Quick Role Login (Demo Mode) */}
      {!isAuthenticated && (
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Login (One-Click)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {[
              { role: 'admin', label: 'Administrator', icon: Shield, color: '#a855f7' },
              { role: 'officer', label: 'Health Officer', icon: Building2, color: '#6366f1' },
              { role: 'health_worker', label: 'Field Worker', icon: Briefcase, color: '#06b6d4' },
              { role: 'public', label: 'Public Citizen', icon: User, color: '#10b981' },
            ].map(({ role, label, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => handleQuickLogin(role)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '8px',
                  background: 'var(--bg-input)', border: '1.5px solid var(--border-base)',
                  cursor: 'pointer', transition: 'all 200ms', fontFamily: 'inherit',
                  color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}10`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
              >
                <Icon size={16} style={{ color }} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sign up link */}
      {!isAuthenticated && (
        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Create Account</Link>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import DistrictDetail from './pages/DistrictDetail';
import Analytics from './pages/Analytics';
import RealTimeMonitor from './pages/RealTimeMonitor';
import NotificationBell from './components/NotificationBell';
import { getAllPredictions, getAlerts, MOCK_DISTRICTS } from './services/api';
import './App.css';

function Sidebar({ highCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🛡</div>
        <div className="logo-text">
          <div className="logo-name">EarlyAlert</div>
          <div className="logo-sub">Tamil Nadu AI</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🚨</span>
          <span className="nav-label">Active Alerts</span>
          {highCount > 0 && <span className="nav-badge-count">{highCount}</span>}
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🧠</span>
          <span className="nav-label">AI Analytics</span>
        </NavLink>
        <NavLink to="/realtime" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📡</span>
          <span className="nav-label">Real-Time</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Disease Tracker</div>
        <div className="nav-item">
          <span className="nav-icon">🦟</span>
          <span className="nav-label">Dengue</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">💧</span>
          <span className="nav-label">Cholera</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🩸</span>
          <span className="nav-label">Malaria</span>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="live-chip">
          <div className="live-dot"></div>
          LIVE MONITORING
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle, apiStatus, highCount }) {
  const nav = useNavigate();
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      {subtitle && <div className="topbar-meta">{subtitle}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
        <NotificationBell count={highCount} onClick={() => nav('/alerts')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: apiStatus === 'online' ? '#34d399' : '#f59e0b'
          }} />
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
            {apiStatus === 'online' ? 'API Connected' : 'Demo Mode'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [districts, setDistricts] = useState([]);
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const loc = useLocation();

  const pageInfo = {
    '/':          { title: 'Disease Risk Dashboard', sub: 'Real-time AI outbreak monitoring across Tamil Nadu' },
    '/alerts':    { title: 'Active Alerts',          sub: 'High and medium risk districts requiring attention' },
    '/analytics': { title: 'AI Model Analytics',     sub: 'XGBoost performance metrics and feature analysis' },
    '/realtime':  { title: 'Real-Time Monitor',      sub: 'Live weather and disease data ingestion' },
  };
  const info = pageInfo[loc.pathname] || { title: 'EarlyAlert AI', sub: '' };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [p, a] = await Promise.all([getAllPredictions(), getAlerts()]);
        setDistricts(p);
        setAlerts(a);
        setApiStatus('online');
      } catch {
        setDistricts(MOCK_DISTRICTS);
        setAlerts(MOCK_DISTRICTS.filter(d => d.risk_level !== 'Low'));
        setApiStatus('offline');
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const highCount = districts.filter(d => d.risk_level === 'High').length;

  return (
    <div className="app-shell">
      <Sidebar highCount={highCount} />
      <div className="main-area">
        <Topbar title={info.title} subtitle={info.sub} apiStatus={apiStatus} highCount={highCount} />
        {apiStatus === 'offline' && (
          <div className="api-banner">
            Backend offline - showing demo data. Start FastAPI on port 8000 for live AI predictions.
          </div>
        )}
        <div className="page-scroll">
          <Routes>
            <Route path="/"       element={<Dashboard districts={districts} loading={loading} />} />
            <Route path="/alerts" element={<Alerts alerts={alerts} loading={loading} />} />
            <Route path="/district/:name" element={<DistrictDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/realtime"  element={<RealTimeMonitor />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

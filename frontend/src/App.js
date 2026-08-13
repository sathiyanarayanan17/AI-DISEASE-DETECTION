import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import DistrictDetail from './pages/DistrictDetail';
import Analytics from './pages/Analytics';
import RealTimeMonitor from './pages/RealTimeMonitor';
import DiseaseTracker from './pages/DiseaseTracker';
import Forecast from './pages/Forecast';
import Reports from './pages/Reports';
import Compare from './pages/Compare';
import CitizenReport from './pages/CitizenReport';
import ResourceAllocation from './pages/ResourceAllocation';
import Settings from './pages/Settings';
import NotificationBell from './components/NotificationBell';
import LanguageToggle from './components/LanguageToggle';
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
        <NavLink to="/forecast" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🔮</span>
          <span className="nav-label">Forecast</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Disease Tracker</div>
        <NavLink to="/disease/dengue" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🦟</span>
          <span className="nav-label">Dengue</span>
        </NavLink>
        <NavLink to="/disease/cholera" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">💧</span>
          <span className="nav-label">Cholera</span>
        </NavLink>
        <NavLink to="/disease/malaria" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🩸</span>
          <span className="nav-label">Malaria</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Tools</div>
        <NavLink to="/compare" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⚖</span>
          <span className="nav-label">Compare</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📄</span>
          <span className="nav-label">Reports</span>
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🏥</span>
          <span className="nav-label">Resources</span>
        </NavLink>
        <NavLink to="/citizen-report" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📝</span>
          <span className="nav-label">Citizen Report</span>
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} style={{ marginBottom: 12 }}>
          <span className="nav-icon">⚙</span>
          <span className="nav-label">Settings</span>
        </NavLink>
        <div className="live-chip">
          <div className="live-dot"></div>
          LIVE MONITORING
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle, apiStatus, highCount, language, onLangToggle }) {
  const nav = useNavigate();
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      {subtitle && <div className="topbar-meta">{subtitle}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
        <LanguageToggle language={language} onToggle={onLangToggle} />
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
  const [language, setLanguage]   = useState('en');
  const loc = useLocation();

  const pageInfo = {
    '/':               { title: 'Disease Risk Dashboard', sub: 'Real-time AI outbreak monitoring across Tamil Nadu' },
    '/alerts':         { title: 'Active Alerts',          sub: 'High and medium risk districts requiring attention' },
    '/analytics':      { title: 'AI Model Analytics',     sub: 'XGBoost performance metrics and feature analysis' },
    '/realtime':       { title: 'Real-Time Monitor',      sub: 'Live weather and disease data ingestion' },
    '/forecast':       { title: '7-Day Forecast',         sub: 'AI-powered risk prediction for the week ahead' },
    '/disease/dengue': { title: 'Dengue Tracker',         sub: 'Monitoring dengue outbreak patterns in Tamil Nadu' },
    '/disease/cholera':{ title: 'Cholera Tracker',        sub: 'Monitoring cholera outbreak patterns in Tamil Nadu' },
    '/disease/malaria':{ title: 'Malaria Tracker',        sub: 'Monitoring malaria outbreak patterns in Tamil Nadu' },
    '/compare':        { title: 'District Comparison',    sub: 'Compare health metrics between districts' },
    '/reports':        { title: 'Report Generator',       sub: 'Generate comprehensive district health reports' },
    '/resources':      { title: 'Resource Allocation',    sub: 'AI-optimized health worker deployment' },
    '/citizen-report': { title: 'Citizen Report',         sub: 'Community symptom reporting portal' },
    '/settings':       { title: 'Settings',               sub: 'Application preferences and configuration' },
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
        <Topbar
          title={info.title}
          subtitle={info.sub}
          apiStatus={apiStatus}
          highCount={highCount}
          language={language}
          onLangToggle={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
        />
        {apiStatus === 'offline' && (
          <div className="api-banner">
            Backend offline - showing demo data. Start FastAPI on port 8000 for live AI predictions.
          </div>
        )}
        <div className="page-scroll">
          <Routes>
            <Route path="/" element={<Dashboard districts={districts} loading={loading} />} />
            <Route path="/alerts" element={<Alerts alerts={alerts} loading={loading} />} />
            <Route path="/district/:name" element={<DistrictDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/realtime" element={<RealTimeMonitor />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/disease/dengue" element={<DiseaseTracker disease="dengue" />} />
            <Route path="/disease/cholera" element={<DiseaseTracker disease="cholera" />} />
            <Route path="/disease/malaria" element={<DiseaseTracker disease="malaria" />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/resources" element={<ResourceAllocation />} />
            <Route path="/citizen-report" element={<CitizenReport />} />
            <Route path="/settings" element={<Settings />} />
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

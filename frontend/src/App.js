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
import WhatIfSimulator from './pages/WhatIfSimulator';
import AnomalyDetection from './pages/AnomalyDetection';
import OutbreakProbability from './pages/OutbreakProbability';
import HeatmapCalendar from './pages/HeatmapCalendar';
import VoiceAlert from './pages/VoiceAlert';
import SMSAlerts from './pages/SMSAlerts';
import DistrictRanking from './pages/DistrictRanking';
import CorrelationMatrix from './pages/CorrelationMatrix';
import PublicDashboard from './pages/PublicDashboard';
import NearbyHospitals from './pages/NearbyHospitals';
import WhatsAppBot from './pages/WhatsAppBot';
import EmailScheduler from './pages/EmailScheduler';
import LoginPage from './pages/LoginPage';
import AuditTrail from './pages/AuditTrail';
import BudgetEstimator from './pages/BudgetEstimator';
import ModelVersions from './pages/ModelVersions';
import APIMonitor from './pages/APIMonitor';
import PreventionTips from './pages/PreventionTips';
import TimelinePlayback from './pages/TimelinePlayback';
import DockerDeploy from './pages/DockerDeploy';
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
        <div className="sidebar-section-label">Main</div>
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📊</span><span className="nav-label">Dashboard</span>
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🚨</span><span className="nav-label">Alerts</span>
          {highCount > 0 && <span className="nav-badge-count">{highCount}</span>}
        </NavLink>
        <NavLink to="/forecast" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🔮</span><span className="nav-label">Forecast</span>
        </NavLink>
        <NavLink to="/realtime" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📡</span><span className="nav-label">Real-Time</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Disease Tracker</div>
        <NavLink to="/disease/dengue" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🦟</span><span className="nav-label">Dengue</span>
        </NavLink>
        <NavLink to="/disease/cholera" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">💧</span><span className="nav-label">Cholera</span>
        </NavLink>
        <NavLink to="/disease/malaria" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🩸</span><span className="nav-label">Malaria</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">AI Tools</div>
        <NavLink to="/what-if" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🎛</span><span className="nav-label">What-If Simulator</span>
        </NavLink>
        <NavLink to="/outbreak-probability" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📈</span><span className="nav-label">Outbreak Probability</span>
        </NavLink>
        <NavLink to="/anomalies" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⚡</span><span className="nav-label">Anomaly Detection</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🧠</span><span className="nav-label">Model Analytics</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Visualization</div>
        <NavLink to="/heatmap" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🗓</span><span className="nav-label">Heatmap Calendar</span>
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">▶</span><span className="nav-label">Timeline Playback</span>
        </NavLink>
        <NavLink to="/correlation" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🔗</span><span className="nav-label">Correlations</span>
        </NavLink>
        <NavLink to="/ranking" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🏆</span><span className="nav-label">District Ranking</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Communication</div>
        <NavLink to="/voice-alerts" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🔊</span><span className="nav-label">Voice Alerts</span>
        </NavLink>
        <NavLink to="/sms-alerts" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📱</span><span className="nav-label">SMS Alerts</span>
        </NavLink>
        <NavLink to="/whatsapp" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">💬</span><span className="nav-label">WhatsApp Bot</span>
        </NavLink>
        <NavLink to="/email-scheduler" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📧</span><span className="nav-label">Email Reports</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Tools</div>
        <NavLink to="/compare" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⚖</span><span className="nav-label">Compare</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📄</span><span className="nav-label">Reports</span>
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🏥</span><span className="nav-label">Resources</span>
        </NavLink>
        <NavLink to="/hospitals" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🏨</span><span className="nav-label">Nearby Hospitals</span>
        </NavLink>
        <NavLink to="/citizen-report" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🙋</span><span className="nav-label">Citizen Report</span>
        </NavLink>
        <NavLink to="/budget" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">💰</span><span className="nav-label">Budget Estimator</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">System</div>
        <NavLink to="/prevention" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">💊</span><span className="nav-label">Prevention Tips</span>
        </NavLink>
        <NavLink to="/public" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">👥</span><span className="nav-label">Public View</span>
        </NavLink>
        <NavLink to="/model-versions" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🔄</span><span className="nav-label">Model Versions</span>
        </NavLink>
        <NavLink to="/api-monitor" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⚙</span><span className="nav-label">API Monitor</span>
        </NavLink>
        <NavLink to="/audit" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">📋</span><span className="nav-label">Audit Trail</span>
        </NavLink>
        <NavLink to="/deploy" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">🐳</span><span className="nav-label">Deployment</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="nav-icon">⚙</span><span className="nav-label">Settings</span>
        </NavLink>
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
        <LanguageToggle />
        <NotificationBell count={highCount} onClick={() => nav('/alerts')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: apiStatus === 'online' ? '#10b981' : '#f59e0b'
          }} />
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
            {apiStatus === 'online' ? 'API Connected' : 'Demo Mode'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [districts, setDistricts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const loc = useLocation();

  const pageInfo = {
    '/':          { title: 'Disease Risk Dashboard', sub: 'Real-time AI outbreak monitoring' },
    '/alerts':    { title: 'Active Alerts', sub: 'Districts requiring attention' },
    '/analytics': { title: 'AI Model Analytics', sub: 'Performance and feature analysis' },
    '/realtime':  { title: 'Real-Time Monitor', sub: 'Live data ingestion feed' },
    '/forecast':  { title: '7-Day Forecast', sub: 'Predictive risk outlook' },
    '/what-if':   { title: 'What-If Simulator', sub: 'Explore scenario outcomes' },
    '/anomalies': { title: 'Anomaly Detection', sub: 'Unusual pattern identification' },
    '/outbreak-probability': { title: 'Outbreak Probability', sub: 'Risk timeline analysis' },
    '/heatmap':   { title: 'Heatmap Calendar', sub: 'Historical risk patterns' },
    '/timeline':  { title: 'Timeline Playback', sub: 'Animated risk visualization' },
    '/correlation': { title: 'Correlation Analysis', sub: 'Feature relationships' },
    '/ranking':   { title: 'District Ranking', sub: 'Weekly risk leaderboard' },
    '/voice-alerts': { title: 'Voice Alerts', sub: 'Text-to-speech notifications' },
    '/sms-alerts': { title: 'SMS Alerts', sub: 'Alert notification system' },
    '/whatsapp':  { title: 'WhatsApp Bot', sub: 'Conversational AI assistant' },
    '/email-scheduler': { title: 'Email Reports', sub: 'Scheduled report delivery' },
    '/compare':   { title: 'District Comparison', sub: 'Side-by-side analysis' },
    '/reports':   { title: 'Report Generator', sub: 'PDF reports' },
    '/resources': { title: 'Resource Allocation', sub: 'AI-optimized deployment' },
    '/hospitals': { title: 'Nearby Hospitals', sub: 'Healthcare facility finder' },
    '/citizen-report': { title: 'Citizen Report', sub: 'Public symptom reporting' },
    '/budget':    { title: 'Budget Estimator', sub: 'Response cost analysis' },
    '/prevention': { title: 'Prevention Tips', sub: 'Disease awareness' },
    '/public':    { title: 'Public Dashboard', sub: 'Citizen-friendly view' },
    '/model-versions': { title: 'Model Versions', sub: 'Training history' },
    '/api-monitor': { title: 'API Monitor', sub: 'System health metrics' },
    '/audit':     { title: 'Audit Trail', sub: 'Activity log' },
    '/deploy':    { title: 'Deployment', sub: 'Docker & cloud setup' },
    '/settings':  { title: 'Settings', sub: 'Preferences' },
    '/login':     { title: 'Login', sub: 'Authentication' },
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
            <Route path="/" element={<Dashboard districts={districts} loading={loading} />} />
            <Route path="/alerts" element={<Alerts alerts={alerts} loading={loading} />} />
            <Route path="/district/:name" element={<DistrictDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/realtime" element={<RealTimeMonitor />} />
            <Route path="/disease/:disease" element={<DiseaseTracker />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/citizen-report" element={<CitizenReport />} />
            <Route path="/resources" element={<ResourceAllocation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/what-if" element={<WhatIfSimulator />} />
            <Route path="/anomalies" element={<AnomalyDetection />} />
            <Route path="/outbreak-probability" element={<OutbreakProbability />} />
            <Route path="/heatmap" element={<HeatmapCalendar />} />
            <Route path="/voice-alerts" element={<VoiceAlert />} />
            <Route path="/sms-alerts" element={<SMSAlerts />} />
            <Route path="/ranking" element={<DistrictRanking />} />
            <Route path="/correlation" element={<CorrelationMatrix />} />
            <Route path="/public" element={<PublicDashboard />} />
            <Route path="/hospitals" element={<NearbyHospitals />} />
            <Route path="/whatsapp" element={<WhatsAppBot />} />
            <Route path="/email-scheduler" element={<EmailScheduler />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/budget" element={<BudgetEstimator />} />
            <Route path="/model-versions" element={<ModelVersions />} />
            <Route path="/api-monitor" element={<APIMonitor />} />
            <Route path="/prevention" element={<PreventionTips />} />
            <Route path="/timeline" element={<TimelinePlayback />} />
            <Route path="/deploy" element={<DockerDeploy />} />
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

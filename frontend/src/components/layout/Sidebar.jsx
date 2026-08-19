import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Bell,
  Calendar,
  Radio,
  Sliders,
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  Grid,
  PlayCircle,
  GitCommit,
  Award,
  GitCompare,
  FileText,
  Volume2,
  MessageSquare,
  Smartphone,
  Mail,
  UserCheck,
  Package,
  Building2,
  Calculator,
  Eye,
  HeartPulse,
  History,
  ActivitySquare,
  ShieldCheck,
  Settings,
  Server,
  LogIn,
  ChevronDown,
  ChevronRight,
  Flame,
  Droplet,
  Bug,
  X,
  Zap,
  Satellite,
  Dna,
  Syringe,
  Link2,
  FlaskConical,
  Download,
  HelpCircle,
  BellRing,
  Waves,
  CircleDot,
  Fingerprint,
  Globe,
  RotateCcw,
  WifiOff,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAlerts } from '../../context/AlertContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { unreadCount } = useAlerts();
  const location = useLocation();

  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState({
    main: false,
    disease: false,
    ai: false,
    vis: false,
    comm: false,
    tools: false,
    sys: false
  });

  const toggleSection = (key) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navSections = [
    {
      key: 'main',
      title: 'Main Operations',
      items: [
        { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { path: '/alerts', label: t('alerts'), icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
        { path: '/forecast', label: t('forecast'), icon: Calendar },
        { path: '/realtime', label: t('realtime'), icon: Radio, pulse: true },
        { path: '/notifications', label: 'Notifications', icon: BellRing }
      ]
    },
    {
      key: 'disease',
      title: 'Disease Trackers',
      items: [
        { path: '/disease/dengue', label: 'Dengue Outbreak', icon: Flame, color: 'text-rose-500' },
        { path: '/disease/cholera', label: 'Cholera Outbreak', icon: Droplet, color: 'text-cyan-500' },
        { path: '/disease/malaria', label: 'Malaria Outbreak', icon: Bug, color: 'text-emerald-500' }
      ]
    },
    {
      key: 'ai',
      title: 'AI & Predictive Tools',
      items: [
        { path: '/what-if', label: t('whatIf'), icon: Sliders },
        { path: '/outbreak-probability', label: t('outbreakProb'), icon: TrendingUp },
        { path: '/anomalies', label: t('anomalies'), icon: AlertTriangle },
        { path: '/analytics', label: t('analytics'), icon: BrainCircuit },
        { path: '/epidemic-simulator', label: 'Epidemic Simulator', icon: FlaskConical },
        { path: '/lstm-forecast', label: 'LSTM Deep Learning', icon: BrainCircuit },
        { path: '/r0-calculator', label: 'R\u2080 Calculator', icon: TrendingUp }
      ]
    },
    {
      key: 'novelty',
      title: 'NOVELTY',
      items: [
        { path: '/outbreak-chain', label: 'Outbreak Chain Reaction', icon: Zap },
        { path: '/triage', label: 'AI Triage Priority', icon: HeartPulse },
        { path: '/satellite', label: 'Satellite Breeding Index', icon: Satellite },
        { path: '/genetic-drift', label: 'Genetic Drift Alert', icon: Dna }
      ]
    },
    {
      key: 'surveillance',
      title: 'Environmental Surveillance',
      items: [
        { path: '/water-quality', label: 'Water Quality Monitor', icon: Waves },
        { path: '/mosquito-density', label: 'Mosquito Density Index', icon: CircleDot },
        { path: '/symptom-heatmap', label: 'Symptom Heatmap', icon: Grid },
        { path: '/social-media', label: 'Social Media Intel', icon: Globe },
        { path: '/pharmacy-sales', label: 'Pharmacy Sales', icon: Package }
      ]
    },
    {
      key: 'vis',
      title: 'Visual Analytics',
      items: [
        { path: '/heatmap', label: t('heatmap'), icon: Grid },
        { path: '/timeline', label: t('timeline'), icon: PlayCircle },
        { path: '/correlation', label: t('correlations'), icon: GitCommit },
        { path: '/ranking', label: t('ranking'), icon: Award }
      ]
    },
    {
      key: 'comm',
      title: 'Communications',
      items: [
        { path: '/voice-alerts', label: t('voiceAlerts'), icon: Volume2 },
        { path: '/sms-alerts', label: t('smsAlerts'), icon: Smartphone },
        { path: '/whatsapp', label: t('whatsappBot'), icon: MessageSquare },
        { path: '/email-scheduler', label: t('emailScheduler'), icon: Mail }
      ]
    },
    {
      key: 'tools',
      title: 'Health Operations',
      items: [
        { path: '/compare', label: t('compare'), icon: GitCompare },
        { path: '/reports', label: t('reports'), icon: FileText },
        { path: '/resources', label: t('resources'), icon: Package },
        { path: '/hospitals', label: t('hospitals'), icon: Building2 },
        { path: '/citizen-report', label: t('citizenReport'), icon: UserCheck },
        { path: '/budget', label: t('budget'), icon: Calculator },
        { path: '/vaccination', label: 'Vaccination Tracker', icon: Syringe },
        { path: '/contact-tracing', label: 'Contact Tracing', icon: Link2 },
        { path: '/supply-chain', label: 'Supply Chain', icon: Package },
        { path: '/field-workers', label: 'Field Workers GPS', icon: MapPin },
        { path: '/telemedicine', label: 'Telemedicine', icon: Building2 },
        { path: '/mortality', label: 'Mortality Tracker', icon: HeartPulse },
        { path: '/genomic-surveillance', label: 'Genomic Surveillance', icon: Dna }
      ]
    },
    {
      key: 'integration',
      title: 'Integration & Identity',
      items: [
        { path: '/aadhaar-verify', label: 'Aadhaar Verification', icon: Fingerprint },
        { path: '/ihip-integration', label: 'IHIP Integration', icon: Globe },
        { path: '/auto-retrain', label: 'Auto Retrain ML', icon: RotateCcw },
        { path: '/offline-pwa', label: 'Offline / PWA Mode', icon: WifiOff }
      ]
    },
    {
      key: 'advanced',
      title: 'Advanced Analytics',
      items: [
        { path: '/spatial-clustering', label: 'Spatial Clustering', icon: Grid },
        { path: '/network-analysis', label: 'Network Analysis', icon: Link2 },
        { path: '/survival-analysis', label: 'Survival Analysis', icon: TrendingUp },
        { path: '/geo-fencing', label: 'Geo-Fencing Alerts', icon: MapPin },
        { path: '/custom-dashboard', label: 'Custom Dashboard', icon: LayoutDashboard },
        { path: '/kpi-scorecard', label: 'KPI Scorecard', icon: Award }
      ]
    },
    {
      key: 'sys',
      title: 'System & Governance',
      items: [
        { path: '/public', label: t('publicDashboard'), icon: Eye },
        { path: '/prevention', label: t('prevention'), icon: HeartPulse },
        { path: '/model-versions', label: t('modelVersions'), icon: History },
        { path: '/api-monitor', label: t('apiMonitor'), icon: ActivitySquare },
        { path: '/audit', label: t('audit'), icon: ShieldCheck },
        { path: '/deploy', label: t('deploy'), icon: Server },
        { path: '/data-export', label: 'Data Export Hub', icon: Download },
        { path: '/help', label: 'Help & Docs', icon: HelpCircle },
        { path: '/settings', label: t('settings'), icon: Settings },
        { path: '/login', label: t('login'), icon: LogIn }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1050
          }}
          className="lg:hidden"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-base)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          transition: 'transform var(--transition-normal)',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-main) 100%)'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 20px',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent'
          }}
        >
          <NavLink to="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(99, 102, 241, 0.5)'
              }}
            >
              <ShieldAlert size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                VyaadhiShield <span style={{ color: 'var(--accent-primary)' }}>AI</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Tamil Nadu Surveillance
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon lg:hidden"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navSections.map((section) => {
            const isCollapsed = collapsedSections[section.key];

            return (
              <div key={section.key}>
                {/* Section Header */}
                <div
                  onClick={() => toggleSection(section.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    userSelect: 'none'
                  }}
                  className="hover:text-slate-300"
                >
                  <span>{section.title}</span>
                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </div>

                {/* Section Items */}
                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                            boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none',
                            transition: 'all var(--transition-fast)'
                          })}
                          className="hover:bg-slate-800/50"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Icon size={16} className={item.color || (isActive ? 'text-white' : 'text-slate-400')} />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              style={{
                                background: 'var(--risk-high)',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '9999px'
                              }}
                            >
                              {item.badge}
                            </span>
                          )}

                          {item.pulse && (
                            <span className="pulse-dot online" />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info badge */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>XGBoost v2.4.2</div>
            <div>37 Districts Monitored</div>
          </div>
          <span className="pulse-dot online" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

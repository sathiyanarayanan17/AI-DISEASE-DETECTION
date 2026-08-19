import { useState } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Mail,
  MessageSquare,
  Smartphone,
  Phone,
  Eye,
  X,
  CheckCheck,
  Trash2,
  Download,
  Filter,
  Shield,
  Activity,
  MapPin,
  Clock,
  Settings,
  Volume2
} from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'critical',
    title: 'Dengue Outbreak Alert — Chennai',
    description: 'Case count exceeded critical threshold (85th percentile). 47 new cases reported in last 24 hours. Immediate rapid response team deployment recommended.',
    timestamp: '2026-08-19T09:30:00',
    district: 'Chennai',
    read: false
  },
  {
    id: 2,
    type: 'critical',
    title: 'Cholera Surge Detected — Tiruvallur',
    description: 'Water contamination suspected. 32 cholera cases in 48 hours. Risk score: 91/100. Emergency medical supplies pre-positioning advised.',
    timestamp: '2026-08-19T08:15:00',
    district: 'Tiruvallur',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Rising Malaria Cases — Madurai',
    description: 'Rolling 7-day average has increased by 40% compared to previous week. Current risk level elevated to Medium.',
    timestamp: '2026-08-19T07:45:00',
    district: 'Madurai',
    read: false
  },
  {
    id: 4,
    type: 'warning',
    title: 'Heavy Rainfall Warning — Kanchipuram',
    description: 'IMD forecasts 120mm rainfall in next 48 hours. Historical correlation shows 3x dengue risk increase within 10 days of heavy rainfall events.',
    timestamp: '2026-08-18T22:00:00',
    district: 'Kanchipuram',
    read: false
  },
  {
    id: 5,
    type: 'info',
    title: 'Model Retrained Successfully',
    description: 'XGBoost ensemble retrained with latest 7 days of data. F1-score improved from 0.91 to 0.923. No feature drift detected.',
    timestamp: '2026-08-18T18:30:00',
    district: 'System',
    read: true
  },
  {
    id: 6,
    type: 'critical',
    title: 'Dengue Cluster Identified — Coimbatore',
    description: 'Spatial clustering algorithm detected localized outbreak in 3 adjacent wards. 28 cases in 72 hours. Vector control teams alerted.',
    timestamp: '2026-08-18T16:20:00',
    district: 'Coimbatore',
    read: false
  },
  {
    id: 7,
    type: 'warning',
    title: 'Humidity Threshold Exceeded — Salem',
    description: 'Relative humidity at 94% for 5 consecutive days. SHAP analysis indicates this is the top contributing factor for current risk elevation.',
    timestamp: '2026-08-18T14:00:00',
    district: 'Salem',
    read: true
  },
  {
    id: 8,
    type: 'info',
    title: 'Weekly Report Generated',
    description: 'Disease surveillance weekly report for Week 33 (Aug 11-17) is ready. 4 high-risk, 12 medium-risk, 21 low-risk districts identified.',
    timestamp: '2026-08-18T10:00:00',
    district: 'System',
    read: true
  },
  {
    id: 9,
    type: 'resolved',
    title: 'Cholera Alert Resolved — Thanjavur',
    description: 'Case count has dropped below threshold for 7 consecutive days. Risk level downgraded from High to Low. Continued surveillance recommended.',
    timestamp: '2026-08-17T20:00:00',
    district: 'Thanjavur',
    read: true
  },
  {
    id: 10,
    type: 'warning',
    title: 'NE Monsoon Onset Predicted — Coastal Districts',
    description: 'IMD signals early NE monsoon onset (Oct 15 ± 5 days). Historical data shows 2.5x increase in waterborne disease risk during transition period.',
    timestamp: '2026-08-17T15:30:00',
    district: 'Multiple',
    read: false
  },
  {
    id: 11,
    type: 'info',
    title: 'New Data Source Integrated',
    description: 'IHIP real-time feed successfully connected. Data latency reduced from 48 hours to 6 hours for 12 pilot districts.',
    timestamp: '2026-08-17T12:00:00',
    district: 'System',
    read: true
  },
  {
    id: 12,
    type: 'critical',
    title: 'Multi-Disease Risk — Nagapattinam',
    description: 'Concurrent elevated risk for both dengue and cholera. Combined risk score: 88/100. Coastal flooding reported. Emergency protocols activated.',
    timestamp: '2026-08-17T09:45:00',
    district: 'Nagapattinam',
    read: false
  }
];

const severityConfig = {
  critical: { color: 'var(--risk-high, #ef4444)', icon: AlertCircle, label: 'Critical' },
  warning: { color: 'var(--risk-medium, #f59e0b)', icon: AlertTriangle, label: 'Warning' },
  info: { color: 'var(--accent-cyan, #06b6d4)', icon: Info, label: 'Info' },
  resolved: { color: 'var(--accent-emerald, #10b981)', icon: CheckCircle, label: 'Resolved' }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    critical: { email: true, sms: true, push: true, voice: true },
    warning: { email: true, sms: true, push: true, voice: false },
    info: { email: true, sms: false, push: true, voice: false },
    resolved: { email: false, sms: false, push: true, voice: false }
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    critical: notifications.filter(n => n.type === 'critical').length,
    resolved: notifications.filter(n => n.type === 'resolved').length
  };

  const filters = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'unread', label: 'Unread', count: stats.unread },
    { key: 'critical', label: 'Critical', count: stats.critical },
    { key: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
    { key: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length }
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const togglePreference = (level, channel) => {
    setPreferences(prev => ({
      ...prev,
      [level]: { ...prev[level], [channel]: !prev[level][channel] }
    }));
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BellRing size={28} style={{ color: 'var(--accent-primary, #6366f1)' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}>Notifications Center</h1>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Manage alerts, warnings, and system notifications</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Settings size={16} />
          Preferences
        </button>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={24} style={{ color: 'var(--accent-primary, #6366f1)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Total Notifications</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.total}</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BellRing size={24} style={{ color: 'var(--risk-medium, #f59e0b)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Unread</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--risk-medium, #f59e0b)' }}>{stats.unread}</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={24} style={{ color: 'var(--risk-high, #ef4444)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Critical Alerts</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--risk-high, #ef4444)' }}>{stats.critical}</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} style={{ color: 'var(--accent-emerald, #10b981)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Resolved</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--accent-emerald, #10b981)' }}>{stats.resolved}</p>
          </div>
        </div>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Volume2 size={20} style={{ color: 'var(--accent-primary, #6366f1)' }} />
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Notification Preferences</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(4, 1fr)', gap: '12px', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Alert Level</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'center' }}>Email</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'center' }}>SMS</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'center' }}>Push</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'center' }}>Voice</span>
            </div>
            {Object.entries(severityConfig).map(([level, config]) => (
              <div key={level} style={{ display: 'grid', gridTemplateColumns: '140px repeat(4, 1fr)', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-base)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: config.color }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{config.label}</span>
                </div>
                {['email', 'sms', 'push', 'voice'].map(channel => (
                  <div key={channel} style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => togglePreference(level, channel)}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        background: preferences[level][channel] ? 'var(--accent-primary, #6366f1)' : 'var(--bg-input, #374151)',
                        position: 'relative',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        position: 'absolute',
                        top: '3px',
                        left: preferences[level][channel] ? '23px' : '3px',
                        transition: 'left 0.2s'
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Mail size={14} /> Email
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <MessageSquare size={14} /> SMS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Smartphone size={14} /> Push
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Phone size={14} /> Voice
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs + Bulk Actions */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  background: activeFilter === f.key ? 'var(--accent-primary, #6366f1)' : 'transparent',
                  color: activeFilter === f.key ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {f.label}
                <span style={{
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: activeFilter === f.key ? 'rgba(255,255,255,0.2)' : 'var(--bg-input)',
                  color: activeFilter === f.key ? '#fff' : 'var(--text-muted)'
                }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={markAllRead} className="btn btn-secondary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCheck size={14} /> Mark All Read
            </button>
            <button onClick={clearAll} className="btn btn-secondary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={14} /> Clear All
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifications.length === 0 && (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <Bell size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>No notifications found</p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>All caught up! Check back later for new alerts.</p>
          </div>
        )}
        {filteredNotifications.map(notification => {
          const config = severityConfig[notification.type];
          const IconComponent = config.icon;
          return (
            <div
              key={notification.id}
              className="glass-card"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${config.color}`,
                opacity: notification.read ? 0.75 : 1,
                position: 'relative',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Icon */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: `${config.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComponent size={20} style={{ color: config.color }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: notification.read ? '500' : '600' }}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary, #6366f1)' }} />
                      )}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: `${config.color}20`,
                        color: config.color,
                        textTransform: 'uppercase'
                      }}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {notification.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <Clock size={12} /> {formatTimestamp(notification.timestamp)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <MapPin size={12} /> {notification.district}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: notification.read ? 'var(--accent-emerald, #10b981)' : 'var(--risk-medium, #f59e0b)' }}>
                        {notification.read ? <CheckCircle size={12} /> : <BellRing size={12} />}
                        {notification.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-base)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <CheckCheck size={12} /> Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-base)',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <X size={12} /> Dismiss
                      </button>
                      <button
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'var(--accent-primary, #6366f1)',
                          color: '#fff',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Eye size={12} /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

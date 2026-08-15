import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, ExternalLink, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../../context/AlertContext';
import RiskBadge from './RiskBadge';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, unreadCount, acknowledgeAlert, acknowledgeAll } = useAlerts();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unacknowledged = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-icon relative"
        title="Notifications & Outbreak Alerts"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--risk-high)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '700',
              borderRadius: '9999px',
              height: '18px',
              minWidth: '18px',
              padding: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px var(--risk-high)'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            right: 0,
            top: '46px',
            width: '360px',
            maxHeight: '480px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} className="text-indigo-400" />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Active Outbreak Alerts</span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={acknowledgeAll}
                className="btn btn-secondary text-xs"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                title="Mark all alerts as acknowledged"
              >
                <CheckCheck size={12} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '360px', padding: '8px' }}>
            {unacknowledged.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '13px' }}>No unacknowledged alerts</p>
                <span style={{ fontSize: '11px' }}>All districts operating under nominal thresholds</span>
              </div>
            ) : (
              unacknowledged.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '8px',
                    background: 'var(--bg-card-hover)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{alert.districtName}</span>
                    <RiskBadge level={alert.riskLevel} score={alert.riskScore} size="sm" />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {alert.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>{alert.timestamp}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Acknowledge
                      </button>
                      <Link
                        to={`/district/${alert.districtName.toLowerCase()}`}
                        onClick={() => setIsOpen(false)}
                        style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                      >
                        <span>Inspect</span>
                        <ExternalLink size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--border-base)',
              background: 'var(--bg-surface)',
              textAlign: 'center'
            }}
          >
            <Link
              to="/alerts"
              onClick={() => setIsOpen(false)}
              style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              View Full Alerts Management Console
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

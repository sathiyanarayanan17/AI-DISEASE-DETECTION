import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  ShieldAlert,
  CheckCheck,
  ExternalLink,
  Search,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import RiskBadge from '../components/common/RiskBadge';

export const AlertsPage = () => {
  const { alerts, acknowledgeAlert, resolveAlert, acknowledgeAll } = useAlerts();
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = {
    all: alerts.length,
    high: alerts.filter((a) => a.riskLevel === 'high').length,
    medium: alerts.filter((a) => a.riskLevel === 'medium').length,
    low: alerts.filter((a) => a.riskLevel === 'low').length
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesLevel = filterLevel === 'all' || alert.riskLevel === filterLevel;
    const matchesSearch = alert.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={24} className="text-rose-500" />
            <span>Alert Management Console</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Real-time public health advisories, threshold breaches, and containment action directives.
          </p>
        </div>

        <button
          onClick={acknowledgeAll}
          className="btn btn-secondary text-xs"
          title="Mark all current alerts as acknowledged"
        >
          <CheckCheck size={14} className="text-indigo-400" />
          <span>Acknowledge All ({alerts.filter((a) => !a.acknowledged).length})</span>
        </button>
      </div>

      {/* 2. Filter Pills & Search */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterLevel('all')}
            className={`btn text-xs ${filterLevel === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Alerts ({counts.all})
          </button>
          <button
            onClick={() => setFilterLevel('high')}
            className={`btn text-xs ${filterLevel === 'high' ? 'btn-danger' : 'btn-secondary'}`}
          >
            High Risk ({counts.high})
          </button>
          <button
            onClick={() => setFilterLevel('medium')}
            className={`btn text-xs ${filterLevel === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Medium Risk ({counts.medium})
          </button>
          <button
            onClick={() => setFilterLevel('low')}
            className={`btn text-xs ${filterLevel === 'low' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Low Risk ({counts.low})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search district or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control text-xs"
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      {/* 3. Alerts Cards Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={40} className="text-slate-600" />
          <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>No Alerts Found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px' }}>
            No outbreak alerts match your current filter criteria. All monitored district parameters are within safe bounds.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredAlerts.map((alert) => {
            const borderColor = alert.riskLevel === 'high' ? 'var(--risk-high)' : (alert.riskLevel === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)');

            return (
              <div
                key={alert.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  borderLeft: `5px solid ${borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: alert.resolved ? 0.6 : 1,
                  background: alert.acknowledged ? 'var(--bg-card)' : 'var(--bg-card-hover)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                      {alert.districtName} - {alert.disease} Vector Warning
                    </div>
                    <RiskBadge level={alert.riskLevel} score={alert.riskScore} size="sm" />
                    {alert.resolved && (
                      <span className="risk-badge low" style={{ fontSize: '11px' }}>
                        <Check size={12} /> Resolved
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {alert.timestamp} | Confidence {alert.confidence}%
                  </div>
                </div>

                {/* Risk Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '70px' }}>Risk Index:</span>
                  <div className="progress-bar-track" style={{ height: '6px', maxWidth: '300px' }}>
                    <div
                      className={`progress-bar-fill ${alert.riskLevel}`}
                      style={{ width: `${alert.riskScore}%` }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {alert.riskScore}/100
                  </span>
                </div>

                {/* Recommendation */}
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Action Directive: </strong>
                  {alert.message}
                </p>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Alert ID: {alert.id}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="btn btn-secondary text-xs"
                      >
                        <Check size={13} />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="btn btn-primary text-xs"
                      >
                        <CheckCheck size={13} />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    <Link
                      to={`/district/${alert.districtName.toLowerCase()}`}
                      className="btn btn-secondary text-xs"
                    >
                      <span>View Details</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;

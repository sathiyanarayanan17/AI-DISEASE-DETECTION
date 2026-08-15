import React, { useState, useEffect } from 'react';
import { Radio, ShieldAlert, Cpu, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DISTRICTS_DATA, getHighRiskDistricts } from '../../data/districtsData';

export const FloatingStatusWidget = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());
  const highRisk = getHighRiskDistricts();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      className="glass-card no-print"
      aria-label="Live System Telemetry"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '24px',
        zIndex: 900,
        width: collapsed ? 'auto' : '280px',
        border: '1px solid var(--border-strong)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(16px)',
        borderRadius: '14px',
        overflow: 'hidden'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-base)',
          cursor: 'pointer'
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot online" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Live Telemetry
          </span>
        </div>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
          aria-label={collapsed ? 'Expand live telemetry widget' : 'Collapse live telemetry widget'}
        >
          {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} className="text-indigo-400" />
              <span>XGBoost ML v2.4</span>
            </span>
            <span style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              97.2% F1
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} className="text-rose-400" />
              <span>High Risk Wards</span>
            </span>
            <span style={{ fontWeight: 700, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>
              {highRisk.length} Districts
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} className="text-cyan-400" />
              <span>Telemetry Sync</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              {timeStr}
            </span>
          </div>

          <div style={{ paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/realtime"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
                padding: '6px 0',
                background: 'var(--accent-primary-light)',
                color: 'var(--accent-primary)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                transition: 'background var(--transition-fast)'
              }}
            >
              <Activity size={13} />
              <span>Open Real-Time Feed</span>
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FloatingStatusWidget;

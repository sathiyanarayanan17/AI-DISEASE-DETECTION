import React from 'react';
import { DISTRICTS_DATA } from '../../data/districtsData';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const LiveTicker = () => {
  // Duplicate array to achieve seamless infinite continuous loop
  const items = [...DISTRICTS_DATA, ...DISTRICTS_DATA];

  return (
    <div
      className="marquee-wrapper no-print"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '6px 0',
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        zIndex: 40
      }}
    >
      <div
        style={{
          padding: '0 16px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-base)',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          zIndex: 2
        }}
      >
        <Activity size={14} />
        <span>TN SURVEILLANCE FEED:</span>
      </div>

      <div className="marquee-content">
        {items.map((d, index) => {
          const color = d.riskLevel === 'high' ? 'var(--risk-high)' : (d.riskLevel === 'medium' ? 'var(--risk-medium)' : 'var(--risk-low)');
          const symbol = d.riskLevel === 'high' ? '!' : (d.riskLevel === 'medium' ? '~' : 'OK');

          return (
            <Link
              key={`${d.id}-${index}`}
              to={`/district/${d.name.toLowerCase()}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '2px 8px',
                borderRadius: '6px',
                transition: 'background var(--transition-fast)'
              }}
              className="hover:bg-slate-800/40"
            >
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({d.tamilName})</span>
              <span
                style={{
                  color,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                [{symbol}] {d.riskScore}/100
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>•</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTicker;

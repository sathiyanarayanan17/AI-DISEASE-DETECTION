import React from 'react';

const ICONS = {
  High:   '⚠',
  Medium: '◈',
  Low:    '✓',
};

export default function RiskBadge({ level, size = 'default' }) {
  const cls = level === 'High' ? 'badge badge-high'
            : level === 'Medium' ? 'badge badge-medium'
            : 'badge badge-low';
  const style = size === 'large' ? { fontSize: '0.85rem', padding: '5px 14px' } : {};
  return <span className={cls} style={style}>{ICONS[level] || '?'} {level}</span>;
}

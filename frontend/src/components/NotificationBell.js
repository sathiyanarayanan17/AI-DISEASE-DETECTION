import React from 'react';

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '6px',
        borderRadius: '8px',
        transition: 'background 0.2s',
      }}
      title={`${count} new alert${count !== 1 ? 's' : ''}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      {count > 0 && (
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: '#ef4444',
          color: '#fff',
          fontSize: '0.6rem',
          fontWeight: 700,
          padding: '1px 5px',
          borderRadius: '10px',
          minWidth: '16px',
          textAlign: 'center',
          lineHeight: '14px',
          boxShadow: '0 0 8px rgba(239,68,68,0.5)',
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
}

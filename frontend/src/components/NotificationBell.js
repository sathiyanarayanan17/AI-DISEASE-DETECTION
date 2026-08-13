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
      🔔
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

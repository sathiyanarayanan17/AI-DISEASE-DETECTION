import React from 'react';

export default function LanguageToggle({ language, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(59,130,246,0.08)',
        color: '#93c5fd',
        fontSize: '0.72rem',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.2s ease',
      }}
      title="Toggle Language"
    >
      🌐 {language === 'en' ? 'EN' : 'TA'}
    </button>
  );
}

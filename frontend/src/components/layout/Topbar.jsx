import React from 'react';
import { Menu, Search, User, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../common/NotificationBell';

export const Topbar = ({ onOpenMobileMenu, onOpenSearch }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <header
      className="topbar no-print"
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: 'var(--bg-overlay)'
      }}
    >
      {/* Left: Mobile Toggle & Quick Search Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn btn-ghost btn-icon"
          style={{ width: '38px', height: '38px', borderRadius: '10px' }}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Trigger */}
        <button
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 16px',
            borderRadius: '10px',
            background: 'var(--bg-input)',
            border: '1.5px solid var(--border-base)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            minWidth: '280px',
            maxWidth: '400px',
            transition: 'all 200ms ease',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.background = 'var(--bg-card)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-base)';
            e.currentTarget.style.background = 'var(--bg-input)';
          }}
          aria-label="Search districts, tools, and features"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <Search size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            <span>Search districts, tools...</span>
          </div>
          <kbd
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 600,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '5px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em'
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* AI Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          borderRadius: '20px',
          background: 'var(--accent-emerald-light)',
          border: '1px solid var(--risk-low-border)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--accent-emerald)'
        }}>
          <Sparkles size={12} />
          <span>AI Active</span>
          <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LanguageToggle />
        <ThemeToggle />
        <NotificationBell />

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '28px',
          background: 'var(--border-base)',
          margin: '0 4px'
        }} />

        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 14px 6px 6px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.background = 'var(--bg-card-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-base)';
            e.currentTarget.style.background = 'var(--bg-card)';
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
            }}
          >
            {user.avatar || 'TN'}
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={9} style={{ color: 'var(--accent-primary)' }} />
              <span>{user.roleName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

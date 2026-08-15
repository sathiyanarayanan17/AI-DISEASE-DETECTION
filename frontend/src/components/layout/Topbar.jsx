import React from 'react';
import { Menu, Search, User, ShieldCheck } from 'lucide-react';
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
        zIndex: 50
      }}
    >
      {/* Left: Mobile Toggle & Quick Search Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn btn-secondary btn-icon lg:hidden"
          style={{ width: '36px', height: '36px' }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={onOpenSearch}
          className="glass-card flex items-center justify-between"
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-base)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            minWidth: '260px',
            maxWidth: '380px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Search size={15} className="text-slate-400" />
            <span>Search 37 districts, tools...</span>
          </div>
          <kbd
            style={{
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 700,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Language, Theme, Alerts, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LanguageToggle />
        <ThemeToggle />
        <NotificationBell />

        {/* User Badge */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'var(--bg-card)'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            {user.avatar || 'TN'}
          </div>

          <div className="hidden sm:block" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={10} className="text-indigo-400" />
              <span>{user.roleName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

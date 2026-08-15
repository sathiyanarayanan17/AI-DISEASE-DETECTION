import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LiveTicker from './LiveTicker';
import QuickSearchModal from '../common/QuickSearchModal';
import FloatingStatusWidget from '../common/FloatingStatusWidget';
import { useAlerts } from '../../context/AlertContext';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { toasts } = useAlerts();

  return (
    <div className="app-container grid-bg">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        <LiveTicker />

        <main className="app-content-body">
          <Outlet />
        </main>
      </div>

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Floating Telemetry Widget */}
      <FloatingStatusWidget />

      {/* Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 2500,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass-card"
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              borderLeft: `4px solid ${toast.type === 'error' ? 'var(--risk-high)' : 'var(--accent-primary)'}`,
              boxShadow: 'var(--shadow-lg)',
              minWidth: '280px',
              maxWidth: '380px',
              animation: 'float-slow 0.3s ease'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {toast.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppLayout;

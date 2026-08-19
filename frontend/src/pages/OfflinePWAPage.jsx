import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  WifiOff,
  Download,
  HardDrive,
  RefreshCw,
  Smartphone,
  Monitor,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  ArrowLeft
} from 'lucide-react';

const OfflinePWAPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, quota: 0 });
  const [lastSync, setLastSync] = useState('2026-08-17T13:45:00');

  const cachedPages = [
    { name: 'Dashboard', path: '/dashboard', cached: true, size: '245 KB' },
    { name: 'District Data', path: '/districts', cached: true, size: '1.2 MB' },
    { name: 'Analytics', path: '/analytics', cached: true, size: '380 KB' },
    { name: 'Alerts', path: '/alerts', cached: true, size: '120 KB' },
    { name: 'Forecast Models', path: '/forecast', cached: false, size: '0 KB' },
    { name: 'Reports Archive', path: '/reports', cached: false, size: '0 KB' }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  useEffect(() => {
    const estimateStorage = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        setStorageUsage({
          used: estimate.usage || 4200000,
          quota: estimate.quota || 524288000
        });
      } else {
        setStorageUsage({ used: 4200000, quota: 524288000 });
      }
    };
    estimateStorage();
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const usagePercent = storageUsage.quota > 0
    ? ((storageUsage.used / storageUsage.quota) * 100).toFixed(2)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Download size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>Offline and PWA Settings</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Manage offline capabilities, app installation, and cached data for uninterrupted access.
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary text-xs">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Network Status and Install */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Network Status */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isOnline
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(239, 68, 68, 0.15)',
            border: `2px solid ${isOnline ? 'var(--risk-low)' : 'var(--risk-high)'}`
          }}>
            {isOnline
              ? <Wifi size={36} style={{ color: 'var(--risk-low)' }} />
              : <WifiOff size={36} style={{ color: 'var(--risk-high)' }} />
            }
          </div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isOnline ? 'Online' : 'Offline'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            {isOnline
              ? 'Connected to the network. All features available.'
              : 'No network connection. Cached data is available.'}
          </p>
          <div style={{
            marginTop: '12px',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: '600',
            background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isOnline ? 'var(--risk-low)' : 'var(--risk-high)'
          }}>
            {isOnline ? 'All systems operational' : 'Limited functionality'}
          </div>
        </div>

        {/* Install App */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isInstalled
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(99, 102, 241, 0.15)',
            border: `2px solid ${isInstalled ? 'var(--risk-low)' : 'var(--accent-primary)'}`
          }}>
            <Smartphone size={36} style={{ color: isInstalled ? 'var(--risk-low)' : 'var(--accent-primary)' }} />
          </div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isInstalled ? 'App Installed' : 'Install as App'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
            {isInstalled
              ? 'The app is installed on your device.'
              : 'Install this app for faster access and offline use.'}
          </p>
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="btn btn-primary"
              disabled={!installPrompt}
            >
              <Download size={16} />
              <span>{installPrompt ? 'Install App' : 'Install via Browser Menu'}</span>
            </button>
          )}
          {isInstalled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', color: 'var(--risk-low)' }}>
              <CheckCircle size={16} />
              <span style={{ fontSize: '13px' }}>Installed successfully</span>
            </div>
          )}
        </div>

        {/* Storage Usage */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '2px solid var(--accent-primary)'
          }}>
            <HardDrive size={36} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Storage Usage
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
            {formatBytes(storageUsage.used)} of {formatBytes(storageUsage.quota)} used
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: 'var(--bg-input)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${usagePercent}%`,
              borderRadius: '4px',
              background: 'var(--accent-primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px' }}>
            {usagePercent}% of available storage
          </p>
        </div>
      </div>

      {/* Last Sync */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={18} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Last synchronized: <strong style={{ color: 'var(--text-primary)' }}>{new Date(lastSync).toLocaleString()}</strong>
          </span>
        </div>
        <button
          onClick={() => setLastSync(new Date().toISOString())}
          className="btn btn-primary text-xs"
          disabled={!isOnline}
        >
          <RefreshCw size={14} />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Cached Pages */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} style={{ color: 'var(--accent-primary)' }} />
          Cached Pages and Data
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)' }}>Page</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)' }}>Path</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>Size</th>
              </tr>
            </thead>
            <tbody>
              {cachedPages.map((page, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-base)' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{page.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{page.path}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {page.cached
                      ? <CheckCircle size={16} style={{ color: 'var(--risk-low)' }} />
                      : <XCircle size={16} style={{ color: 'var(--text-muted)' }} />
                    }
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>{page.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={18} style={{ color: 'var(--accent-primary)' }} />
          How to Install as an App
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Desktop */}
          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-base)' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={16} />
              Desktop (Chrome / Edge)
            </h4>
            <ol style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
              <li>Click the install icon in the address bar</li>
              <li>Or open browser menu (three dots)</li>
              <li>Select "Install Early Warning System"</li>
              <li>Click "Install" in the confirmation dialog</li>
            </ol>
          </div>

          {/* Android */}
          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-base)' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} />
              Android (Chrome)
            </h4>
            <ol style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
              <li>Tap the three-dot menu in Chrome</li>
              <li>Select "Add to Home screen"</li>
              <li>Tap "Install" when prompted</li>
              <li>App icon appears on your home screen</li>
            </ol>
          </div>

          {/* iOS */}
          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-base)' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} />
              iOS (Safari)
            </h4>
            <ol style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
              <li>Tap the Share button (square with arrow)</li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" in the top right</li>
              <li>Launch from your home screen</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePWAPage;

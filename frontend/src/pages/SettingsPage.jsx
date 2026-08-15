import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Sliders,
  CheckCircle,
  ActivitySquare,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAlerts } from '../context/AlertContext';

export const SettingsPage = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { addToast } = useAlerts();

  const [threshold, setThreshold] = useState(70);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [apiStatus, setApiStatus] = useState('Online (Mock Mode Active)');

  const handleSave = () => {
    addToast("Settings Updated", "System surveillance preferences saved successfully.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} className="text-indigo-400" />
            <span>Platform Configuration & System Preferences</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Customize interface visual theme, language locale, early warning thresholds, and telemetry connectivity.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <CheckCircle size={15} />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* 2. Preferences Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Theme Setting */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Interface Theme Mode</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Toggle between dark surveillance operations theme and daytime high-contrast light mode.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`btn text-xs ${isDark ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Moon size={14} />
              <span>Dark Premium (Default)</span>
            </button>
            <button
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`btn text-xs ${!isDark ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Sun size={14} />
              <span>Light High-Contrast</span>
            </button>
          </div>
        </div>

        {/* Language Setting */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Language & Localization</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Switch dashboard and alert broadcast labels between English and Tamil (தமிழ்).
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { if (language !== 'en') toggleLanguage(); }}
              className={`btn text-xs ${language === 'en' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Globe size={14} />
              <span>English (Default)</span>
            </button>
            <button
              onClick={() => { if (language !== 'ta') toggleLanguage(); }}
              className={`btn text-xs ${language === 'ta' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Globe size={14} />
              <span>தமிழ் (Tamil)</span>
            </button>
          </div>
        </div>

        {/* Outbreak Threshold Slider */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>High Outbreak Alert Threshold Trigger</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Districts with risk scores at or above this value will immediately generate critical audio, SMS, and dashboard alerts.
              </div>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--risk-high)' }}>
              {threshold} / 100
            </span>
          </div>

          <input
            type="range"
            min="50"
            max="90"
            step="1"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
          />
        </div>

        {/* Audio Alerts Sound Toggle */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Auditory Telemetry Chimes</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Play sound cues when new high-severity vector anomalies arrive.
            </div>
          </div>

          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Backend & About Section */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} className="text-indigo-400" />
            <h3 style={{ fontSize: '15px' }}>System Build Information</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Platform Version:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>VyaadhiShield AI v2.4.2</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Frontend Framework:</span>
              <span>React 18 + Vite (SPA)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Backend Architecture:</span>
              <span>FastAPI Python on localhost:8000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Organization:</span>
              <span>Directorate of Public Health & Preventive Medicine, Tamil Nadu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

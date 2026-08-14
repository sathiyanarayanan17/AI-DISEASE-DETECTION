import React, { useState, useEffect, useCallback } from 'react';
import RiskBadge from '../components/RiskBadge';
import { MOCK_DISTRICTS } from '../services/api';

export default function VoiceAlert() {
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [supported, setSupported] = useState(true);

  const highRiskDistricts = MOCK_DISTRICTS.filter(d => d.risk_level === 'High');

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  const speak = useCallback((text, district) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = 'en-IN';

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);

    setHistory(prev => [
      { text, district, time: new Date().toLocaleTimeString('en-IN'), id: Date.now() },
      ...prev.slice(0, 19),
    ]);
  }, [volume, rate]);

  const readAllAlerts = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const intro = 'Disease outbreak early warning alerts for Tamil Nadu.';
    const messages = highRiskDistricts.map(d =>
      `Warning: ${d.district} is at high risk with a score of ${d.risk_score}. Deploy rapid response teams immediately.`
    );
    const fullText = [intro, ...messages].join(' ');
    speak(fullText, 'All Districts');
  };

  const speakSingle = (d) => {
    const text = `Warning: ${d.district} is at high risk with a score of ${d.risk_score}. Deploy rapid response teams immediately.`;
    speak(text, d.district);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  if (!supported) {
    return (
      <div className="card">
        <div className="card-body" style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
          Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Voice Alert System</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={readAllAlerts}
              disabled={speaking}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: speaking ? '#94a3b8' : '#6366f1', color: '#fff',
                fontWeight: 600, fontSize: '0.82rem', cursor: speaking ? 'not-allowed' : 'pointer',
              }}
            >
              {speaking ? 'Speaking...' : 'Read All Alerts'}
            </button>
            {speaking && (
              <button
                onClick={stopSpeaking}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                  fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                }}
              >
                Stop
              </button>
            )}
          </div>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 500 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range" min={0} max={1} step={0.1} value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                Speed: {rate}x
              </label>
              <input
                type="range" min={0.5} max={2} step={0.1} value={rate}
                onChange={e => setRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Districts */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">High Risk Districts ({highRiskDistricts.length})</h3>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {highRiskDistricts.map(d => (
              <div key={d.district} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(239,68,68,0.04)', borderRadius: 10, padding: '12px 16px',
                border: '1px solid rgba(239,68,68,0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(239,68,68,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.82rem', color: '#ef4444'
                  }}>
                    {d.risk_score}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{d.district}</div>
                    <RiskBadge level={d.risk_level} />
                  </div>
                </div>
                <button
                  onClick={() => speakSingle(d)}
                  disabled={speaking}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)',
                    background: 'rgba(99,102,241,0.06)', color: '#6366f1',
                    fontWeight: 600, fontSize: '0.78rem', cursor: speaking ? 'not-allowed' : 'pointer',
                  }}
                >
                  Speak
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert History */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Alert Read History</h3>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', padding: 20 }}>
              No alerts have been read yet. Click "Read All Alerts" or individual "Speak" buttons.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {history.map(h => (
                <div key={h.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#f8fafc', borderRadius: 8, padding: '10px 14px',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}>
                  <span style={{ fontSize: '0.9rem' }}></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 500 }}>
                      {h.district}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{h.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Accessibility Information</h3>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          <div style={{
            background: 'rgba(99,102,241,0.05)', borderRadius: 12, padding: 16,
            border: '1px solid rgba(99,102,241,0.12)',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.6 }}>
              This feature uses the Web Speech API to provide audio alerts for visually impaired users
              and situations where reading a screen is not practical (e.g., emergency response coordination).
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.78rem', color: '#475569', lineHeight: 1.8 }}>
              <li>Supports screen readers and keyboard navigation</li>
              <li>Adjustable speech rate for different listening preferences</li>
              <li>Works offline once the page is loaded</li>
              <li>Compatible with Chrome, Edge, Safari, and Firefox</li>
              <li>Alerts are read in English with Indian English pronunciation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Pause,
  Sliders,
  ShieldAlert,
  CheckCircle,
  Radio
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { getHighRiskDistricts } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

export const VoiceAlertsPage = () => {
  const highRisk = getHighRiskDistricts();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [broadcastLog, setBroadcastLog] = useState([
    {
      id: "VOX-101",
      timestamp: "09:15:30",
      district: "Chennai",
      message: "Urgent outbreak advisory: Chennai risk index 88. Coastal fogging active.",
      status: "COMPLETED"
    },
    {
      id: "VOX-102",
      timestamp: "09:00:12",
      district: "Chengalpattu",
      message: "Chengalpattu IT corridor vector warning: High dengue incidence.",
      status: "COMPLETED"
    }
  ]);

  useEffect(() => {
    speechService.setSettings(rate, pitch, volume);
  }, [rate, pitch, volume]);

  const handleSpeak = (text, districtName = "High Risk Alert") => {
    setCurrentText(text);
    setIsPlaying(true);

    speechService.speak(
      text,
      () => setIsPlaying(true),
      () => {
        setIsPlaying(false);
        setBroadcastLog((prev) => [
          {
            id: `VOX-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString(),
            district: districtName,
            message: text,
            status: "COMPLETED"
          },
          ...prev.slice(0, 10)
        ]);
      },
      (err) => {
        setIsPlaying(false);
      }
    );
  };

  const handleReadAllAlerts = () => {
    const speechScript = `Attention health officers. VyaadhiShield AI Outbreak Bulletin. Currently ${highRisk.length} Tamil Nadu districts are under high alert. ` +
      highRisk.map((d) => `${d.name} risk score ${d.riskScore}. Recommended action: ${d.recommendation}`).join('. ');
    handleSpeak(speechScript, "Statewide Bulletin");
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Volume2 size={24} className="text-cyan-400" />
            <span>Voice Audio Outbreak Synthesizer (TTS)</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Web Speech API integration generating spoken audio health bulletins for emergency command centers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isPlaying ? (
            <button onClick={handleStop} className="btn btn-danger">
              <Square size={15} />
              <span>Stop Speech Audio</span>
            </button>
          ) : (
            <button onClick={handleReadAllAlerts} className="btn btn-primary">
              <Volume2 size={15} />
              <span>Broadcast All High-Risk Bulletins</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Audio Synthesizer Controls */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex-between">
          <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} className="text-indigo-400" />
            <span>Voice Modulation Settings</span>
          </h2>
          {isPlaying && (
            <span className="risk-badge high" style={{ fontSize: '11px' }}>
              <span className="pulse-dot high" />
              <span>Audio Synthesizer Active</span>
            </span>
          )}
        </div>

        <div className="grid-cols-3">
          <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex-between">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Speech Speed (Rate)</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
            />
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex-between">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Voice Pitch</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
            />
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex-between">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Master Volume</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 3. High Risk District Speeches List */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Individual District Audio Dispatches</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {highRisk.map((d) => {
            const speechText = `Emergency alert for ${d.name} district. Risk score is ${d.riskScore} out of 100. Observed ${d.totalCases7d} cases in past 7 days. Action directive: ${d.recommendation}`;

            return (
              <div
                key={d.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <RiskBadge level={d.riskLevel} score={d.riskScore} size="sm" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{d.name} ({d.tamilName})</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{d.recommendation}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeak(speechText, d.name)}
                  className="btn btn-secondary text-xs"
                  style={{ padding: '6px 12px' }}
                >
                  <Play size={13} />
                  <span>Read Bulletin</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Broadcast History Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Audio Voice Broadcast Log</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Broadcast ID</th>
                <th>Time</th>
                <th>Channel / District</th>
                <th>Script Synopsis</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {broadcastLog.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{log.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 600 }}>{log.district}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.message.slice(0, 70)}...</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoiceAlertsPage;

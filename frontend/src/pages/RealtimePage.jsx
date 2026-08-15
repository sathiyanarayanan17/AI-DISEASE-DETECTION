import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RefreshCw,
  ShieldAlert,
  Droplets,
  Thermometer,
  Wind,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

export const RealtimePage = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [events, setEvents] = useState(() => {
    // Initial 8 events
    return DISTRICTS_DATA.slice(0, 8).map((d, i) => ({
      id: `EVT-${Date.now() - i * 4000}`,
      district: d.name,
      tamilName: d.tamilName,
      riskScore: d.riskScore,
      riskLevel: d.riskLevel,
      rainfall: d.weather.rainfall,
      temperature: d.weather.temperature,
      humidity: d.weather.humidity,
      timestamp: new Date(Date.now() - i * 4000).toLocaleTimeString(),
      source: i % 2 === 0 ? "IMD Radar Doppler Sync" : "PHC Vector Lab Ingest"
    }));
  });

  const [counter, setCounter] = useState(30);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Pick random district
      const randomDist = DISTRICTS_DATA[Math.floor(Math.random() * DISTRICTS_DATA.length)];
      const variance = (Math.random() * 4 - 2);
      const newScore = Math.min(100, Math.max(10, Math.round(randomDist.riskScore + variance)));
      const level = newScore >= 70 ? 'high' : (newScore >= 40 ? 'medium' : 'low');

      const newEvent = {
        id: `EVT-${Date.now()}`,
        district: randomDist.name,
        tamilName: randomDist.tamilName,
        riskScore: newScore,
        riskLevel: level,
        rainfall: Math.max(0, Math.round((randomDist.weather.rainfall + Math.random() * 2) * 10) / 10),
        temperature: Math.round((randomDist.weather.temperature + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        humidity: Math.min(98, Math.max(40, Math.round(randomDist.weather.humidity + (Math.random() * 2 - 1)))),
        timestamp: new Date().toLocaleTimeString(),
        source: Math.random() > 0.5 ? "IMD Radar Doppler Sync" : "PHC Sentinel Lab Ingest"
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 24)]);
    }, 4000);

    const countdown = setInterval(() => {
      setCounter((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [isPlaying]);

  const highRiskCount = events.filter((e) => e.riskLevel === 'high').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Controls */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={24} className="text-emerald-400" />
            <span>Real-Time Outbreak Stream & Telemetry</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Simulated WebSocket data pipeline streaming continuous micro-climate sensor updates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn text-xs ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* 2. Status Ribbon */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="pulse-dot online" style={{ width: '12px', height: '12px' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>WebSocket Status</div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-emerald)' }}>CONNECTED (ws://localhost:8000/ws)</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={20} className="text-rose-400" />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>High Risk Events in Buffer</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>{highRiskCount} Detected</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RefreshCw size={20} className="text-indigo-400" />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Auto Sync Refresh Cycle</div>
            <div style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'var(--font-mono)' }}>Every {counter}s</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={20} className="text-cyan-400" />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Throughput</div>
            <div style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'var(--font-mono)' }}>240 pkts / min</div>
          </div>
        </div>
      </div>

      {/* 3. Live Stream Table / Feed */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <h2 style={{ fontSize: '16px' }}>Live Outbreak Ingestion Telemetry</h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Showing latest 25 incoming packets</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>District</th>
                <th>Inferred Risk</th>
                <th>Rainfall (mm)</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Data Source</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} style={{ animation: 'float-slow 0.3s ease' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {evt.timestamp}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{evt.district}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{evt.tamilName}</div>
                  </td>
                  <td>
                    <RiskBadge level={evt.riskLevel} score={evt.riskScore} size="sm" />
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Droplets size={12} className="text-cyan-400" />
                      <span>{evt.rainfall} mm</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Thermometer size={12} className="text-amber-400" />
                      <span>{evt.temperature} °C</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Wind size={12} className="text-indigo-400" />
                      <span>{evt.humidity} %</span>
                    </span>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {evt.source}
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

export default RealtimePage;

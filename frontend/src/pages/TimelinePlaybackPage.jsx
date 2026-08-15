import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  PlayCircle,
  Calendar,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import TamilNaduMap from '../components/maps/TamilNaduMap';
import RiskBadge from '../components/common/RiskBadge';

export const TimelinePlaybackPage = () => {
  const [dayIndex, setDayIndex] = useState(0); // 0 to 29
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x

  useEffect(() => {
    let timer;
    if (isPlaying) {
      const intervalMs = 1200 / speed;
      timer = setInterval(() => {
        setDayIndex((prev) => {
          if (prev >= 29) {
            setIsPlaying(false);
            return 29;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // Calculate day's risk score map for all 37 districts
  const currentDayRiskMap = {};
  let currentHighRiskCount = 0;

  DISTRICTS_DATA.forEach((d) => {
    const dayEntry = d.history30d[dayIndex] || d.history30d[0];
    currentDayRiskMap[d.id] = dayEntry.riskScore;
    if (dayEntry.riskScore >= 70) {
      currentHighRiskCount++;
    }
  });

  const currentDateStr = DISTRICTS_DATA[0].history30d[dayIndex]?.date || "2026-08-15";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Scrubber Controls */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlayCircle size={24} className="text-cyan-400" />
            <span>Spatiotemporal Outbreak Playback</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Replay the evolution of vector surge contagion across Tamil Nadu over the past 30 days.
          </p>
        </div>

        {/* Playback Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setDayIndex(0)}
            className="btn btn-secondary btn-icon"
            title="Reset to Day 1"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-primary"
            style={{ padding: '8px 18px' }}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
          </button>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '4px', borderRadius: '8px' }}>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`btn text-xs ${speed === s ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Timeline Scrubber Ribbon */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} className="text-indigo-400" />
            <span style={{ fontWeight: 700, fontSize: '14px' }}>
              Day {dayIndex + 1} of 30: {currentDateStr}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="risk-badge high" style={{ fontSize: '11px' }}>
              High Risk Districts: {currentHighRiskCount}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="29"
          value={dayIndex}
          onChange={(e) => {
            setDayIndex(parseInt(e.target.value, 10));
            setIsPlaying(false);
          }}
          style={{ width: '100%' }}
        />

        <div className="flex-between" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>T-30 Days ({DISTRICTS_DATA[0].history30d[0].date})</span>
          <span>Midpoint (T-15)</span>
          <span>Today ({DISTRICTS_DATA[0].history30d[29].date})</span>
        </div>
      </div>

      {/* 3. Interactive Animated Map */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <h2 style={{ fontSize: '16px' }}>Dynamic Geospatial Outbreak Visualization</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Markers dynamically recolor per day's simulated inference
          </span>
        </div>

        <div style={{ height: '520px', width: '100%' }}>
          <TamilNaduMap height="100%" overrideRiskScores={currentDayRiskMap} />
        </div>
      </div>
    </div>
  );
};

export default TimelinePlaybackPage;

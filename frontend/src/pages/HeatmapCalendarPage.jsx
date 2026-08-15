import React, { useState, useMemo } from 'react';
import { Grid, Calendar, Info } from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

export const HeatmapCalendarPage = () => {
  const [selectedDistrictName, setSelectedDistrictName] = useState('Chennai');
  const district = getDistrictByName(selectedDistrictName);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 365 days of mock historical calendar data
  const calendarData = useMemo(() => {
    const days = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    let highCount = 0;
    let sumScore = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
      const month = d.getMonth(); // 0 to 11

      // Seasonal peak in Monsoon (Sept - Dec)
      let seasonalFactor = 1.0;
      if (month >= 8 && month <= 11) {
        seasonalFactor = 1.45;
      } else if (month >= 5 && month <= 7) {
        seasonalFactor = 1.15;
      } else {
        seasonalFactor = 0.75;
      }

      const raw = (district.riskScore * 0.7) * seasonalFactor + Math.sin(i / 7) * 12 + (Math.random() * 8 - 4);
      const score = Math.min(100, Math.max(8, Math.round(raw)));

      if (score >= 70) highCount++;
      sumScore += score;

      days.push({
        date: d.toISOString().split('T')[0],
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayOfWeek,
        score,
        level: score >= 70 ? 'high' : (score >= 40 ? 'medium' : 'low')
      });
    }

    return {
      days,
      highCount,
      avgScore: Math.round(sumScore / 365)
    };
  }, [district]);

  const getColor = (level) => {
    if (level === 'high') return '#f43f5e';
    if (level === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const getOpacity = (score) => {
    return Math.max(0.25, score / 100);
  };

  // Group days into 52 weeks (each week has 7 days)
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    weeks.push(calendarData.days.slice(w * 7, (w + 1) * 7));
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Grid size={24} className="text-indigo-400" />
            <span>365-Day Outbreak Heatmap Matrix</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            GitHub-style longitudinal risk calendar tracking annual epidemiological seasonality.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target District:</span>
          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            className="input-control input-select"
            style={{ width: '220px', fontWeight: 600 }}
          >
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.tamilName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Summary Stats */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--risk-high)', fontWeight: 600, textTransform: 'uppercase' }}>
            High-Risk Outbreak Days
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>
            {calendarData.highCount} Days
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Score greater than or equal to 70/100
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Annual Mean Risk Score
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {calendarData.avgScore} / 100
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Longitudinal 52-week average
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Peak Risk Season
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-amber)' }}>
            Oct - Dec (Monsoon)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            North-East Rain Monsoon surge
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Hovered Date Inspector
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: hoveredDay ? getColor(hoveredDay.level) : 'var(--text-muted)' }}>
            {hoveredDay ? `${hoveredDay.formattedDate}: ${hoveredDay.score}/100` : 'Hover on any block'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {hoveredDay ? `Status: ${hoveredDay.level.toUpperCase()}` : '365 points mapped'}
          </div>
        </div>
      </div>

      {/* 3. Heatmap Matrix Grid */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'auto' }}>
        <div className="flex-between">
          <h2 style={{ fontSize: '16px' }}>{district.name}: 52-Week Epidemiological Heatmap</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Low Risk (0-39)</span>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f43f5e' }} />
            <span>High Epidemic (70-100)</span>
          </div>
        </div>

        {/* The 52x7 Grid Container */}
        <div style={{ display: 'flex', gap: '4px', minWidth: '820px', paddingBottom: '8px' }}>
          {/* Day of week labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: '8px', justifyContent: 'space-between' }}>
            {dayLabels.map((lbl, idx) => (
              <span key={idx} style={{ fontSize: '10px', color: 'var(--text-muted)', height: '14px', lineHeight: '14px' }}>
                {lbl}
              </span>
            ))}
          </div>

          {/* 52 Columns */}
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredDay(day)}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    backgroundColor: getColor(day.level),
                    opacity: getOpacity(day.score),
                    cursor: 'pointer',
                    transition: 'transform 100ms',
                    border: hoveredDay?.date === day.date ? '2px solid #ffffff' : 'none'
                  }}
                  title={`${day.formattedDate}: ${day.score}/100 (${day.level})`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapCalendarPage;

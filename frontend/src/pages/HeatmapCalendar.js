import React, { useState, useEffect } from 'react';
import { getDistrictHistory, MOCK_DISTRICTS } from '../services/api';

const DISTRICTS = MOCK_DISTRICTS.map(d => d.district);
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getColor(score) {
  if (score >= 70) return '#ef4444';
  if (score >= 55) return '#f97316';
  if (score >= 40) return '#f59e0b';
  if (score >= 25) return '#84cc16';
  return '#10b981';
}

function getRiskLevel(score) {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function generateYearData(district) {
  const data = [];
  const now = new Date();
  const snap = MOCK_DISTRICTS.find(d => d.district === district);
  let score = snap ? snap.risk_score * 0.7 : 40;

  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth() + 1;
    // Monsoon boost for Oct-Dec
    const monsoonFactor = [10, 11, 12].includes(month) ? 1.3 : [6, 7, 8, 9].includes(month) ? 1.1 : 0.9;
    score = Math.max(5, Math.min(95, score + (Math.random() - 0.48) * 8));
    const dayScore = Math.round(score * monsoonFactor);

    data.push({
      date: d.toISOString().split('T')[0],
      dayOfWeek: d.getDay(),
      score: Math.min(100, dayScore),
    });
  }
  return data;
}

export default function HeatmapCalendar() {
  const [district, setDistrict] = useState('Chennai');
  const [yearData, setYearData] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const data = generateYearData(district);
    setYearData(data);
  }, [district]);

  // Organize into weeks (columns)
  const weeks = [];
  let currentWeek = [];
  yearData.forEach((day, i) => {
    if (i === 0) {
      // Pad beginning
      for (let p = 0; p < day.dayOfWeek; p++) {
        currentWeek.push(null);
      }
    }
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <div>
      {/* District Selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Risk Heatmap Calendar</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>365-day risk history</span>
        </div>
        <div className="card-body" style={{ padding: '16px 24px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 8 }}>
            Select District
          </label>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            style={{
              width: '100%', maxWidth: 320, padding: '10px 14px', borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem', color: '#1e293b',
              background: '#f8fafc', outline: 'none'
            }}
          >
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">{district} - Daily Risk Scores</h3>
        </div>
        <div className="card-body" style={{ padding: 20, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 2, position: 'relative' }}>
            {/* Day labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 6, paddingTop: 0 }}>
              {DAYS_OF_WEEK.map((day, i) => (
                <div key={i} style={{
                  width: 28, height: 14, display: 'flex', alignItems: 'center',
                  fontSize: '0.62rem', color: '#94a3b8', fontWeight: 500
                }}>
                  {i % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    onMouseEnter={(e) => day && setTooltip({ ...day, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: day ? getColor(day.score) : 'transparent',
                      opacity: day ? 0.85 : 0,
                      cursor: day ? 'pointer' : 'default',
                      transition: 'opacity 0.15s',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div style={{
              position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 50,
              background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 8, padding: '8px 12px', fontSize: '0.75rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000,
              pointerEvents: 'none',
            }}>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{tooltip.date}</div>
              <div style={{ color: '#475569', marginTop: 2 }}>
                Score: <strong style={{ color: getColor(tooltip.score) }}>{tooltip.score}</strong>
              </div>
              <div style={{ color: '#64748b', marginTop: 2 }}>
                Level: {getRiskLevel(tooltip.score)}
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 20,
            paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Less</span>
            {[
              { color: '#10b981', label: '0-24' },
              { color: '#84cc16', label: '25-39' },
              { color: '#f59e0b', label: '40-54' },
              { color: '#f97316', label: '55-69' },
              { color: '#ef4444', label: '70-100' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: item.color, opacity: 0.85 }} />
              </div>
            ))}
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>More</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[
              { color: '#10b981', label: 'Low (0-24)' },
              { color: '#84cc16', label: 'Low-Med (25-39)' },
              { color: '#f59e0b', label: 'Medium (40-54)' },
              { color: '#f97316', label: 'Med-High (55-69)' },
              { color: '#ef4444', label: 'High (70-100)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: '#64748b' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap si-red"></div>
          <div>
            <div className="stat-num">{yearData.filter(d => d.score >= 70).length}</div>
            <div className="stat-lbl">High Risk Days</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber"></div>
          <div>
            <div className="stat-num">{yearData.filter(d => d.score >= 40 && d.score < 70).length}</div>
            <div className="stat-lbl">Medium Risk Days</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green"></div>
          <div>
            <div className="stat-num">{yearData.filter(d => d.score < 40).length}</div>
            <div className="stat-lbl">Low Risk Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

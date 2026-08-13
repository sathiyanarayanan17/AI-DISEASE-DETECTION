import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { DISTRICT_COORDS, MOCK_DISTRICTS, generateMockHistory } from '../services/api';
import RiskBadge from '../components/RiskBadge';

function getRiskColor(score) {
  if (score >= 70) return '#ef4444';
  if (score >= 40) return '#f59e0b';
  return '#10b981';
}

export default function TimelinePlayback() {
  const [dayIndex, setDayIndex] = useState(29);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  const historyData = useMemo(() => {
    const data = {};
    MOCK_DISTRICTS.forEach(d => {
      data[d.district] = generateMockHistory(d.district, 30);
    });
    return data;
  }, []);

  const dates = useMemo(() => {
    const sample = historyData[MOCK_DISTRICTS[0].district];
    return sample.map(s => s.date);
  }, [historyData]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setDayIndex(prev => {
          if (prev >= 29) {
            setPlaying(false);
            return 29;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speed]);

  const togglePlay = () => {
    if (dayIndex >= 29 && !playing) {
      setDayIndex(0);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
  };

  const currentDate = dates[dayIndex] || '';

  const getDistrictData = (district) => {
    const history = historyData[district];
    if (!history || !history[dayIndex]) return null;
    return history[dayIndex];
  };

  return (
    <div>
      {/* Map */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <h3 className="card-head-title">Disease Risk Timeline Playback</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)' }}>
              📅 {currentDate}
            </span>
          </div>
        </div>
        <div className="map-wrap" style={{ height: 450 }}>
          <MapContainer
            center={[10.8, 78.5]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {MOCK_DISTRICTS.map(d => {
              const dayData = getDistrictData(d.district);
              if (!dayData) return null;
              const coords = DISTRICT_COORDS[d.district];
              return (
                <CircleMarker
                  key={d.district}
                  center={coords}
                  radius={Math.max(6, dayData.risk_score / 8)}
                  fillColor={getRiskColor(dayData.risk_score)}
                  fillOpacity={0.7}
                  color={getRiskColor(dayData.risk_score)}
                  weight={1.5}
                  opacity={0.9}
                >
                  <Popup>
                    <div style={{ fontSize: '0.8rem' }}>
                      <strong>{d.district}</strong><br />
                      Risk Score: {dayData.risk_score.toFixed(1)}<br />
                      Cases: {dayData.disease_cases}<br />
                      <RiskBadge level={dayData.risk_level} />
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Play/Pause */}
            <button
              className="btn-detail"
              onClick={togglePlay}
              style={{ minWidth: 80 }}
            >
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>

            {/* Speed Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text3)' }}>Speed:</span>
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  className="filter-btn"
                  style={{
                    background: speed === s ? 'var(--accent)' : 'transparent',
                    color: speed === s ? '#fff' : 'var(--text2)',
                    borderColor: speed === s ? 'var(--accent)' : 'var(--border)',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                  }}
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Date display */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text1)' }}>
                {currentDate}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text3)', marginLeft: 8 }}>
                Day {dayIndex + 1} of 30
              </span>
            </div>
          </div>

          {/* Slider */}
          <div style={{ marginTop: 14 }}>
            <input
              type="range"
              min={0}
              max={29}
              value={dayIndex}
              onChange={e => { setDayIndex(parseInt(e.target.value)); setPlaying(false); }}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text3)' }}>
              <span>{dates[0]}</span>
              <span>{dates[14]}</span>
              <span>{dates[29]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Legend</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>High Risk (Score 70+)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Medium Risk (Score 40-69)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Low Risk (Score below 40)</span>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.74rem', color: 'var(--text3)' }}>
              Circle size corresponds to risk score magnitude
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

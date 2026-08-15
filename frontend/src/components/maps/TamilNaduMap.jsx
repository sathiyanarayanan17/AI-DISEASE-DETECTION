import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { DISTRICTS_DATA } from '../../data/districtsData';
import { useTheme } from '../../context/ThemeContext';
import RiskBadge from '../common/RiskBadge';
import { ExternalLink, Droplets, Thermometer, Wind, Activity } from 'lucide-react';

const TN_CENTER = [10.8, 78.5];
const DEFAULT_ZOOM = 7;

export const TamilNaduMap = ({
  height = '500px',
  selectedDistrictId = null,
  onSelectDistrict = null,
  overrideRiskScores = null
}) => {
  const { isDark } = useTheme();
  const [filterLevel, setFilterLevel] = useState('all');

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap';

  const getColor = (score, level) => {
    if (overrideRiskScores && score !== undefined) {
      if (score >= 70) return '#f43f5e';
      if (score >= 40) return '#f59e0b';
      return '#10b981';
    }
    if (level === 'high') return '#f43f5e';
    if (level === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const filteredDistricts = DISTRICTS_DATA.filter((d) => {
    if (filterLevel === 'all') return true;
    return d.riskLevel === filterLevel;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden' }}>
      {/* Overlay Filter Pills */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          display: 'flex',
          gap: '6px',
          background: 'var(--bg-card-glass)',
          backdropFilter: 'blur(10px)',
          padding: '6px',
          borderRadius: '10px',
          border: '1px solid var(--border-base)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <button
          onClick={() => setFilterLevel('all')}
          className={`btn text-xs ${filterLevel === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 10px', fontSize: '11px' }}
        >
          All (37)
        </button>
        <button
          onClick={() => setFilterLevel('high')}
          className={`btn text-xs ${filterLevel === 'high' ? 'btn-danger' : 'btn-secondary'}`}
          style={{ padding: '4px 10px', fontSize: '11px' }}
        >
          High Risk
        </button>
        <button
          onClick={() => setFilterLevel('medium')}
          className={`btn text-xs ${filterLevel === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 10px', fontSize: '11px' }}
        >
          Medium
        </button>
        <button
          onClick={() => setFilterLevel('low')}
          className={`btn text-xs ${filterLevel === 'low' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 10px', fontSize: '11px' }}
        >
          Low
        </button>
      </div>

      <MapContainer
        center={TN_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={tileUrl} attribution={attribution} maxZoom={18} />

        {filteredDistricts.map((district) => {
          const score = overrideRiskScores ? (overrideRiskScores[district.id] ?? district.riskScore) : district.riskScore;
          const level = score >= 70 ? 'high' : (score >= 40 ? 'medium' : 'low');
          const markerColor = getColor(score, level);
          const isSelected = selectedDistrictId === district.id;

          return (
            <CircleMarker
              key={district.id}
              center={district.coordinates}
              radius={isSelected ? 16 : (level === 'high' ? 12 : (level === 'medium' ? 9 : 7))}
              pathOptions={{
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.65,
                weight: isSelected ? 3 : 2
              }}
              eventHandlers={{
                click: () => {
                  if (onSelectDistrict) onSelectDistrict(district);
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div style={{ fontWeight: 600, fontSize: '12px', textAlign: 'center' }}>
                  {district.name} ({score}/100)
                </div>
              </Tooltip>

              <Popup>
                <div style={{ minWidth: '220px', padding: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>{district.name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{district.tamilName}</span>
                    </div>
                    <RiskBadge level={level} score={score} size="sm" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px', fontSize: '11px' }}>
                    <div style={{ background: 'var(--bg-input)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ color: 'var(--text-muted)' }}>7-Day Cases</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{district.totalCases7d}</div>
                    </div>
                    <div style={{ background: 'var(--bg-input)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Confidence</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-emerald)' }}>{district.confidence}%</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Droplets size={12} className="text-cyan-400" /> {district.weather.rainfall}mm
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Thermometer size={12} className="text-amber-400" /> {district.weather.temperature}C
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Wind size={12} className="text-indigo-400" /> {district.weather.humidity}%
                    </span>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.3 }}>
                    {district.recommendation}
                  </p>

                  <Link
                    to={`/district/${district.name.toLowerCase()}`}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '6px', fontSize: '11px', display: 'flex', justifyContent: 'center' }}
                  >
                    <span>View District Deep Dive</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TamilNaduMap;

import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Clock,
  MapPin,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

// District adjacency map (at least 15 pairs)
const ADJACENCY_MAP = {
  Chennai: ['Chengalpattu', 'Kancheepuram', 'Tiruvallur'],
  Coimbatore: ['Tiruppur', 'Nilgiris', 'Erode'],
  Madurai: ['Dindigul', 'Sivagangai', 'Virudhunagar', 'Theni'],
  Tiruvallur: ['Chennai', 'Kancheepuram', 'Vellore', 'Ranipet'],
  Chengalpattu: ['Chennai', 'Kancheepuram', 'Villupuram'],
  Salem: ['Erode', 'Namakkal', 'Dharmapuri', 'Kallakurichi'],
  Tiruppur: ['Coimbatore', 'Erode', 'Karur', 'Dindigul'],
  Erode: ['Coimbatore', 'Tiruppur', 'Salem', 'Namakkal'],
  Trichy: ['Karur', 'Perambalur', 'Ariyalur', 'Pudukkottai', 'Thanjavur'],
  Thanjavur: ['Trichy', 'Pudukkottai', 'Nagapattinam', 'Tiruvarur'],
  Kancheepuram: ['Chennai', 'Chengalpattu', 'Tiruvallur', 'Ranipet'],
  Tirunelveli: ['Tenkasi', 'Thoothukudi', 'Kanyakumari'],
  Vellore: ['Tiruvallur', 'Ranipet', 'Tiruvannamalai'],
  Dindigul: ['Madurai', 'Tiruppur', 'Karur', 'Theni'],
  Sivagangai: ['Madurai', 'Virudhunagar', 'Ramanathapuram', 'Pudukkottai'],
  Nilgiris: ['Coimbatore', 'Erode'],
  Virudhunagar: ['Madurai', 'Sivagangai', 'Thoothukudi', 'Tenkasi'],
  Theni: ['Madurai', 'Dindigul'],
  Thoothukudi: ['Tirunelveli', 'Virudhunagar', 'Ramanathapuram'],
  Cuddalore: ['Villupuram', 'Kallakurichi', 'Ariyalur']
};

const TN_CENTER = [10.8, 78.5];

const getDistrictByName = (name) => {
  return DISTRICTS_DATA.find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  );
};

const calculateSpreadProbability = (source, neighbor) => {
  const neighborDistrict = getDistrictByName(neighbor);
  if (!neighborDistrict) return null;

  const baseProbability = 60;
  // Weather factor: high humidity and rainfall increase spread
  const weatherFactor = Math.min(15,
    (neighborDistrict.weather.humidity - 60) * 0.3 +
    (neighborDistrict.weather.rainfall > 20 ? 8 : 0)
  );
  // Proximity factor based on coordinates distance
  const dx = source.coordinates[0] - neighborDistrict.coordinates[0];
  const dy = source.coordinates[1] - neighborDistrict.coordinates[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  const proximityFactor = Math.max(0, 15 - distance * 8);

  const probability = Math.min(95, Math.round(baseProbability + weatherFactor + proximityFactor));
  const daysToSpread = Math.max(2, Math.round(7 - (probability - 50) * 0.1));

  return {
    district: neighbor,
    districtData: neighborDistrict,
    probability,
    daysToSpread,
    weatherFactor: Math.round(weatherFactor),
    proximityFactor: Math.round(proximityFactor)
  };
};

const OutbreakChainPage = () => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const highRiskDistricts = useMemo(() => {
    return DISTRICTS_DATA.filter((d) => d.riskLevel === 'high');
  }, []);

  const spreadPredictions = useMemo(() => {
    const predictions = [];
    highRiskDistricts.forEach((source) => {
      const neighbors = ADJACENCY_MAP[source.name] || [];
      neighbors.forEach((neighborName) => {
        const prediction = calculateSpreadProbability(source, neighborName);
        if (prediction) {
          predictions.push({
            ...prediction,
            source: source.name,
            sourceData: source
          });
        }
      });
    });
    return predictions.sort((a, b) => b.probability - a.probability);
  }, [highRiskDistricts]);

  const arrowLines = useMemo(() => {
    const lines = [];
    highRiskDistricts.forEach((source) => {
      const neighbors = ADJACENCY_MAP[source.name] || [];
      neighbors.forEach((neighborName) => {
        const neighbor = getDistrictByName(neighborName);
        if (neighbor) {
          lines.push({
            positions: [source.coordinates, neighbor.coordinates],
            source: source.name,
            target: neighborName,
            probability: calculateSpreadProbability(source, neighborName)?.probability || 60
          });
        }
      });
    });
    return lines;
  }, [highRiskDistricts]);

  const stats = useMemo(() => {
    const activeOutbreaks = highRiskDistricts.length;
    const districtsAtRisk = new Set(spreadPredictions.map((p) => p.district)).size;
    const predictedSpread = spreadPredictions.filter((p) => p.probability > 65).length;
    const avgDays = spreadPredictions.length > 0
      ? Math.round(spreadPredictions.reduce((s, p) => s + p.daysToSpread, 0) / spreadPredictions.length)
      : 0;

    return { activeOutbreaks, districtsAtRisk, predictedSpread, responseWindow: avgDays };
  }, [highRiskDistricts, spreadPredictions]);

  const getMarkerColor = (riskLevel) => {
    if (riskLevel === 'high') return '#f43f5e';
    if (riskLevel === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const getMarkerRadius = (riskLevel) => {
    if (riskLevel === 'high') return 12;
    if (riskLevel === 'medium') return 9;
    return 7;
  };

  // Timeline ring data
  const timelineRings = [
    { day: 1, label: 'Source Outbreak', color: '#f43f5e', districts: highRiskDistricts.map((d) => d.name) },
    { day: 3, label: 'First Ring', color: '#f97316', districts: spreadPredictions.filter((p) => p.daysToSpread <= 3).map((p) => p.district) },
    { day: 5, label: 'Second Ring', color: '#f59e0b', districts: spreadPredictions.filter((p) => p.daysToSpread > 3 && p.daysToSpread <= 5).map((p) => p.district) },
    { day: 7, label: 'Third Ring', color: '#eab308', districts: spreadPredictions.filter((p) => p.daysToSpread > 5).map((p) => p.district) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
          <Zap size={24} style={{ color: '#f43f5e' }} />
          Outbreak Chain Reaction Predictor
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Predicting disease spread pathways based on geographic proximity, weather patterns, and active case data
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-4" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <Activity size={20} style={{ color: '#f43f5e', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.activeOutbreaks}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Outbreaks</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <AlertTriangle size={20} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.districtsAtRisk}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Districts at Risk</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <TrendingUp size={20} style={{ color: '#f97316', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.predictedSpread}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Predicted Spread Count</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <Clock size={20} style={{ color: '#3b82f6', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.responseWindow} days</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Avg Response Window</div>
        </div>
      </div>

      {/* Map Section */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} />
          Chain Reaction Map
        </h3>
        <div style={{ borderRadius: '12px', overflow: 'hidden', height: '500px' }}>
          <MapContainer
            center={TN_CENTER}
            zoom={7}
            style={{ height: '100%', width: '100%', background: '#1a1a2e' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {/* Spread arrow lines */}
            {arrowLines.map((line, idx) => (
              <Polyline
                key={`arrow-${idx}`}
                positions={line.positions}
                pathOptions={{
                  color: line.probability > 75 ? '#f43f5e' : line.probability > 60 ? '#f59e0b' : '#3b82f6',
                  weight: 2,
                  opacity: 0.7,
                  dashArray: '8, 6',
                  dashOffset: String(pulsePhase % 14)
                }}
              >
                <Popup>
                  <div style={{ color: '#1a1a2e', fontSize: '12px' }}>
                    <strong>{line.source}</strong> → <strong>{line.target}</strong><br />
                    Spread probability: {line.probability}%
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* District markers */}
            {DISTRICTS_DATA.map((district) => {
              const isHigh = district.riskLevel === 'high';
              const pulseRadius = isHigh ? getMarkerRadius('high') + Math.sin(pulsePhase * 0.1) * 3 : 0;

              return (
                <React.Fragment key={district.id}>
                  {isHigh && (
                    <CircleMarker
                      center={district.coordinates}
                      radius={pulseRadius + 6}
                      pathOptions={{
                        color: '#f43f5e',
                        fillColor: '#f43f5e',
                        fillOpacity: 0.15,
                        weight: 1,
                        opacity: 0.4
                      }}
                    />
                  )}
                  <CircleMarker
                    center={district.coordinates}
                    radius={getMarkerRadius(district.riskLevel)}
                    pathOptions={{
                      color: getMarkerColor(district.riskLevel),
                      fillColor: getMarkerColor(district.riskLevel),
                      fillOpacity: 0.7,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div style={{ color: '#1a1a2e', fontSize: '12px' }}>
                        <strong>{district.name}</strong><br />
                        Risk: {district.riskLevel.toUpperCase()} ({district.riskScore})<br />
                        Cases (7d): {district.totalCases7d}
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} /> High Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} /> Medium Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} /> Low Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '20px', height: '2px', background: '#f43f5e', borderTop: '2px dashed #f43f5e' }} /> Spread Path
          </span>
        </div>
      </div>

      {/* Spread Timeline */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} />
          Predicted Spread Timeline
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', padding: '12px 0' }}>
          {timelineRings.map((ring, idx) => (
            <React.Fragment key={ring.day}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '160px',
                padding: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: ring.color,
                  opacity: 0.85,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  marginBottom: '8px'
                }}>
                  Day {ring.day}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: ring.color }}>{ring.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>
                  {ring.districts.length > 0 ? ring.districts.slice(0, 3).join(', ') : 'None predicted'}
                  {ring.districts.length > 3 && ` +${ring.districts.length - 3} more`}
                </div>
              </div>
              {idx < timelineRings.length - 1 && (
                <ArrowRight size={20} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Spread Prediction Cards */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} />
          Spread Predictions ({spreadPredictions.length} districts at risk)
        </h3>
        <div className="grid grid-3" style={{ gap: '12px' }}>
          {spreadPredictions.slice(0, 12).map((pred, idx) => (
            <div
              key={`${pred.source}-${pred.district}-${idx}`}
              className="glass-card interactive"
              style={{
                padding: '14px',
                borderLeft: `3px solid ${pred.probability > 75 ? '#f43f5e' : pred.probability > 60 ? '#f59e0b' : '#3b82f6'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{pred.district}</span>
                <RiskBadge level={pred.districtData?.riskLevel || 'low'} size="sm" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: pred.probability > 75 ? '#f43f5e' : pred.probability > 60 ? '#f59e0b' : '#3b82f6' }}>
                {pred.probability}% chance
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Estimated spread in {pred.daysToSpread} days from {pred.source}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>Weather: +{pred.weatherFactor}%</span>
                <span>Proximity: +{pred.proximityFactor}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutbreakChainPage;

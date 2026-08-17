import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Satellite,
  RefreshCw,
  Droplets,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Eye,
  Info,
  Radar
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

const TN_CENTER = [10.8, 78.5];

// Generate mock satellite analysis data for 12 districts
const generateSatelliteData = () => {
  const targetDistricts = DISTRICTS_DATA.slice(0, 12);
  return targetDistricts.map((d) => {
    const breedingIndex = Math.min(100, Math.max(5,
      Math.round(d.riskScore * 0.8 + (d.weather.humidity - 50) * 0.4 + (d.weather.rainfall > 30 ? 15 : 0))
    ));
    const waterBodies = Math.round(breedingIndex * 0.3 + Math.random() * 10);
    const riskZones = Math.round(breedingIndex / 20) + 1;

    let status = 'Monitoring';
    if (breedingIndex > 70) status = 'Active';
    else if (breedingIndex > 40 && breedingIndex <= 55) status = 'Contained';

    const recommendations = [];
    if (breedingIndex > 70) {
      recommendations.push('Immediate larvicide deployment required');
      recommendations.push('Drain stagnant water in identified zones');
      recommendations.push('Deploy field teams for manual inspection');
    } else if (breedingIndex > 40) {
      recommendations.push('Schedule bi-weekly fogging operations');
      recommendations.push('Monitor identified water bodies');
    } else {
      recommendations.push('Continue routine surveillance');
      recommendations.push('Maintain drainage infrastructure');
    }

    return {
      id: d.id,
      name: d.name,
      coordinates: d.coordinates,
      breedingIndex,
      waterBodies,
      riskZones,
      status,
      recommendations,
      riskLevel: d.riskLevel,
      lastDetected: `${Math.floor(Math.random() * 24) + 1}h ago`
    };
  });
};

const SatellitePage = () => {
  const [satelliteData] = useState(generateSatelliteData);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('2 hours ago');

  const handleRefresh = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScan('Just now');
    }, 2000);
  };

  const top10ByIndex = useMemo(() => {
    return [...satelliteData]
      .sort((a, b) => b.breedingIndex - a.breedingIndex)
      .slice(0, 10)
      .map((d) => ({
        name: d.name.length > 10 ? d.name.slice(0, 10) + '...' : d.name,
        fullName: d.name,
        index: d.breedingIndex
      }));
  }, [satelliteData]);

  const getIndexColor = (index) => {
    if (index > 70) return '#f43f5e';
    if (index > 40) return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (status) => {
    if (status === 'Active') return <AlertCircle size={14} style={{ color: '#f43f5e' }} />;
    if (status === 'Contained') return <CheckCircle2 size={14} style={{ color: '#10b981' }} />;
    return <Eye size={14} style={{ color: '#f59e0b' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <Satellite size={24} style={{ color: '#06b6d4' }} />
            Mosquito Breeding Index from Satellite
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            AI analyzes satellite imagery to detect stagnant water bodies - potential mosquito breeding sites
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Last satellite scan: <strong style={{ color: 'var(--text-primary)' }}>{lastScan}</strong>
          </span>
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={isScanning}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={isScanning ? 'spinning' : ''} style={isScanning ? { animation: 'spin 1s linear infinite' } : {}} />
            {isScanning ? 'Analyzing...' : 'Refresh Scan'}
          </button>
        </div>
      </div>

      {/* Hero Info Card */}
      <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Radar size={20} style={{ color: '#06b6d4', marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Satellite-Based Breeding Site Detection
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Using multispectral satellite imagery combined with AI analysis, the system identifies stagnant water
              bodies, waterlogged areas, and potential mosquito breeding hotspots across all monitored districts.
              The breeding index (0-100) indicates the density and risk level of identified sites.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results Grid (4x3) */}
      <div>
        <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)', fontSize: '16px' }}>
          Analysis Results
        </h3>
        <div className="grid grid-4" style={{ gap: '14px' }}>
          {satelliteData.map((item) => (
            <div
              key={item.id}
              className="glass-card interactive"
              style={{
                padding: '16px',
                borderTop: `3px solid ${getIndexColor(item.breedingIndex)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{item.name}</span>
                {getStatusIcon(item.status)}
              </div>

              <div style={{ fontSize: '28px', fontWeight: 700, color: getIndexColor(item.breedingIndex), marginBottom: '8px' }}>
                {item.breedingIndex}
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '4px' }}>/100</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Water bodies</span>
                  <span style={{ color: 'var(--text-primary)' }}>{item.waterBodies}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Risk zones</span>
                  <span style={{ color: 'var(--text-primary)' }}>{item.riskZones}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status</span>
                  <span style={{ color: getIndexColor(item.breedingIndex), fontWeight: 500 }}>{item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Top 10 districts */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
          <Droplets size={18} style={{ color: '#06b6d4' }} />
          Top 10 Districts by Breeding Index
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top10ByIndex} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
            <RechartsTooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
            />
            <Bar dataKey="index" radius={[4, 4, 0, 0]} name="Breeding Index">
              {top10ByIndex.map((entry, idx) => (
                <Cell key={idx} fill={getIndexColor(entry.index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Map Section */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} />
          Breeding Site Density Map
        </h3>
        <div style={{ borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
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
            {satelliteData.map((item) => (
              <CircleMarker
                key={item.id}
                center={item.coordinates}
                radius={Math.max(8, item.breedingIndex / 5)}
                pathOptions={{
                  color: getIndexColor(item.breedingIndex),
                  fillColor: getIndexColor(item.breedingIndex),
                  fillOpacity: 0.5,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ color: '#1a1a2e', fontSize: '12px' }}>
                    <strong>{item.name}</strong><br />
                    Breeding Index: {item.breedingIndex}/100<br />
                    Water bodies: {item.waterBodies}<br />
                    Status: {item.status}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', fontSize: '16px' }}>
          District Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {satelliteData.filter((d) => d.breedingIndex > 50).map((item) => (
            <div
              key={item.id}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                borderLeft: `3px solid ${getIndexColor(item.breedingIndex)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{item.name}</span>
                <span style={{ fontSize: '12px', color: getIndexColor(item.breedingIndex), fontWeight: 600 }}>
                  Index: {item.breedingIndex}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {item.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '2px' }}>{rec}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Info */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Info size={18} style={{ color: '#06b6d4', marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Data Source Information</div>
          <div>Source: ISRO Cartosat-3 (simulated)</div>
          <div>Resolution: 0.25m panchromatic / 1m multispectral</div>
          <div>Scan frequency: Every 48 hours (priority zones), Weekly (routine)</div>
          <div>AI Model: Water Body Detection v3.2 - Accuracy: 94.7%</div>
        </div>
      </div>
    </div>
  );
};

export default SatellitePage;

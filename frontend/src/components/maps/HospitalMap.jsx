import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { HOSPITALS_DATA } from '../../data/hospitalsData';
import { useTheme } from '../../context/ThemeContext';
import { Phone, Bed, Activity } from 'lucide-react';

const TN_CENTER = [10.8, 78.5];

// Custom Hospital SVG Pin icon
const createHospitalIcon = (icuAvailable) => {
  const color = icuAvailable > 15 ? '#10b981' : (icuAvailable > 5 ? '#f59e0b' : '#f43f5e');
  return L.divIcon({
    className: 'custom-hospital-icon',
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: 14px;
      ">+</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const HospitalMap = ({ height = '480px', filterType = 'all' }) => {
  const { isDark } = useTheme();

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap';

  const hospitals = HOSPITALS_DATA.filter((h) => {
    if (filterType === 'all') return true;
    if (filterType === 'icu') return h.availableIcu > 10;
    if (filterType === 'isolation') return h.availableIsolation > 15;
    return true;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden' }}>
      <MapContainer
        center={TN_CENTER}
        zoom={7}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={tileUrl} attribution={attribution} maxZoom={18} />

        {hospitals.map((hosp) => (
          <Marker
            key={hosp.id}
            position={hosp.coordinates}
            icon={createHospitalIcon(hosp.availableIcu)}
          >
            <Popup>
              <div style={{ minWidth: '240px', padding: '4px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-primary)' }}>
                  {hosp.name}
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {hosp.district} | {hosp.type}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px', fontSize: '11px' }}>
                  <div style={{ background: 'var(--bg-input)', padding: '6px', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Avail. Beds: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{hosp.availableBeds}</strong> / {hosp.totalBeds}
                  </div>
                  <div style={{ background: 'var(--bg-input)', padding: '6px', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>ICU Beds: </span>
                    <strong style={{ color: hosp.availableIcu > 10 ? 'var(--accent-emerald)' : 'var(--risk-high)' }}>
                      {hosp.availableIcu}
                    </strong> / {hosp.icuBeds}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <strong>Oxygen Supply: </strong>{hosp.oxygenPlant}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} />
                  <span>{hosp.phone}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HospitalMap;

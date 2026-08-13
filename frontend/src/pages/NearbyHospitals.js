import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { MOCK_DISTRICTS, DISTRICT_COORDS } from '../services/api';

const MOCK_HOSPITALS = [
  { id: 1, name: 'Government General Hospital, Chennai', lat: 13.06, lng: 80.28, beds: 2500, available: 180, phone: '044-25305000', speciality: 'Multi-speciality', hasICU: true, hasIsolation: true, district: 'Chennai' },
  { id: 2, name: 'Rajiv Gandhi Government General Hospital', lat: 13.07, lng: 80.27, beds: 1800, available: 120, phone: '044-25305100', speciality: 'Infectious Disease', hasICU: true, hasIsolation: true, district: 'Chennai' },
  { id: 3, name: 'Government Hospital, Madurai', lat: 9.92, lng: 78.11, beds: 1200, available: 85, phone: '0452-2532535', speciality: 'General Medicine', hasICU: true, hasIsolation: true, district: 'Madurai' },
  { id: 4, name: 'Coimbatore Medical College Hospital', lat: 11.01, lng: 76.97, beds: 1500, available: 95, phone: '0422-2301393', speciality: 'Multi-speciality', hasICU: true, hasIsolation: false, district: 'Coimbatore' },
  { id: 5, name: 'Government Hospital, Salem', lat: 11.66, lng: 78.15, beds: 800, available: 55, phone: '0427-2211200', speciality: 'General Medicine', hasICU: true, hasIsolation: true, district: 'Salem' },
  { id: 6, name: 'JIPMER Puducherry', lat: 11.96, lng: 79.82, beds: 2000, available: 150, phone: '0413-2272380', speciality: 'Multi-speciality', hasICU: true, hasIsolation: true, district: 'Puducherry' },
  { id: 7, name: 'Government Hospital, Tirunelveli', lat: 8.72, lng: 77.69, beds: 650, available: 40, phone: '0462-2572656', speciality: 'General Medicine', hasICU: false, hasIsolation: true, district: 'Tirunelveli' },
  { id: 8, name: 'Government Hospital, Vellore', lat: 12.91, lng: 79.14, beds: 700, available: 48, phone: '0416-2263636', speciality: 'Infectious Disease', hasICU: true, hasIsolation: true, district: 'Vellore' },
  { id: 9, name: 'Thanjavur Medical College Hospital', lat: 10.78, lng: 79.15, beds: 900, available: 62, phone: '04362-231491', speciality: 'Multi-speciality', hasICU: true, hasIsolation: false, district: 'Thanjavur' },
  { id: 10, name: 'Government Hospital, Erode', lat: 11.35, lng: 77.72, beds: 550, available: 35, phone: '0424-2225500', speciality: 'General Medicine', hasICU: false, hasIsolation: true, district: 'Erode' },
  { id: 11, name: 'Government Hospital, Thoothukudi', lat: 8.77, lng: 78.12, beds: 500, available: 30, phone: '0461-2320656', speciality: 'General Medicine', hasICU: true, hasIsolation: true, district: 'Thoothukudi' },
  { id: 12, name: 'Government Hospital, Tiruchirappalli', lat: 10.80, lng: 78.69, beds: 1100, available: 75, phone: '0431-2415685', speciality: 'Multi-speciality', hasICU: true, hasIsolation: true, district: 'Tiruchirappalli' },
  { id: 13, name: 'Government Hospital, Cuddalore', lat: 11.74, lng: 79.76, beds: 450, available: 28, phone: '04142-231231', speciality: 'General Medicine', hasICU: false, hasIsolation: false, district: 'Cuddalore' },
  { id: 14, name: 'Government Hospital, Kanyakumari', lat: 8.09, lng: 77.54, beds: 400, available: 25, phone: '04651-246246', speciality: 'General Medicine', hasICU: true, hasIsolation: false, district: 'Kanyakumari' },
  { id: 15, name: 'Government Hospital, Dindigul', lat: 10.35, lng: 77.98, beds: 480, available: 32, phone: '0451-2420200', speciality: 'General Medicine', hasICU: false, hasIsolation: true, district: 'Dindigul' },
];

const highRiskDistricts = MOCK_DISTRICTS.filter(d => d.risk_level === 'High').map(d => d.district);

export default function NearbyHospitals() {
  const [filter, setFilter] = useState('all');

  const filteredHospitals = useMemo(() => {
    let list = MOCK_HOSPITALS;
    if (filter === 'icu') list = list.filter(h => h.hasICU);
    if (filter === 'isolation') list = list.filter(h => h.hasIsolation);
    return list;
  }, [filter]);

  const isNearHighRisk = (hospital) => highRiskDistricts.includes(hospital.district);

  return (
    <div>
      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Nearby Hospitals</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'all', label: 'All Hospitals' },
              { key: 'icu', label: 'Has ICU' },
              { key: 'isolation', label: 'Has Isolation Ward' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: filter === f.key ? '#6366f1' : 'rgba(0,0,0,0.1)',
                  background: filter === f.key ? 'rgba(99,102,241,0.08)' : 'transparent',
                  color: filter === f.key ? '#6366f1' : '#64748b',
                  fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Hospital Map - Tamil Nadu</h3>
          <div style={{ display: 'flex', gap: 14, fontSize: '0.72rem', fontWeight: 600 }}>
            <span style={{ color: '#10b981' }}>+ Hospital</span>
            <span style={{ color: '#ef4444' }}>+ Near High Risk</span>
          </div>
        </div>
        <div className="map-wrap">
          <MapContainer center={[10.8, 78.5]} zoom={7} className="map-container" scrollWheelZoom>
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {/* High risk district zones */}
            {MOCK_DISTRICTS.filter(d => d.risk_level === 'High').map(d => (
              <CircleMarker
                key={`zone-${d.district}`}
                center={[d.lat, d.lng]}
                radius={18}
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1, dashArray: '4 4' }}
              />
            ))}
            {/* Hospital markers */}
            {filteredHospitals.map(h => (
              <CircleMarker
                key={h.id}
                center={[h.lat, h.lng]}
                radius={8}
                pathOptions={{
                  color: isNearHighRisk(h) ? '#ef4444' : '#10b981',
                  fillColor: isNearHighRisk(h) ? '#ef4444' : '#10b981',
                  fillOpacity: 0.8, weight: 2,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 200, fontFamily: 'Inter,sans-serif' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 6, color: '#1e293b' }}>
                      {h.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
                      Beds: {h.available}/{h.beds} available
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
                      Speciality: {h.speciality}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
                      Phone: {h.phone}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      {h.hasICU && <span style={{ fontSize: '0.65rem', background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>ICU</span>}
                      {h.hasIsolation && <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Isolation</span>}
                    </div>
                    {isNearHighRisk(h) && (
                      <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>
                        Near high-risk zone
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Hospital Table */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Hospital Directory ({filteredHospitals.length})</h3>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Hospital</th>
                <th>District</th>
                <th>Available Beds</th>
                <th>Phone</th>
                <th>Facilities</th>
                <th>Zone</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map(h => (
                <tr key={h.id} style={{ background: isNearHighRisk(h) ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>{h.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{h.speciality}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{h.district}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: h.available < 40 ? '#f59e0b' : '#10b981' }}>
                      {h.available}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}> / {h.beds}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>{h.phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {h.hasICU && (
                        <span style={{ fontSize: '0.68rem', background: 'rgba(99,102,241,0.08)', color: '#6366f1', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>ICU</span>
                      )}
                      {h.hasIsolation && (
                        <span style={{ fontSize: '0.68rem', background: 'rgba(245,158,11,0.08)', color: '#f59e0b', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>Isolation</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {isNearHighRisk(h) ? (
                      <span style={{ fontSize: '0.72rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                        High Risk Zone
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

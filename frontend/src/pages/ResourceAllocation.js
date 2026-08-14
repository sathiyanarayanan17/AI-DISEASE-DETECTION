import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getResourceAllocation, DISTRICT_COORDS, MOCK_DISTRICTS } from '../services/api';

export default function ResourceAllocation() {
  const [workers, setWorkers] = useState(100);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const highRiskDistricts = MOCK_DISTRICTS.filter(d => d.risk_level === 'High');

  useEffect(() => {
    loadAllocation();
  }, []);

  const loadAllocation = async () => {
    setLoading(true);
    try {
      const result = await getResourceAllocation(workers);
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  const pieData = data?.allocations?.map(a => ({
    name: a.district,
    value: a.workers_allocated,
  })) || [];

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          AI Resource Allocation
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Optimize deployment of health workers based on AI risk predictions
        </p>
      </div>

      {/* Input Controls */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Resource Configuration</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Available Health Workers
              </label>
              <input
                type="number"
                value={workers}
                onChange={e => setWorkers(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="1000"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  width: 150,
                }}
              />
            </div>
            <button
              onClick={loadAllocation}
              disabled={loading}
              className="btn-detail"
              style={{ padding: '10px 24px', fontSize: '0.85rem', alignSelf: 'flex-end' }}
            >
              {loading ? '...' : 'Optimize Allocation'}
            </button>
            <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b' }}>
              High-risk districts: <strong style={{ color: '#fca5a5' }}>{highRiskDistricts.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Map of High Risk Districts */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">High Risk Districts Map</h3>
          <div style={{ display: 'flex', gap: 14, fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ color: '#fca5a5' }}>● Critical</span>
            <span style={{ color: '#fcd34d' }}>● Priority</span>
          </div>
        </div>
        <div className="map-wrap" style={{ height: 350 }}>
          <MapContainer center={[10.8, 78.5]} zoom={7} className="map-container" scrollWheelZoom>
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {highRiskDistricts.map(d => (
              <CircleMarker
                key={d.district}
                center={[d.lat, d.lng]}
                radius={12}
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.7, weight: 2 }}
              >
                <Popup>
                  <div style={{ minWidth: 150, fontFamily: 'Inter,sans-serif' }}>
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>{d.district}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Risk: {d.risk_score}/100</div>
                    {data?.allocations && (
                      <div style={{ fontSize: '0.78rem', color: '#3b82f6', marginTop: 4 }}>
                        Workers assigned: {data.allocations.find(a => a.district === d.district)?.workers_allocated || 0}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {data && (
        <>
          {/* AI Recommendation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            {(data.allocations || []).slice(0, 6).map((a, i) => (
              <div key={a.district} className="card">
                <div className="card-body" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: `rgba(${i < 3 ? '239,68,68' : '245,158,11'},0.12)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem',
                    }}>
                      
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>{a.district}</div>
                      <div style={{ fontSize: '0.72rem', color: '#475569' }}>Priority: {a.priority}</div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(59,130,246,0.06)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    color: '#93c5fd',
                  }}>
                    Deploy <strong>{a.workers_allocated}</strong> health workers
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                      Risk Score: {a.risk_score}/100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Distribution Pie + Hospital Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
            {/* Pie Chart */}
            <div className="card">
              <div className="card-head">
                <h3 className="card-head-title">Distribution</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="none">
                      {pieData.map((entry, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: '0.78rem' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 12, width: '100%' }}>
                  {pieData.slice(0, 5).map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', flex: 1 }}>{d.name}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f1f5f9' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hospital Bed Availability */}
            <div className="card">
              <div className="card-head">
                <h3 className="card-head-title">Hospital Bed Availability</h3>
              </div>
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Total Beds</th>
                      <th>Available</th>
                      <th>ICU Free</th>
                      <th>Occupancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.hospitals || []).map(h => {
                      const occ = ((h.beds_total - h.beds_available) / h.beds_total * 100).toFixed(0);
                      return (
                        <tr key={h.district}>
                          <td style={{ fontWeight: 700 }}>{h.district}</td>
                          <td>{h.beds_total}</td>
                          <td style={{ color: h.beds_available < 30 ? '#fca5a5' : '#6ee7b7', fontWeight: 600 }}>
                            {h.beds_available}
                          </td>
                          <td style={{ color: h.icu_available < 3 ? '#fca5a5' : '#fcd34d', fontWeight: 600 }}>
                            {h.icu_available}
                          </td>
                          <td>
                            <div className="score-wrap">
                              <div className="score-track">
                                <div className="score-fill" style={{
                                  width: `${occ}%`,
                                  background: occ > 85 ? 'linear-gradient(90deg,#ef4444,#f97316)' : occ > 60 ? 'linear-gradient(90deg,#f59e0b,#eab308)' : 'linear-gradient(90deg,#10b981,#06b6d4)',
                                }} />
                              </div>
                              <span className="score-num">{occ}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

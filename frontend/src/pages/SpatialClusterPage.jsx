import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MapPin, TrendingUp, AlertTriangle, Info, Shield, Activity, Target, Zap } from 'lucide-react';

const clusterTypes = {
  HOT_SPOT: { label: 'Hot Spot', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  COLD_SPOT: { label: 'Cold Spot', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  NOT_SIGNIFICANT: { label: 'Not Significant', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  SPATIAL_OUTLIER: { label: 'Spatial Outlier', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
};

const districtData = [
  { district: 'Chennai', moranLocal: 0.89, pValue: 0.001, cluster: 'HOT_SPOT', neighbors: 'Tiruvallur, Kancheepuram, Chengalpattu' },
  { district: 'Coimbatore', moranLocal: 0.76, pValue: 0.003, cluster: 'HOT_SPOT', neighbors: 'Tiruppur, Nilgiris, Erode' },
  { district: 'Madurai', moranLocal: 0.81, pValue: 0.002, cluster: 'HOT_SPOT', neighbors: 'Theni, Dindigul, Sivaganga' },
  { district: 'Tiruvallur', moranLocal: 0.72, pValue: 0.005, cluster: 'HOT_SPOT', neighbors: 'Chennai, Kancheepuram, Vellore' },
  { district: 'Salem', moranLocal: 0.68, pValue: 0.008, cluster: 'HOT_SPOT', neighbors: 'Namakkal, Dharmapuri, Erode' },
  { district: 'Nilgiris', moranLocal: -0.45, pValue: 0.012, cluster: 'COLD_SPOT', neighbors: 'Coimbatore, Erode' },
  { district: 'Ramanathapuram', moranLocal: -0.52, pValue: 0.009, cluster: 'COLD_SPOT', neighbors: 'Sivaganga, Virudhunagar' },
  { district: 'Krishnagiri', moranLocal: -0.38, pValue: 0.018, cluster: 'COLD_SPOT', neighbors: 'Dharmapuri, Vellore' },
  { district: 'Thanjavur', moranLocal: 0.12, pValue: 0.320, cluster: 'NOT_SIGNIFICANT', neighbors: 'Tiruvarur, Nagapattinam, Pudukkottai' },
  { district: 'Tirunelveli', moranLocal: 0.08, pValue: 0.450, cluster: 'NOT_SIGNIFICANT', neighbors: 'Thoothukudi, Kanyakumari, Tenkasi' },
  { district: 'Erode', moranLocal: -0.05, pValue: 0.580, cluster: 'NOT_SIGNIFICANT', neighbors: 'Coimbatore, Salem, Namakkal, Tiruppur' },
  { district: 'Vellore', moranLocal: 0.15, pValue: 0.210, cluster: 'NOT_SIGNIFICANT', neighbors: 'Tiruvallur, Ranipet, Tiruvannamalai' },
  { district: 'Dindigul', moranLocal: 0.62, pValue: 0.007, cluster: 'SPATIAL_OUTLIER', neighbors: 'Madurai, Theni, Karur' },
  { district: 'Tiruppur', moranLocal: -0.55, pValue: 0.015, cluster: 'SPATIAL_OUTLIER', neighbors: 'Coimbatore, Erode, Karur' },
  { district: 'Nagapattinam', moranLocal: 0.48, pValue: 0.022, cluster: 'SPATIAL_OUTLIER', neighbors: 'Thanjavur, Tiruvarur, Mayiladuthurai' },
];

const moranTimeSeriesData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 0.45 + (day / 30) * 0.3;
  const noise = (Math.sin(day * 0.5) * 0.08) + (Math.random() - 0.5) * 0.05;
  return {
    day: `Day ${day}`,
    moranI: parseFloat((base + noise).toFixed(3)),
    significance: parseFloat((0.05 - (day / 30) * 0.03 + Math.random() * 0.01).toFixed(4)),
  };
});

const recommendations = [
  { icon: <Target size={18} />, title: 'Prioritize Chennai Cluster', desc: 'Deploy additional surveillance teams to Chennai, Tiruvallur, and Kancheepuram — the primary hot spot cluster with Moran\'s I > 0.7.' },
  { icon: <Shield size={18} />, title: 'Containment Buffer Zones', desc: 'Establish buffer zones around Coimbatore-Salem corridor to prevent hot spot expansion into adjacent cold spot districts.' },
  { icon: <Zap size={18} />, title: 'Investigate Spatial Outliers', desc: 'Dindigul and Nagapattinam show high local risk surrounded by low-risk neighbors — investigate localized transmission sources.' },
  { icon: <Activity size={18} />, title: 'Resource Reallocation', desc: 'Shift 30% of vector control resources from cold spot districts (Nilgiris, Ramanathapuram) to confirmed hot spots.' },
];

export default function SpatialClusterPage() {
  const [selectedCluster, setSelectedCluster] = useState(null);

  const filteredDistricts = selectedCluster
    ? districtData.filter(d => d.cluster === selectedCluster)
    : districtData;

  const clusterCounts = {
    HOT_SPOT: districtData.filter(d => d.cluster === 'HOT_SPOT').length,
    COLD_SPOT: districtData.filter(d => d.cluster === 'COLD_SPOT').length,
    NOT_SIGNIFICANT: districtData.filter(d => d.cluster === 'NOT_SIGNIFICANT').length,
    SPATIAL_OUTLIER: districtData.filter(d => d.cluster === 'SPATIAL_OUTLIER').length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapPin size={28} style={{ color: 'var(--color-primary, #6366f1)' }} />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
              Spatial Autocorrelation & Outbreak Clustering
            </h1>
          </div>
          <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Global Moran's I</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>0.72</div>
            </div>
            <span style={{
              fontSize: '0.7rem',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(239,68,68,0.15)',
              color: '#ef4444',
              fontWeight: 600,
            }}>
              Significant Clustering
            </span>
          </div>
        </div>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
          Analyzing spatial patterns of disease risk across 37 Tamil Nadu districts using Local Indicators of Spatial Association (LISA)
        </p>
      </div>

      {/* Cluster Summary Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {Object.entries(clusterTypes).map(([key, { label, color, bg }]) => (
          <div
            key={key}
            className="glass-card"
            onClick={() => setSelectedCluster(selectedCluster === key ? null : key)}
            style={{
              padding: '16px',
              cursor: 'pointer',
              border: selectedCluster === key ? `2px solid ${color}` : '2px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                background: color,
              }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{clusterCounts[key]}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>districts</div>
          </div>
        ))}
      </div>

      {/* Grid Visualization */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600 }}>
          District Cluster Map — Tamil Nadu
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}>
          {districtData.map((d) => {
            const type = clusterTypes[d.cluster];
            return (
              <div
                key={d.district}
                style={{
                  padding: '12px 8px',
                  borderRadius: '10px',
                  background: type.bg,
                  border: `1.5px solid ${type.color}`,
                  textAlign: 'center',
                  transition: 'transform 0.2s ease',
                }}
                title={`${d.district} — ${type.label} (Local I: ${d.moranLocal})`}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', color: type.color }}>
                  {d.district}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{d.moranLocal}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>{type.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.entries(clusterTypes).map(([key, { label, color }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LISA Statistics Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
            LISA Statistics — Local Indicators of Spatial Association
          </h3>
          {selectedCluster && (
            <button
              onClick={() => setSelectedCluster(null)}
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: 'var(--color-primary, #6366f1)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="data-table-container">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>District</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>Moran's I (Local)</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>p-value</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>Cluster Type</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>Neighbors</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((d) => {
                const type = clusterTypes[d.cluster];
                return (
                  <tr key={d.district} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: '0.85rem' }}>{d.district}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: d.moranLocal > 0 ? '#ef4444' : '#3b82f6' }}>
                      {d.moranLocal > 0 ? '+' : ''}{d.moranLocal.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem' }}>
                      <span style={{
                        color: d.pValue < 0.05 ? '#10b981' : '#6b7280',
                        fontWeight: d.pValue < 0.05 ? 600 : 400,
                      }}>
                        {d.pValue < 0.001 ? '<0.001' : d.pValue.toFixed(3)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: type.bg,
                        color: type.color,
                      }}>
                        {type.label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '0.8rem', opacity: 0.8 }}>{d.neighbors}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Time Series + Interpretation + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        {/* Cluster Evolution Line Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>
            Cluster Evolution — Global Moran's I Over 30 Days
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', opacity: 0.6 }}>
            Rising values indicate increasing spatial clustering of outbreaks
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={moranTimeSeriesData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                interval={4}
                stroke="rgba(255,255,255,0.4)"
              />
              <YAxis
                domain={[0.3, 0.9]}
                tick={{ fontSize: 11 }}
                stroke="rgba(255,255,255,0.4)"
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(30,30,50,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                }}
              />
              <ReferenceLine y={0.5} stroke="#eab308" strokeDasharray="4 4" label={{ value: 'Threshold', fill: '#eab308', fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="moranI"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
                name="Moran's I"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right Column: Interpretation + Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Interpretation Panel */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Info size={18} style={{ color: '#6366f1' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Interpretation</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                <strong>Moran's I = 0.72</strong> indicates strong positive spatial autocorrelation — disease cases are significantly
                clustered rather than randomly distributed across Tamil Nadu.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Hot Spots</strong> (High-High clusters): Districts with high case counts surrounded by high-count neighbors.
                These form contiguous outbreak zones requiring coordinated multi-district response.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Spatial Outliers</strong> (High-Low): Isolated districts with elevated risk not explained by their neighbors —
                indicating localized transmission sources (e.g., stagnant water, dense housing).
              </p>
              <p style={{ margin: 0 }}>
                <strong>For disease control:</strong> Focus containment on hot spot boundaries to prevent cluster expansion.
                Spatial outliers require targeted investigation of local drivers.
              </p>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Action Recommendations</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(99,102,241,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary, #6366f1)',
                  }}>
                    {rec.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '2px' }}>{rec.title}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: 1.5 }}>{rec.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

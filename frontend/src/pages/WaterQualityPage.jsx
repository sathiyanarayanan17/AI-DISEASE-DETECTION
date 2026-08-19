import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Waves,
  Filter,
  ThermometerSun,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for 10 Tamil Nadu districts
const districtWaterData = [
  { district: 'Chennai', ph: 7.2, turbidity: 3.1, dissolvedOxygen: 6.8, coliformCount: 2, chlorineLevel: 0.5, tds: 320, status: 'safe' },
  { district: 'Coimbatore', ph: 7.5, turbidity: 2.4, dissolvedOxygen: 7.1, coliformCount: 0, chlorineLevel: 0.6, tds: 280, status: 'safe' },
  { district: 'Madurai', ph: 8.1, turbidity: 6.8, dissolvedOxygen: 4.2, coliformCount: 18, chlorineLevel: 0.2, tds: 680, status: 'unsafe' },
  { district: 'Tiruchirappalli', ph: 7.0, turbidity: 4.2, dissolvedOxygen: 5.9, coliformCount: 5, chlorineLevel: 0.4, tds: 410, status: 'safe' },
  { district: 'Salem', ph: 6.2, turbidity: 8.5, dissolvedOxygen: 3.8, coliformCount: 25, chlorineLevel: 0.1, tds: 820, status: 'unsafe' },
  { district: 'Tirunelveli', ph: 7.4, turbidity: 2.9, dissolvedOxygen: 6.5, coliformCount: 1, chlorineLevel: 0.5, tds: 295, status: 'safe' },
  { district: 'Erode', ph: 7.8, turbidity: 5.6, dissolvedOxygen: 5.1, coliformCount: 12, chlorineLevel: 0.3, tds: 550, status: 'unsafe' },
  { district: 'Vellore', ph: 7.1, turbidity: 3.5, dissolvedOxygen: 6.2, coliformCount: 3, chlorineLevel: 0.4, tds: 370, status: 'safe' },
  { district: 'Thanjavur', ph: 6.8, turbidity: 7.2, dissolvedOxygen: 4.5, coliformCount: 15, chlorineLevel: 0.2, tds: 620, status: 'unsafe' },
  { district: 'Dindigul', ph: 7.3, turbidity: 3.0, dissolvedOxygen: 6.9, coliformCount: 2, chlorineLevel: 0.5, tds: 310, status: 'safe' },
];

// Safe ranges for parameters
const safeRanges = {
  ph: { min: 6.5, max: 8.5, unit: '' },
  turbidity: { min: 0, max: 5, unit: ' NTU' },
  dissolvedOxygen: { min: 5, max: 14, unit: ' mg/L' },
  coliformCount: { min: 0, max: 10, unit: ' CFU/100mL' },
  chlorineLevel: { min: 0.2, max: 1.0, unit: ' mg/L' },
  tds: { min: 0, max: 500, unit: ' ppm' },
};

// 30-day contamination trend data
const trendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 7, i + 1);
  return {
    day: `Aug ${i + 1}`,
    coliform: Math.round(5 + Math.random() * 15 + (i > 15 ? Math.random() * 10 : 0)),
    turbidity: +(2 + Math.random() * 4 + (i > 20 ? Math.random() * 3 : 0)).toFixed(1),
    tds: Math.round(300 + Math.random() * 200 + (i > 18 ? Math.random() * 150 : 0)),
  };
});

// Water source breakdown
const waterSources = [
  { type: 'Borewell', count: 142, icon: '🔵' },
  { type: 'Pipeline', count: 98, icon: '🟢' },
  { type: 'River', count: 56, icon: '🔷' },
  { type: 'Tank', count: 34, icon: '🟡' },
];

// WQI score (mock overall score)
const overallWQI = 72;

function WQIGauge({ score }) {
  const getColor = (s) => {
    if (s >= 80) return '#2ECC71';
    if (s >= 60) return '#F39C12';
    if (s >= 40) return '#E67E22';
    return '#E74C3C';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Good';
    if (s >= 60) return 'Moderate';
    if (s >= 40) return 'Poor';
    return 'Critical';
  };

  const color = getColor(score);
  const rotation = (score / 100) * 180 - 90;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '110px',
          overflow: 'hidden',
        }}
      >
        {/* Background arc */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '20px solid var(--bg-input, #2a2a3e)',
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            transform: 'rotate(225deg)',
            boxSizing: 'border-box',
          }}
        />
        {/* Filled arc */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '20px solid transparent',
            borderTopColor: color,
            borderLeftColor: score > 50 ? color : 'transparent',
            transform: `rotate(${225 + (score / 100) * 180}deg)`,
            boxSizing: 'border-box',
            transition: 'transform 1s ease-out',
          }}
        />
        {/* Needle */}
        <div
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            width: '4px',
            height: '70px',
            background: `linear-gradient(to top, ${color}, transparent)`,
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            borderRadius: '2px',
            transition: 'transform 1s ease-out',
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            width: '14px',
            height: '14px',
            background: color,
            borderRadius: '50%',
            transform: 'translate(-50%, 50%)',
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: color }}>{score}</div>
        <div style={{ fontSize: '14px', color: 'var(--text-primary, #e0e0e0)', opacity: 0.7 }}>
          Water Quality Index — <span style={{ color }}>{getLabel(score)}</span>
        </div>
      </div>
      {/* Scale labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: '#E74C3C' }}>0</span>
        <span style={{ fontSize: '11px', color: '#E67E22' }}>25</span>
        <span style={{ fontSize: '11px', color: '#F39C12' }}>50</span>
        <span style={{ fontSize: '11px', color: '#2ECC71' }}>75</span>
        <span style={{ fontSize: '11px', color: '#2ECC71' }}>100</span>
      </div>
    </div>
  );
}

function isParamSafe(param, value) {
  const range = safeRanges[param];
  if (!range) return true;
  return value >= range.min && value <= range.max;
}

function WaterQualityPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const safeCount = districtWaterData.filter((d) => d.status === 'safe').length;
  const unsafeCount = districtWaterData.filter((d) => d.status === 'unsafe').length;
  const underTreatment = 2;

  const unsafeDistricts = districtWaterData.filter((d) => d.status === 'unsafe');

  const filteredDistricts =
    selectedFilter === 'all'
      ? districtWaterData
      : districtWaterData.filter((d) => d.status === selectedFilter);

  return (
    <div style={{ padding: '24px', color: 'var(--text-primary, #e0e0e0)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Droplets size={32} color="#3498DB" />
          Water Quality Monitoring
        </h1>
        <p style={{ opacity: 0.7, marginTop: '4px' }}>
          Real-time water quality analysis across Tamil Nadu districts — linked to cholera outbreak prediction
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#3498DB20', borderRadius: '12px', padding: '12px' }}>
            <Droplets size={24} color="#3498DB" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>10</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Districts Sampled</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#2ECC7120', borderRadius: '12px', padding: '12px' }}>
            <CheckCircle size={24} color="#2ECC71" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#2ECC71' }}>{safeCount}</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Safe Sources</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#E74C3C20', borderRadius: '12px', padding: '12px' }}>
            <XCircle size={24} color="#E74C3C" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#E74C3C' }}>{unsafeCount}</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Contaminated</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#F39C1220', borderRadius: '12px', padding: '12px' }}>
            <Filter size={24} color="#F39C12" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#F39C12' }}>{underTreatment}</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Under Treatment</div>
          </div>
        </div>
      </div>

      {/* WQI Gauge + Water Source Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#3498DB" />
            Overall Water Quality Index
          </h3>
          <WQIGauge score={overallWQI} />
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Waves size={18} color="#3498DB" />
            Water Source Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {waterSources.map((source) => (
              <div key={source.type} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{source.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{source.type}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{source.count} sources</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-input, #2a2a3e)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(source.count / 150) * 100}%`,
                        background: 'linear-gradient(90deg, #3498DB, #2ECC71)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-input, #2a2a3e)', borderRadius: '8px' }}>
            <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', opacity: 0.7 }}>Total Sources Monitored</span>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>
                {waterSources.reduce((sum, s) => sum + s.count, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThermometerSun size={18} color="#3498DB" />
            Water Quality Parameters by District
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'safe', 'unsafe'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: selectedFilter === filter ? '#3498DB' : 'var(--bg-input, #2a2a3e)',
                  color: selectedFilter === filter ? '#fff' : 'var(--text-primary, #e0e0e0)',
                  transition: 'all 0.2s',
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="data-table-container" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>District</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>pH</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>Turbidity (NTU)</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>DO (mg/L)</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>Coliform (CFU)</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>Chlorine (mg/L)</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>TDS (ppm)</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', opacity: 0.7, fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((d) => (
                <tr key={d.district} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{d.district}</td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: isParamSafe('ph', d.ph) ? '#2ECC71' : '#E74C3C' }}>
                      {d.ph}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: isParamSafe('turbidity', d.turbidity) ? '#2ECC71' : '#E74C3C' }}>
                      {d.turbidity}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: isParamSafe('dissolvedOxygen', d.dissolvedOxygen) ? '#2ECC71' : '#E74C3C' }}>
                      {d.dissolvedOxygen}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: isParamSafe('coliformCount', d.coliformCount) ? '#2ECC71' : '#E74C3C' }}>
                      {d.coliformCount}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: isParamSafe('chlorineLevel', d.chlorineLevel) ? '#2ECC71' : '#E74C3C' }}>
                      {d.chlorineLevel}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: isParamSafe('tds', d.tds) ? '#2ECC71' : '#E74C3C' }}>
                      {d.tds}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    {d.status === 'safe' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', background: '#2ECC7120', color: '#2ECC71', fontSize: '12px', fontWeight: 500 }}>
                        <CheckCircle size={12} /> Safe
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', background: '#E74C3C20', color: '#E74C3C', fontSize: '12px', fontWeight: 500 }}>
                        <XCircle size={12} /> Unsafe
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contamination Trend Chart */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#E74C3C" />
          Contamination Trends — Last 30 Days
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 11 }}
              interval={4}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#e0e0e0',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="coliform"
              stroke="#E74C3C"
              strokeWidth={2}
              name="Coliform (CFU/100mL)"
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke="#F39C12"
              strokeWidth={2}
              name="Turbidity (NTU)"
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="tds"
              stroke="#3498DB"
              strokeWidth={2}
              name="TDS (ppm)"
              dot={false}
              activeDot={{ r: 5 }}
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Section */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#E74C3C" />
          Water Quality Alerts
        </h3>
        {unsafeDistricts.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No active alerts. All monitored districts have safe water quality.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {unsafeDistricts.map((d) => {
              const violations = [];
              if (!isParamSafe('ph', d.ph)) violations.push(`pH: ${d.ph}`);
              if (!isParamSafe('turbidity', d.turbidity)) violations.push(`Turbidity: ${d.turbidity} NTU`);
              if (!isParamSafe('dissolvedOxygen', d.dissolvedOxygen)) violations.push(`DO: ${d.dissolvedOxygen} mg/L`);
              if (!isParamSafe('coliformCount', d.coliformCount)) violations.push(`Coliform: ${d.coliformCount} CFU`);
              if (!isParamSafe('chlorineLevel', d.chlorineLevel)) violations.push(`Chlorine: ${d.chlorineLevel} mg/L`);
              if (!isParamSafe('tds', d.tds)) violations.push(`TDS: ${d.tds} ppm`);

              return (
                <div
                  key={d.district}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    background: '#E74C3C10',
                    border: '1px solid #E74C3C30',
                    borderRadius: '10px',
                  }}
                >
                  <AlertTriangle size={20} color="#E74C3C" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                      {d.district} — Unsafe Water Detected
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>
                      Parameters exceeding safe limits:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {violations.map((v) => (
                        <span
                          key={v}
                          style={{
                            padding: '3px 8px',
                            background: '#E74C3C25',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#E74C3C',
                            fontWeight: 500,
                          }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
                      ⚠️ High cholera outbreak risk — recommend immediate water treatment and public advisory
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WaterQualityPage;

import React, { useState } from 'react';
import {
  Bug,
  MapPin,
  Activity,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  ThermometerSun,
  Search
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Mock district density data for Tamil Nadu
const districtDensityData = [
  { district: 'Chennai', bretauIndex: 28, houseIndex: 18, containerIndex: 35, larvalDensity: 4.2, riskLevel: 'High', lastSurveyed: '2026-08-18' },
  { district: 'Coimbatore', bretauIndex: 15, houseIndex: 10, containerIndex: 22, larvalDensity: 2.8, riskLevel: 'Medium', lastSurveyed: '2026-08-18' },
  { district: 'Madurai', bretauIndex: 22, houseIndex: 14, containerIndex: 28, larvalDensity: 3.5, riskLevel: 'High', lastSurveyed: '2026-08-17' },
  { district: 'Tiruchirappalli', bretauIndex: 12, houseIndex: 8, containerIndex: 18, larvalDensity: 2.1, riskLevel: 'Medium', lastSurveyed: '2026-08-18' },
  { district: 'Salem', bretauIndex: 9, houseIndex: 6, containerIndex: 14, larvalDensity: 1.5, riskLevel: 'Low', lastSurveyed: '2026-08-17' },
  { district: 'Tirunelveli', bretauIndex: 19, houseIndex: 12, containerIndex: 25, larvalDensity: 3.1, riskLevel: 'Medium', lastSurveyed: '2026-08-16' },
  { district: 'Erode', bretauIndex: 7, houseIndex: 5, containerIndex: 11, larvalDensity: 1.2, riskLevel: 'Low', lastSurveyed: '2026-08-18' },
  { district: 'Vellore', bretauIndex: 24, houseIndex: 16, containerIndex: 30, larvalDensity: 3.8, riskLevel: 'High', lastSurveyed: '2026-08-18' },
  { district: 'Thanjavur', bretauIndex: 17, houseIndex: 11, containerIndex: 23, larvalDensity: 2.9, riskLevel: 'Medium', lastSurveyed: '2026-08-17' },
  { district: 'Kanchipuram', bretauIndex: 26, houseIndex: 17, containerIndex: 33, larvalDensity: 4.0, riskLevel: 'High', lastSurveyed: '2026-08-18' },
  { district: 'Dindigul', bretauIndex: 11, houseIndex: 7, containerIndex: 16, larvalDensity: 1.8, riskLevel: 'Low', lastSurveyed: '2026-08-16' },
  { district: 'Cuddalore', bretauIndex: 21, houseIndex: 13, containerIndex: 27, larvalDensity: 3.3, riskLevel: 'High', lastSurveyed: '2026-08-18' },
  { district: 'Nagapattinam', bretauIndex: 14, houseIndex: 9, containerIndex: 20, larvalDensity: 2.4, riskLevel: 'Medium', lastSurveyed: '2026-08-17' },
  { district: 'Thoothukudi', bretauIndex: 16, houseIndex: 10, containerIndex: 21, larvalDensity: 2.6, riskLevel: 'Medium', lastSurveyed: '2026-08-18' },
  { district: 'Ramanathapuram', bretauIndex: 8, houseIndex: 5, containerIndex: 12, larvalDensity: 1.3, riskLevel: 'Low', lastSurveyed: '2026-08-16' }
];

// Generate 30-day trend data per district
const generateTrendData = (district) => {
  const baseIndex = districtDensityData.find(d => d.district === district)?.bretauIndex || 15;
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date('2026-08-19');
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 4;
    data.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      bretauIndex: Math.max(0, Math.round((baseIndex + variation) * 10) / 10),
      houseIndex: Math.max(0, Math.round((baseIndex * 0.6 + variation * 0.5) * 10) / 10),
      larvalDensity: Math.max(0, Math.round((baseIndex * 0.15 + variation * 0.1) * 10) / 10)
    });
  }
  return data;
};

// Breeding site breakdown data
const breedingSiteData = [
  { name: 'Overhead Tanks', value: 32, color: '#3B82F6' },
  { name: 'Discarded Tires', value: 25, color: '#EF4444' },
  { name: 'Flower Pots', value: 18, color: '#10B981' },
  { name: 'Construction Sites', value: 15, color: '#F59E0B' },
  { name: 'Drains', value: 10, color: '#8B5CF6' }
];

// Fogging operations log
const foggingOperations = [
  { date: '2026-08-19', district: 'Chennai', areaCovered: 12.5, teamsDeployed: 8, status: 'In Progress' },
  { date: '2026-08-19', district: 'Vellore', areaCovered: 8.2, teamsDeployed: 5, status: 'In Progress' },
  { date: '2026-08-19', district: 'Kanchipuram', areaCovered: 6.8, teamsDeployed: 4, status: 'Scheduled' },
  { date: '2026-08-18', district: 'Chennai', areaCovered: 15.3, teamsDeployed: 10, status: 'Completed' },
  { date: '2026-08-18', district: 'Madurai', areaCovered: 9.7, teamsDeployed: 6, status: 'Completed' },
  { date: '2026-08-18', district: 'Cuddalore', areaCovered: 7.1, teamsDeployed: 4, status: 'Completed' },
  { date: '2026-08-17', district: 'Coimbatore', areaCovered: 11.0, teamsDeployed: 7, status: 'Completed' },
  { date: '2026-08-17', district: 'Thanjavur', areaCovered: 5.5, teamsDeployed: 3, status: 'Completed' },
  { date: '2026-08-16', district: 'Tirunelveli', areaCovered: 8.9, teamsDeployed: 5, status: 'Completed' },
  { date: '2026-08-16', district: 'Chennai', areaCovered: 14.2, teamsDeployed: 9, status: 'Completed' }
];

const getRiskBadgeStyle = (level) => {
  const styles = {
    High: { background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' },
    Medium: { background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' },
    Low: { background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }
  };
  return styles[level] || styles.Low;
};

const getStatusStyle = (status) => {
  const styles = {
    'Completed': { background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
    'In Progress': { background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
    'Scheduled': { background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }
  };
  return styles[status] || styles['Scheduled'];
};

function MosquitoDensityPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [searchTerm, setSearchTerm] = useState('');

  const trendData = generateTrendData(selectedDistrict);
  const highDensityZones = districtDensityData.filter(d => d.bretauIndex > 20).length;
  const avgBretauIndex = Math.round(
    districtDensityData.reduce((sum, d) => sum + d.bretauIndex, 0) / districtDensityData.length * 10
  ) / 10;
  const foggingToday = foggingOperations.filter(f => f.date === '2026-08-19').length;

  const filteredDistricts = districtDensityData.filter(d =>
    d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bug size={32} style={{ color: '#EF4444' }} />
          Mosquito Density Index Monitoring
        </h1>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '14px', marginTop: '8px' }}>
          Aedes mosquito surveillance across Tamil Nadu districts — Breteau Index &gt; 20 indicates high dengue transmission risk
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Districts Surveyed</p>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '32px', fontWeight: 700, margin: '8px 0 0' }}>{districtDensityData.length}</h2>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '10px' }}>
              <MapPin size={22} style={{ color: '#3B82F6' }} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: '12px 0 0' }}>of 37 total TN districts</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Breteau Index</p>
              <h2 style={{ color: avgBretauIndex > 20 ? '#EF4444' : avgBretauIndex > 10 ? '#F59E0B' : '#10B981', fontSize: '32px', fontWeight: 700, margin: '8px 0 0' }}>{avgBretauIndex}</h2>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', borderRadius: '12px', padding: '10px' }}>
              <Activity size={22} style={{ color: '#F59E0B' }} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: '12px 0 0' }}>across all surveyed districts</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>High Density Zones</p>
              <h2 style={{ color: '#EF4444', fontSize: '32px', fontWeight: 700, margin: '8px 0 0' }}>{highDensityZones}</h2>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '10px' }}>
              <AlertTriangle size={22} style={{ color: '#EF4444' }} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: '12px 0 0' }}>Breteau Index &gt; 20</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fogging Operations Today</p>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '32px', fontWeight: 700, margin: '8px 0 0' }}>{foggingToday}</h2>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '10px' }}>
              <Truck size={22} style={{ color: '#10B981' }} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: '12px 0 0' }}>active fogging campaigns</p>
        </div>
      </div>

      {/* District Density Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, margin: 0 }}>
            District-wise Mosquito Density
          </h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary, #94a3b8)' }} />
            <input
              type="text"
              placeholder="Search district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'var(--bg-input, rgba(255,255,255,0.05))',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px 8px 34px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                width: '200px'
              }}
            />
          </div>
        </div>
        <div className="data-table-container" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Breteau Index</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>House Index</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Container Index</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Larval Density</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Risk Level</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Last Surveyed</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((row, idx) => (
                <tr key={row.district} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} style={{ color: 'var(--text-secondary, #94a3b8)' }} />
                      {row.district}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ color: row.bretauIndex > 20 ? '#EF4444' : row.bretauIndex > 10 ? '#F59E0B' : '#10B981', fontWeight: 600, fontSize: '14px' }}>
                      {row.bretauIndex}
                    </span>
                    <div className="progress-bar-track" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '6px' }}>
                      <div className="progress-bar-fill" style={{ height: '100%', width: `${Math.min(row.bretauIndex / 40 * 100, 100)}%`, background: row.bretauIndex > 20 ? '#EF4444' : row.bretauIndex > 10 ? '#F59E0B' : '#10B981', borderRadius: '2px', transition: 'width 0.3s' }} />
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '14px' }}>{row.houseIndex}%</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '14px' }}>{row.containerIndex}%</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '14px' }}>{row.larvalDensity}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span className="risk-badge" style={{ ...getRiskBadgeStyle(row.riskLevel), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {new Date(row.lastSurveyed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Density Trend Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, margin: 0 }}>
              30-Day Density Trend
            </h3>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                background: 'var(--bg-input, rgba(255,255,255,0.05))',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {districtDensityData.map(d => (
                <option key={d.district} value={d.district}>{d.district}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bretauGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="houseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <RechartsTooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="bretauIndex" stroke="#EF4444" fill="url(#bretauGradient)" strokeWidth={2} name="Breteau Index" />
              <Area type="monotone" dataKey="houseIndex" stroke="#3B82F6" fill="url(#houseGradient)" strokeWidth={2} name="House Index" />
            </AreaChart>
          </ResponsiveContainer>
          {/* Threshold Reference Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle size={14} style={{ color: '#EF4444' }} />
            <span style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px' }}>
              Red zone threshold: Breteau Index &gt; 20 indicates high risk for dengue transmission
            </span>
          </div>
        </div>

        {/* Breeding Site Breakdown Pie Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, margin: '0 0 16px' }}>
            Breeding Site Types
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={breedingSiteData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {breedingSiteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px' }}>
            {breedingSiteData.map(site => (
              <div key={site.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: site.color }} />
                  <span style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px' }}>{site.name}</span>
                </div>
                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{site.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fogging Operations Log */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} style={{ color: '#10B981' }} />
          Fogging Operations Log
        </h3>
        <div className="data-table-container" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Area Covered (km²)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Teams Deployed</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {foggingOperations.map((op, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px' }}>
                    {new Date(op.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{op.district}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '14px' }}>{op.areaCovered}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-primary)', fontSize: '14px' }}>{op.teamsDeployed}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ ...getStatusStyle(op.status), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
                      {op.status === 'Completed' && <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
                      {op.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breteau Index Threshold Indicators */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplets size={20} style={{ color: '#3B82F6' }} />
          Breteau Index — Risk Thresholds
        </h3>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '13px', margin: '0 0 16px' }}>
          The Breteau Index measures the number of positive containers per 100 houses inspected. It is the most widely used indicator for Aedes mosquito density.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Low Risk */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle size={18} style={{ color: '#10B981' }} />
              <span style={{ color: '#10B981', fontSize: '15px', fontWeight: 600 }}>Low Risk</span>
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>BI ≤ 10</div>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: 0 }}>
              Acceptable level. Routine surveillance and community awareness. Minimal transmission risk.
            </p>
          </div>

          {/* Medium Risk */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
              <span style={{ color: '#F59E0B', fontSize: '15px', fontWeight: 600 }}>Medium Risk</span>
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>BI 11–20</div>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: 0 }}>
              Elevated density. Enhanced source reduction, larviciding, and intensified house-to-house inspection.
            </p>
          </div>

          {/* High Risk */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ThermometerSun size={18} style={{ color: '#EF4444' }} />
              <span style={{ color: '#EF4444', fontSize: '15px', fontWeight: 600 }}>High Risk</span>
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>BI &gt; 20</div>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '12px', margin: 0 }}>
              Critical threshold. Immediate fogging operations, emergency vector control, and public health alert issuance required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MosquitoDensityPage;

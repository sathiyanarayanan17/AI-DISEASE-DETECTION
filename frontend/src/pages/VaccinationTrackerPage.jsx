import React, { useState } from 'react';
import {
  Syringe,
  Users,
  Clock,
  TrendingUp,
  Package,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const districtVaccinationData = [
  { district: 'Chennai', vaccinated: 892450, target: 1000000 },
  { district: 'Coimbatore', vaccinated: 654320, target: 780000 },
  { district: 'Madurai', vaccinated: 543210, target: 650000 },
  { district: 'Tiruchirappalli', vaccinated: 412300, target: 520000 },
  { district: 'Salem', vaccinated: 389000, target: 480000 },
  { district: 'Tirunelveli', vaccinated: 321000, target: 410000 },
  { district: 'Erode', vaccinated: 298700, target: 370000 },
  { district: 'Vellore', vaccinated: 276500, target: 350000 },
  { district: 'Thanjavur', vaccinated: 245600, target: 320000 },
  { district: 'Dindigul', vaccinated: 213400, target: 290000 }
];

const districtChartData = districtVaccinationData.map(d => ({
  district: d.district,
  coverage: Math.round((d.vaccinated / d.target) * 100),
  vaccinated: d.vaccinated,
  target: d.target
}));

const scheduleData = [
  { id: 1, district: 'Chennai', location: 'Govt. General Hospital', date: '2026-08-20', vaccine: 'Covishield', slots: 500, booked: 423, status: 'Confirmed' },
  { id: 2, district: 'Madurai', location: 'Rajaji Hospital', date: '2026-08-21', vaccine: 'Covaxin', slots: 350, booked: 298, status: 'Confirmed' },
  { id: 3, district: 'Coimbatore', location: 'ESI Hospital', date: '2026-08-21', vaccine: 'Covishield', slots: 400, booked: 156, status: 'Open' },
  { id: 4, district: 'Salem', location: 'Govt. Mohan Kumaramangalam Hospital', date: '2026-08-22', vaccine: 'Moderna', slots: 200, booked: 200, status: 'Full' },
  { id: 5, district: 'Tiruchirappalli', location: 'Mahatma Gandhi Memorial Hospital', date: '2026-08-22', vaccine: 'Covaxin', slots: 300, booked: 87, status: 'Open' },
  { id: 6, district: 'Vellore', location: 'Govt. Vellore Medical College', date: '2026-08-23', vaccine: 'Covishield', slots: 250, booked: 110, status: 'Open' },
  { id: 7, district: 'Tirunelveli', location: 'Govt. Hospital Palayamkottai', date: '2026-08-24', vaccine: 'Covaxin', slots: 300, booked: 300, status: 'Full' },
  { id: 8, district: 'Thanjavur', location: 'Thanjavur Medical College Hospital', date: '2026-08-25', vaccine: 'Moderna', slots: 150, booked: 42, status: 'Open' }
];

const inventoryData = [
  { name: 'Covishield', stock: 245000, threshold: 50000, used: 1820000, color: '#3B82F6' },
  { name: 'Covaxin', stock: 178000, threshold: 40000, used: 1450000, color: '#10B981' },
  { name: 'Moderna', stock: 32000, threshold: 25000, color: '#F59E0B', used: 580000 }
];

const ageGroupData = [
  { name: '18-30', value: 1245000, color: '#6366F1' },
  { name: '31-45', value: 1580000, color: '#3B82F6' },
  { name: '46-60', value: 1120000, color: '#10B981' },
  { name: '60+', value: 890000, color: '#F59E0B' },
  { name: '12-17', value: 420000, color: '#EC4899' }
];

const totalVaccinated = 5255000;
const totalTarget = 6800000;
const coveragePercent = Math.round((totalVaccinated / totalTarget) * 100);
const pendingCount = totalTarget - totalVaccinated;
const dosesToday = 34521;

function VaccinationTrackerPage() {
  const [scheduleFilter, setScheduleFilter] = useState('All');

  const filteredSchedule = scheduleFilter === 'All'
    ? scheduleData
    : scheduleData.filter(s => s.status === scheduleFilter);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return { color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'Open':
        return { color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'Full':
        return { color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default:
        return { color: 'var(--text-primary)' };
    }
  };

  const getStockStatus = (stock, threshold) => {
    if (stock <= threshold) return { label: 'Critical', color: '#EF4444' };
    if (stock <= threshold * 2) return { label: 'Low', color: '#F59E0B' };
    return { label: 'Adequate', color: '#10B981' };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border-base)',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 4px 0' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '2px 0', fontSize: '13px' }}>
              {entry.name}: {entry.value}{entry.name === 'coverage' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Syringe size={28} style={{ color: 'var(--accent-primary)' }} />
            <h1 style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, margin: 0 }}>
              Vaccination Tracker
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px'
          }}>
            <Activity size={14} style={{ color: '#10B981' }} />
            <span style={{ color: '#10B981', fontSize: '13px', fontWeight: 500 }}>Live Tracking</span>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
          District-level vaccination progress across Tamil Nadu — real-time coverage monitoring
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Total Vaccinated</span>
            <Users size={18} style={{ color: '#3B82F6' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {(totalVaccinated / 1000000).toFixed(2)}M
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={14} style={{ color: '#10B981' }} />
            <span style={{ color: '#10B981', fontSize: '12px' }}>+2.4% from last week</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Coverage %</span>
            <CheckCircle2 size={18} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {coveragePercent}%
          </div>
          <div style={{
            marginTop: '8px',
            height: '6px',
            background: 'var(--bg-input)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${coveragePercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981, #3B82F6)',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Pending</span>
            <Clock size={18} style={{ color: '#F59E0B' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {(pendingCount / 1000000).toFixed(2)}M
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
            <span style={{ color: '#F59E0B', fontSize: '12px' }}>Target: 6.8M total</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>Doses Today</span>
            <Syringe size={18} style={{ color: '#6366F1' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {dosesToday.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={14} style={{ color: '#10B981' }} />
            <span style={{ color: '#10B981', fontSize: '12px' }}>+12% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* District Progress Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              District-wise Vaccination Coverage
            </h2>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              padding: '4px 10px',
              background: 'var(--bg-input)',
              borderRadius: '12px',
              border: '1px solid var(--border-base)'
            }}>
              Top 10 Districts
            </span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={districtChartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-base)' }}
                tickLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="district"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-base)' }}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="coverage"
                name="Coverage %"
                radius={[0, 4, 4, 0]}
                fill="var(--accent-primary)"
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age Group Distribution Pie Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0' }}>
            Age Group Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={ageGroupData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
              >
                {ageGroupData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${(value / 1000000).toFixed(2)}M doses`}
                contentStyle={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-base)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vaccine Inventory Cards */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>
          Vaccine Inventory Status
        </h2>
        <div className="grid-cols-3">
          {inventoryData.map((vaccine) => {
            const status = getStockStatus(vaccine.stock, vaccine.threshold);
            return (
              <div className="glass-card" key={vaccine.name} style={{ padding: '20px' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${vaccine.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Package size={18} style={{ color: vaccine.color }} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px' }}>{vaccine.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {(vaccine.used / 1000000).toFixed(2)}M doses administered
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '10px',
                    color: status.color,
                    background: `${status.color}15`,
                    border: `1px solid ${status.color}30`
                  }}>
                    {status.label}
                  </span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div className="flex-between" style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Current Stock</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {vaccine.stock.toLocaleString()}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'var(--bg-input)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((vaccine.stock / (vaccine.threshold * 5)) * 100, 100)}%`,
                      height: '100%',
                      background: status.color,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div className="flex-between" style={{ marginTop: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      Threshold: {vaccine.threshold.toLocaleString()}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      Max: {(vaccine.threshold * 5).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vaccination Schedule Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, margin: 0 }}>
              Upcoming Vaccination Drives
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Open', 'Confirmed', 'Full'].map(filter => (
              <button
                key={filter}
                onClick={() => setScheduleFilter(filter)}
                className={scheduleFilter === filter ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)' }}>District</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)' }}>Vaccine</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)' }}>Slots</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-base)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((drive) => (
                <tr key={drive.id} style={{ borderBottom: '1px solid var(--border-base)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>{drive.district}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {drive.location}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                    {drive.date}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-base)',
                      color: 'var(--text-primary)',
                      fontWeight: 500
                    }}>
                      {drive.vaccine}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                        {drive.booked}/{drive.slots}
                      </span>
                      <div style={{
                        width: '60px',
                        height: '4px',
                        background: 'var(--bg-input)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(drive.booked / drive.slots) * 100}%`,
                          height: '100%',
                          background: drive.booked >= drive.slots ? '#EF4444' : 'var(--accent-primary)',
                          borderRadius: '2px'
                        }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      ...getStatusStyle(drive.status)
                    }}>
                      {drive.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchedule.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No drives found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

export default VaccinationTrackerPage;

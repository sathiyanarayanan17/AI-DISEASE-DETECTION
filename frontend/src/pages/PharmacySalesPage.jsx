import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Pill, TrendingUp, AlertTriangle, Activity, ShoppingCart, Building2, BarChart3, Search
} from 'lucide-react';

const salesTrendData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const baseORS = 120 + Math.sin(day / 5) * 40 + (day > 20 ? (day - 20) * 15 : 0);
  const baseParacetamol = 200 + Math.cos(day / 4) * 30 + Math.random() * 20;
  const baseAntimalarial = 80 + Math.sin(day / 7) * 25 + (day > 22 ? (day - 22) * 8 : 0);
  return {
    day: `Aug ${day}`,
    ORS: Math.round(baseORS + Math.random() * 15),
    Paracetamol: Math.round(baseParacetamol),
    'Anti-malarial': Math.round(baseAntimalarial + Math.random() * 10),
  };
});

const districtSalesData = [
  { district: 'Chennai', ors: 2840, paracetamol: 4520, antimalarial: 1280, coughSyrup: 1890, trend: '+42%', anomaly: true },
  { district: 'Coimbatore', ors: 1560, paracetamol: 3210, antimalarial: 890, coughSyrup: 1450, trend: '+18%', anomaly: false },
  { district: 'Madurai', ors: 1980, paracetamol: 2890, antimalarial: 1120, coughSyrup: 1230, trend: '+35%', anomaly: true },
  { district: 'Tiruchirappalli', ors: 1240, paracetamol: 2450, antimalarial: 760, coughSyrup: 980, trend: '+12%', anomaly: false },
  { district: 'Salem', ors: 1680, paracetamol: 2780, antimalarial: 940, coughSyrup: 1100, trend: '+28%', anomaly: true },
  { district: 'Tirunelveli', ors: 890, paracetamol: 1980, antimalarial: 620, coughSyrup: 870, trend: '+8%', anomaly: false },
  { district: 'Erode', ors: 1120, paracetamol: 2340, antimalarial: 710, coughSyrup: 960, trend: '+15%', anomaly: false },
  { district: 'Vellore', ors: 1450, paracetamol: 2560, antimalarial: 850, coughSyrup: 1080, trend: '+22%', anomaly: false },
  { district: 'Thanjavur', ors: 1780, paracetamol: 2120, antimalarial: 980, coughSyrup: 1340, trend: '+31%', anomaly: true },
  { district: 'Dindigul', ors: 760, paracetamol: 1650, antimalarial: 540, coughSyrup: 720, trend: '+6%', anomaly: false },
];

const anomalyAlerts = [
  { id: 1, message: 'ORS sales in Chennai +280% above baseline - possible cholera signal', severity: 'critical', time: '2 hours ago', district: 'Chennai' },
  { id: 2, message: 'Anti-malarial sales in Madurai +180% above baseline - potential malaria surge', severity: 'high', time: '4 hours ago', district: 'Madurai' },
  { id: 3, message: 'Paracetamol spike in Salem +95% - dengue fever indicator', severity: 'medium', time: '6 hours ago', district: 'Salem' },
  { id: 4, message: 'ORS + Zinc combination sales in Thanjavur +150% - diarrheal disease signal', severity: 'high', time: '8 hours ago', district: 'Thanjavur' },
  { id: 5, message: 'Cough syrup sales in Coimbatore +60% above seasonal average', severity: 'low', time: '12 hours ago', district: 'Coimbatore' },
];

const correlationData = [
  { lag: 'Day 0', pharmacySales: 100, diseaseReports: 20 },
  { lag: 'Day 1', pharmacySales: 95, diseaseReports: 25 },
  { lag: 'Day 2', pharmacySales: 85, diseaseReports: 35 },
  { lag: 'Day 3', pharmacySales: 70, diseaseReports: 55 },
  { lag: 'Day 4', pharmacySales: 55, diseaseReports: 75 },
  { lag: 'Day 5', pharmacySales: 40, diseaseReports: 90 },
  { lag: 'Day 6', pharmacySales: 30, diseaseReports: 95 },
  { lag: 'Day 7', pharmacySales: 25, diseaseReports: 100 },
];

const topMedicinesData = [
  { name: 'ORS Packets', sales: 12400, color: '#06b6d4' },
  { name: 'Paracetamol', sales: 18900, color: '#f59e0b' },
  { name: 'Chloroquine', sales: 6800, color: '#ef4444' },
  { name: 'Doxycycline', sales: 5200, color: '#8b5cf6' },
  { name: 'Zinc Tablets', sales: 8900, color: '#10b981' },
  { name: 'Cough Syrup', sales: 7600, color: '#f97316' },
  { name: 'Azithromycin', sales: 4300, color: '#ec4899' },
  { name: 'Metronidazole', sales: 3800, color: '#6366f1' },
];

const severityStyles = {
  critical: { background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' },
  high: { background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.4)', color: '#fdba74' },
  medium: { background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fcd34d' },
  low: { background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#86efac' },
};

export default function PharmacySalesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = districtSalesData.filter(d =>
    d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Pharmacies Monitored', value: '2,847', icon: Building2, color: '#06b6d4', change: '+124 this week' },
    { label: 'ORS Sales Today', value: '14,560', icon: ShoppingCart, color: '#10b981', change: '+42% vs baseline' },
    { label: 'Anti-malarial Sales', value: '6,840', icon: Pill, color: '#f59e0b', change: '+28% vs baseline' },
    { label: 'Anomaly Alerts', value: '12', icon: AlertTriangle, color: '#ef4444', change: '5 critical' },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Pill size={32} color="#06b6d4" />
          Pharmacy Sales Monitoring
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
          Real-time pharmacy sales tracking as disease outbreak proxy indicators — sales anomalies lead confirmed cases by 3-5 days
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px', borderRadius: '12px' }}>
            <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{stat.label}</p>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#f1f5f9', margin: '8px 0 4px' }}>{stat.value}</h2>
                <span style={{ fontSize: '12px', color: stat.color }}>{stat.change}</span>
              </div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <stat.icon size={24} color={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Trend Chart */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#06b6d4" />
            30-Day Sales Trend
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Units sold per day across all monitored pharmacies</span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={salesTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} interval={4} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Line type="monotone" dataKey="ORS" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="Paracetamol" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="Anti-malarial" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: District Sales Table + Anomaly Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* District-wise Sales Table */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '18px' }}>District-wise Pharmacy Sales</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', borderRadius: '8px',
                  padding: '8px 12px 8px 32px', color: '#f1f5f9', fontSize: '13px', outline: 'none', width: '180px'
                }}
              />
            </div>
          </div>
          <div className="data-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  {['District', 'ORS', 'Paracetamol', 'Anti-malarial', 'Cough Syrup', 'Trend', 'Anomaly'].map(h => (
                    <th key={h} style={{ padding: '12px 10px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDistricts.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                    <td style={{ padding: '12px 10px', color: '#f1f5f9', fontSize: '14px', fontWeight: 500 }}>{row.district}</td>
                    <td style={{ padding: '12px 10px', color: '#06b6d4', fontSize: '14px' }}>{row.ors.toLocaleString()}</td>
                    <td style={{ padding: '12px 10px', color: '#f59e0b', fontSize: '14px' }}>{row.paracetamol.toLocaleString()}</td>
                    <td style={{ padding: '12px 10px', color: '#ef4444', fontSize: '14px' }}>{row.antimalarial.toLocaleString()}</td>
                    <td style={{ padding: '12px 10px', color: '#a78bfa', fontSize: '14px' }}>{row.coughSyrup.toLocaleString()}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ color: parseInt(row.trend) > 25 ? '#ef4444' : '#10b981', fontSize: '13px', fontWeight: 600 }}>
                        {row.trend}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="risk-badge" style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                        background: row.anomaly ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                        color: row.anomaly ? '#fca5a5' : '#86efac',
                        border: `1px solid ${row.anomaly ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
                      }}>
                        {row.anomaly ? '⚠ Flagged' : '✓ Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Anomaly Detection Alerts */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ color: '#f1f5f9', margin: '0 0 16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#ef4444" />
            Anomaly Detection Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {anomalyAlerts.map(alert => (
              <div key={alert.id} style={{
                ...severityStyles[alert.severity],
                padding: '14px', borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span className="risk-badge" style={{
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: '6px',
                    background: severityStyles[alert.severity].background,
                    color: severityStyles[alert.severity].color
                  }}>
                    {alert.severity}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{alert.time}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#e2e8f0', lineHeight: 1.4 }}>
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column: Correlation Panel + Top Medicines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Correlation Panel */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#8b5cf6" />
            Sales → Disease Report Correlation
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px' }}>
            Pharmacy sales anomalies lead confirmed disease reports by <strong style={{ color: '#06b6d4' }}>3-5 days</strong> — enabling early warning before official case confirmation
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={correlationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="lag" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} label={{ value: 'Normalized Index', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 11 } }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Area type="monotone" dataKey="pharmacySales" name="Pharmacy Sales Spike" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.2)" strokeWidth={2} />
              <Area type="monotone" dataKey="diseaseReports" name="Confirmed Disease Reports" stroke="#ef4444" fill="rgba(239, 68, 68, 0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Avg Lead Time', value: '3.8 days', color: '#06b6d4' },
              { label: 'Correlation (r)', value: '0.87', color: '#10b981' },
              { label: 'Prediction Accuracy', value: '82%', color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '10px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{item.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: item.color, marginTop: '4px' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Medicines Bar Chart */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ color: '#f1f5f9', margin: '0 0 16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#10b981" />
            Top Selling Medicines (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={topMedicinesData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={90} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                formatter={(value) => [`${value.toLocaleString()} units`, 'Sales']}
              />
              <Bar dataKey="sales" radius={[0, 6, 6, 0]} fill="#06b6d4">
                {topMedicinesData.map((entry, index) => (
                  <rect key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

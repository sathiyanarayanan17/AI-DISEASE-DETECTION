import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertTriangle, Truck, MapPin, RefreshCw, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const inventoryData = [
  { item: 'ORS Packets', stock: 12500, threshold: 5000, status: 'Adequate', lastRestocked: '2026-08-17' },
  { item: 'RDT Kits', stock: 3200, threshold: 4000, status: 'Low', lastRestocked: '2026-08-14' },
  { item: 'IV Fluids', stock: 800, threshold: 2000, status: 'Critical', lastRestocked: '2026-08-10' },
  { item: 'Paracetamol', stock: 45000, threshold: 10000, status: 'Adequate', lastRestocked: '2026-08-18' },
  { item: 'Mosquito Nets', stock: 1500, threshold: 3000, status: 'Low', lastRestocked: '2026-08-12' },
  { item: 'Chlorine Tablets', stock: 600, threshold: 1500, status: 'Critical', lastRestocked: '2026-08-08' },
];

const districtSupplyStatus = [
  { name: 'Chennai', status: 'green' },
  { name: 'Coimbatore', status: 'green' },
  { name: 'Madurai', status: 'yellow' },
  { name: 'Tiruchirappalli', status: 'red' },
  { name: 'Salem', status: 'green' },
  { name: 'Tirunelveli', status: 'yellow' },
  { name: 'Erode', status: 'green' },
  { name: 'Vellore', status: 'red' },
  { name: 'Thoothukudi', status: 'yellow' },
  { name: 'Thanjavur', status: 'green' },
  { name: 'Dindigul', status: 'yellow' },
  { name: 'Kanchipuram', status: 'green' },
  { name: 'Nagapattinam', status: 'red' },
  { name: 'Cuddalore', status: 'yellow' },
  { name: 'Ramanathapuram', status: 'red' },
  { name: 'Viluppuram', status: 'green' },
];

const supplyDemandData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 7, i + 1);
  const supply = 800 + Math.floor(Math.random() * 400) - (i > 20 ? 200 : 0);
  const demand = 600 + Math.floor(Math.random() * 300) + (i > 15 ? 250 : 0);
  return {
    date: `Aug ${i + 1}`,
    supply,
    demand,
  };
});

const deliveryLog = [
  { date: '2026-08-19', from: 'Central Warehouse, Chennai', to: 'Tiruchirappalli', items: 'IV Fluids (500), ORS (2000)', status: 'In Transit' },
  { date: '2026-08-19', from: 'Regional Depot, Madurai', to: 'Ramanathapuram', items: 'RDT Kits (1000), Chlorine Tablets (500)', status: 'In Transit' },
  { date: '2026-08-18', from: 'Central Warehouse, Chennai', to: 'Vellore', items: 'Mosquito Nets (1000), Paracetamol (5000)', status: 'Delivered' },
  { date: '2026-08-18', from: 'Regional Depot, Coimbatore', to: 'Erode', items: 'ORS (3000), IV Fluids (200)', status: 'Delivered' },
  { date: '2026-08-17', from: 'Central Warehouse, Chennai', to: 'Nagapattinam', items: 'RDT Kits (800), Chlorine Tablets (1000)', status: 'Delivered' },
  { date: '2026-08-17', from: 'Regional Depot, Madurai', to: 'Dindigul', items: 'Paracetamol (10000), ORS (1500)', status: 'Delivered' },
];

const autoReorderAlerts = inventoryData
  .filter((item) => item.stock < item.threshold)
  .map((item) => ({
    item: item.item,
    current: item.stock,
    threshold: item.threshold,
    deficit: item.threshold - item.stock,
    priority: item.status === 'Critical' ? 'High' : 'Medium',
  }));

const stats = [
  { label: 'Total Supplies Tracked', value: '63,600', icon: Package, color: '#6366f1' },
  { label: 'Critical Shortages', value: '2', icon: AlertTriangle, color: '#ef4444' },
  { label: 'Deliveries Today', value: '2', icon: Truck, color: '#10b981' },
  { label: 'Districts Covered', value: '37', icon: MapPin, color: '#f59e0b' },
];

function getStatusColor(status) {
  switch (status) {
    case 'Adequate': return '#10b981';
    case 'Low': return '#f59e0b';
    case 'Critical': return '#ef4444';
    default: return '#6b7280';
  }
}

function getDistrictColor(status) {
  switch (status) {
    case 'green': return '#10b981';
    case 'yellow': return '#f59e0b';
    case 'red': return '#ef4444';
    default: return '#6b7280';
  }
}

function getDistrictBg(status) {
  switch (status) {
    case 'green': return 'rgba(16, 185, 129, 0.15)';
    case 'yellow': return 'rgba(245, 158, 11, 0.15)';
    case 'red': return 'rgba(239, 68, 68, 0.15)';
    default: return 'rgba(107, 114, 128, 0.1)';
  }
}

function getDeliveryStatusStyle(status) {
  if (status === 'In Transit') return { background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' };
  return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
}

export default function SupplyChainPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
          <Package style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} size={28} />
          Medical Supply Chain Tracker
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Real-time tracking of medical supplies across Tamil Nadu districts
        </p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat) => (
          <div className="glass-card" key={stat.label} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: `${stat.color}22`, borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Inventory Status</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Stock Level</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Last Restocked</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((row) => (
                <tr key={row.item}>
                  <td style={{ fontWeight: 500 }}>{row.item}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{row.stock.toLocaleString()}</span>
                      <div className="progress-bar-track" style={{ width: '80px', height: '6px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min((row.stock / (row.threshold * 3)) * 100, 100)}%`,
                            background: getStatusColor(row.status),
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{row.threshold.toLocaleString()}</td>
                  <td>
                    <span
                      className="risk-badge"
                      style={{
                        background: `${getStatusColor(row.status)}22`,
                        color: getStatusColor(row.status),
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{row.lastRestocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* District-wise Supply Status Grid */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>District-wise Supply Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {districtSupplyStatus.map((district) => (
            <div
              key={district.name}
              style={{
                background: getDistrictBg(district.status),
                border: `1px solid ${getDistrictColor(district.status)}44`,
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{district.name}</div>
              <div style={{ fontSize: '11px', color: getDistrictColor(district.status), fontWeight: 600, textTransform: 'uppercase' }}>
                {district.status === 'green' ? '● Adequate' : district.status === 'yellow' ? '● Low Stock' : '● Critical'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supply vs Demand Chart */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Supply vs Demand (30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={supplyDemandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} interval={4} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={2} dot={false} name="Supply Units" />
            <Line type="monotone" dataKey="demand" stroke="#ef4444" strokeWidth={2} dot={false} name="Demand Units" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Delivery Tracking Log */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          <Truck style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={20} />
          Delivery Tracking Log
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From Warehouse</th>
                <th>To District</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveryLog.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{row.date}</td>
                  <td>{row.from}</td>
                  <td style={{ fontWeight: 500 }}>
                    <ArrowRight size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {row.to}
                  </td>
                  <td style={{ fontSize: '13px' }}>{row.items}</td>
                  <td>
                    <span
                      style={{
                        ...getDeliveryStatusStyle(row.status),
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {row.status === 'In Transit' ? <Clock size={12} /> : <CheckCircle size={12} />}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-Reorder Alerts */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          <RefreshCw style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={20} />
          Auto-Reorder Alerts
        </h2>
        {autoReorderAlerts.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>All items are above threshold. No reorders needed.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {autoReorderAlerts.map((alert) => (
              <div
                key={alert.item}
                style={{
                  background: alert.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${alert.priority === 'High' ? '#ef444444' : '#f59e0b44'}`,
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={20} color={alert.priority === 'High' ? '#ef4444' : '#f59e0b'} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{alert.item}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                      Current: {alert.current.toLocaleString()} | Threshold: {alert.threshold.toLocaleString()} | Deficit: {alert.deficit.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      background: alert.priority === 'High' ? '#ef444422' : '#f59e0b22',
                      color: alert.priority === 'High' ? '#ef4444' : '#f59e0b',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {alert.priority} Priority
                  </span>
                  <button
                    style={{
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Trigger Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

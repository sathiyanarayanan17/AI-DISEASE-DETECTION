import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Package,
  Users,
  ShieldCheck,
  Building2,
  Sliders,
  CheckCircle,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { HOSPITALS_DATA } from '../data/hospitalsData';
import ExportButton from '../components/common/ExportButton';

export const ResourceAllocPage = () => {
  const [workersCount, setWorkersCount] = useState(250);
  const [allocationData, setAllocationData] = useState(null);

  useEffect(() => {
    const fetchAllocation = async () => {
      const res = await api.allocateResources(workersCount);
      setAllocationData(res);
    };
    fetchAllocation();
  }, [workersCount]);

  const allocationList = allocationData?.allocation || [];

  const COLORS = ['#f43f5e', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#3b82f6'];

  const pieData = allocationList.map((item, idx) => ({
    name: item.district,
    value: item.recommendedWorkers,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={24} className="text-indigo-400" />
            <span>AI Autonomous Resource & Workforce Allocator</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Proportional emergency squad dispatch based on Bayesian risk weighting and hospital bed constraints.
          </p>
        </div>

        <ExportButton data={allocationList} filename="resource_allocation_plan" label="Export Allocation Plan" />
      </div>

      {/* 2. Worker Pool Slider Ribbon */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} className="text-indigo-400" />
            <h2 style={{ fontSize: '16px' }}>Total Mobile Health Field Workers Pool:</h2>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
            {workersCount} Personnel
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="1000"
          step="25"
          value={workersCount}
          onChange={(e) => setWorkersCount(parseInt(e.target.value, 10))}
        />

        <div className="flex-between" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>50 Workers (Minimal Squad)</span>
          <span>500 Workers (Standard Mobilization)</span>
          <span>1,000 Workers (State Emergency Response)</span>
        </div>
      </div>

      {/* 3. Distribution Pie & AI Recommendation Cards */}
      <div className="grid-cols-2">
        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '16px' }}>Personnel Distribution by District</h2>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-strong)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Dispatch Directives List */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '16px' }}>AI Recommended Dispatch Directives</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '280px' }}>
            {allocationList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{item.district}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.keyFocus}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    {item.recommendedWorkers} Workers
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--risk-high)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Hospital Bed Capacity Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Tertiary Medical College Bed & ICU Logistics</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hospital Facility</th>
                <th>District</th>
                <th>Total Bed Capacity</th>
                <th>Available General Beds</th>
                <th>Available ICU Beds</th>
                <th>Isolation Units</th>
                <th>Oxygen Infrastructure</th>
              </tr>
            </thead>
            <tbody>
              {HOSPITALS_DATA.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600 }}>{h.name}</td>
                  <td>{h.district}</td>
                  <td>{h.totalBeds}</td>
                  <td>
                    <strong style={{ color: 'var(--accent-emerald)' }}>{h.availableBeds}</strong>
                  </td>
                  <td>
                    <strong style={{ color: h.availableIcu > 15 ? 'var(--accent-emerald)' : 'var(--risk-high)' }}>
                      {h.availableIcu}
                    </strong> / {h.icuBeds}
                  </td>
                  <td>{h.availableIsolation} / {h.isolationBeds}</td>
                  <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{h.oxygenPlant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocPage;

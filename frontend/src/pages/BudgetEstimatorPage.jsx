import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Calculator,
  DollarSign,
  ShieldAlert,
  Layers,
  CheckCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { getHighRiskDistricts } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';
import ExportButton from '../components/common/ExportButton';

export const BudgetEstimatorPage = () => {
  const highRisk = getHighRiskDistricts();
  const [districtMultiplier, setDistrictMultiplier] = useState(highRisk.length);
  const [containmentDays, setContainmentDays] = useState(14);

  // Cost estimates per high risk district for 14-day containment (in INR)
  const medicalSuppliesPerDist = 450000; // IV fluids, Paracetamol, RDT test kits
  const personnelPerDist = 380000;       // Field workers, nurses, doctors overtime
  const chemicalsPerDist = 280000;       // Temephos, Pyrethroid larvicide, fogging fuel
  const transportLogistics = 190000;     // Mobile fever clinic vans, ambulance support

  const totalPerDistrict = medicalSuppliesPerDist + personnelPerDist + chemicalsPerDist + transportLogistics;
  const grandTotal = totalPerDistrict * districtMultiplier * (containmentDays / 14);

  const budgetBreakdown = [
    { category: "Medical Supplies & Diagnostics", amount: (medicalSuppliesPerDist * districtMultiplier * (containmentDays / 14)) / 100000, desc: "Platelet units, IV Ringer lactate, ELISA & NS1 Dengue testing kits" },
    { category: "Personnel & Emergency Squads", amount: (personnelPerDist * districtMultiplier * (containmentDays / 14)) / 100000, desc: "ASHA workers, domestic breeding checkers, medical officers overtime" },
    { category: "Larvicidal Chemicals & Fogging", amount: (chemicalsPerDist * districtMultiplier * (containmentDays / 14)) / 100000, desc: "Temephos 50% EC, Malathion thermal fogging, Bti biological larvicide" },
    { category: "Logistics, Transport & Water", amount: (transportLogistics * districtMultiplier * (containmentDays / 14)) / 100000, desc: "Mobile fever clinics, water tanker superchlorination, IEC leaflets" }
  ];

  const perDistrictAllocation = highRisk.map((d) => ({
    district: d.name,
    tamilName: d.tamilName,
    riskScore: d.riskScore,
    allocatedBudgetLakhs: ((d.riskScore / 100) * 16.5 * (containmentDays / 14)).toFixed(2)
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={24} className="text-amber-400" />
            <span>Emergency Containment Budget Estimator</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Predictive fiscal planning and resource requisition based on active outbreak hotspots.
          </p>
        </div>

        <ExportButton data={budgetBreakdown} filename="outbreak_budget_estimate" label="Export Budget Dossier" />
      </div>

      {/* 2. Controls & Grand Total Ribbon */}
      <div className="grid-cols-3">
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Hotspot Districts Monitored:</label>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--risk-high)' }}>
              {districtMultiplier} Districts
            </span>
            <RiskBadge level="high" size="sm" />
          </div>
          <input
            type="range"
            min="1"
            max="37"
            value={districtMultiplier}
            onChange={(e) => setDistrictMultiplier(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Containment Operation Duration:</label>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {containmentDays} Days
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Full Vector Cycle</span>
          </div>
          <input
            type="range"
            min="7"
            max="60"
            step="7"
            value={containmentDays}
            onChange={(e) => setContainmentDays(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Requisition Estimate
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            ₹ {(grandTotal / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            ≈ ₹ {(grandTotal / 10000000).toFixed(2)} Crores (State SDRF Fund)
          </div>
        </div>
      </div>

      {/* 3. Category Breakdown Cards */}
      <div className="grid-cols-4">
        {budgetBreakdown.map((item, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {item.category}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
              ₹ {item.amount.toFixed(2)} L
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 4. Budget Breakdown Bar Chart */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Expenditure Allocation Distribution (INR in Lakhs)</h2>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetBreakdown} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `₹${v}L`} />
              <RechartsTooltip
                formatter={(val) => [`₹ ${val.toFixed(2)} Lakhs`, 'Estimated Expenditure']}
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Per-District Allocation Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>High-Risk District Fund Requisition Matrix</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>District Name</th>
                <th>Risk Score</th>
                <th>Classification</th>
                <th>Operation Days</th>
                <th>Allocated Emergency Budget</th>
              </tr>
            </thead>
            <tbody>
              {perDistrictAllocation.map((d, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.district}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.tamilName}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{d.riskScore}/100</td>
                  <td><RiskBadge level="high" score={d.riskScore} size="sm" /></td>
                  <td>{containmentDays} Days</td>
                  <td>
                    <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                      ₹ {d.allocatedBudgetLakhs} Lakhs
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetEstimatorPage;

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_DISTRICTS } from '../services/api';

const COST_PER_DISTRICT = {
  medicalSupplies: 850000,
  personnelDeployment: 620000,
  testingKits: 380000,
  transportation: 240000,
};

const PREVIOUS_OUTBREAKS = [
  { name: 'Dengue 2023', cost: 28.5 },
  { name: 'Cholera 2024', cost: 18.2 },
  { name: 'Malaria 2024', cost: 22.0 },
  { name: 'Current', cost: 0 },
];

export default function BudgetEstimator() {
  const highRiskDistricts = MOCK_DISTRICTS.filter(d => d.risk_level === 'High');
  const [numDistricts, setNumDistricts] = useState(highRiskDistricts.length);

  const costs = useMemo(() => {
    const n = numDistricts;
    const medical = COST_PER_DISTRICT.medicalSupplies * n;
    const personnel = COST_PER_DISTRICT.personnelDeployment * n;
    const testing = COST_PER_DISTRICT.testingKits * n;
    const transport = COST_PER_DISTRICT.transportation * n;
    const total = medical + personnel + testing + transport;
    return { medical, personnel, testing, transport, total };
  }, [numDistricts]);

  const comparisonData = useMemo(() => {
    return PREVIOUS_OUTBREAKS.map(o => ({
      ...o,
      cost: o.name === 'Current' ? (costs.total / 1000000).toFixed(1) : o.cost,
    }));
  }, [costs]);

  const districtAllocations = useMemo(() => {
    return highRiskDistricts.slice(0, numDistricts).map(d => {
      const weight = d.risk_score / 100;
      return {
        district: d.district,
        riskScore: d.risk_score,
        medical: Math.round(COST_PER_DISTRICT.medicalSupplies * weight),
        personnel: Math.round(COST_PER_DISTRICT.personnelDeployment * weight),
        testing: Math.round(COST_PER_DISTRICT.testingKits * weight),
        transport: Math.round(COST_PER_DISTRICT.transportation * weight),
        total: Math.round((COST_PER_DISTRICT.medicalSupplies + COST_PER_DISTRICT.personnelDeployment + COST_PER_DISTRICT.testingKits + COST_PER_DISTRICT.transportation) * weight),
      };
    });
  }, [numDistricts, highRiskDistricts]);

  const formatRupees = (val) => {
    if (val >= 10000000) return `Rs ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `Rs ${(val / 100000).toFixed(2)} L`;
    return `Rs ${val.toLocaleString('en-IN')}`;
  };

  return (
    <div>
      {/* Input */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Response Cost Estimator</h3>
          <span className="pill pill-red">{highRiskDistricts.length} High Risk Districts Detected</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text1)' }}>
              Number of Districts to Respond:
            </label>
            <input
              type="number"
              className="search-input"
              style={{ width: 80 }}
              min={1}
              max={37}
              value={numDistricts}
              onChange={e => setNumDistricts(Math.max(1, Math.min(37, parseInt(e.target.value) || 1)))}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
              (Auto-filled from high-risk alerts)
            </span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="card" style={{ marginBottom: 20, textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Total Estimated Response Cost
        </div>
        <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em' }}>
          {formatRupees(costs.total)}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginTop: 6 }}>
          For {numDistricts} district{numDistricts > 1 ? 's' : ''} outbreak response
        </div>
      </div>

      {/* Cost Breakdown Cards */}
      <div className="stats-row" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">💊</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1.3rem' }}>{formatRupees(costs.medical)}</div>
            <div className="stat-lbl">Medical Supplies</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">👨‍⚕</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1.3rem' }}>{formatRupees(costs.personnel)}</div>
            <div className="stat-lbl">Personnel Deployment</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">🧪</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1.3rem' }}>{formatRupees(costs.testing)}</div>
            <div className="stat-lbl">Testing Kits</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-green">🚑</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1.3rem' }}>{formatRupees(costs.transport)}</div>
            <div className="stat-lbl">Transportation</div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Cost Comparison: Current vs Previous Outbreaks</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 12, fill: '#475569' }} label={{ value: 'Cost (Rs Lakhs)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }} />
              <Bar dataKey="cost" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-District Allocation Table */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Per-District Cost Allocation</h3>
        </div>
        <div className="card-body">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Risk Score</th>
                  <th>Medical</th>
                  <th>Personnel</th>
                  <th>Testing</th>
                  <th>Transport</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {districtAllocations.map(d => (
                  <tr key={d.district}>
                    <td style={{ fontWeight: 600 }}>{d.district}</td>
                    <td>
                      <div className="score-wrap">
                        <div className="score-track">
                          <div className="score-fill" style={{ width: `${d.riskScore}%`, background: d.riskScore >= 70 ? 'var(--red)' : 'var(--amber)' }} />
                        </div>
                        <span className="score-num">{d.riskScore}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>{formatRupees(d.medical)}</td>
                    <td style={{ fontSize: '0.78rem' }}>{formatRupees(d.personnel)}</td>
                    <td style={{ fontSize: '0.78rem' }}>{formatRupees(d.testing)}</td>
                    <td style={{ fontSize: '0.78rem' }}>{formatRupees(d.transport)}</td>
                    <td style={{ fontWeight: 700, fontSize: '0.82rem' }}>{formatRupees(d.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Cost Estimation Formula</h3>
        </div>
        <div className="card-body" style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>The response cost is calculated using the following per-district base rates, weighted by risk score:</p>
          <div style={{ background: 'var(--bg-card2)', padding: 16, borderRadius: 10, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.78rem' }}>
            <div>Total Cost = Sum(Base Cost x Risk Weight) for each district</div>
            <div style={{ marginTop: 8 }}>Where:</div>
            <div style={{ paddingLeft: 16 }}>
              <div>- Medical Supplies: Rs 8,50,000 per district</div>
              <div>- Personnel Deployment: Rs 6,20,000 per district</div>
              <div>- Testing Kits: Rs 3,80,000 per district</div>
              <div>- Transportation: Rs 2,40,000 per district</div>
              <div>- Risk Weight = district_risk_score / 100</div>
            </div>
          </div>
          <p style={{ marginTop: 12, color: 'var(--text3)', fontSize: '0.76rem' }}>
            Note: These are estimated figures based on historical outbreak response data from TNHSP. Actual costs may vary based on outbreak severity, season, and resource availability.
          </p>
        </div>
      </div>
    </div>
  );
}

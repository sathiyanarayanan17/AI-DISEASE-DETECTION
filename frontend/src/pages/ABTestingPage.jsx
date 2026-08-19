import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FlaskConical, CheckCircle2, TrendingUp, BarChart3, Calculator, Award, BookOpen, Users, Shuffle, Target } from 'lucide-react';

const statsData = [
  { label: 'Active Experiments', value: 8, icon: FlaskConical, color: '#6366f1' },
  { label: 'Completed Tests', value: 23, icon: CheckCircle2, color: '#10b981' },
  { label: 'Avg Lift', value: '+14.2%', icon: TrendingUp, color: '#f59e0b' },
  { label: 'Significance Rate', value: '78%', icon: BarChart3, color: '#ec4899' },
];

const activeExperiments = [
  { name: 'SMS vs WhatsApp Alerts', control: 'SMS Only (n=1200)', treatment: 'WhatsApp + SMS (n=1200)', metric: 'Response Rate', duration: '21 days', status: 'Running', pValue: 0.032 },
  { name: 'Fogging Schedule Optimization', control: 'Weekly Fogging (n=15 wards)', treatment: 'AI-Scheduled (n=15 wards)', metric: 'Mosquito Density Index', duration: '45 days', status: 'Running', pValue: 0.078 },
  { name: 'Vaccination Drive Timing', control: 'Morning Drives (n=800)', treatment: 'Evening Drives (n=800)', metric: 'Coverage Rate', duration: '30 days', status: 'Running', pValue: 0.005 },
  { name: 'Water Chlorination Dosage', control: 'Standard Dose (n=50 sources)', treatment: 'Enhanced Dose (n=50 sources)', metric: 'Coliform Reduction', duration: '14 days', status: 'Paused', pValue: 0.112 },
  { name: 'Community Health Worker Training', control: 'Traditional (n=60 CHWs)', treatment: 'AI-Guided (n=60 CHWs)', metric: 'Early Detection Rate', duration: '60 days', status: 'Running', pValue: 0.041 },
];

const chartData = [
  { experiment: 'SMS vs WhatsApp', control: 42, treatment: 58 },
  { experiment: 'Fogging Schedule', control: 3.2, treatment: 2.1 },
  { experiment: 'Vaccination Timing', control: 64, treatment: 79 },
  { experiment: 'Chlorination', control: 71, treatment: 82 },
  { experiment: 'CHW Training', control: 38, treatment: 52 },
];

const pastResults = [
  { name: 'IEC Material Distribution Method', winner: 'Treatment', lift: '+22.5%', pValue: 0.001, conclusion: 'Door-to-door distribution significantly outperformed community boards' },
  { name: 'Alert Frequency Optimization', winner: 'Control', lift: '-3.1%', pValue: 0.42, conclusion: 'No significant difference; daily alerts preferred over hourly' },
  { name: 'Bed Net Distribution Strategy', winner: 'Treatment', lift: '+18.7%', pValue: 0.003, conclusion: 'School-based distribution improved usage compliance' },
  { name: 'Fever Surveillance Method', winner: 'Treatment', lift: '+31.2%', pValue: 0.0001, conclusion: 'Mobile app reporting dramatically faster than paper forms' },
  { name: 'Larvicide Application Timing', winner: 'Treatment', lift: '+12.8%', pValue: 0.018, conclusion: 'Pre-monsoon application more effective than reactive treatment' },
];

export default function ABTestingPage() {
  const [baselineRate, setBaselineRate] = useState(20);
  const [mde, setMde] = useState(5);
  const [significance, setSignificance] = useState(0.05);
  const [power, setPower] = useState(0.8);

  const calculateSampleSize = () => {
    const p1 = baselineRate / 100;
    const p2 = p1 + mde / 100;
    const zAlpha = significance === 0.05 ? 1.96 : significance === 0.01 ? 2.576 : 1.645;
    const zBeta = power === 0.8 ? 0.842 : power === 0.9 ? 1.282 : 0.674;
    const pBar = (p1 + p2) / 2;
    const n = Math.ceil(
      (Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2))) /
      Math.pow(p2 - p1, 2)
    );
    return isFinite(n) && n > 0 ? n : 0;
  };

  const requiredSample = calculateSampleSize();

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FlaskConical size={32} color="#6366f1" />
          A/B Testing Framework
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>
          Rigorous intervention strategy testing with statistical significance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {statsData.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
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

      {/* Active Experiments Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FlaskConical size={20} color="#6366f1" />
          Active Experiments
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Experiment Name</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Control Group</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Treatment Group</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Metric</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Duration</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600 }}>p-value</th>
              </tr>
            </thead>
            <tbody>
              {activeExperiments.map((exp, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{exp.name}</td>
                  <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{exp.control}</td>
                  <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{exp.treatment}</td>
                  <td style={{ padding: '12px 8px' }}>{exp.metric}</td>
                  <td style={{ padding: '12px 8px' }}>{exp.duration}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: exp.status === 'Running' ? '#10b98122' : '#f59e0b22',
                      color: exp.status === 'Running' ? '#10b981' : '#f59e0b',
                    }}>
                      {exp.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      fontWeight: 600,
                      color: exp.pValue < 0.05 ? '#10b981' : '#ef4444',
                    }}>
                      {exp.pValue.toFixed(3)}
                      {exp.pValue < 0.05 && ' ✓'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Visualization + Sample Size Calculator */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#6366f1" />
            Control vs Treatment Outcomes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="experiment" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="control" fill="#64748b" name="Control" radius={[4, 4, 0, 0]} />
              <Bar dataKey="treatment" fill="#6366f1" name="Treatment" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sample Size Calculator */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} color="#f59e0b" />
            Sample Size Calculator
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Baseline Rate (%)</label>
              <input
                className="input-control"
                type="number"
                value={baselineRate}
                onChange={(e) => setBaselineRate(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.5)', color: '#f1f5f9' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Minimum Detectable Effect (%)</label>
              <input
                className="input-control"
                type="number"
                value={mde}
                onChange={(e) => setMde(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.5)', color: '#f1f5f9' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Significance Level (α)</label>
              <select
                className="input-control"
                value={significance}
                onChange={(e) => setSignificance(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.5)', color: '#f1f5f9' }}
              >
                <option value={0.01}>0.01 (99% confidence)</option>
                <option value={0.05}>0.05 (95% confidence)</option>
                <option value={0.1}>0.10 (90% confidence)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Statistical Power (1-β)</label>
              <select
                className="input-control"
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.5)', color: '#f1f5f9' }}
              >
                <option value={0.7}>70%</option>
                <option value={0.8}>80%</option>
                <option value={0.9}>90%</option>
              </select>
            </div>
            <div style={{ marginTop: '8px', padding: '16px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Required Sample Size (per group)</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#6366f1' }}>
                {requiredSample.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Total: {(requiredSample * 2).toLocaleString()} participants
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Experiment Results */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#10b981" />
          Past Experiment Results
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pastResults.map((result, idx) => (
            <div key={idx} style={{ padding: '16px', background: 'rgba(15,23,42,0.4)', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{result.name}</span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: result.winner === 'Treatment' ? '#10b98122' : '#64748b22',
                    color: result.winner === 'Treatment' ? '#10b981' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Award size={12} />
                    {result.winner} Wins
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: result.lift.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    Lift: {result.lift}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    p={result.pValue}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{result.conclusion}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Panel */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="#6366f1" />
          Methodology
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '20px', background: 'rgba(99,102,241,0.08)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shuffle size={20} color="#6366f1" />
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Randomization</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Districts and populations are randomly assigned to control and treatment groups using computer-generated random sequences. 
              Block randomization ensures balanced group sizes. Allocation concealment prevents selection bias during assignment.
              Random seed is logged for reproducibility and audit compliance.
            </p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Users size={20} color="#10b981" />
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Stratification</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Participants are stratified by key confounders: district type (urban/rural/coastal), population density, 
              baseline disease incidence, and healthcare infrastructure capacity. This ensures treatment effects are not 
              confounded by pre-existing group differences. Post-hoc subgroup analysis validates balance.
            </p>
          </div>
          <div style={{ padding: '20px', background: 'rgba(245,158,11,0.08)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Target size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Intent-to-Treat Analysis</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              All participants are analyzed in their originally assigned groups regardless of compliance or dropout. 
              This preserves randomization benefits and provides conservative, real-world effect estimates. 
              Per-protocol analysis is conducted as sensitivity check but ITT remains primary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

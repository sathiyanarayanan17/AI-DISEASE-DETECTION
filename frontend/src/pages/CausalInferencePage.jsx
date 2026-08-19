import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Brain, GitBranch, FlaskConical, Target, ArrowRight, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const stats = [
  { label: 'Causal Links Discovered', value: '14', icon: GitBranch, color: '#6366f1' },
  { label: 'Confidence Level', value: '94.2%', icon: Target, color: '#10b981' },
  { label: 'Variables Analyzed', value: '23', icon: Brain, color: '#f59e0b' },
  { label: 'Interventions Modeled', value: '8', icon: FlaskConical, color: '#ef4444' },
];

const dagNodes = [
  { id: 'rainfall', label: 'Rainfall', x: 50, y: 30 },
  { id: 'humidity', label: 'Humidity', x: 250, y: 30 },
  { id: 'temperature', label: 'Temperature', x: 450, y: 30 },
  { id: 'stagnant_water', label: 'Stagnant Water', x: 150, y: 160 },
  { id: 'mosquito', label: 'Mosquito Breeding', x: 350, y: 160 },
  { id: 'dengue', label: 'Dengue Cases', x: 250, y: 290 },
  { id: 'hospital', label: 'Hospital Admissions', x: 250, y: 400 },
];

const dagEdges = [
  { from: 'rainfall', to: 'stagnant_water' },
  { from: 'humidity', to: 'mosquito' },
  { from: 'temperature', to: 'mosquito' },
  { from: 'stagnant_water', to: 'mosquito' },
  { from: 'mosquito', to: 'dengue' },
  { from: 'rainfall', to: 'dengue' },
  { from: 'dengue', to: 'hospital' },
  { from: 'temperature', to: 'dengue' },
];

const causalEstimates = [
  { cause: 'Rainfall (mm)', effect: 'Dengue Cases', ate: 0.43, ci: '[0.31, 0.55]', pvalue: '0.001', method: 'Backdoor (Linear)' },
  { cause: 'Stagnant Water', effect: 'Mosquito Breeding', ate: 0.71, ci: '[0.62, 0.80]', pvalue: '<0.001', method: 'Frontdoor' },
  { cause: 'Mosquito Density', effect: 'Dengue Cases', ate: 0.58, ci: '[0.44, 0.72]', pvalue: '<0.001', method: 'IV Estimation' },
  { cause: 'Humidity (%)', effect: 'Mosquito Breeding', ate: 0.35, ci: '[0.21, 0.49]', pvalue: '0.003', method: 'Backdoor (NP)' },
  { cause: 'Temperature (°C)', effect: 'Dengue Cases', ate: 0.28, ci: '[0.15, 0.41]', pvalue: '0.012', method: 'DoWhy Auto' },
  { cause: 'Dengue Cases', effect: 'Hospital Admissions', ate: 0.82, ci: '[0.74, 0.90]', pvalue: '<0.001', method: 'Backdoor (Linear)' },
];

const interventions = [
  {
    id: 'drain',
    label: 'Remove stagnant water',
    effect: 'Dengue reduction: 62%',
    detail: 'Eliminates primary mosquito breeding sites. Strongest upstream causal lever.',
    reduction: 62,
  },
  {
    id: 'spray',
    label: 'Indoor residual spraying',
    effect: 'Dengue reduction: 41%',
    detail: 'Kills adult mosquitoes indoors. Moderate causal effect, needs repeat application.',
    reduction: 41,
  },
  {
    id: 'nets',
    label: 'Insecticide-treated bed nets',
    effect: 'Dengue reduction: 28%',
    detail: 'Reduces human-mosquito contact during sleep. Lower but sustained causal effect.',
    reduction: 28,
  },
];

const interventionChartData = interventions.map(i => ({
  name: i.label,
  reduction: i.reduction,
}));

const barColors = ['#6366f1', '#10b981', '#f59e0b'];

function getNodePosition(id) {
  const node = dagNodes.find(n => n.id === id);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

export default function CausalInferencePage() {
  const [selectedIntervention, setSelectedIntervention] = useState(interventions[0]);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={28} color="#6366f1" />
          Causal Inference Engine
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Discover true cause-effect relationships in disease outbreaks using DoWhy framework and do-calculus
        </p>
      </div>

      {/* Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div className="glass-card" key={i} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: `${s.color}22`, borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={24} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* DAG Visualization */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch size={20} color="#6366f1" />
          Causal DAG (Directed Acyclic Graph)
        </h2>
        <div style={{ position: 'relative', width: '100%', height: '480px', background: 'rgba(15,23,42,0.4)', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Edges (SVG arrows) */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
              </marker>
            </defs>
            {dagEdges.map((edge, i) => {
              const from = getNodePosition(edge.from);
              const to = getNodePosition(edge.to);
              const fromX = from.x + 70;
              const fromY = from.y + 25;
              const toX = to.x + 70;
              const toY = to.y + 25;
              return (
                <line
                  key={i}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeOpacity="0.6"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>
          {/* Nodes */}
          {dagNodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                background: 'linear-gradient(135deg, #1e293b, #334155)',
                border: '1px solid #6366f1',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 12px rgba(99,102,241,0.2)',
                zIndex: 2,
              }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>

      {/* Causal Effect Estimates Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="#10b981" />
          Causal Effect Estimates
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Cause</th>
                <th style={thStyle}>Effect</th>
                <th style={thStyle}>Causal Estimate (ATE)</th>
                <th style={thStyle}>95% CI</th>
                <th style={thStyle}>p-value</th>
                <th style={thStyle}>Method</th>
              </tr>
            </thead>
            <tbody>
              {causalEstimates.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={tdStyle}>{row.cause}</td>
                  <td style={tdStyle}>{row.effect}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>{row.ate.toFixed(2)}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px' }}>{row.ci}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', color: parseFloat(row.pvalue) < 0.01 || row.pvalue === '<0.001' ? '#10b981' : '#f59e0b' }}>{row.pvalue}</td>
                  <td style={tdStyle}>{row.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Do-Calculus Panel + Intervention Simulator */}
      <div className="grid-cols-3" style={{ marginBottom: '28px', gap: '20px' }}>
        {/* Do-Calculus Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FlaskConical size={18} color="#f59e0b" />
            Do-Calculus Interventions
          </h2>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>INTERVENTION QUERY</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
              P(Dengue | <span style={{ color: '#6366f1' }}>do</span>(Rainfall = 0))
            </div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>RESULT</div>
            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
              If we <strong style={{ color: '#10b981' }}>SET rainfall = 0</strong> (drain water), expected dengue reduction:{' '}
              <strong style={{ color: '#10b981', fontSize: '20px' }}>62%</strong>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
            <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            do-calculus allows us to estimate interventional effects from observational data by blocking confounding paths in the causal DAG.
          </div>
        </div>

        {/* Intervention Simulator */}
        <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#ef4444" />
            Intervention Simulator
          </h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {interventions.map((intv) => (
              <button
                key={intv.id}
                className={`btn ${selectedIntervention.id === intv.id ? 'btn-primary' : ''}`}
                onClick={() => setSelectedIntervention(intv)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: selectedIntervention.id === intv.id ? 'none' : '1px solid rgba(148,163,184,0.3)',
                  background: selectedIntervention.id === intv.id ? '#6366f1' : 'rgba(30,41,59,0.6)',
                  color: '#e2e8f0',
                }}
              >
                {intv.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>PREDICTED CAUSAL EFFECT</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{selectedIntervention.effect}</div>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{selectedIntervention.detail}</p>
            </div>
            <div style={{ flex: 1, minWidth: '280px', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#e2e8f0' }}
                  />
                  <Bar dataKey="reduction" radius={[6, 6, 0, 0]}>
                    {interventionChartData.map((_, idx) => (
                      <Cell key={idx} fill={barColors[idx]} opacity={interventions[idx].id === selectedIntervention.id ? 1 : 0.4} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation vs Causation */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} color="#6366f1" />
          Correlation vs Causation: Rainfall → Dengue
        </h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>CORRELATION (Observational)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>r = 0.67</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              Pearson correlation between rainfall and dengue cases. Includes confounding effects from humidity, season, and urbanization.
            </p>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} /> May be spurious — confounders not controlled
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowRight size={28} color="#64748b" />
          </div>
          <div style={{ flex: 1, minWidth: '260px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>CAUSATION (Interventional)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>ATE = 0.43</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              Average Treatment Effect after adjusting for confounders via backdoor criterion. True causal effect is 36% lower than naive correlation.
            </p>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Confounders controlled via DAG adjustment
            </div>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} color="#f59e0b" />
          Methodology
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6366f1', marginBottom: '8px' }}>DoWhy Framework</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
              Microsoft's DoWhy library provides a 4-step causal inference pipeline: (1) Model the causal graph, (2) Identify the causal estimand, (3) Estimate causal effect, (4) Refute the estimate with robustness checks (placebo, random common cause, data subset).
            </p>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>Backdoor Criterion</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
              Identifies a sufficient adjustment set Z such that conditioning on Z blocks all backdoor paths between treatment and outcome. Used for rainfall→dengue estimation by adjusting for humidity and season confounders.
            </p>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b', marginBottom: '8px' }}>Instrumental Variables (IV)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
              When unmeasured confounders exist, IV estimation uses a variable (e.g., geographic elevation) that affects the treatment (mosquito density) but has no direct effect on the outcome (dengue cases) except through the treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 14px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#94a3b8',
  borderBottom: '1px solid rgba(148,163,184,0.2)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 14px',
  fontSize: '13px',
  color: '#e2e8f0',
};

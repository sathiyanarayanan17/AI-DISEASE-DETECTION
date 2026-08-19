import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dna, AlertTriangle, FlaskConical, Building2, ShieldAlert, MapPin, Activity, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const statsData = [
  { label: 'Sequences Analyzed', value: '12,847', icon: Dna, color: '#6366f1' },
  { label: 'Mutations Detected', value: '342', icon: AlertTriangle, color: '#f59e0b' },
  { label: 'Variant Alerts', value: '18', icon: ShieldAlert, color: '#ef4444' },
  { label: 'Labs Connected', value: '14', icon: Building2, color: '#10b981' },
];

const mutationData = [
  { pathogen: 'Dengue Virus', gene: 'NS1', mutationId: 'DEN-NS1-A203V', type: 'SNP', firstDetected: '2026-07-12', districts: 5, severity: 'High' },
  { pathogen: 'Cholera (V. cholerae)', gene: 'ctxB', mutationId: 'VC-CTX-D94G', type: 'SNP', firstDetected: '2026-06-28', districts: 3, severity: 'Critical' },
  { pathogen: 'P. falciparum', gene: 'pfkelch13', mutationId: 'PF-K13-C580Y', type: 'SNP', firstDetected: '2026-08-01', districts: 2, severity: 'High' },
  { pathogen: 'Dengue Virus', gene: 'E protein', mutationId: 'DEN-E-DEL47', type: 'Deletion', firstDetected: '2026-07-25', districts: 4, severity: 'Medium' },
  { pathogen: 'Cholera (V. cholerae)', gene: 'wbeN', mutationId: 'VC-WBE-INS12', type: 'Insertion', firstDetected: '2026-08-05', districts: 1, severity: 'Low' },
  { pathogen: 'P. falciparum', gene: 'pfcrt', mutationId: 'PF-CRT-K76T', type: 'SNP', firstDetected: '2026-07-18', districts: 6, severity: 'Critical' },
  { pathogen: 'Dengue Virus', gene: 'NS5', mutationId: 'DEN-NS5-R368K', type: 'SNP', firstDetected: '2026-08-10', districts: 2, severity: 'Medium' },
];

const variantPrevalenceData = [
  { month: 'Mar', DEN_I: 40, DEN_II: 30, DEN_III: 20, DEN_IV: 10 },
  { month: 'Apr', DEN_I: 35, DEN_II: 35, DEN_III: 18, DEN_IV: 12 },
  { month: 'May', DEN_I: 28, DEN_II: 40, DEN_III: 20, DEN_IV: 12 },
  { month: 'Jun', DEN_I: 22, DEN_II: 42, DEN_III: 22, DEN_IV: 14 },
  { month: 'Jul', DEN_I: 18, DEN_II: 38, DEN_III: 28, DEN_IV: 16 },
  { month: 'Aug', DEN_I: 15, DEN_II: 32, DEN_III: 35, DEN_IV: 18 },
];

const drugResistanceAlerts = [
  { drug: 'Chloroquine', pathogen: 'P. falciparum', mutation: 'PF-CRT-K76T', resistance: 'Confirmed', districts: ['Chennai', 'Kancheepuram', 'Tiruvallur', 'Vellore', 'Cuddalore', 'Villupuram'], date: '2026-07-18' },
  { drug: 'Artesunate', pathogen: 'P. falciparum', mutation: 'PF-K13-C580Y', resistance: 'Suspected', districts: ['Ramanathapuram', 'Sivaganga'], date: '2026-08-01' },
  { drug: 'Tetracycline', pathogen: 'V. cholerae', mutation: 'VC-TET-M1', resistance: 'Confirmed', districts: ['Nagapattinam', 'Thanjavur', 'Tiruvarur'], date: '2026-07-30' },
];

const geographicSpreadData = [
  { district: 'Chennai', dominantVariant: 'DEN-III', sequences: 1842, lastUpdate: '2026-08-18' },
  { district: 'Coimbatore', dominantVariant: 'DEN-II', sequences: 1204, lastUpdate: '2026-08-17' },
  { district: 'Madurai', dominantVariant: 'DEN-III', sequences: 987, lastUpdate: '2026-08-18' },
  { district: 'Tiruchirappalli', dominantVariant: 'DEN-II', sequences: 856, lastUpdate: '2026-08-16' },
  { district: 'Salem', dominantVariant: 'DEN-I', sequences: 643, lastUpdate: '2026-08-17' },
  { district: 'Thanjavur', dominantVariant: 'DEN-III', sequences: 578, lastUpdate: '2026-08-18' },
  { district: 'Kancheepuram', dominantVariant: 'DEN-IV', sequences: 512, lastUpdate: '2026-08-15' },
  { district: 'Vellore', dominantVariant: 'DEN-II', sequences: 489, lastUpdate: '2026-08-17' },
];

const pipelineStages = [
  { name: 'Sample Collection', status: 'complete', count: 320 },
  { name: 'DNA Extraction', status: 'complete', count: 298 },
  { name: 'Sequencing', status: 'active', count: 215 },
  { name: 'Bioinformatics Analysis', status: 'pending', count: 0 },
  { name: 'Report Generation', status: 'pending', count: 0 },
];

const phylogeneticTree = `
┌── Dengue Virus
│   ├── Serotype I (DEN-I)
│   │   ├── Genotype I (Southeast Asian)
│   │   └── Genotype IV (South Pacific) ← TN Dominant
│   ├── Serotype II (DEN-II)
│   │   ├── Cosmopolitan genotype
│   │   └── Asian I genotype ← Emerging in TN
│   ├── Serotype III (DEN-III) ★ ALERT
│   │   ├── Genotype I (South Pacific)
│   │   ├── Genotype III (Indian subcontinent) ← TN Dominant
│   │   └── Genotype III-B (Novel mutation: NS1-A203V) ← NEW
│   └── Serotype IV (DEN-IV)
│       └── Genotype II (Indonesian)
│
├── Vibrio cholerae
│   ├── O1 Classical
│   ├── O1 El Tor ← TN Dominant
│   │   ├── Altered El Tor (ctxB-D94G) ★ ALERT
│   │   └── Hybrid variant (wbeN-INS12) ← NEW
│   └── O139 Bengal
│
└── Plasmodium falciparum
    ├── African lineage
    └── Southeast Asian lineage
        ├── KEL1/PLA1 (pfkelch13-C580Y) ★ RESISTANCE
        └── CRT-resistant (pfcrt-K76T) ← TN Spread
`.trim();

function getSeverityBadge(severity) {
  const colors = {
    Critical: '#ef4444',
    High: '#f59e0b',
    Medium: '#6366f1',
    Low: '#10b981',
  };
  return (
    <span className="risk-badge" style={{ background: `${colors[severity]}22`, color: colors[severity], border: `1px solid ${colors[severity]}44` }}>
      {severity}
    </span>
  );
}

function getTypeBadge(type) {
  const colors = { SNP: '#6366f1', Deletion: '#ef4444', Insertion: '#10b981' };
  return (
    <span className="risk-badge" style={{ background: `${colors[type]}22`, color: colors[type], border: `1px solid ${colors[type]}44` }}>
      {type}
    </span>
  );
}

function getPipelineIcon(status) {
  if (status === 'complete') return <CheckCircle2 size={18} color="#10b981" />;
  if (status === 'active') return <Loader2 size={18} color="#6366f1" className="spin" />;
  return <Clock size={18} color="#64748b" />;
}

export default function GenomicSurveillancePage() {
  const [selectedPathogen, setSelectedPathogen] = useState('All');

  const filteredMutations = selectedPathogen === 'All'
    ? mutationData
    : mutationData.filter(m => m.pathogen.includes(selectedPathogen));

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dna size={28} color="#6366f1" />
            Pathogen Genomic Surveillance
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Real-time pathogen sequencing, mutation tracking & variant monitoring across Tamil Nadu</p>
        </div>
        <select
          value={selectedPathogen}
          onChange={e => setSelectedPathogen(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.9rem' }}
        >
          <option value="All">All Pathogens</option>
          <option value="Dengue">Dengue Virus</option>
          <option value="Cholera">Cholera</option>
          <option value="falciparum">P. falciparum</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {statsData.map((stat, i) => (
          <div className="glass-card" key={i} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: `${stat.color}15`, borderRadius: '12px', padding: '0.75rem', display: 'flex' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mutation Tracking Table */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} color="#f59e0b" />
          Mutation Tracking
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pathogen</th>
                <th>Gene</th>
                <th>Mutation ID</th>
                <th>Type</th>
                <th>First Detected</th>
                <th>Districts Affected</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredMutations.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{row.pathogen}</td>
                  <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{row.gene}</code></td>
                  <td><code style={{ background: '#ede9fe', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem', color: '#6366f1' }}>{row.mutationId}</code></td>
                  <td>{getTypeBadge(row.type)}</td>
                  <td>{row.firstDetected}</td>
                  <td style={{ textAlign: 'center' }}>{row.districts}</td>
                  <td>{getSeverityBadge(row.severity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phylogenetic Tree + Variant Prevalence Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Phylogenetic Tree */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dna size={18} color="#6366f1" />
            Phylogenetic Tree (Lineage Map)
          </h2>
          <pre style={{
            background: '#0f172a',
            color: '#e2e8f0',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            overflow: 'auto',
            maxHeight: '400px',
            fontFamily: 'monospace',
          }}>
            {phylogeneticTree}
          </pre>
        </div>

        {/* Variant Prevalence Chart */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="#10b981" />
            Dengue Variant Prevalence (%)
          </h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={variantPrevalenceData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="DEN_I" name="DEN-I" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="DEN_II" name="DEN-II" fill="#10b981" stackId="a" />
              <Bar dataKey="DEN_III" name="DEN-III" fill="#f59e0b" stackId="a" />
              <Bar dataKey="DEN_IV" name="DEN-IV" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drug Resistance Alerts */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="#ef4444" />
          Drug Resistance Alerts
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {drugResistanceAlerts.map((alert, i) => (
            <div key={i} style={{
              padding: '1rem',
              borderRadius: '10px',
              border: `1px solid ${alert.resistance === 'Confirmed' ? '#fecaca' : '#fef3c7'}`,
              background: alert.resistance === 'Confirmed' ? '#fef2f2' : '#fffbeb',
            }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FlaskConical size={18} color={alert.resistance === 'Confirmed' ? '#ef4444' : '#f59e0b'} />
                  <span style={{ fontWeight: 600 }}>{alert.drug}</span>
                  <span className="risk-badge" style={{
                    background: alert.resistance === 'Confirmed' ? '#ef444422' : '#f59e0b22',
                    color: alert.resistance === 'Confirmed' ? '#ef4444' : '#f59e0b',
                    border: `1px solid ${alert.resistance === 'Confirmed' ? '#ef444444' : '#f59e0b44'}`,
                  }}>
                    {alert.resistance}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{alert.date}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                <strong>Pathogen:</strong> {alert.pathogen} &nbsp;|&nbsp; <strong>Mutation:</strong> <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: '3px' }}>{alert.mutation}</code>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                <strong>Affected Districts:</strong> {alert.districts.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Spread + Sequencing Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Geographic Spread */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#6366f1" />
            Geographic Spread of Variants
          </h2>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>Dominant Variant</th>
                  <th>Sequences</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {geographicSpreadData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{row.district}</td>
                    <td>
                      <span className="risk-badge" style={{ background: '#6366f122', color: '#6366f1', border: '1px solid #6366f144' }}>
                        {row.dominantVariant}
                      </span>
                    </td>
                    <td>{row.sequences.toLocaleString()}</td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{row.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sequencing Pipeline Status */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="#10b981" />
            Sequencing Pipeline Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pipelineStages.map((stage, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getPipelineIcon(stage.status)}
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{stage.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {stage.status === 'complete' ? `${stage.count} done` : stage.status === 'active' ? `${stage.count} in progress` : 'Waiting'}
                    </span>
                  </div>
                  <div className="progress-bar-track" style={{ marginTop: '0.4rem' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: '999px',
                      width: stage.status === 'complete' ? '100%' : stage.status === 'active' ? '67%' : '0%',
                      background: stage.status === 'complete' ? '#10b981' : stage.status === 'active' ? '#6366f1' : '#e2e8f0',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                {i < pipelineStages.length - 1 && (
                  <div style={{ position: 'absolute', left: '1.8rem', top: '100%', height: '1rem', width: '2px', background: '#e2e8f0' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 500 }}>Pipeline Summary</div>
            <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '0.25rem' }}>
              320 samples collected → 298 extracted → 215 currently sequencing
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Estimated completion: ~6 hours for current batch
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

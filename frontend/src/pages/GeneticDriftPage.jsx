import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import {
  Dna,
  AlertTriangle,
  Activity,
  Clock,
  FileSearch,
  Shield,
  TrendingUp,
  Info
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

// Disease-specific mock data
const DISEASE_DATA = {
  Dengue: {
    mutationProbability: 12,
    sequencesAnalyzed: 1247,
    alertLevel: 'elevated',
    alertMessage: 'WARNING: Dengue case pattern has shifted. Possible new serotype detected in Chennai cluster. Age group 5-15 showing 34% increase compared to historical baseline.',
    showAlert: true,
    demographicsBefore: [
      { group: '0-5', cases: 8 },
      { group: '5-15', cases: 15 },
      { group: '15-25', cases: 22 },
      { group: '25-40', cases: 45 },
      { group: '40-60', cases: 35 },
      { group: '60+', cases: 12 }
    ],
    demographicsAfter: [
      { group: '0-5', cases: 12 },
      { group: '5-15', cases: 38 },
      { group: '15-25', cases: 28 },
      { group: '25-40', cases: 32 },
      { group: '40-60', cases: 30 },
      { group: '60+', cases: 18 }
    ]
  },
  Cholera: {
    mutationProbability: 5,
    sequencesAnalyzed: 892,
    alertLevel: 'normal',
    alertMessage: '',
    showAlert: false,
    demographicsBefore: [
      { group: '0-5', cases: 18 },
      { group: '5-15', cases: 25 },
      { group: '15-25', cases: 20 },
      { group: '25-40', cases: 30 },
      { group: '40-60', cases: 22 },
      { group: '60+', cases: 28 }
    ],
    demographicsAfter: [
      { group: '0-5', cases: 20 },
      { group: '5-15', cases: 27 },
      { group: '15-25', cases: 18 },
      { group: '25-40', cases: 32 },
      { group: '40-60', cases: 25 },
      { group: '60+', cases: 30 }
    ]
  },
  Malaria: {
    mutationProbability: 8,
    sequencesAnalyzed: 708,
    alertLevel: 'watch',
    alertMessage: 'WATCH: Malaria chloroquine resistance markers detected in Nilgiris samples. Monitoring for spread pattern changes.',
    showAlert: true,
    demographicsBefore: [
      { group: '0-5', cases: 10 },
      { group: '5-15', cases: 14 },
      { group: '15-25', cases: 30 },
      { group: '25-40', cases: 42 },
      { group: '40-60', cases: 28 },
      { group: '60+', cases: 15 }
    ],
    demographicsAfter: [
      { group: '0-5', cases: 14 },
      { group: '5-15', cases: 22 },
      { group: '15-25', cases: 34 },
      { group: '25-40', cases: 38 },
      { group: '40-60', cases: 32 },
      { group: '60+', cases: 20 }
    ]
  }
};

// Generate 30-day case pattern data
const generate30DayCasePattern = (disease) => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
    const baseExpected = disease === 'Dengue' ? 35 : disease === 'Cholera' ? 18 : 12;
    const variance = Math.sin(i / 3) * 5;
    const expected = Math.round(baseExpected + variance);
    // Actual starts matching expected then deviates in last 10 days
    let actual;
    if (i > 10) {
      actual = Math.round(expected + (Math.random() * 6 - 3));
    } else {
      const deviationFactor = disease === 'Dengue' ? 1.4 : disease === 'Malaria' ? 1.2 : 1.05;
      actual = Math.round(expected * deviationFactor + (Math.random() * 5));
    }
    data.push({ date: dateStr, day: 30 - i, expected, actual });
  }
  return data;
};

// Historical variant events
const HISTORICAL_EVENTS = [
  { date: 'Mar 2024', disease: 'Dengue', event: 'DENV-2 serotype shift detected in Chennai metropolitan cluster', severity: 'high' },
  { date: 'Jan 2024', disease: 'Cholera', event: 'O1 El Tor biotype variation observed in delta region samples', severity: 'medium' },
  { date: 'Nov 2023', disease: 'Malaria', event: 'Plasmodium vivax drug resistance markers in Western Ghats region', severity: 'high' },
  { date: 'Aug 2023', disease: 'Dengue', event: 'Unusual DENV-3/4 co-circulation in Coimbatore district', severity: 'medium' },
  { date: 'May 2023', disease: 'Malaria', event: 'pfhrp2/3 deletion variants found in border region samples', severity: 'low' }
];

const GeneticDriftPage = () => {
  const [activeDisease, setActiveDisease] = useState('Dengue');

  const diseaseInfo = DISEASE_DATA[activeDisease];

  const casePatternData = useMemo(() => {
    return generate30DayCasePattern(activeDisease);
  }, [activeDisease]);

  const totalSequences = Object.values(DISEASE_DATA).reduce((s, d) => s + d.sequencesAnalyzed, 0);

  const getGaugeColor = (prob) => {
    if (prob > 10) return '#f43f5e';
    if (prob > 6) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
          <Dna size={24} style={{ color: '#a855f7' }} />
          Disease Genetic Drift Alert
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Monitoring case pattern deviations to detect potential variant emergence or serotype shifts
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-4" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <FileSearch size={20} style={{ color: '#a855f7', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{totalSequences.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sequences Analyzed</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <AlertTriangle size={20} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>3</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deviation Alerts</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <Clock size={20} style={{ color: '#06b6d4', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>6h ago</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Last Genome Update</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <Shield size={20} style={{ color: '#10b981', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>Active</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Surveillance Status</div>
        </div>
      </div>

      {/* Disease Tabs */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['Dengue', 'Cholera', 'Malaria'].map((disease) => (
            <button
              key={disease}
              className={`btn ${activeDisease === disease ? 'btn-primary' : ''}`}
              onClick={() => setActiveDisease(disease)}
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                borderRadius: '8px',
                background: activeDisease === disease ? undefined : 'var(--bg-card)',
                color: activeDisease === disease ? '#fff' : 'var(--text-secondary)',
                border: activeDisease === disease ? 'none' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer'
              }}
            >
              {disease}
            </button>
          ))}
        </div>

        {/* Mutation Probability Gauge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
              Mutation Probability
            </div>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={getGaugeColor(diseaseInfo.mutationProbability)}
                  strokeWidth="10"
                  strokeDasharray={`${(diseaseInfo.mutationProbability / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '28px',
                fontWeight: 700,
                color: getGaugeColor(diseaseInfo.mutationProbability)
              }}>
                {diseaseInfo.mutationProbability}%
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px' }}>
              {diseaseInfo.sequencesAnalyzed} sequences analyzed
            </div>
          </div>

          {/* Alert Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {diseaseInfo.showAlert && (
              <div style={{
                padding: '14px 16px',
                background: 'rgba(244, 63, 94, 0.08)',
                borderRadius: '8px',
                borderLeft: '4px solid #f43f5e',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertTriangle size={16} style={{ color: '#f43f5e', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {diseaseInfo.alertMessage}
                </div>
              </div>
            )}
            {!diseaseInfo.showAlert && (
              <div style={{
                padding: '14px 16px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '8px',
                borderLeft: '4px solid #10b981',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <Shield size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  No significant pattern deviation detected for {activeDisease}. Case distribution remains within expected parameters.
                </div>
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Alert threshold: deviation greater than 20% from expected pattern over 7 consecutive days
            </div>
          </div>
        </div>
      </div>

      {/* Case Pattern Deviation Chart */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: '#a855f7' }} />
          Case Pattern Deviation - {activeDisease} (30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={casePatternData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} interval={4} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
            <RechartsTooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
            <Legend />
            <Line type="monotone" dataKey="expected" stroke="#6366f1" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Expected" />
            <Line type="monotone" dataKey="actual" stroke="#f43f5e" strokeWidth={2} dot={false} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Demographics Shift */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', fontSize: '16px' }}>
          Affected Demographics Shift - {activeDisease}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase' }}>
              Before (Baseline Pattern)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={diseaseInfo.demographicsBefore} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="group" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <RechartsTooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="cases" fill="#6366f1" radius={[3, 3, 0, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase' }}>
              Current (Observed Shift)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={diseaseInfo.demographicsAfter} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="group" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <RechartsTooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="cases" fill="#f43f5e" radius={[3, 3, 0, 0]} name="Cases">
                  {diseaseInfo.demographicsAfter.map((entry, idx) => {
                    const before = diseaseInfo.demographicsBefore[idx]?.cases || 0;
                    const deviation = before > 0 ? ((entry.cases - before) / before) * 100 : 0;
                    return <Cell key={idx} fill={deviation > 20 ? '#f43f5e' : '#a855f7'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Variant Timeline */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} />
          Historical Variant Emergence Timeline
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {HISTORICAL_EVENTS.map((event, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                borderLeft: `3px solid ${event.severity === 'high' ? '#f43f5e' : event.severity === 'medium' ? '#f59e0b' : '#10b981'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{
                minWidth: '70px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}>
                {event.date}
              </div>
              <div style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                background: event.disease === 'Dengue' ? 'rgba(239, 68, 68, 0.15)' : event.disease === 'Cholera' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                color: event.disease === 'Dengue' ? '#ef4444' : event.disease === 'Cholera' ? '#3b82f6' : '#a855f7'
              }}>
                {event.disease}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1 }}>
                {event.event}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Info size={18} style={{ color: '#a855f7', marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Genomic Surveillance Integration
          </div>
          <div>Integrates with INSACOG genomic surveillance network (simulated)</div>
          <div>Analysis pipeline: Sample collection -{'>'} Sequencing -{'>'} Variant calling -{'>'} Pattern matching</div>
          <div>Deviation threshold: 20% shift from 90-day rolling baseline triggers automatic alert</div>
          <div>Data refresh: Every 6 hours from participating labs across Tamil Nadu</div>
        </div>
      </div>
    </div>
  );
};

export default GeneticDriftPage;

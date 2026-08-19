import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  AlertTriangle, Brain, CheckCircle2, Clock, Search, Shield,
  MapPin, Calendar, TrendingUp, FileWarning, XCircle, Eye,
  Lightbulb, Activity, History, ChevronRight
} from 'lucide-react';

const anomalies = [
  {
    id: 1,
    title: 'Dengue Case Spike — 340% Above Baseline',
    district: 'Chennai',
    timestamp: '2026-08-15T09:30:00',
    severity: 'high',
    status: 'pending',
    explanation: 'Chennai showed 340% spike in dengue cases on Aug 15. This is unusual because: (1) No corresponding rainfall increase, (2) Surrounding districts show normal levels, (3) Historical pattern suggests reporting artifact rather than true outbreak. Recommendation: Verify with district health officer.',
    rootCause: {
      primary: 'Batch Data Entry',
      confidence: 0.78,
      details: 'Analysis indicates that 47 cases were entered simultaneously at 09:28 AM from a single facility, suggesting accumulated backlog entry rather than sudden onset. The temporal distribution of symptom onset dates spans 12 days.',
      evidence: [
        'All 47 cases entered within 2-minute window',
        'Symptom onset dates range from Aug 3–15',
        'No increase in hospital admissions',
        'Neighboring districts (Kanchipuram, Tiruvallur) show stable trends'
      ]
    },
    contributingFactors: [
      { factor: 'Batch Entry Pattern', score: 85 },
      { factor: 'No Rainfall Correlation', score: 72 },
      { factor: 'Neighboring Stability', score: 68 },
      { factor: 'Single Source Report', score: 90 },
      { factor: 'Historical Seasonality Mismatch', score: 55 }
    ],
    similarPast: [
      { date: '2025-07-22', district: 'Chennai', outcome: 'Data Error', description: 'Similar batch entry from GH caused 280% spike' },
      { date: '2025-11-10', district: 'Coimbatore', outcome: 'Data Error', description: 'System migration caused duplicate entries' }
    ]
  },
  {
    id: 2,
    title: 'Cholera Cluster — 5 Cases in 48 Hours',
    district: 'Madurai',
    timestamp: '2026-08-17T14:15:00',
    severity: 'critical',
    status: 'pending',
    explanation: 'Madurai reported 5 confirmed cholera cases within 48 hours from the same ward (Ward 12, Sellur). This is significant because: (1) All cases share common water source, (2) Water quality index dropped to 38 (critical), (3) Matches classic point-source outbreak pattern. Recommendation: Immediate water source testing and boil-water advisory.',
    rootCause: {
      primary: 'Contaminated Water Source',
      confidence: 0.92,
      details: 'Epidemiological curve and geographic clustering strongly suggest point-source contamination. All 5 patients sourced drinking water from the Sellur overhead tank. WQI readings from Aug 16 show coliform levels 8x above safe limits.',
      evidence: [
        'All patients within 500m radius of Sellur tank',
        'WQI dropped from 72 to 38 on Aug 16',
        'Coliform count: 840 MPN/100ml (safe: <100)',
        'No cases from areas with alternate water supply'
      ]
    },
    contributingFactors: [
      { factor: 'Water Quality Drop', score: 95 },
      { factor: 'Geographic Clustering', score: 92 },
      { factor: 'Common Source Identified', score: 88 },
      { factor: 'Temporal Clustering', score: 80 },
      { factor: 'Season Risk', score: 45 }
    ],
    similarPast: [
      { date: '2025-08-05', district: 'Madurai', outcome: 'True Outbreak', description: 'Ward 8 cholera from contaminated bore well — 12 cases' },
      { date: '2026-03-18', district: 'Trichy', outcome: 'True Outbreak', description: 'Point-source cholera from damaged pipeline — 8 cases' }
    ]
  },
  {
    id: 3,
    title: 'Malaria Cases Outside Endemic Zone',
    district: 'Coimbatore',
    timestamp: '2026-08-16T11:00:00',
    severity: 'medium',
    status: 'explained',
    explanation: 'Coimbatore reported 3 malaria cases despite being a non-endemic zone. Investigation reveals: (1) All patients returned from Rameswaram trip 10 days prior, (2) Incubation period matches travel timeline, (3) No local vector breeding sites detected. Conclusion: Imported cases, not local transmission.',
    rootCause: {
      primary: 'Imported Cases (Travel)',
      confidence: 0.95,
      details: 'All three patients are family members who visited Rameswaram (endemic zone) from Aug 3–6. Symptom onset 10–12 days post-return aligns with P. vivax incubation. Local mosquito surveillance shows no Anopheles breeding sites within 2km.',
      evidence: [
        'Travel history confirmed for all 3 patients',
        'Incubation period consistent with P. vivax',
        'No Anopheles breeding sites in locality',
        'No secondary cases after 14 days'
      ]
    },
    contributingFactors: [
      { factor: 'Travel History Match', score: 98 },
      { factor: 'Incubation Period Fit', score: 92 },
      { factor: 'No Local Vectors', score: 85 },
      { factor: 'Family Cluster', score: 78 },
      { factor: 'No Secondary Cases', score: 70 }
    ],
    similarPast: [
      { date: '2025-09-14', district: 'Salem', outcome: 'Imported', description: 'Worker returned from Odisha with P. falciparum' },
      { date: '2026-01-20', district: 'Erode', outcome: 'Imported', description: 'Tourist group returned from Andaman with malaria' }
    ]
  },
  {
    id: 4,
    title: 'Sudden Drop in Dengue Reporting',
    district: 'Tiruvallur',
    timestamp: '2026-08-18T08:45:00',
    severity: 'medium',
    status: 'pending',
    explanation: 'Tiruvallur showed 0 dengue cases for 5 consecutive days despite active monsoon season and 23 cases the prior week. This is suspicious because: (1) Rainfall increased 40% this week, (2) Adjacent Chennai still reporting 8–12 cases/day, (3) Pattern suggests reporting gap rather than genuine decline. Recommendation: Check if district reporting system is operational.',
    rootCause: {
      primary: 'Reporting System Failure',
      confidence: 0.82,
      details: 'The district IDSP portal shows last successful data sync on Aug 13. IT team confirmed server maintenance was scheduled Aug 13–15 but extended due to hardware failure. Backlog entries expected once system resumes.',
      evidence: [
        'Last data sync: Aug 13 (5 days ago)',
        'Server maintenance extended beyond schedule',
        'Hospital OPD records show continued dengue visits',
        'PHC registers have 15 suspected cases not yet uploaded'
      ]
    },
    contributingFactors: [
      { factor: 'System Downtime', score: 90 },
      { factor: 'Adjacent District Activity', score: 75 },
      { factor: 'Monsoon Active', score: 70 },
      { factor: 'Prior Week High Cases', score: 65 },
      { factor: 'No Intervention Deployed', score: 60 }
    ],
    similarPast: [
      { date: '2025-06-08', district: 'Kanchipuram', outcome: 'System Error', description: 'IDSP portal down for 3 days caused reporting gap' },
      { date: '2026-02-28', district: 'Tiruvallur', outcome: 'System Error', description: 'Same district had 4-day gap during software update' }
    ]
  },
  {
    id: 5,
    title: 'Unusual Dengue-Malaria Co-occurrence',
    district: 'Thanjavur',
    timestamp: '2026-08-14T16:20:00',
    severity: 'high',
    status: 'resolved',
    explanation: 'Thanjavur reported simultaneous rise in both dengue (+180%) and malaria (+220%) cases. This dual spike is unusual because: (1) Different vectors (Aedes vs Anopheles) rarely peak together, (2) Heavy flooding on Aug 10–12 created stagnant water pools favoring both species, (3) Rice paddy irrigation season adds breeding sites. Conclusion: Flood-driven dual vector breeding event.',
    rootCause: {
      primary: 'Flood-Driven Vector Proliferation',
      confidence: 0.88,
      details: 'The Aug 10–12 flooding from Cauvery overflow created extensive stagnant water in both urban (Aedes habitat) and periurban/rural (Anopheles habitat) areas simultaneously. Entomological survey on Aug 14 found Breteau Index of 42 (critical >20) and Anopheles density 3x baseline.',
      evidence: [
        'Cauvery flooding Aug 10–12 confirmed by IMD',
        'Breteau Index: 42 (critical threshold: 20)',
        'Anopheles density 3x above baseline',
        'Both urban and rural breeding sites active',
        'Rice paddy standing water adds habitat'
      ]
    },
    contributingFactors: [
      { factor: 'Flood Event', score: 95 },
      { factor: 'Dual Vector Breeding', score: 88 },
      { factor: 'Rice Paddy Season', score: 72 },
      { factor: 'Urban Stagnation', score: 68 },
      { factor: 'Delayed Fogging Response', score: 55 }
    ],
    similarPast: [
      { date: '2024-11-25', district: 'Thanjavur', outcome: 'True Outbreak', description: 'NE monsoon flooding caused similar dual spike' },
      { date: '2025-08-30', district: 'Nagapattinam', outcome: 'True Outbreak', description: 'Cyclone aftermath dual vector surge' }
    ]
  }
];

const stats = [
  { label: 'Anomalies This Week', value: 12, icon: AlertTriangle, color: '#f59e0b' },
  { label: 'Explained', value: 8, icon: Brain, color: '#8b5cf6' },
  { label: 'Auto-Resolved', value: 5, icon: CheckCircle2, color: '#10b981' },
  { label: 'Pending Review', value: 4, icon: Clock, color: '#ef4444' }
];

const severityColors = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#10b981'
};

const statusLabels = {
  pending: { label: 'Pending Review', color: '#ef4444' },
  explained: { label: 'Explained', color: '#8b5cf6' },
  resolved: { label: 'Auto-Resolved', color: '#10b981' }
};

const barColors = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4'];

export default function AnomalyExplainPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomalies[0]);
  const [activeTab, setActiveTab] = useState('explanation');

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleAction = (action) => {
    alert(`Action: "${action}" applied to anomaly — "${selectedAnomaly.title}"`);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={32} style={{ color: '#8b5cf6' }} />
          AI Anomaly Explanation
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>
          Natural language explanations for detected anomalies with root cause analysis
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
        {/* Anomaly Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileWarning size={18} style={{ color: '#f59e0b' }} />
            Detected Anomalies
          </h3>
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="glass-card"
              onClick={() => { setSelectedAnomaly(anomaly); setActiveTab('explanation'); }}
              style={{
                padding: '16px',
                cursor: 'pointer',
                border: selectedAnomaly.id === anomaly.id ? '2px solid #8b5cf6' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: `${severityColors[anomaly.severity]}20`,
                  color: severityColors[anomaly.severity],
                  textTransform: 'uppercase'
                }}>
                  {anomaly.severity}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: `${statusLabels[anomaly.status].color}20`,
                  color: statusLabels[anomaly.status].color
                }}>
                  {statusLabels[anomaly.status].label}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                {anomaly.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {anomaly.district}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {formatTimestamp(anomaly.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tab Navigation */}
          <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
            {[
              { key: 'explanation', label: 'AI Explanation', icon: Brain },
              { key: 'rootcause', label: 'Root Cause', icon: Search },
              { key: 'factors', label: 'Contributing Factors', icon: Activity },
              { key: 'similar', label: 'Similar Past', icon: History }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: activeTab === tab.key ? '#8b5cf620' : 'transparent',
                  color: activeTab === tab.key ? '#8b5cf6' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* AI Explanation Tab */}
          {activeTab === 'explanation' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} style={{ color: '#8b5cf6' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{selectedAnomaly.title}</h3>
                  <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <MapPin size={12} /> {selectedAnomaly.district}
                    <Calendar size={12} style={{ marginLeft: '4px' }} /> {formatTimestamp(selectedAnomaly.timestamp)}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf610, #6366f110)',
                border: '1px solid #8b5cf630',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Lightbulb size={16} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>AI Explanation</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#e2e8f0' }}>
                  {selectedAnomaly.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Shield size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Confidence Score</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#1e293b' }}>
                  <div style={{
                    width: `${selectedAnomaly.rootCause.confidence * 100}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #8b5cf6, #6366f1)'
                  }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#8b5cf6' }}>
                  {(selectedAnomaly.rootCause.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Primary cause identified: <strong style={{ color: '#e2e8f0' }}>{selectedAnomaly.rootCause.primary}</strong>
              </p>
            </div>
          )}

          {/* Root Cause Tab */}
          {activeTab === 'rootcause' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={20} style={{ color: '#3b82f6' }} />
                Root Cause Analysis
              </h3>

              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: '#3b82f610',
                border: '1px solid #3b82f630',
                marginBottom: '20px'
              }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Primary Cause</span>
                  <span className="risk-badge" style={{ background: '#3b82f620', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                    {(selectedAnomaly.rootCause.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6', marginBottom: '8px' }}>
                  {selectedAnomaly.rootCause.primary}
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#cbd5e1' }}>
                  {selectedAnomaly.rootCause.details}
                </p>
              </div>

              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} style={{ color: '#10b981' }} />
                Supporting Evidence
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedAnomaly.rootCause.evidence.map((ev, idx) => (
                  <div key={idx} style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#10b98110',
                    border: '1px solid #10b98130',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px'
                  }}>
                    <ChevronRight size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contributing Factors Tab */}
          {activeTab === 'factors' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} style={{ color: '#6366f1' }} />
                Contributing Factors Analysis
              </h3>
              <div style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedAnomaly.contributingFactors}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                    <YAxis dataKey="factor" type="category" width={180} tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={{ stroke: '#334155' }} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                      formatter={(value) => [`${value}%`, 'Impact Score']}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={28}>
                      {selectedAnomaly.contributingFactors.map((_, idx) => (
                        <Cell key={idx} fill={barColors[idx % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: '#6366f110', border: '1px solid #6366f130' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                  <strong style={{ color: '#e2e8f0' }}>Interpretation:</strong> Higher scores indicate stronger contribution to the anomaly detection. Factors above 80% are considered primary drivers.
                </p>
              </div>
            </div>
          )}

          {/* Similar Past Tab */}
          {activeTab === 'similar' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} style={{ color: '#0ea5e9' }} />
                Similar Past Anomalies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedAnomaly.similarPast.map((past, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: '#0ea5e910',
                    border: '1px solid #0ea5e930'
                  }}>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{past.district}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: past.outcome === 'True Outbreak' ? '#ef444420' : past.outcome === 'Data Error' || past.outcome === 'System Error' ? '#f59e0b20' : '#10b98120',
                        color: past.outcome === 'True Outbreak' ? '#ef4444' : past.outcome === 'Data Error' || past.outcome === 'System Error' ? '#f59e0b' : '#10b981'
                      }}>
                        Outcome: {past.outcome}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#cbd5e1' }}>{past.description}</p>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {past.date}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: '#0ea5e910', border: '1px solid #0ea5e930' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                  <strong style={{ color: '#e2e8f0' }}>Pattern Match:</strong> Based on similar historical anomalies, the most likely outcome for the current anomaly is <strong style={{ color: '#0ea5e9' }}>{selectedAnomaly.rootCause.primary}</strong> with {(selectedAnomaly.rootCause.confidence * 100).toFixed(0)}% confidence.
                </p>
              </div>
            </div>
          )}

          {/* Resolution Actions */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} style={{ color: '#10b981' }} />
              Resolution Actions
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                className="btn btn-danger"
                onClick={() => handleAction('Confirm True Anomaly')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}
              >
                <AlertTriangle size={14} />
                Confirm True Anomaly
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleAction('Mark as Data Error')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}
              >
                <XCircle size={14} />
                Mark as Data Error
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAction('Investigate Further')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}
              >
                <Eye size={14} />
                Investigate Further
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleAction('Dismiss')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}
              >
                <CheckCircle2 size={14} />
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

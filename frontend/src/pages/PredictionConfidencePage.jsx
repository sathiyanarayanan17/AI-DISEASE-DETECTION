import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend, Area, AreaChart
} from 'recharts';
import {
  ShieldCheck, AlertTriangle, Target, Brain, MapPin,
  TrendingDown, Database, Clock, CheckCircle, Info,
  Activity, Eye, Layers
} from 'lucide-react';

const TN_DISTRICTS = [
  { name: 'Chennai', risk: 'High', confidence: 94, uncertainty: 3, history: 36 },
  { name: 'Coimbatore', risk: 'Medium', confidence: 91, uncertainty: 4, history: 36 },
  { name: 'Madurai', risk: 'High', confidence: 89, uncertainty: 5, history: 36 },
  { name: 'Tiruchirappalli', risk: 'Medium', confidence: 87, uncertainty: 5, history: 34 },
  { name: 'Salem', risk: 'Low', confidence: 85, uncertainty: 6, history: 33 },
  { name: 'Tirunelveli', risk: 'High', confidence: 92, uncertainty: 4, history: 36 },
  { name: 'Erode', risk: 'Low', confidence: 83, uncertainty: 6, history: 32 },
  { name: 'Vellore', risk: 'Medium', confidence: 88, uncertainty: 5, history: 35 },
  { name: 'Thoothukudi', risk: 'Medium', confidence: 86, uncertainty: 5, history: 34 },
  { name: 'Thanjavur', risk: 'High', confidence: 90, uncertainty: 4, history: 36 },
  { name: 'Dindigul', risk: 'Low', confidence: 79, uncertainty: 7, history: 30 },
  { name: 'Kanchipuram', risk: 'Medium', confidence: 91, uncertainty: 4, history: 36 },
  { name: 'Cuddalore', risk: 'High', confidence: 88, uncertainty: 5, history: 34 },
  { name: 'Nagapattinam', risk: 'High', confidence: 85, uncertainty: 6, history: 33 },
  { name: 'Viluppuram', risk: 'Medium', confidence: 82, uncertainty: 6, history: 31 },
  { name: 'Tiruvannamalai', risk: 'Low', confidence: 78, uncertainty: 7, history: 29 },
  { name: 'Namakkal', risk: 'Low', confidence: 76, uncertainty: 8, history: 28 },
  { name: 'Karur', risk: 'Low', confidence: 74, uncertainty: 8, history: 27 },
  { name: 'Sivagangai', risk: 'Medium', confidence: 81, uncertainty: 7, history: 30 },
  { name: 'Ramanathapuram', risk: 'High', confidence: 87, uncertainty: 5, history: 34 },
  { name: 'Virudhunagar', risk: 'Low', confidence: 77, uncertainty: 7, history: 29 },
  { name: 'Theni', risk: 'Low', confidence: 72, uncertainty: 9, history: 26 },
  { name: 'Perambalur', risk: 'Low', confidence: 68, uncertainty: 10, history: 24 },
  { name: 'Ariyalur', risk: 'Low', confidence: 65, uncertainty: 11, history: 22 },
  { name: 'Krishnagiri', risk: 'Medium', confidence: 80, uncertainty: 7, history: 30 },
  { name: 'Dharmapuri', risk: 'Low', confidence: 73, uncertainty: 8, history: 27 },
  { name: 'Tirupur', risk: 'Medium', confidence: 86, uncertainty: 5, history: 34 },
  { name: 'Kanyakumari', risk: 'Medium', confidence: 84, uncertainty: 6, history: 33 },
  { name: 'Nilgiris', risk: 'Low', confidence: 71, uncertainty: 9, history: 25 },
  { name: 'Pudukkottai', risk: 'Low', confidence: 75, uncertainty: 8, history: 28 },
  { name: 'Tiruvallur', risk: 'Medium', confidence: 90, uncertainty: 4, history: 36 },
  { name: 'Ranipet', risk: 'Low', confidence: 69, uncertainty: 10, history: 24 },
  { name: 'Tirupattur', risk: 'Low', confidence: 67, uncertainty: 10, history: 23 },
  { name: 'Tenkasi', risk: 'Medium', confidence: 78, uncertainty: 7, history: 29 },
  { name: 'Chengalpattu', risk: 'Medium', confidence: 89, uncertainty: 5, history: 35 },
  { name: 'Kallakurichi', risk: 'Low', confidence: 64, uncertainty: 11, history: 21 },
  { name: 'Mayiladuthurai', risk: 'Medium', confidence: 76, uncertainty: 8, history: 28 },
];

const confidenceBuckets = [
  { range: '50-60%', count: 0 },
  { range: '60-70%', count: TN_DISTRICTS.filter(d => d.confidence >= 60 && d.confidence < 70).length },
  { range: '70-80%', count: TN_DISTRICTS.filter(d => d.confidence >= 70 && d.confidence < 80).length },
  { range: '80-90%', count: TN_DISTRICTS.filter(d => d.confidence >= 80 && d.confidence < 90).length },
  { range: '90-100%', count: TN_DISTRICTS.filter(d => d.confidence >= 90 && d.confidence <= 100).length },
];

const temporalConfidenceData = [
  { day: 'Day 1', confidence: 95, upper: 97, lower: 93 },
  { day: 'Day 2', confidence: 92, upper: 95, lower: 89 },
  { day: 'Day 3', confidence: 87, upper: 91, lower: 83 },
  { day: 'Day 4', confidence: 81, upper: 86, lower: 76 },
  { day: 'Day 5', confidence: 74, upper: 80, lower: 68 },
  { day: 'Day 6', confidence: 66, upper: 73, lower: 59 },
  { day: 'Day 7', confidence: 58, upper: 66, lower: 50 },
];

const factorsData = [
  {
    factor: 'Data Freshness',
    icon: Clock,
    description: 'How recently data was collected from the district',
    impact: 'High',
    detail: 'Predictions degrade by ~3% per day of stale data'
  },
  {
    factor: 'Feature Completeness',
    icon: Layers,
    description: 'Percentage of required features available for prediction',
    impact: 'Critical',
    detail: 'Missing weather features reduce confidence by up to 15%'
  },
  {
    factor: 'District Data History',
    icon: Database,
    description: 'Length of historical training data available per district',
    impact: 'Medium',
    detail: 'Districts with <24 months history show 10-20% lower confidence'
  },
];

const getReliabilityRating = (confidence) => {
  if (confidence >= 90) return { label: 'Excellent', color: '#10b981' };
  if (confidence >= 80) return { label: 'Good', color: '#3b82f6' };
  if (confidence >= 70) return { label: 'Fair', color: '#f59e0b' };
  return { label: 'Low', color: '#ef4444' };
};

const getRiskColor = (risk) => {
  switch (risk) {
    case 'High': return '#ef4444';
    case 'Medium': return '#f59e0b';
    case 'Low': return '#10b981';
    default: return '#6b7280';
  }
};

const getBucketColor = (range) => {
  switch (range) {
    case '90-100%': return '#10b981';
    case '80-90%': return '#3b82f6';
    case '70-80%': return '#f59e0b';
    case '60-70%': return '#f97316';
    case '50-60%': return '#ef4444';
    default: return '#6b7280';
  }
};

export default function PredictionConfidencePage() {
  const [sortBy, setSortBy] = useState('confidence');
  const [sortOrder, setSortOrder] = useState('desc');

  const avgConfidence = (TN_DISTRICTS.reduce((s, d) => s + d.confidence, 0) / TN_DISTRICTS.length).toFixed(1);
  const highConfCount = TN_DISTRICTS.filter(d => d.confidence >= 85).length;
  const lowConfCount = TN_DISTRICTS.filter(d => d.confidence < 75).length;
  const certScore = ((avgConfidence / 100) * 0.7 + (highConfCount / TN_DISTRICTS.length) * 0.3).toFixed(2) * 100;

  const stats = [
    { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: Target, color: '#3b82f6' },
    { label: 'High Confidence Districts', value: highConfCount, icon: ShieldCheck, color: '#10b981' },
    { label: 'Low Confidence Areas', value: lowConfCount, icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Model Certainty Score', value: `${certScore.toFixed(0)}%`, icon: Brain, color: '#8b5cf6' },
  ];

  const sortedDistricts = [...TN_DISTRICTS].sort((a, b) => {
    const mult = sortOrder === 'desc' ? -1 : 1;
    if (sortBy === 'confidence') return mult * (a.confidence - b.confidence);
    if (sortBy === 'name') return mult * a.name.localeCompare(b.name);
    if (sortBy === 'uncertainty') return mult * (a.uncertainty - b.uncertainty);
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Eye size={32} style={{ color: '#8b5cf6' }} />
          Prediction Confidence Visualization
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>
          Understand model certainty across districts and forecast horizons
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{stat.label}</span>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Map + Histogram */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '24px' }}>
        {/* Confidence Grid Map */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} style={{ color: '#8b5cf6' }} />
            District Confidence Grid Map
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
            Higher confidence = sharper & more opaque. Lower confidence = blurry & faded.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px'
          }}>
            {TN_DISTRICTS.map((district, i) => {
              const opacity = 0.3 + (district.confidence / 100) * 0.7;
              const blur = district.confidence >= 85 ? 0 : (85 - district.confidence) * 0.15;
              const bgColor = getRiskColor(district.risk);
              return (
                <div
                  key={i}
                  title={`${district.name}: ${district.confidence}% confidence (${district.risk} risk)`}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    background: bgColor,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    textAlign: 'center',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#fff',
                    minHeight: '52px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ lineHeight: 1.2 }}>{district.name.slice(0, 6)}</span>
                  <span style={{ fontSize: '10px', marginTop: '2px' }}>{district.confidence}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px', opacity: 1 }}></span>
              High Conf (Sharp)
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px', opacity: 0.6 }}></span>
              Medium Conf
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px', opacity: 0.35, filter: 'blur(1px)' }}></span>
              Low Conf (Blurry)
            </span>
          </div>
        </div>

        {/* Confidence Distribution Histogram */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#3b82f6' }} />
            Confidence Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={confidenceBuckets} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="count" name="Districts" radius={[6, 6, 0, 0]}>
                {confidenceBuckets.map((entry, index) => (
                  <Cell key={index} fill={getBucketColor(entry.range)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p style={{ fontSize: '12px', color: '#93c5fd' }}>
              <Info size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {highConfCount} of {TN_DISTRICTS.length} districts have confidence ≥85% — predictions are highly reliable for these areas.
            </p>
          </div>
        </div>
      </div>

      {/* Temporal Confidence Degradation Chart */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} style={{ color: '#f59e0b' }} />
          Temporal Confidence Degradation
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
          Prediction confidence decreases as the forecast horizon extends further into the future
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={temporalConfidenceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis domain={[40, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(139,92,246,0.15)" name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="rgba(139,92,246,0.05)" name="Lower Bound" />
            <Line type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} name="Confidence %" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(16,185,129,0.15)', borderRadius: '12px', color: '#6ee7b7' }}>
            Day 1-2: Highly Reliable
          </span>
          <span style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(245,158,11,0.15)', borderRadius: '12px', color: '#fbbf24' }}>
            Day 3-5: Moderate
          </span>
          <span style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(239,68,68,0.15)', borderRadius: '12px', color: '#fca5a5' }}>
            Day 6-7: Use with Caution
          </span>
        </div>
      </div>

      {/* District Confidence Table */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} style={{ color: '#10b981' }} />
          District Confidence Table
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }} onClick={() => handleSort('name')}>
                  District {sortBy === 'name' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Risk Level</th>
                <th style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }} onClick={() => handleSort('confidence')}>
                  Confidence % {sortBy === 'confidence' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }} onClick={() => handleSort('uncertainty')}>
                  Uncertainty Band {sortBy === 'uncertainty' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Reliability Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedDistricts.map((district, i) => {
                const reliability = getReliabilityRating(district.confidence);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 500 }}>{district.name}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span className="risk-badge" style={{
                        background: `${getRiskColor(district.risk)}22`,
                        color: getRiskColor(district.risk),
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {district.risk}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div className="progress-bar-track" style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)' }}>
                          <div className="progress-bar-fill" style={{
                            width: `${district.confidence}%`,
                            height: '100%',
                            borderRadius: '3px',
                            background: reliability.color,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: reliability.color }}>{district.confidence}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
                      ±{district.uncertainty}%
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: `${reliability.color}22`,
                        color: reliability.color
                      }}>
                        {reliability.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Factors + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Factors Affecting Confidence */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: '#f59e0b' }} />
            Factors Affecting Confidence
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {factorsData.map((factor, i) => (
              <div key={i} style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <factor.icon size={16} style={{ color: '#f59e0b' }} />
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{factor.factor}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: factor.impact === 'Critical' ? 'rgba(239,68,68,0.15)' : factor.impact === 'High' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                    color: factor.impact === 'Critical' ? '#fca5a5' : factor.impact === 'High' ? '#fbbf24' : '#93c5fd',
                    fontWeight: 600
                  }}>
                    {factor.impact} Impact
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 26px' }}>{factor.description}</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 0 26px', fontStyle: 'italic' }}>{factor.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} style={{ color: '#10b981' }} />
            Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'rgba(239,68,68,0.08)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#fca5a5' }}>Priority Action</span>
              </div>
              <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>
                Collect more data for districts with &lt;80% confidence. Currently {TN_DISTRICTS.filter(d => d.confidence < 80).length} districts are below threshold:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {TN_DISTRICTS.filter(d => d.confidence < 80).map((d, i) => (
                  <span key={i} style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(239,68,68,0.15)', borderRadius: '8px', color: '#fca5a5' }}>
                    {d.name} ({d.confidence}%)
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'rgba(245,158,11,0.08)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Clock size={14} style={{ color: '#f59e0b' }} />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#fbbf24' }}>Improve Freshness</span>
              </div>
              <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>
                Increase data collection frequency for districts reporting weekly. Daily reporting improves confidence by ~8%.
              </p>
            </div>

            <div style={{ padding: '14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Database size={14} style={{ color: '#3b82f6' }} />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#93c5fd' }}>Extend History</span>
              </div>
              <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>
                Districts with &lt;24 months of historical data need retroactive data ingestion to train more robust models.
              </p>
            </div>

            <div style={{ padding: '14px', background: 'rgba(16,185,129,0.08)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Layers size={14} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#6ee7b7' }}>Feature Gaps</span>
              </div>
              <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>
                Add humidity sensors in {lowConfCount} districts lacking complete weather station data to fill feature gaps.
              </p>
            </div>

            <div style={{ padding: '14px', background: 'rgba(139,92,246,0.08)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <TrendingDown size={14} style={{ color: '#8b5cf6' }} />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#c4b5fd' }}>Forecast Horizon</span>
              </div>
              <p style={{ fontSize: '12px', color: '#e2e8f0', margin: 0 }}>
                Limit actionable decisions to 5-day forecasts. Beyond Day 5, confidence drops below 75% — use only for general preparedness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

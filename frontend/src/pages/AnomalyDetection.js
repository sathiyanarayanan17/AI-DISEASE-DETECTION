import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import RiskBadge from '../components/RiskBadge';
import { MOCK_DISTRICTS } from '../services/api';
import axios from 'axios';

function generateMockAnomalies() {
  const types = ['spike', 'unusual_pattern'];
  const severities = ['High', 'Medium', 'Low'];
  const descriptions = [
    'Sudden spike in dengue cases detected, 3x above 7-day rolling average',
    'Unusual correlation pattern between humidity and reported cases',
    'Temperature anomaly coinciding with case surge in neighboring districts',
    'Unexpected drop in cases followed by sharp rebound',
    'Case reporting rate anomaly detected in surveillance data',
    'Water-borne disease cluster identified outside monsoon season',
    'Vector density spike without corresponding weather change',
    'Cross-district spread pattern deviating from historical models',
    'Mortality rate anomaly in under-5 population segment',
    'Lab confirmation rate diverging from clinical case reports',
  ];
  const districts = ['Chennai', 'Madurai', 'Coimbatore', 'Salem', 'Tiruchirappalli', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Tirunelveli', 'Erode'];
  const anomalies = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    anomalies.push({
      id: i + 1,
      district: districts[i],
      date: d.toISOString().split('T')[0],
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: descriptions[i],
      score: Math.round(40 + Math.random() * 55),
    });
  }
  return anomalies.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateTimelineData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const isAnomaly = Math.random() < 0.15;
    data.push({
      date: d.toISOString().split('T')[0],
      day: d.getDate(),
      value: isAnomaly ? 70 + Math.random() * 30 : 20 + Math.random() * 30,
      isAnomaly,
    });
  }
  return data;
}

export default function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/analytics/anomalies');
        setAnomalies(response.data);
      } catch {
        setAnomalies(generateMockAnomalies());
      }
      setTimelineData(generateTimelineData());
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalAnomalies = anomalies.length;
  const districtsAffected = new Set(anomalies.map(a => a.district)).size;
  const lastAnomalyDate = anomalies.length > 0 ? anomalies[0].date : 'N/A';

  if (loading) {
    return (
      <div className="card">
        <div className="card-body" style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
          Loading anomaly data...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-wrap si-red">🚨</div>
          <div>
            <div className="stat-num">{totalAnomalies}</div>
            <div className="stat-lbl">Anomalies Detected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">🗺</div>
          <div>
            <div className="stat-num">{districtsAffected}</div>
            <div className="stat-lbl">Districts Affected</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">📅</div>
          <div>
            <div className="stat-num" style={{ fontSize: '1rem' }}>{lastAnomalyDate}</div>
            <div className="stat-lbl">Last Anomaly Date</div>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <h3 className="card-head-title">Anomaly Timeline (30 Days)</h3>
          <div style={{ display: 'flex', gap: 14, fontSize: '0.72rem', fontWeight: 600 }}>
            <span style={{ color: '#10b981' }}>Normal</span>
            <span style={{ color: '#ef4444' }}>Anomalous</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: '16px 16px 8px' }}>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" name="Day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="value" name="Score" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: '0.8rem' }}
                formatter={(value, name) => [value.toFixed(1), name === 'value' ? 'Risk Score' : name]}
              />
              <Scatter data={timelineData} dataKey="value">
                {timelineData.map((entry, i) => (
                  <Cell key={i} fill={entry.isAnomaly ? '#ef4444' : '#10b981'} r={entry.isAnomaly ? 8 : 5} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Cards */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Detected Anomalies</h3>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            {anomalies.map(a => (
              <div key={a.id} style={{
                background: '#f8fafc', borderRadius: 12, padding: 16,
                border: `1px solid ${a.severity === 'High' ? 'rgba(239,68,68,0.2)' : a.severity === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.06)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{a.district}</span>
                    <span style={{
                      marginLeft: 10, fontSize: '0.7rem', fontWeight: 600,
                      background: a.type === 'spike' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      color: a.type === 'spike' ? '#ef4444' : '#f59e0b',
                      padding: '2px 8px', borderRadius: 6,
                    }}>
                      {a.type === 'spike' ? 'Spike' : 'Unusual Pattern'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RiskBadge level={a.severity} />
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.date}</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

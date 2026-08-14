import React, { useState } from 'react';
import { MOCK_DISTRICTS } from '../services/api';

const DISTRICTS = MOCK_DISTRICTS.map(d => d.district);

function riskColor(level) {
  return level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
}

function getPreventionTips(level) {
  if (level === 'High') {
    return [
      'Avoid stagnant water areas near your home',
      'Use mosquito nets and repellents at all times',
      'Drink only boiled or purified water',
      'Seek medical attention for fever lasting more than 2 days',
      'Keep doors and windows closed during evening hours',
      'Report any unusual illness in your area to 104',
    ];
  }
  if (level === 'Medium') {
    return [
      'Use mosquito repellent, especially during dawn and dusk',
      'Clear any water containers around your home weekly',
      'Wash hands frequently with soap',
      'Eat freshly cooked food, avoid street food',
      'Keep your surroundings clean',
    ];
  }
  return [
    'Continue regular hygiene practices',
    'Keep your surroundings clean',
    'Ensure proper waste disposal',
    'Stay hydrated and eat nutritious food',
  ];
}

function getActionAdvice(level) {
  if (level === 'High') {
    return {
      title: 'Take Immediate Precautions',
      text: 'Your area is currently at high risk. Please follow all prevention guidelines strictly. If you or anyone in your family shows symptoms like fever, vomiting, or rash, visit the nearest hospital immediately. Do not ignore persistent fever.',
      urgency: 'urgent',
    };
  }
  if (level === 'Medium') {
    return {
      title: 'Stay Alert and Prepared',
      text: 'There is moderate disease risk in your area. Take preventive measures and monitor your health. Keep emergency numbers handy. If you notice unusual symptoms, consult a doctor early.',
      urgency: 'moderate',
    };
  }
  return {
    title: 'All Clear - Stay Healthy',
    text: 'Your area is currently at low risk. Continue your normal routine while maintaining basic hygiene. No special precautions needed at this time.',
    urgency: 'low',
  };
}

export default function PublicDashboard() {
  const [district, setDistrict] = useState('Chennai');
  const snap = MOCK_DISTRICTS.find(d => d.district === district) || MOCK_DISTRICTS[0];
  const tips = getPreventionTips(snap.risk_level);
  const advice = getActionAdvice(snap.risk_level);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* District Selector */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <label style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 10 }}>
          Check risk for your district
        </label>
        <select
          value={district}
          onChange={e => setDistrict(e.target.value)}
          style={{
            padding: '12px 20px', borderRadius: 12, border: '2px solid rgba(99,102,241,0.2)',
            fontSize: '1rem', color: '#1e293b', background: '#fff', outline: 'none',
            width: '100%', maxWidth: 360, fontWeight: 500,
          }}
        >
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Large Risk Display */}
      <div className="card" style={{ marginBottom: 28, textAlign: 'center' }}>
        <div className="card-body" style={{ padding: '40px 24px' }}>
          <div style={{
            width: 140, height: 140, borderRadius: '50%', margin: '0 auto 20px',
            background: riskColor(snap.risk_level) + '15',
            border: `5px solid ${riskColor(snap.risk_level)}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: riskColor(snap.risk_level) }}>
              {snap.risk_score}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: riskColor(snap.risk_level), textTransform: 'uppercase' }}>
              {snap.risk_level} Risk
            </div>
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
            {district}
          </h2>
          <p style={{ margin: 0, fontSize: '1rem', color: '#475569' }}>
            Disease outbreak risk level for today
          </p>
        </div>
      </div>

      {/* Three Card Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {/* Current Risk Card */}
        <div className="card">
          <div className="card-body" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>
              {snap.risk_level === 'High' ? '!' : snap.risk_level === 'Medium' ? '~' : 'OK'}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
              Current Risk
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: riskColor(snap.risk_level) }}>
              {snap.risk_level}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
              Score: {snap.risk_score}/100
            </div>
          </div>
        </div>

        {/* Weather Card */}
        <div className="card">
          <div className="card-body" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>--</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
              Weather
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569' }}>
              32C, Humid
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
              Rainfall expected this week
            </div>
          </div>
        </div>

        {/* Prevention Tips Card */}
        <div className="card">
          <div className="card-body" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>--</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
              Prevention
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              {tips[0]}
            </div>
          </div>
        </div>
      </div>

      {/* What Should I Do? */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-body" style={{ padding: 28 }}>
          <h3 style={{
            margin: '0 0 12px', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span></span> What should I do?
          </h3>
          <div style={{
            background: advice.urgency === 'urgent' ? 'rgba(239,68,68,0.05)' : advice.urgency === 'moderate' ? 'rgba(245,158,11,0.05)' : 'rgba(16,185,129,0.05)',
            borderRadius: 12, padding: 20,
            border: `1px solid ${advice.urgency === 'urgent' ? 'rgba(239,68,68,0.15)' : advice.urgency === 'moderate' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'}`,
          }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              {advice.title}
            </h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.92rem', color: '#475569', lineHeight: 1.7 }}>
              {advice.text}
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.88rem', color: '#475569', lineHeight: 2 }}>
              {tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="card">
        <div className="card-body" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            Emergency Contacts
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { number: '108', label: 'Emergency Ambulance', desc: 'Free ambulance service - available 24/7' },
              { number: '104', label: 'Health Helpline', desc: 'Medical advice and nearest hospital info' },
              { number: '1077', label: 'Disaster Helpline', desc: 'Tamil Nadu State Emergency Operations Center' },
            ].map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
                background: '#f8fafc', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%', background: 'rgba(99,102,241,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 900, color: '#6366f1', flexShrink: 0,
                }}>
                  {c.number}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{c.label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
            For nearest district hospital, call 104 and provide your location
          </p>
        </div>
      </div>
    </div>
  );
}

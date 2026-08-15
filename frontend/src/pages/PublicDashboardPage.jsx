import React, { useState } from 'react';
import {
  Eye,
  ShieldAlert,
  PhoneCall,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  HelpCircle,
  Activity
} from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

export const PublicDashboardPage = () => {
  const [selectedDistrictName, setSelectedDistrictName] = useState('Chennai');
  const district = getDistrictByName(selectedDistrictName);

  const getCircleColor = (level) => {
    if (level === 'high') return '#f43f5e';
    if (level === 'medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 1. Header & District Switcher */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
            <Eye size={14} />
            <span>Public Health Information Portal</span>
          </div>
          <h1 style={{ fontSize: '26px' }}>Tamil Nadu Citizen Health & Outbreak Status</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Check real-time vector disease risk in your home district and access verified health safety guidelines.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Select Your District:</span>
          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            className="input-control input-select"
            style={{ width: '220px', fontWeight: 700, fontSize: '14px' }}
          >
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.name}>{d.name} ({d.tamilName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Giant Colored Risk Circle Centerpiece */}
      <div
        className="glass-card"
        style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '18px',
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: `2px solid ${getCircleColor(district.riskLevel)}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} className="text-indigo-400" />
          <h2 style={{ fontSize: '22px' }}>{district.name} District ({district.tamilName})</h2>
        </div>

        {/* Big Circular Gauge */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: `6px solid ${getCircleColor(district.riskLevel)}`,
            boxShadow: `0 0 35px ${getCircleColor(district.riskLevel)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-input)'
          }}
        >
          <div style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: getCircleColor(district.riskLevel), lineHeight: 1 }}>
            {district.riskScore}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
            Risk Index
          </div>
        </div>

        <RiskBadge level={district.riskLevel} score={district.riskScore} size="lg" />

        <p style={{ maxWidth: '600px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {district.riskLevel === 'high'
            ? `High vector activity detected in ${district.name} following recent precipitation of ${district.weather.rainfall}mm. Please empty standing water in your neighborhood and monitor family members for sudden fever.`
            : `Nominal vector conditions reported in ${district.name}. Maintain standard domestic water hygiene and cover water storage barrels.`}
        </p>
      </div>

      {/* 3. Simple 3-Card Citizen Action Layout */}
      <div className="grid-cols-3">
        {/* Card 1: What is the Threat? */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} className="text-amber-400" />
            <h3 style={{ fontSize: '16px' }}>Current Local Threat</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Active 7-Day Case Count: <strong>{district.totalCases7d} cases</strong> ({district.dengueCases} Dengue, {district.choleraCases} Cholera).
          </p>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
            Weather: {district.weather.temperature}°C with {district.weather.humidity}% humidity accelerating mosquito life cycles.
          </div>
        </div>

        {/* Card 2: What Should I Do Right Now? */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} className="text-emerald-400" />
            <h3 style={{ fontSize: '16px' }}>What Should You Do?</h3>
          </div>
          <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Empty flowerpot trays &amp; discarded tires weekly.</li>
            <li>Drink only boiled and filtered drinking water.</li>
            <li>Use mosquito repellent creams at dawn and dusk.</li>
            <li>Consult a doctor immediately if fever persists &gt;24 hours.</li>
          </ul>
        </div>

        {/* Card 3: Free Telemedicine & Support */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PhoneCall size={20} className="text-cyan-400" />
            <h3 style={{ fontSize: '16px' }}>Free Telemedicine</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Tamil Nadu residents can speak directly to government doctors 24/7 at zero cost for fever consultations.
          </p>
          <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Dial Toll-Free:</span>
            <strong style={{ fontSize: '18px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>104</strong>
          </div>
        </div>
      </div>

      {/* 4. Emergency Contacts Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Emergency Ambulance</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>108</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TN Health Telemedicine</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>104</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>State Health Control Room</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>044-29510400</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mental Health Support</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>14416</div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboardPage;

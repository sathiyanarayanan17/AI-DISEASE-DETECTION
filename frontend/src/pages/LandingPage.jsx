import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  ArrowRight,
  Cpu,
  MapPin,
  TrendingUp,
  Sliders,
  Bell,
  Building2,
  FileText,
  Lock,
  Globe,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Moon,
  LogIn,
  User,
  Search
} from 'lucide-react';
import { DISTRICTS_DATA, getHighRiskDistricts } from '../data/districtsData';
import Sparkline from '../components/common/Sparkline';
import RiskBadge from '../components/common/RiskBadge';
import LiveTicker from '../components/layout/LiveTicker';
import FloatingStatusWidget from '../components/common/FloatingStatusWidget';

export const LandingPage = () => {
  const highRisk = getHighRiskDistricts();
  const topDistricts = DISTRICTS_DATA.slice(0, 6);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('light-theme');
  };

  const stats = [
    { label: "Districts Monitored", value: "37", sub: "100% Tamil Nadu Coverage" },
    { label: "XGBoost F1-Score", value: "97.2%", sub: "Validated on 1.48M Records" },
    { label: "Inference Latency", value: "14.8ms", sub: "Real-time Telemetry Pipeline" },
    { label: "Surveillance Active", value: "24/7", sub: "Continuous Early Warning" }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Geospatial Outbreak Heatmaps",
      desc: "Live Leaflet mapping of 37 Tamil Nadu districts with color-coded risk markers and epidemiological telemetry.",
      color: "text-indigo-400"
    },
    {
      icon: Cpu,
      title: "XGBoost Machine Learning",
      desc: "Ensemble classification engine correlating rainfall, humidity, diurnal temperature, and 14-day case lag.",
      color: "text-cyan-400"
    },
    {
      icon: Sliders,
      title: "What-If Climate Simulators",
      desc: "Interactive multi-variable stress-testing adjusting precipitation and humidity to simulate localized outbreaks.",
      color: "text-amber-400"
    },
    {
      icon: Bell,
      title: "Multi-Channel Alert Dispatch",
      desc: "Instant automated warning broadcasts via Web Speech Audio TTS, SMS gateway, and interactive WhatsApp bot.",
      color: "text-rose-400"
    },
    {
      icon: Building2,
      title: "Hospital & Bed Surveillance",
      desc: "Direct monitoring of tertiary medical college ICU bed capacities, isolation units, and oxygen plant status.",
      color: "text-emerald-400"
    },
    {
      icon: FileText,
      title: "Clinical Report Generation",
      desc: "One-click generation of comprehensive epidemiological audit summaries and printable surveillance PDF dossiers.",
      color: "text-purple-400"
    }
  ];

  const techStack = [
    "React 18",
    "FastAPI Python",
    "XGBoost 2.0",
    "Leaflet Maps",
    "Recharts Engine",
    "Web Speech API",
    "PostgreSQL",
    "Docker Containerized"
  ];

  return (
    <div className="app-container grid-bg" style={{ display: 'block', overflow: 'auto', height: '100vh' }}>
      
      {/* TOP NAVBAR */}
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '12px 32px',
        borderBottom: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 16px rgba(99,102,241,0.3)'
          }}>VS</div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>VyaadhiShield</span>
          <span style={{
            fontSize: '0.58rem', background: 'var(--accent-primary)', color: '#fff',
            padding: '2px 7px', borderRadius: 4, fontWeight: 700
          }}>AI</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '24px', marginLeft: '40px' }}>
          {[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Alerts', to: '/alerts' },
            { label: 'Analytics', to: '/analytics' },
            { label: 'Forecast', to: '/forecast' },
            { label: 'Districts', to: '/ranking' },
          ].map(item => (
            <Link key={item.label} to={item.to} style={{
              fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500,
              textDecoration: 'none', transition: 'color 0.2s'
            }}>{item.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-input)', border: '1px solid var(--border-base)',
            borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', color: 'var(--text-muted)',
            cursor: 'pointer', minWidth: 160
          }}>
            <Search size={14} />
            <span>Search districts...</span>
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-base)',
            borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', color: 'var(--text-secondary)'
          }}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <button style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-base)',
            borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', color: 'var(--text-secondary)',
            position: 'relative'
          }}>
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 14, height: 14, borderRadius: '50%',
              background: 'var(--risk-high)', color: '#fff',
              fontSize: '0.55rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{highRisk.length}</span>
          </button>

          {/* Login Button */}
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-input)', border: '1px solid var(--border-base)',
            borderRadius: 8, padding: '7px 14px',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)',
            textDecoration: 'none', transition: 'all 0.2s'
          }}>
            <User size={14} />
            <span>Login</span>
          </Link>

          {/* CTA */}
          <Link to="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--accent-primary)', border: 'none',
            borderRadius: 8, padding: '8px 16px',
            fontSize: '0.78rem', fontWeight: 700, color: '#fff',
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>
            <Activity size={14} />
            <span>Go to App</span>
          </Link>
        </div>
      </nav>

      {/* Live District Ticker */}
      <LiveTicker />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 32px' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: '40px',
          alignItems: 'center',
          minHeight: '75vh',
          paddingTop: '20px'
        }}
        className="grid-cols-2"
      >
        {/* Left Column: Headline & Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
            <span className="risk-badge high" style={{ fontSize: '11px', padding: '4px 12px' }}>
              <span className="pulse-dot high" />
              <span>TN DPH EARLY WARNING ACTIVE</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              fontWeight: 800
            }}
          >
            Predict Disease Outbreaks{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Before They Happen
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '580px' }}>
            VyaadhiShield AI is Tamil Nadu's state-of-the-art epidemiological intelligence platform. Powered by high-accuracy XGBoost ML models (97.2% F1 score), it continuously forecasts Dengue, Cholera, and Malaria vector surges across all 37 districts.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', paddingTop: '8px' }}>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              <Activity size={18} />
              <span>Launch Surveillance Dashboard</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/public" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '14px' }}>
              <Globe size={16} />
              <span>Public Citizen Portal</span>
            </Link>
          </div>

          {/* Key Stat Counters */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-base)'
            }}
          >
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Floating Data Cards Matrix */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Floating Status Card */}
          <div className="glass-card floating-card" style={{ padding: '20px', border: '1px solid var(--border-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot high" />
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Chennai Coastal Surveillance</span>
              </div>
              <RiskBadge level="high" score={88} size="sm" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Cases</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>142</div>
                <Sparkline data={[80, 95, 110, 105, 120, 134, 142]} width={60} height={20} color="#f43f5e" />
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rainfall (mm)</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-cyan)' }}>42.5</div>
                <Sparkline data={[10, 15, 28, 35, 40, 38, 42.5]} width={60} height={20} color="#06b6d4" />
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ML Confidence</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-emerald)' }}>98.4%</div>
                <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 600 }}>Optimal</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
              <strong>AI Action: </strong>Emergency vector fumigation across coastal wards (Tondiarpet, Royapuram).
            </div>
          </div>

          {/* Mini District Status Grid */}
          <div className="glass-card floating-card-slow" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Active District Telemetry
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>Sync 14.8ms</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {topDistricts.map((d) => (
                <Link
                  key={d.id}
                  to={`/district/${d.name.toLowerCase()}`}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    border: '1px solid var(--border-subtle)'
                  }}
                  className="hover:border-slate-600"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{d.name}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: d.riskLevel === 'high' ? 'var(--risk-high)' : 'var(--risk-medium)' }}>
                      {d.riskScore}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {d.totalCases7d} cases (7d)
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAMIL NADU SURVEILLANCE OVERVIEW */}
      <section className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Activity size={15} />
              <span>Statewide Epidemiological Intelligence</span>
            </div>
            <h2 style={{ fontSize: '24px' }}>37 District Surveillance Grid</h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="risk-badge high">High Risk: {highRisk.length}</span>
            <span className="risk-badge medium">Medium: 18</span>
            <span className="risk-badge low">Low: 10</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {DISTRICTS_DATA.slice(0, 12).map((dist) => (
            <Link
              key={dist.id}
              to={`/district/${dist.name.toLowerCase()}`}
              className="glass-card interactive"
              style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{dist.name}</span>
                <RiskBadge level={dist.riskLevel} score={dist.riskScore} size="sm" />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dist.tamilName}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>7d Cases: {dist.totalCases7d}</span>
                <span>Rain: {dist.weather.rainfall}mm</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SIX CORE FEATURES GRID */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Designed for Rapid Public Health Action</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            End-to-end telemetry from raw IMD meteorological sensors to district hospital emergency resource dispatch.
          </p>
        </div>

        <div className="grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-base)'
                  }}
                >
                  <Icon size={20} className={f.color} />
                </div>
                <h3 style={{ fontSize: '16px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TECH STACK PILLS */}
      <section className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.06em' }}>
          Production Grade Architecture
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-base)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIAL & ENDORSEMENT */}
      <section
        className="glass-card"
        style={{
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(15, 22, 41, 0.9), rgba(10, 17, 34, 0.95))',
          borderLeft: '4px solid var(--accent-primary)'
        }}
      >
        <blockquote style={{ fontSize: '16px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
          "VyaadhiShield AI gives our epidemiologists a 7-day predictive window before vector counts translate into clinical hospital admissions. The precision in rainfall correlation has reduced emergency response latency by over 60%."
        </blockquote>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}
          >
            TN
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Directorate of Public Health and Preventive Medicine</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Government of Tamil Nadu, Chennai</div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer
        style={{
          borderTop: '1px solid var(--border-base)',
          paddingTop: '28px',
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} className="text-indigo-400" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>VyaadhiShield AI</span>
          <span>(TN Health Surveillance Platform)</span>
        </div>
        <div>
          Official Public Health Portal for Tamil Nadu, India. All rights reserved.
        </div>
      </footer>
      </div>

      {/* Floating Status Widget */}
      <FloatingStatusWidget />
    </div>
  );
};

export default LandingPage;

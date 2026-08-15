import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingCard({ children, style, delay = 0 }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: 20,
      backdropFilter: 'blur(10px)',
      animation: `floatCard 6s ease-in-out infinite ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

function MiniChart({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 120;
    const y = 40 - ((v - min) / range) * 35;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="120" height="45" style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,45 ${points} 120,45`} fill={`${color}15`} stroke="none" />
    </svg>
  );
}

function PulsingDot({ color, size = 8 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, boxShadow: `0 0 ${size}px ${color}`, animation: 'livePulse 1.4s infinite' }} />
  );
}

export default function LandingPage() {
  const nav = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const mockRiskData = [45, 52, 48, 61, 73, 68, 82, 78, 85, 72, 65, 58];
  const mockCasesData = [12, 18, 15, 22, 28, 35, 42, 38, 31, 25, 20, 16];
  const mockWeatherData = [20, 35, 28, 45, 62, 58, 72, 85, 78, 55, 40, 30];

  return (
    <div style={{ background: '#040812', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative' }}>

      {/* Background floating orbs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '50%', right: '30%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)', animation: 'float3 12s ease-in-out infinite' }} />
        {/* Grid lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>VS</div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em' }}>VyaadhiShield</span>
          <span style={{ fontSize: '0.6rem', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 6, fontWeight: 600, marginLeft: 4 }}>v2.0</span>
        </div>
        <div style={{ display: 'flex', gap: 28, marginLeft: 48 }}>
          {['Features', 'Analytics', 'Districts', 'About'].map(item => (
            <span key={item} style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500 }}>{item}</span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PulsingDot color="#10b981" size={6} />
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>LIVE</span>
          </div>
          <button onClick={() => nav('/dashboard')} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 8, padding: '8px 20px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            Open Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section - Two Column */}
      <section style={{ position: 'relative', zIndex: 5, display: 'flex', padding: '70px 32px 40px', maxWidth: '100%', margin: '0 auto', alignItems: 'center', minHeight: '80vh' }}>
        
        {/* Left - Text */}
        <div style={{ flex: '0 0 45%', paddingRight: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20 }}>
            <PulsingDot color="#10b981" />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#34d399', letterSpacing: '0.06em' }}>Monitoring 37 Districts</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 20 }}>
            Predict Disease<br />
            Outbreaks Before<br />
            They{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Happen.
            </span>
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.8, marginBottom: 32, maxWidth: 480 }}>
            AI-powered early warning system for Tamil Nadu. Predicts dengue, cholera, 
            and malaria outbreaks using XGBoost ML on government health and weather data 
            with 97.2% accuracy.
          </p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 40 }}>
            <button onClick={() => nav('/dashboard')} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, padding: '13px 28px', color: '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.3)', transition: 'transform 0.2s' }}>
              Launch Dashboard
            </button>
            <button onClick={() => nav('/public')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '13px 28px', color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              Public View
            </button>
          </div>

          {/* Stats inline */}
          <div style={{ display: 'flex', gap: 36 }}>
            {[
              { num: '97.2%', label: 'Accuracy' },
              { num: '37', label: 'Districts' },
              { num: '<10ms', label: 'Latency' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{s.num}</div>
                <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 500, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Floating Dashboard Cards */}
        <div style={{ flex: '1', position: 'relative', minHeight: 520 }}>
          
          {/* Card 1 - Risk Score */}
          <FloatingCard style={{ position: 'absolute', top: '0%', right: '5%', width: 220 }} delay={0}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Risk Score - Chennai</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fca5a5', marginBottom: 4 }}>78</div>
            <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>HIGH RISK</div>
            <div style={{ marginTop: 12 }}>
              <MiniChart data={mockRiskData} color="#ef4444" />
            </div>
          </FloatingCard>

          {/* Card 2 - Cases Trend */}
          <FloatingCard style={{ position: 'absolute', top: '10%', left: '5%', width: 200 }} delay={1}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Daily Cases</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>142</div>
            <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: 2 }}>-12% vs last week</div>
            <div style={{ marginTop: 10 }}>
              <MiniChart data={mockCasesData} color="#10b981" />
            </div>
          </FloatingCard>

          {/* Card 3 - Weather */}
          <FloatingCard style={{ position: 'absolute', top: '40%', right: '0%', width: 180 }} delay={0.5}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Rainfall (mm)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>85.2</div>
            <div style={{ fontSize: '0.68rem', color: '#f59e0b', marginTop: 2 }}>Monsoon Active</div>
            <div style={{ marginTop: 10 }}>
              <MiniChart data={mockWeatherData} color="#3b82f6" />
            </div>
          </FloatingCard>

          {/* Card 4 - Alert */}
          <FloatingCard style={{ position: 'absolute', top: '50%', left: '10%', width: 210 }} delay={1.5}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <PulsingDot color="#ef4444" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fca5a5' }}>ALERT</span>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>Outbreak Predicted</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 }}>Chennai - Dengue risk elevated. 82% probability in 5 days.</div>
          </FloatingCard>

          {/* Card 5 - Model */}
          <FloatingCard style={{ position: 'absolute', bottom: '5%', right: '10%', width: 190 }} delay={2}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Model Performance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a5b4fc' }}>97.2</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>% F1</span>
            </div>
            <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '97.2%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 2 }} />
            </div>
          </FloatingCard>

          {/* Card 6 - Live Clock */}
          <FloatingCard style={{ position: 'absolute', top: '25%', left: '35%', width: 160, textAlign: 'center' }} delay={0.8}>
            <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Live Time</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums' }}>
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </FloatingCard>

          {/* Card 7 - Districts Active */}
          <FloatingCard style={{ position: 'absolute', bottom: '15%', left: '0%', width: 170 }} delay={2.5}>
            <div style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Districts Online</div>
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {Array.from({length: 37}).map((_, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: 2, background: i < 12 ? '#ef4444' : i < 24 ? '#f59e0b' : '#10b981', opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 6 }}>37/37 connected</div>
          </FloatingCard>

          {/* Connection lines SVG */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3 }}>
            <line x1="110" y1="85" x2="180" y2="150" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="240" y1="50" x2="210" y2="140" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="180" y1="200" x2="220" y2="240" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
      </section>

      {/* Live Ticker Bar */}
      <div style={{ position: 'relative', zIndex: 5, overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '10px 0', marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 48, animation: 'scroll 30s linear infinite', whiteSpace: 'nowrap' }}>
          {['Chennai: HIGH (78)', 'Madurai: MEDIUM (52)', 'Coimbatore: LOW (28)', 'Tiruchirappalli: MEDIUM (45)', 'Salem: LOW (22)', 'Tirunelveli: HIGH (71)', 'Vellore: MEDIUM (48)', 'Thanjavur: LOW (31)', 'Thoothukudi: HIGH (82)', 'Cuddalore: MEDIUM (55)', 'Nagapattinam: HIGH (74)', 'Nilgiris: LOW (15)'].map((item, i) => {
            const isHigh = item.includes('HIGH');
            const isMed = item.includes('MEDIUM');
            return (
              <span key={i} style={{ fontSize: '0.72rem', fontWeight: 600, color: isHigh ? '#fca5a5' : isMed ? '#fcd34d' : '#6ee7b7' }}>
                {item}
              </span>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <section style={{ position: 'relative', zIndex: 5, padding: '60px 32px 80px', maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Complete Disease Surveillance Platform
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
            Everything a District Health Officer needs to prevent outbreaks and save lives.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { title: 'XGBoost + LightGBM', desc: 'Ensemble of 3 models with SMOTE balancing. Trained on 39,000+ records across 3 years of data.', color: '#6366f1' },
            { title: 'Real-Time WebSocket', desc: 'Live weather ingestion every 60 seconds. Instant predictions pushed to all connected clients.', color: '#10b981' },
            { title: 'SHAP Explainability', desc: 'Every prediction explained with feature contributions. Healthcare AI must be interpretable.', color: '#f59e0b' },
            { title: '7-Day Forecasting', desc: 'Predicts outbreak probability for the next week with confidence bands and trend analysis.', color: '#06b6d4' },
            { title: 'What-If Simulator', desc: 'Adjust rainfall, temperature, humidity sliders and see how risk changes instantly.', color: '#8b5cf6' },
            { title: 'SMS + Voice Alerts', desc: 'Automated notifications via SMS, WhatsApp, and text-to-speech for accessibility.', color: '#ef4444' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, transition: 'all 0.3s' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, boxShadow: `0 0 10px ${f.color}`, marginBottom: 14 }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>{f.title}</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tamil Nadu Banner */}
      <section style={{ position: 'relative', zIndex: 5, padding: '60px 32px', maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '6px 14px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 20 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800 }}>TN</div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fb923c' }}>Tamil Nadu Government</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.03em' }}>
              Protecting 80M+ Citizens
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7, marginBottom: 20 }}>
              From Chennai metropolis to Nilgiris hills, from Kanyakumari coast to Krishnagiri plains - 
              every district, every disease, every day. Built for IDSP/IHIP integration.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['11 Coastal', '6 Urban', '1 Hill', '37 Total'].map(d => (
                <div key={d} style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{d}</div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Dengue', status: 'Active Watch', color: '#f59e0b' },
              { label: 'Cholera', status: 'Monitored', color: '#3b82f6' },
              { label: 'Malaria', status: 'Seasonal Alert', color: '#10b981' },
              { label: 'Outbreaks', status: '3 Predicted', color: '#ef4444' },
            ].map(d => (
              <div key={d.label} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color, margin: '0 auto 8px', boxShadow: `0 0 8px ${d.color}` }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>{d.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 3 }}>{d.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ position: 'relative', zIndex: 5, padding: '40px 48px 60px', maxWidth: 1300, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Built With</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {['XGBoost', 'LightGBM', 'FastAPI', 'React', 'SHAP', 'WebSocket', 'Leaflet', 'Recharts'].map(t => (
            <span key={t} style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, padding: '6px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 5, padding: '32px 48px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.72rem', color: '#334155' }}>
          VyaadhiShield AI - Smart India Hackathon 2024 - Tamil Nadu
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['GitHub', 'API Docs', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '0.72rem', color: '#475569', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px, 30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px, -20px); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px, -25px); } }
        @keyframes floatCard { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes livePulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

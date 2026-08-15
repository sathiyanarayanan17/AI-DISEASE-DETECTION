import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div style={{ background: '#040812', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      
      {/* Floating background elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', animation: 'float3 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: 2, height: 2, background: '#6366f1', borderRadius: '50%', boxShadow: '0 0 4px #6366f1', animation: 'twinkle 3s infinite' }} />
        <div style={{ position: 'absolute', top: '15%', left: '80%', width: 2, height: 2, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 4px #10b981', animation: 'twinkle 4s infinite 1s' }} />
        <div style={{ position: 'absolute', top: '60%', left: '25%', width: 2, height: 2, background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 4px #f59e0b', animation: 'twinkle 5s infinite 2s' }} />
        <div style={{ position: 'absolute', top: '75%', right: '20%', width: 2, height: 2, background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 4px #ef4444', animation: 'twinkle 3.5s infinite 0.5s' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>EA</div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em' }}>EarlyAlert</span>
        </div>
        <div style={{ display: 'flex', gap: 32, marginLeft: 48 }}>
          {['Features', 'Analytics', 'Districts', 'About'].map(item => (
            <span key={item} style={{ fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }}>{item}</span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer' }}>Login</span>
          <button onClick={() => nav('/dashboard')} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 8, padding: '8px 20px', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            Open Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 5, padding: '100px 48px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'livePulse 1.4s infinite' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Monitoring Active</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 24, maxWidth: 800 }}>
          Predict Disease<br />
          Outbreaks Before<br />
          They{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Happen.
          </span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.7, maxWidth: 580, marginBottom: 40 }}>
          AI-powered early warning system monitoring 37 Tamil Nadu districts in real-time. 
          Using XGBoost ML on IDSP + IMD government data to predict dengue, cholera, and malaria 
          outbreaks with 97.2% accuracy.
        </p>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 48 }}>
          <button onClick={() => nav('/dashboard')} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, padding: '14px 32px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.3)', transition: 'transform 0.2s' }}>
            Launch Dashboard
          </button>
          <button onClick={() => nav('/public')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 32px', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            Public View
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48, marginBottom: 80 }}>
          {[
            { num: '37', label: 'Districts Monitored' },
            { num: '97.2%', label: 'Model Accuracy' },
            { num: '3', label: 'Diseases Tracked' },
            { num: '< 10ms', label: 'Prediction Speed' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9' }}>{s.num}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards - Floating Bento Grid */}
      <section style={{ position: 'relative', zIndex: 5, padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 40, letterSpacing: '-0.03em' }}>
          Powered by Advanced AI
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { title: 'XGBoost Ensemble', desc: '600-tree gradient boosting with LightGBM + Random Forest voting. Trained on 39,000+ data points across 3 years.', color: '#6366f1' },
            { title: 'Real-Time Prediction', desc: 'WebSocket-based live weather ingestion. Predicts risk for all 37 districts in under 10ms per request.', color: '#10b981' },
            { title: 'SHAP Explainability', desc: 'Every prediction explained. Know exactly why a district is flagged - rainfall, humidity, case trends, or seasonal patterns.', color: '#f59e0b' },
            { title: '7-Day Forecasting', desc: 'Not just current risk - predicts outbreak probability for the next 7 days with confidence intervals.', color: '#06b6d4' },
            { title: 'Anomaly Detection', desc: 'Automatically detects unusual disease spikes that deviate from seasonal norms. Alerts before outbreaks escalate.', color: '#ef4444' },
            { title: 'Government Data', desc: 'Built on IDSP (disease surveillance) + IMD (weather) data patterns. Ready for IHIP integration.', color: '#8b5cf6' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, transition: 'all 0.3s', cursor: 'default' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, boxShadow: `0 0 12px ${f.color}`, marginBottom: 16 }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: '#f1f5f9' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tamil Nadu Section */}
      <section style={{ position: 'relative', zIndex: 5, padding: '60px 48px 80px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '8px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 30 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>TN</div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>Government of Tamil Nadu Initiative</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>
          Protecting 80 Million People
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Covering all 37 districts of Tamil Nadu - from Chennai to Kanyakumari, 
          Nilgiris to Ramanathapuram. Urban, coastal, and hill regions all monitored 24/7.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {[
            { label: 'Dengue', val: 'Monitored', color: '#f59e0b' },
            { label: 'Cholera', val: 'Monitored', color: '#3b82f6' },
            { label: 'Malaria', val: 'Monitored', color: '#10b981' },
            { label: 'Outbreaks', val: 'Predicted', color: '#ef4444' },
          ].map(d => (
            <div key={d.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 16px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, margin: '0 auto 10px', boxShadow: `0 0 8px ${d.color}` }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{d.val}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: 4 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial / Quote */}
      <section style={{ position: 'relative', zIndex: 5, padding: '60px 48px', maxWidth: 1200, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, fontStyle: 'italic', color: '#e2e8f0', marginBottom: 16 }}>
          "Life-saving technology"
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Designed for District Health Officers, State Health Departments, and Public Health Researchers.
          Built for Smart India Hackathon (SIH) - MedTech Theme.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 5, padding: '40px 48px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: '#334155' }}>
          EarlyAlert AI - Smart India Hackathon 2024
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['GitHub', 'API Docs', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '0.75rem', color: '#475569', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px, 30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px, -20px); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px, -25px); } }
        @keyframes twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes livePulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
      `}</style>
    </div>
  );
}

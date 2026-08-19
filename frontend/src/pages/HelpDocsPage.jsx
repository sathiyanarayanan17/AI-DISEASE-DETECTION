import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Server,
  Cpu,
  Monitor,
  Database,
  Mail,
  Phone,
  Keyboard,
  Rocket,
  ArrowRight,
  Globe,
  Activity,
  Shield,
  AlertTriangle,
  BarChart3,
  Zap
} from 'lucide-react';

const quickStartSteps = [
  { step: 1, title: 'Install Dependencies', description: 'Run pip install for Python packages and npm install for frontend dependencies.' },
  { step: 2, title: 'Run the ML Pipeline', description: 'Execute python run_pipeline.py to generate data, train models, and produce SHAP explainability plots.' },
  { step: 3, title: 'Start the Backend', description: 'Navigate to backend/ and run uvicorn main:app --reload --port 8000 to launch the FastAPI server.' },
  { step: 4, title: 'Start the Frontend', description: 'Navigate to frontend/ and run npm start to launch the React dashboard on port 3000.' },
  { step: 5, title: 'Monitor Predictions', description: 'Open the Dashboard to view real-time risk levels, alerts, and district-level predictions across Tamil Nadu.' },
  { step: 6, title: 'Review Alerts & Analytics', description: 'Use the Alerts page for critical notifications and Analytics for model performance insights.' }
];

const faqItems = [
  {
    question: 'How does VyaadhiShield AI make predictions?',
    answer: 'VyaadhiShield uses a stacking ensemble of XGBoost and LightGBM models trained on historical weather (IMD) and disease surveillance (IDSP) data. The model analyzes 25+ engineered features including rolling averages, lag features, seasonal indicators, and geographic factors to classify outbreak risk as Low, Medium, or High.'
  },
  {
    question: 'What data sources are used?',
    answer: 'Two primary government data sources are used: India Meteorological Department (IMD) for daily rainfall, temperature, and humidity data per district; and Integrated Disease Surveillance Programme (IDSP) for daily cholera, dengue, and malaria case counts. These are merged at the district + date level for feature engineering.'
  },
  {
    question: 'How are alerts triggered?',
    answer: 'Alerts are triggered based on the ML model\'s risk classification. High-risk alerts activate when predicted case counts exceed the district\'s 85th percentile or when an accelerating outbreak trend is detected. Medium-risk alerts trigger between the 50th and 85th percentile or when a rising trend is identified.'
  },
  {
    question: 'How do I interpret risk scores?',
    answer: 'Risk scores range from 0 to 100. Scores below 40 indicate Low risk (routine surveillance). Scores between 40-70 indicate Medium risk (enhanced monitoring recommended). Scores above 70 indicate High risk (rapid response deployment needed). The confidence value indicates how certain the model is about its prediction.'
  },
  {
    question: 'What is SHAP explainability and why does it matter?',
    answer: 'SHAP (SHapley Additive exPlanations) provides transparent reasoning for each prediction. It shows which features contributed most to a risk classification — for example, high humidity + elevated 7-day rolling cases + active monsoon season. This builds trust with health officials and satisfies healthcare AI explainability guidelines.'
  },
  {
    question: 'How often are predictions updated?',
    answer: 'The real-time monitor updates every 30 seconds via WebSocket connections. Batch predictions for all 37 Tamil Nadu districts are refreshed every time new weather data is ingested. Historical trends are computed daily for the dashboard overview.'
  },
  {
    question: 'Can I add new districts or states?',
    answer: 'Yes. The architecture is designed for scalability. To add new districts, update the data generation pipeline with new district metadata (coastal/urban/hill flags, coordinates) and retrain the model. The system supports Phase 2 expansion to Kerala, Karnataka, AP, and Telangana.'
  },
  {
    question: 'What model accuracy does VyaadhiShield achieve?',
    answer: 'The Optuna-tuned XGBoost model achieves ~91% F1 (macro) and ~0.96 ROC-AUC. The stacking ensemble reaches ~92% F1 and ~0.97 ROC-AUC. These metrics are validated using time-based splits to prevent data leakage, with 5-fold cross-validation for reliable estimates.'
  }
];

const apiEndpoints = [
  { method: 'GET', path: '/health', description: 'Service health check and model status' },
  { method: 'GET', path: '/predict', description: 'Single prediction with district, date, and weather params' },
  { method: 'POST', path: '/predict/batch', description: 'Batch predictions for multiple districts' },
  { method: 'GET', path: '/alerts', description: 'All Medium + High risk district alerts' },
  { method: 'GET', path: '/alerts/high', description: 'High risk alerts only' },
  { method: 'GET', path: '/history', description: 'Historical time-series for a district' },
  { method: 'GET', path: '/analytics/metrics', description: 'Model F1, AUC, and accuracy metrics' },
  { method: 'GET', path: '/analytics/features', description: 'Feature importance rankings' },
  { method: 'GET', path: '/analytics/trends', description: 'Disease trends over time' },
  { method: 'WS', path: '/ws', description: 'WebSocket real-time updates stream' }
];

const keyboardShortcuts = [
  { keys: 'Ctrl + K', action: 'Open search' },
  { keys: 'Ctrl + D', action: 'Go to Dashboard' },
  { keys: 'Ctrl + A', action: 'Go to Alerts' },
  { keys: 'Ctrl + R', action: 'Go to Real-Time Monitor' },
  { keys: 'Ctrl + M', action: 'Go to Analytics' },
  { keys: 'Esc', action: 'Close modal / dialog' },
  { keys: 'Ctrl + Shift + T', action: 'Toggle dark/light theme' },
  { keys: '?', action: 'Open this Help page' }
];

function getMethodColor(method) {
  switch (method) {
    case 'GET': return '#2ECC71';
    case 'POST': return '#3498DB';
    case 'WS': return '#9B59B6';
    default: return '#95A5A6';
  }
}

export default function HelpDocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEndpoints = apiEndpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={32} />
          Help & Documentation
        </h1>
        <p style={{ color: 'var(--text-secondary, #A0AEC0)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
          Everything you need to know about the VyaadhiShield AI Early Warning System
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary, #A0AEC0)' }} />
          <input
            type="text"
            placeholder="Search documentation, FAQs, API endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 3rem',
              background: 'var(--bg-input)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Rocket size={24} />
          Quick Start Guide
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quickStartSteps.map((item) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                minWidth: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3498DB, #2ECC71)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '0.9rem'
              }}>
                {item.step}
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={24} />
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {filteredFaq.map((item, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-input)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{item.question}</span>
                {expandedFaq === index ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {expandedFaq === index && (
                <div style={{ padding: '0 1.25rem 1rem 1.25rem', color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
          {filteredFaq.length === 0 && (
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', textAlign: 'center', padding: '1rem' }}>
              No matching FAQs found for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* API Reference */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Server size={24} />
          API Reference
        </h2>
        <p style={{ color: 'var(--text-secondary, #A0AEC0)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Base URL: <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#3498DB' }}>http://localhost:8000</code>
        </p>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {filteredEndpoints.map((ep, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                background: 'var(--bg-input)',
                borderRadius: '0.6rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <span style={{
                background: getMethodColor(ep.method),
                color: '#fff',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                minWidth: '48px',
                textAlign: 'center'
              }}>
                {ep.method}
              </span>
              <code style={{ color: '#E8D44D', fontSize: '0.9rem', minWidth: '200px' }}>{ep.path}</code>
              <span style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.85rem' }}>{ep.description}</span>
            </div>
          ))}
          {filteredEndpoints.length === 0 && (
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', textAlign: 'center', padding: '1rem' }}>
              No matching endpoints found for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Cpu size={24} />
          System Architecture
        </h2>
        <div style={{
          background: 'var(--bg-input)',
          borderRadius: '0.75rem',
          padding: '2rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          overflowX: 'auto',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <pre style={{ margin: 0, lineHeight: 1.8 }}>
{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                        VyaadhiShield AI Architecture                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐     ┌──────────────────┐     ┌────────────────┐              │
│  │  IMD Weather │     │  Feature Engine   │     │   XGBoost      │              │
│  │  (Rainfall,  │────►│  25+ Features     │────►│   Ensemble     │              │
│  │   Temp, Hum) │     │  Rolling/Lag/Geo  │     │   (Optuna)     │              │
│  └──────────────┘     └──────────────────┘     └───────┬────────┘              │
│                                                         │                       │
│  ┌──────────────┐                                       ▼                       │
│  │  IDSP Cases  │     ┌──────────────────┐     ┌────────────────┐              │
│  │  (Cholera,   │────►│  Preprocessing   │     │   FastAPI       │              │
│  │   Dengue,    │     │  + SMOTE Balance │     │   Backend       │──────┐      │
│  │   Malaria)   │     └──────────────────┘     │   + WebSocket   │      │      │
│  └──────────────┘                               └────────────────┘      │      │
│                                                                          ▼      │
│                                                                 ┌─────────────┐ │
│                                                                 │   React 18  │ │
│                                                                 │   Dashboard │ │
│                         ┌──────────────┐                        │  + Leaflet  │ │
│                         │  SHAP        │                        │  + Recharts │ │
│                         │  Explainer   │───────────────────────►│  + WebSocket│ │
│                         └──────────────┘                        └─────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Data Flow:  IMD + IDSP  ──►  Feature Engineering  ──►  ML Model  ──►  API  ──►  Dashboard
                                                          │
                                                          ▼
                                                    SHAP Explanations`}
          </pre>
        </div>
        <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: '#3498DB' }} />
            <span style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.85rem' }}>Data Layer: IMD + IDSP APIs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} style={{ color: '#E67E22' }} />
            <span style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.85rem' }}>ML Layer: XGBoost + SHAP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={18} style={{ color: '#2ECC71' }} />
            <span style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.85rem' }}>API Layer: FastAPI + WS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={18} style={{ color: '#9B59B6' }} />
            <span style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.85rem' }}>UI Layer: React + Leaflet</span>
          </div>
        </div>
      </div>

      {/* Contact / Support Section */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Shield size={24} />
          Contact & Support
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Mail size={20} style={{ color: '#3498DB' }} />
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Email Support</h4>
            </div>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>General Inquiries:</p>
            <p style={{ color: '#3498DB', fontSize: '0.9rem' }}>support@vyaadhishield.gov.in</p>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginTop: '0.6rem', marginBottom: '0.4rem' }}>Technical Support:</p>
            <p style={{ color: '#3498DB', fontSize: '0.9rem' }}>tech@vyaadhishield.gov.in</p>
          </div>
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Phone size={20} style={{ color: '#2ECC71' }} />
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Helpline Numbers</h4>
            </div>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>24/7 Disease Alert Helpline:</p>
            <p style={{ color: '#2ECC71', fontSize: '0.9rem', fontWeight: 600 }}>1800-XXX-XXXX (Toll Free)</p>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginTop: '0.6rem', marginBottom: '0.4rem' }}>IDSP Control Room:</p>
            <p style={{ color: '#2ECC71', fontSize: '0.9rem', fontWeight: 600 }}>011-2306-1469</p>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginTop: '0.6rem', marginBottom: '0.4rem' }}>State Health Dept (Tamil Nadu):</p>
            <p style={{ color: '#2ECC71', fontSize: '0.9rem', fontWeight: 600 }}>044-2852-6900</p>
          </div>
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Globe size={20} style={{ color: '#9B59B6' }} />
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Online Resources</h4>
            </div>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>IDSP Portal:</p>
            <p style={{ color: '#9B59B6', fontSize: '0.9rem' }}>https://idsp.nic.in</p>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginTop: '0.6rem', marginBottom: '0.4rem' }}>IMD Weather Data:</p>
            <p style={{ color: '#9B59B6', fontSize: '0.9rem' }}>https://mausam.imd.gov.in</p>
            <p style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem', marginTop: '0.6rem', marginBottom: '0.4rem' }}>API Documentation:</p>
            <p style={{ color: '#9B59B6', fontSize: '0.9rem' }}>http://localhost:8000/docs</p>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Keyboard size={24} />
          Keyboard Shortcuts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {keyboardShortcuts.map((shortcut, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-input)',
                borderRadius: '0.6rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <span style={{ color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.9rem' }}>{shortcut.action}</span>
              <kbd style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                fontWeight: 600
              }}>
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary, #A0AEC0)', fontSize: '0.85rem' }}>
        <p>VyaadhiShield AI — Built for Smart India Hackathon 2024 | MedTech / HealthTech Theme</p>
        <p style={{ marginTop: '0.3rem', opacity: 0.7 }}>Protecting Tamil Nadu's 37 districts with AI-powered disease outbreak prediction</p>
      </div>
    </div>
  );
}

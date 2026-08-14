import React, { useState } from 'react';

const DOCKER_COMPOSE = `version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/earlyalert
      - REDIS_URL=redis://redis:6379
      - MODEL_PATH=/app/models/latest.pkl
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=earlyalert
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  celery:
    build: ./backend
    command: celery -A tasks worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/earlyalert
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - db

volumes:
  pgdata:`;

const ENV_VARS = [
  { name: 'DATABASE_URL', description: 'PostgreSQL connection string', example: 'postgresql://user:pass@localhost:5432/earlyalert', required: true },
  { name: 'REDIS_URL', description: 'Redis connection for caching and task queue', example: 'redis://localhost:6379', required: true },
  { name: 'MODEL_PATH', description: 'Path to trained ML model file', example: '/app/models/latest.pkl', required: true },
  { name: 'SENDGRID_API_KEY', description: 'SendGrid API key for email alerts', example: 'SG.xxxxx', required: false },
  { name: 'TWILIO_SID', description: 'Twilio account SID for SMS/WhatsApp', example: 'ACxxxxx', required: false },
  { name: 'JWT_SECRET', description: 'Secret key for JWT token signing', example: 'your-secret-key-here', required: true },
  { name: 'CORS_ORIGINS', description: 'Allowed CORS origins (comma separated)', example: 'http://localhost:3000', required: false },
  { name: 'LOG_LEVEL', description: 'Application log level', example: 'INFO', required: false },
];

const CHECKLIST_ITEMS = [
  'Docker and Docker Compose installed',
  'Environment variables configured in .env file',
  'ML model file available at MODEL_PATH',
  'PostgreSQL data directory backed up',
  'SSL certificates configured for production',
  'Domain DNS records pointing to server',
  'Firewall rules allow ports 80, 443, 8000',
  'Health check endpoint responding correctly',
  'Monitoring and alerting configured (Prometheus/Grafana)',
  'Backup strategy documented and tested',
];

const CLOUD_PROVIDERS = [
  {
    name: 'AWS',
    icon: '',
    services: ['ECS Fargate', 'RDS PostgreSQL', 'ElastiCache', 'S3', 'CloudFront'],
    estimatedCost: 'Rs 8,000 - 15,000/month',
    pros: ['Best ML/AI integration', 'SES for email', 'India regions available'],
  },
  {
    name: 'GCP',
    icon: '',
    services: ['Cloud Run', 'Cloud SQL', 'Memorystore', 'GCS', 'Cloud CDN'],
    estimatedCost: 'Rs 7,000 - 12,000/month',
    pros: ['Free tier generous', 'BigQuery for analytics', 'Vertex AI integration'],
  },
  {
    name: 'Azure',
    icon: '',
    services: ['Container Apps', 'Azure DB', 'Azure Cache', 'Blob Storage', 'Azure CDN'],
    estimatedCost: 'Rs 9,000 - 16,000/month',
    pros: ['Government compliance', 'Azure ML Studio', 'India data residency'],
  },
];

export default function DockerDeploy() {
  const [checklist, setChecklist] = useState(() => CHECKLIST_ITEMS.map(() => false));
  const [copied, setCopied] = useState(false);

  const toggleCheck = (index) => {
    setChecklist(prev => prev.map((v, i) => i === index ? !v : v));
  };

  const copyDockerCompose = () => {
    navigator.clipboard.writeText(DOCKER_COMPOSE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const completedCount = checklist.filter(Boolean).length;

  return (
    <div>
      {/* Status Badge */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text1)', margin: 0 }}>Deployment Guide</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)', margin: '4px 0 0' }}>Docker-based deployment for EarlyAlert system</p>
          </div>
          <span className="badge badge-low" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            Ready for Production
          </span>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">System Architecture</h3>
        </div>
        <div className="card-body">
          <pre style={{
            background: 'var(--bg-card2)',
            padding: 20,
            borderRadius: 10,
            border: '1px solid var(--border)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            overflowX: 'auto',
            fontFamily: 'monospace',
            color: 'var(--text1)',
          }}>
{`
    +------------------+         +------------------+
    |   React Frontend |         |   Nginx (SSL)    |
    |   Port 3000      | <-----> |   Port 80/443    |
    +------------------+         +------------------+
              |
              v
    +------------------+         +------------------+
    |   FastAPI Backend | <-----> |   Redis Cache    |
    |   Port 8000      |         |   Port 6379      |
    +------------------+         +------------------+
         |         |
         v         v
    +----------+  +------------------+
    | PostgreSQL|  | Celery Workers   |
    | Port 5432 |  | (Background Jobs)|
    +----------+  +------------------+
         |
         v
    +------------------+
    | ML Model Store   |
    | (XGBoost + LSTM) |
    +------------------+
`}
          </pre>
        </div>
      </div>

      {/* Docker Compose */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">docker-compose.yml</h3>
          <button className="btn-detail" onClick={copyDockerCompose}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="card-body">
          <pre style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: 20,
            borderRadius: 10,
            fontSize: '0.74rem',
            lineHeight: 1.7,
            overflowX: 'auto',
            fontFamily: 'monospace',
          }}>
            {DOCKER_COMPOSE}
          </pre>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Environment Variables</h3>
        </div>
        <div className="card-body">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Description</th>
                  <th>Example</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                {ENV_VARS.map(v => (
                  <tr key={v.name}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }}>{v.name}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{v.description}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text3)' }}>{v.example}</td>
                    <td>
                      {v.required ? (
                        <span className="badge badge-high">Required</span>
                      ) : (
                        <span className="badge badge-low">Optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deployment Checklist */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Deployment Checklist</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600 }}>
            {completedCount}/{CHECKLIST_ITEMS.length} completed
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: 8 }}>
            {CHECKLIST_ITEMS.map((item, i) => (
              <label
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 8,
                  background: checklist[i] ? 'var(--green-bg)' : 'var(--bg-card2)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={checklist[i]}
                  onChange={() => toggleCheck(i)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{
                  fontSize: '0.82rem',
                  color: checklist[i] ? '#059669' : 'var(--text2)',
                  fontWeight: checklist[i] ? 600 : 400,
                  textDecoration: checklist[i] ? 'line-through' : 'none',
                }}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud Provider Comparison */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Cloud Provider Comparison</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {CLOUD_PROVIDERS.map(provider => (
              <div key={provider.name} style={{
                padding: 20, background: 'var(--bg-card2)',
                borderRadius: 12, border: '1px solid var(--border)',
              }}>
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>{provider.icon}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text1)' }}>{provider.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>
                    {provider.estimatedCost}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>Services</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {provider.services.map(s => (
                      <span key={s} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.08)', color: 'var(--accent)', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>Advantages</div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: '0.76rem', color: 'var(--text2)', lineHeight: 1.8 }}>
                    {provider.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

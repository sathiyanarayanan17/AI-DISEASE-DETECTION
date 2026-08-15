import React, { useState } from 'react';
import {
  Server,
  Copy,
  Check,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  Cloud
} from 'lucide-react';
import { useAlerts } from '../context/AlertContext';

export const DockerDeployPage = () => {
  const { addToast } = useAlerts();
  const [copied, setCopied] = useState(false);

  const dockerComposeCode = `version: '3.8'

services:
  # 1. Frontend Client
  vyaadhishield-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - vyaadhishield-backend
    restart: always

  # 2. FastAPI ML Backend
  vyaadhishield-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DB_URL=postgresql://vyaadhi_admin:secure_pass@postgres-db:5432/vyaadhi_tn
      - XGBOOST_MODEL_PATH=/app/models/xgboost_v2.4.2.json
      - REDIS_URL=redis://redis-cache:6379/0
      - MSG91_AUTH_KEY=\${MSG91_AUTH_KEY}
    depends_on:
      - postgres-db
      - redis-cache
    restart: always

  # 3. PostgreSQL Database
  postgres-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=vyaadhi_admin
      - POSTGRES_PASSWORD=secure_pass
      - POSTGRES_DB=vyaadhi_tn
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

  # 4. Redis Cache & WebSocket Broker
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: always

volumes:
  pgdata:
    driver: local`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(dockerComposeCode);
    setCopied(true);
    addToast("Copied to Clipboard", "docker-compose.yml configuration copied.");
    setTimeout(() => setCopied(false), 2000);
  };

  const envVars = [
    { name: "VITE_API_URL", default: "http://localhost:8000", desc: "Endpoint for FastAPI microservice" },
    { name: "DB_URL", default: "postgresql://...:5432/vyaadhi_tn", desc: "PostgreSQL telemetry & audit database" },
    { name: "XGBOOST_MODEL_PATH", default: "/app/models/xgboost_v2.4.2.json", desc: "Trained XGBoost model weights" },
    { name: "MSG91_AUTH_KEY", default: "secret_token", desc: "SMS Telephony Gateway API key" },
    { name: "WHATSAPP_TOKEN", default: "eaab_webhook_token", desc: "Meta Cloud WhatsApp Business token" },
    { name: "JWT_SECRET", default: "random_256bit_key", desc: "Role-based auth encryption token" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={24} className="text-cyan-400" />
            <span>Production Docker Container Deployment</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            High-availability deployment architecture for State Data Center (ELCOT / SDC) infrastructure.
          </p>
        </div>
      </div>

      {/* 2. docker-compose.yml Block */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} className="text-indigo-400" />
            <strong style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>docker-compose.yml</strong>
          </div>
          <button onClick={handleCopyCode} className="btn btn-secondary text-xs">
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre
          style={{
            background: 'var(--bg-input)',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            overflowX: 'auto',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            border: '1px solid var(--border-subtle)'
          }}
        >
          {dockerComposeCode}
        </pre>
      </div>

      {/* 3. Environment Variables Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Environment Variables Configuration</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Variable Name</th>
                <th>Sample / Default Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {envVars.map((v, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {v.name}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {v.default}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {v.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Deployment Pre-flight Checklist */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Production Pre-Flight Verification Checklist</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="grid-cols-2">
          <div style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={16} className="text-emerald-400" />
            <span style={{ fontSize: '13px' }}>SSL/TLS Certificates provisioned via Nginx Reverse Proxy</span>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={16} className="text-emerald-400" />
            <span style={{ fontSize: '13px' }}>PostgreSQL hourly automated snapshot volume attached</span>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={16} className="text-emerald-400" />
            <span style={{ fontSize: '13px' }}>IMD Doppler radar API token configured and validated</span>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={16} className="text-emerald-400" />
            <span style={{ fontSize: '13px' }}>MSG91 DLT Entity ID approved for state health alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerDeployPage;

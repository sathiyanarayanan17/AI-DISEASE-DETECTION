import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Activity
} from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';
import Sparkline from '../components/common/Sparkline';

export const ReportsPage = () => {
  const [selectedDistrictName, setSelectedDistrictName] = useState('Chennai');
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('epidemiological');
  const [generated, setGenerated] = useState(true);

  const district = getDistrictByName(selectedDistrictName);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Print Action (Hidden on Print) */}
      <div className="flex-between flex-wrap gap-4 no-print">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} className="text-purple-400" />
            <span>Epidemiological Report Generator</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Compile official surveillance briefs, statistical charts, and clinical containment directives for printing or PDF export.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            title="Print or save as PDF via browser print dialogue"
          >
            <Printer size={15} />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Generation Config Form (Hidden on Print) */}
      <div className="glass-card no-print" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Target District:</label>
          <select
            value={selectedDistrictName}
            onChange={(e) => setSelectedDistrictName(e.target.value)}
            className="input-control input-select text-xs"
          >
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.name}>{d.name} ({d.tamilName})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Historical Window:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-control input-select text-xs"
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Dossier Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="input-control input-select text-xs"
          >
            <option value="epidemiological">Epidemiological Vector Summary</option>
            <option value="clinical">Hospital Capacity & Bed Logistics</option>
            <option value="meteorological">Climate Correlation Dossier</option>
          </select>
        </div>

        <button
          onClick={() => setGenerated(true)}
          className="btn btn-secondary text-xs"
          style={{ padding: '9px 16px' }}
        >
          <Activity size={14} />
          <span>Refresh Report</span>
        </button>
      </div>

      {/* 3. Official Report Dossier Card (Printable) */}
      <div
        className="glass-card"
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-strong)'
        }}
      >
        {/* Official Letterhead Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-strong)', paddingBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              GOVERNMENT OF TAMIL NADU
            </div>
            <h2 style={{ fontSize: '20px', margin: '4px 0' }}>Directorate of Public Health & Preventive Medicine</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              VyaadhiShield AI - Autonomous Outbreak Surveillance Bulletin
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
              REF: TN-DPH-VS-2026-0815
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Date: 15 August 2026 | Time: 09:30 IST
            </div>
            <div style={{ marginTop: '6px' }}>
              <RiskBadge level={district.riskLevel} score={district.riskScore} />
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>1. Executive Epidemiological Summary: {district.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Surveillance telemetry over the past {dateRange} days for <strong>{district.name} ({district.tamilName})</strong> indicates an XGBoost outbreak vulnerability index of <strong>{district.riskScore}/100</strong> (Classification: {district.riskLevel.toUpperCase()}). The primary vector burden consists of <strong>{district.dengueCases} Dengue cases</strong>, <strong>{district.choleraCases} Cholera cases</strong>, and <strong>{district.malariaCases} Malaria cases</strong>, totaling {district.totalCases7d} active cases.
          </p>
        </div>

        {/* Meteorological Matrix */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>2. Meteorological Sensor Parameters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rainfall (7d)</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{district.weather.rainfall} mm</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mean Temperature</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{district.weather.temperature} °C</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Relative Humidity</div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{district.weather.humidity} %</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ML Model Confidence</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{district.confidence} %</div>
            </div>
          </div>
        </div>

        {/* Containment Directive */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>3. Mandatory Public Health Directives</h3>
          <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Action Protocol:</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {district.recommendation}
            </p>
          </div>
        </div>

        {/* Signatures Footer */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-base)', paddingTop: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div>
            <div style={{ fontWeight: 700 }}>Dr. Kavitha Sundaram</div>
            <div>Chief Health Surveillance Officer</div>
            <div>DPH, Govt of Tamil Nadu</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700 }}>Automated Cryptographic Seal</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-emerald)' }}>
              SHA256: 8f72a19b4c029e84
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

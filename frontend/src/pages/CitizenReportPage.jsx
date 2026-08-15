import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import { api } from '../services/api';
import { useAlerts } from '../context/AlertContext';

export const CitizenReportPage = () => {
  const { addToast } = useAlerts();
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [contact, setContact] = useState('');
  const [onsetDate, setOnsetDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [submittedReport, setSubmittedReport] = useState(null);
  const [reportsList, setReportsList] = useState([]);

  const symptomOptions = [
    "High-grade fever (>102 F)",
    "Severe retro-orbital eye pain",
    "Severe muscle and joint pain",
    "Skin petechiae / rash",
    "Painless watery diarrhea",
    "Persistent vomiting & nausea",
    "Shivering chills rigor",
    "Stagnant water near residence"
  ];

  useEffect(() => {
    const fetchReports = async () => {
      const data = await api.getCitizenReports();
      setReportsList(data);
    };
    fetchReports();
  }, []);

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || selectedSymptoms.length === 0) return;

    const payload = {
      name,
      district,
      contact: contact || "Anonymous Resident",
      onsetDate,
      symptoms: selectedSymptoms,
      notes
    };

    const res = await api.submitCitizenReport(payload);
    if (res.success) {
      setSubmittedReport(res.report);
      setReportsList([res.report, ...reportsList]);
      addToast("Report Filed", `Public health report logged with Ticket ID: ${res.report.id}`);
      setName('');
      setContact('');
      setSelectedSymptoms([]);
      setNotes('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={24} className="text-cyan-400" />
            <span>Community Symptom & Stagnation Reporting</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Direct crowdsourced disease surveillance assisting municipal health officers in early cluster detection.
          </p>
        </div>
      </div>

      {/* 2. Success Banner */}
      {submittedReport && (
        <div
          className="glass-card"
          style={{
            padding: '18px 24px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <CheckCircle2 size={28} className="text-emerald-400" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--accent-emerald)' }}>
              Surveillance Report Successfully Submitted (Ticket #{submittedReport.id})
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your report has been securely routed to the {submittedReport.district} District Epidemiological Field Squad for validation.
            </div>
          </div>
        </div>
      )}

      {/* 3. Reporting Form */}
      <div className="grid-cols-2">
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px' }}>Submit Clinical Symptom Dossier</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reporter / Patient Name:</label>
              <input
                type="text"
                placeholder="e.g. S. Murugan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-control text-xs"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>District Jurisdiction:</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-control input-select text-xs"
              >
                {DISTRICTS_DATA.map((d) => (
                  <option key={d.id} value={d.name}>{d.name} ({d.tamilName})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contact Mobile Number:</label>
              <input
                type="text"
                placeholder="+91 98400 00000"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="input-control text-xs"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date of Symptom Onset:</label>
              <input
                type="date"
                value={onsetDate}
                onChange={(e) => setOnsetDate(e.target.value)}
                className="input-control text-xs"
              />
            </div>
          </div>

          {/* Symptoms Checkbox Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Observed Symptoms (Select all that apply):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {symptomOptions.map((sym, idx) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSymptom(sym)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-input)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-base)'}`,
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span>{sym}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Additional Ward / Locality Notes:</label>
            <textarea
              rows="2"
              placeholder="e.g. Open drain overflow near street corner 4..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-control text-xs"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Send size={15} />
            <span>Transmit Citizen Report</span>
          </button>
        </form>

        {/* Public Reporting Information */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px' }}>How Citizen Reports Accelerate Containment</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Crowdsourced reports provide an independent ground-truth signal to corroborate meteorological rainfall anomalies. Once 3 or more independent reports are logged within a 2-kilometer radius, the XGBoost engine automatically triggers a priority fever survey for the local Primary Health Center (PHC).
          </p>

          <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-primary)' }}>
              Emergency Telephone Shortcuts
            </div>
            <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ambulance Services:</span>
              <strong style={{ color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>108</strong>
            </div>
            <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Tamil Nadu Health Helpline:</span>
              <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>104</strong>
            </div>
            <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>DPH Dengue Control Cell:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>044 2951 0400</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Reports Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Recent Community Outbreak Filings</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>District</th>
                <th>Onset Date</th>
                <th>Reported Symptoms</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportsList.map((rep) => (
                <tr key={rep.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>{rep.id}</td>
                  <td style={{ fontWeight: 600 }}>{rep.district}</td>
                  <td>{rep.onsetDate}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {Array.isArray(rep.symptoms) ? rep.symptoms.join(', ') : rep.symptoms}
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rep.timestamp}</td>
                  <td>
                    <span style={{ background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {rep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CitizenReportPage;

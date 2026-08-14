import React, { useState } from 'react';
import { DISTRICT_COORDS } from '../services/api';
import { submitCitizenReport } from '../services/api';

const SYMPTOM_OPTIONS = [
  { id: 'fever', label: 'Fever', icon: '' },
  { id: 'vomiting', label: 'Vomiting', icon: '' },
  { id: 'rash', label: 'Skin Rash', icon: '' },
  { id: 'body_pain', label: 'Body Pain', icon: '' },
  { id: 'diarrhea', label: 'Diarrhea', icon: '' },
  { id: 'headache', label: 'Headache', icon: '' },
];

const MOCK_RECENT_REPORTS = [
  { id: 1, district: 'Chennai', symptoms: 3, date: '2026-08-12', status: 'Reviewed' },
  { id: 2, district: 'Madurai', symptoms: 2, date: '2026-08-12', status: 'Pending' },
  { id: 3, district: 'Coimbatore', symptoms: 4, date: '2026-08-11', status: 'Reviewed' },
  { id: 4, district: 'Salem', symptoms: 1, date: '2026-08-11', status: 'Escalated' },
  { id: 5, district: 'Tiruchirappalli', symptoms: 5, date: '2026-08-10', status: 'Reviewed' },
];

export default function CitizenReport() {
  const [formData, setFormData] = useState({
    name: '',
    district: 'Chennai',
    symptoms: [],
    date_of_onset: new Date().toISOString().split('T')[0],
    contact_number: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const districts = Object.keys(DISTRICT_COORDS);

  const toggleSymptom = (id) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(id)
        ? prev.symptoms.filter(s => s !== id)
        : [...prev.symptoms, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.symptoms.length === 0) return;
    setSubmitting(true);
    try {
      const result = await submitCitizenReport(formData);
      setResponseData(result);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      district: 'Chennai',
      symptoms: [],
      date_of_onset: new Date().toISOString().split('T')[0],
      contact_number: '',
    });
    setSubmitted(false);
    setResponseData(null);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f1f5f9',
    fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: '0.72rem',
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>
          Citizen Health Report
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Report symptoms to help the AI early warning system detect outbreaks faster
        </p>
      </div>

      {submitted ? (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>OK</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6ee7b7', margin: '0 0 8px' }}>
              Report Submitted Successfully!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 4px' }}>
              Thank you for contributing to public health surveillance.
            </p>
            {responseData?.report_id && (
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: '8px 0 24px' }}>
                Report ID: <strong style={{ color: '#93c5fd' }}>{responseData.report_id}</strong>
              </p>
            )}
            <button onClick={resetForm} className="btn-detail" style={{ padding: '10px 24px' }}>
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-head">
            <h3 className="card-head-title">Report Symptoms</h3>
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>All fields marked * are required</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>District *</label>
                  <select
                    value={formData.district}
                    onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    style={inputStyle}
                  >
                    {districts.map(d => (
                      <option key={d} value={d} style={{ background: '#111827' }}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date of Onset *</label>
                  <input
                    type="date"
                    value={formData.date_of_onset}
                    onChange={e => setFormData(prev => ({ ...prev, date_of_onset: e.target.value }))}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contact_number}
                    onChange={e => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Symptoms Checkboxes */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Symptoms * (Select all that apply)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
                  {SYMPTOM_OPTIONS.map(s => (
                    <div
                      key={s.id}
                      onClick={() => toggleSymptom(s.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: formData.symptoms.includes(s.id)
                          ? '1px solid rgba(59,130,246,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                        background: formData.symptoms.includes(s.id)
                          ? 'rgba(59,130,246,0.08)'
                          : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                      <span style={{
                        fontSize: '0.84rem',
                        fontWeight: formData.symptoms.includes(s.id) ? 700 : 500,
                        color: formData.symptoms.includes(s.id) ? '#93c5fd' : '#94a3b8',
                      }}>
                        {s.label}
                      </span>
                      {formData.symptoms.includes(s.id) && (
                        <span style={{ marginLeft: 'auto', color: '#3b82f6', fontWeight: 700 }}>OK</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.name || formData.symptoms.length === 0}
                className="btn-detail"
                style={{
                  padding: '12px 32px',
                  fontSize: '0.9rem',
                  opacity: (!formData.name || formData.symptoms.length === 0) ? 0.5 : 1,
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recent Reports Summary */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Recent Community Reports</h3>
          <span style={{ fontSize: '0.72rem', color: '#475569' }}>Last 5 submissions</span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>District</th>
                <th>Symptoms</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_REPORTS.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.district}</td>
                  <td>{r.symptoms} reported</td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.date}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: r.status === 'Escalated' ? 'rgba(239,68,68,0.1)' : r.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: r.status === 'Escalated' ? '#fca5a5' : r.status === 'Pending' ? '#fcd34d' : '#6ee7b7',
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  Clock,
  BedDouble,
  ChevronDown,
  ChevronUp,
  Hospital,
  Activity,
  Filter,
  Cpu
} from 'lucide-react';
import { DISTRICTS_DATA } from '../data/districtsData';
import RiskBadge from '../components/common/RiskBadge';

// Tamil names for mock patients
const TAMIL_NAMES = [
  'Murugan K.', 'Lakshmi S.', 'Karthik R.', 'Priya M.', 'Senthil V.',
  'Meena D.', 'Rajesh T.', 'Kavitha N.', 'Arun P.', 'Divya B.',
  'Gopal S.', 'Sangeetha L.', 'Vignesh A.', 'Anitha R.', 'Manikandan J.',
  'Revathi K.', 'Suresh M.', 'Deepa V.', 'Balaji N.', 'Janani P.'
];

const SYMPTOM_POOL = [
  'High fever', 'Headache', 'Joint pain', 'Rash', 'Nausea',
  'Vomiting', 'Diarrhea', 'Abdominal pain', 'Fatigue', 'Muscle pain',
  'Chills', 'Dehydration', 'Bleeding gums', 'Eye pain', 'Loss of appetite'
];

const HOSPITALS = [
  'GH Madurai', 'RGGGH Chennai', 'GH Coimbatore', 'GH Trichy',
  'CMC Vellore', 'GH Salem', 'GH Thanjavur', 'GH Tirunelveli'
];

const TESTS = [
  'NS1 Antigen Test', 'Dengue IgM/IgG', 'CBC with Platelet Count',
  'Liver Function Test', 'Peripheral Smear', 'Stool Culture',
  'Blood Culture', 'Chest X-Ray', 'Rapid Malaria Test'
];

const generatePatients = () => {
  const patients = [];
  const highRiskDistricts = DISTRICTS_DATA.filter((d) => d.riskLevel === 'high').map((d) => d.name);

  for (let i = 0; i < 20; i++) {
    const district = DISTRICTS_DATA[Math.floor(Math.random() * DISTRICTS_DATA.length)];
    const age = Math.floor(Math.random() * 70) + 5;
    const symptomCount = Math.floor(Math.random() * 5) + 1;
    const symptoms = [];
    const usedIndices = new Set();
    for (let j = 0; j < symptomCount; j++) {
      let idx;
      do { idx = Math.floor(Math.random() * SYMPTOM_POOL.length); } while (usedIndices.has(idx));
      usedIndices.add(idx);
      symptoms.push(SYMPTOM_POOL[idx]);
    }

    const feverDuration = Math.floor(Math.random() * 7) + 1;
    const isHighRiskDistrict = highRiskDistricts.includes(district.name);

    // Severity calculation
    const severity = Math.min(100,
      symptomCount * 15 +
      (isHighRiskDistrict ? 25 : 0) +
      (age > 60 ? 15 : 0) +
      (feverDuration > 3 ? 10 : 0)
    );

    let category = 'Low';
    if (severity > 80) category = 'Critical';
    else if (severity >= 60) category = 'Urgent';
    else if (severity >= 40) category = 'Standard';

    const recommendedAction = category === 'Critical'
      ? 'Immediate ICU admission'
      : category === 'Urgent'
        ? 'Priority ward admission'
        : category === 'Standard'
          ? 'Outpatient monitoring'
          : 'Home isolation with follow-up';

    const recommendedTests = [];
    const testCount = Math.min(4, symptomCount + 1);
    const usedTests = new Set();
    for (let j = 0; j < testCount; j++) {
      let idx;
      do { idx = Math.floor(Math.random() * TESTS.length); } while (usedTests.has(idx));
      usedTests.add(idx);
      recommendedTests.push(TESTS[idx]);
    }

    patients.push({
      id: `PAT-${String(1000 + i).slice(1)}${String.fromCharCode(65 + (i % 26))}`,
      name: TAMIL_NAMES[i],
      age,
      district: district.name,
      districtRiskLevel: district.riskLevel,
      symptoms,
      feverDuration,
      severity,
      category,
      recommendedAction,
      recommendedTests,
      nearestHospital: HOSPITALS[Math.floor(Math.random() * HOSPITALS.length)],
      waitTime: Math.floor(Math.random() * 45) + 5
    });
  }

  return patients.sort((a, b) => b.severity - a.severity);
};

const TriagePage = () => {
  const [patients] = useState(generatePatients);
  const [filter, setFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);
  const [processingRate, setProcessingRate] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingRate((r) => Math.max(35, Math.min(65, r + Math.floor(Math.random() * 7) - 3)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredPatients = useMemo(() => {
    if (filter === 'All') return patients;
    return patients.filter((p) => p.category === filter);
  }, [patients, filter]);

  const stats = useMemo(() => {
    const critical = patients.filter((p) => p.category === 'Critical').length;
    const avgWait = Math.round(patients.reduce((s, p) => s + p.waitTime, 0) / patients.length);
    return {
      total: patients.length,
      critical,
      avgWait,
      bedsAvailable: 42
    };
  }, [patients]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Critical': return '#f43f5e';
      case 'Urgent': return '#f59e0b';
      case 'Standard': return '#3b82f6';
      default: return '#10b981';
    }
  };

  const handleAssign = (patientId) => {
    alert(`Patient ${patientId} assigned to nearest available hospital.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <Activity size={24} style={{ color: '#8b5cf6' }} />
            AI Triage Priority Score
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            AI-driven patient prioritization based on severity, location risk, and clinical indicators
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <Cpu size={16} style={{ color: '#8b5cf6' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            AI processing <strong style={{ color: '#8b5cf6' }}>{processingRate}</strong> patients/minute
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <Users size={20} style={{ color: '#3b82f6', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Patients</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <AlertTriangle size={20} style={{ color: '#f43f5e', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f43f5e' }}>{stats.critical}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Critical</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <Clock size={20} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.avgWait} min</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Avg Wait Time</div>
        </div>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <BedDouble size={20} style={{ color: '#10b981', margin: '0 auto 8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{stats.bedsAvailable}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Beds Available</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
          {['All', 'Critical', 'Urgent', 'Standard', 'Low'].map((f) => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : ''}`}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                borderRadius: '6px',
                background: filter === f ? undefined : 'var(--bg-card)',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table */}
      <div className="glass-card" style={{ padding: '16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>#</th>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Patient ID</th>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Age</th>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>District</th>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Symptoms</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>Severity</th>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, idx) => {
              const isExpanded = expandedRow === patient.id;
              return (
                <React.Fragment key={patient.id}>
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : patient.id)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      borderLeft: `3px solid ${getCategoryColor(patient.category)}`,
                      background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '12px' }}>{patient.id}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>{patient.name}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{patient.age}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{patient.district}</span>
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {patient.symptoms.slice(0, 2).join(', ')}{patient.symptoms.length > 2 ? ` +${patient.symptoms.length - 2}` : ''}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: `${getCategoryColor(patient.category)}22`,
                        color: getCategoryColor(patient.category)
                      }}>
                        {patient.severity}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontSize: '11px' }}>{patient.recommendedAction}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <td colSpan={9} style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Full Symptoms</div>
                            <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-primary)', fontSize: '12px' }}>
                              {patient.symptoms.map((s, si) => <li key={si} style={{ marginBottom: '2px' }}>{s}</li>)}
                            </ul>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                              Fever duration: {patient.feverDuration} days
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Recommended Tests</div>
                            <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-primary)', fontSize: '12px' }}>
                              {patient.recommendedTests.map((t, ti) => <li key={ti} style={{ marginBottom: '2px' }}>{t}</li>)}
                            </ul>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Nearest Hospital</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '13px' }}>
                              <Hospital size={14} />
                              {patient.nearestHospital}
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={(e) => { e.stopPropagation(); handleAssign(patient.id); }}
                              style={{ marginTop: '12px', padding: '6px 14px', fontSize: '12px' }}
                            >
                              Assign to Hospital
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TriagePage;

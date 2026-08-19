import React, { useState } from 'react';
import {
  Video,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  User,
  UserCheck,
  Clock,
  Activity,
  Star,
  Calendar,
  FileText,
  Pill,
  Stethoscope,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  Monitor
} from 'lucide-react';

const TelemedicinePage = () => {
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    district: '',
    symptoms: '',
    preferredDate: '',
    preferredTime: '',
    priority: 'Normal'
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const stats = [
    { label: 'Active Consultations', value: 12, icon: Video, color: '#6366f1' },
    { label: 'Doctors Available', value: 8, icon: UserCheck, color: '#10b981' },
    { label: 'Patients Waiting', value: 5, icon: Clock, color: '#f59e0b' },
    { label: 'Avg Wait Time', value: '14 min', icon: Activity, color: '#ef4444' }
  ];

  const doctors = [
    { name: 'Dr. Priya Sharma', specialization: 'Infectious Disease', district: 'Chennai', status: 'Available', rating: 4.8 },
    { name: 'Dr. Rajesh Kumar', specialization: 'General Medicine', district: 'Coimbatore', status: 'In Session', rating: 4.6 },
    { name: 'Dr. Anitha Rajan', specialization: 'Epidemiology', district: 'Madurai', status: 'Available', rating: 4.9 },
    { name: 'Dr. Suresh Babu', specialization: 'Pediatrics', district: 'Tiruchirappalli', status: 'Offline', rating: 4.5 },
    { name: 'Dr. Kavitha Nair', specialization: 'Tropical Medicine', district: 'Salem', status: 'Available', rating: 4.7 },
    { name: 'Dr. Mohan Das', specialization: 'Pulmonology', district: 'Tirunelveli', status: 'In Session', rating: 4.4 }
  ];

  const recentConsultations = [
    { patient: 'Arun Kumar', doctor: 'Dr. Priya Sharma', district: 'Chennai', date: '2026-08-19', duration: '22 min', diagnosis: 'Dengue Fever (Suspected)', status: 'Completed' },
    { patient: 'Lakshmi Devi', doctor: 'Dr. Rajesh Kumar', district: 'Coimbatore', date: '2026-08-19', duration: '18 min', diagnosis: 'Cholera Symptoms', status: 'In Progress' },
    { patient: 'Venkat Raman', doctor: 'Dr. Anitha Rajan', district: 'Madurai', date: '2026-08-18', duration: '30 min', diagnosis: 'Malaria (Confirmed)', status: 'Completed' },
    { patient: 'Meena Sundari', doctor: 'Dr. Kavitha Nair', district: 'Salem', date: '2026-08-18', duration: '15 min', diagnosis: 'Viral Fever', status: 'Completed' },
    { patient: 'Ravi Shankar', doctor: 'Dr. Mohan Das', district: 'Tirunelveli', date: '2026-08-17', duration: '25 min', diagnosis: 'Respiratory Infection', status: 'Follow-up' }
  ];

  const prescriptions = [
    { patient: 'Arun Kumar', doctor: 'Dr. Priya Sharma', date: '2026-08-19', medicines: 'Paracetamol, ORS, Platelet Booster', notes: 'Rest for 5 days, hydration' },
    { patient: 'Venkat Raman', doctor: 'Dr. Anitha Rajan', date: '2026-08-18', medicines: 'Chloroquine, Primaquine', notes: 'Complete full course, follow-up in 3 days' },
    { patient: 'Meena Sundari', doctor: 'Dr. Kavitha Nair', date: '2026-08-18', medicines: 'Azithromycin, Vitamin C', notes: 'Monitor temperature, visit if fever persists' },
    { patient: 'Ravi Shankar', doctor: 'Dr. Mohan Das', date: '2026-08-17', medicines: 'Amoxicillin, Cough Syrup', notes: 'Avoid cold exposure, steam inhalation' }
  ];

  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul'
  ];

  const symptomsList = [
    'High Fever', 'Body Pain', 'Headache', 'Vomiting', 'Diarrhea',
    'Rash/Skin Spots', 'Breathing Difficulty', 'Cough', 'Fatigue',
    'Joint Pain', 'Abdominal Pain', 'Dehydration'
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available': return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'In Session': return { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'Offline': return { background: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
      case 'Completed': return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'In Progress': return { background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' };
      case 'Follow-up': return { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      default: return { background: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
  };

  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Appointment booked successfully! You will receive a confirmation shortly.');
    setBookingForm({ patientName: '', district: '', symptoms: '', preferredDate: '', preferredTime: '', priority: 'Normal' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Monitor size={32} style={{ color: '#6366f1' }} />
          Telemedicine & Remote Consultation
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
          Connect patients with healthcare professionals remotely for disease outbreak consultation
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Availability Cards */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Stethoscope size={20} style={{ color: '#6366f1' }} />
          Doctor Availability
        </h2>
        <div className="grid-cols-3" style={{ gap: '16px' }}>
          {doctors.map((doc, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User size={20} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{doc.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{doc.specialization}</div>
                  </div>
                </div>
                <span style={{
                  ...getStatusStyle(doc.status),
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600'
                }}>
                  {doc.status === 'Available' && <span className="pulse-dot" style={{ marginRight: '4px' }}></span>}
                  {doc.status}
                </span>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
                  <MapPin size={12} /> {doc.district}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#f59e0b' }}>
                  <Star size={12} fill="#f59e0b" /> {doc.rating}
                </div>
              </div>
              {doc.status === 'Available' && (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px', fontSize: '12px', padding: '8px' }}>
                  <Video size={14} style={{ marginRight: '6px' }} /> Start Consultation
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Booking Form + Video Call Mockup */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Appointment Booking Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: '#10b981' }} />
            Book Appointment
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Patient Name</label>
              <input
                className="input-control"
                type="text"
                name="patientName"
                value={bookingForm.patientName}
                onChange={handleFormChange}
                placeholder="Enter patient name"
                required
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>District</label>
              <select
                className="input-control"
                name="district"
                value={bookingForm.district}
                onChange={handleFormChange}
                required
                style={{ width: '100%' }}
              >
                <option value="">Select District</option>
                {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Symptoms</label>
              <select
                className="input-control"
                name="symptoms"
                value={bookingForm.symptoms}
                onChange={handleFormChange}
                required
                style={{ width: '100%' }}
              >
                <option value="">Select Primary Symptom</option>
                {symptomsList.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Preferred Date</label>
                <input
                  className="input-control"
                  type="date"
                  name="preferredDate"
                  value={bookingForm.preferredDate}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Preferred Time</label>
                <input
                  className="input-control"
                  type="time"
                  name="preferredTime"
                  value={bookingForm.preferredTime}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Priority</label>
              <select
                className="input-control"
                name="priority"
                value={bookingForm.priority}
                onChange={handleFormChange}
                style={{ width: '100%' }}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
              <Send size={16} style={{ marginRight: '8px' }} /> Book Consultation
            </button>
          </form>
        </div>

        {/* Video Call Interface Mockup */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={20} style={{ color: '#ef4444' }} />
            Video Consultation
          </h2>
          {/* Camera Placeholder */}
          <div style={{
            flex: 1, minHeight: '280px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            {isCameraOff ? (
              <CameraOff size={48} style={{ color: '#6b7280' }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.3)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
                }}>
                  <User size={40} style={{ color: '#a5b4fc' }} />
                </div>
                <p style={{ color: '#a5b4fc', fontSize: '14px', margin: 0 }}>Camera Preview</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Waiting for connection...</p>
              </div>
            )}
            {/* Self-view pip */}
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              width: '100px', height: '75px', borderRadius: '8px',
              background: 'rgba(30, 27, 75, 0.8)', border: '2px solid rgba(99, 102, 241, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={20} style={{ color: '#6b7280' }} />
            </div>
            {/* Duration indicator */}
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'rgba(239, 68, 68, 0.8)', padding: '4px 10px',
              borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span className="pulse-dot"></span> 00:00
            </div>
          </div>
          {/* Call Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? 'btn btn-danger' : 'btn btn-secondary'}
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={isCameraOff ? 'btn btn-danger' : 'btn btn-secondary'}
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isCameraOff ? <CameraOff size={20} /> : <Camera size={20} />}
            </button>
            <button
              className="btn btn-danger"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="End Call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Consultations Table */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} style={{ color: '#f59e0b' }} />
          Recent Consultations
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>District</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Diagnosis</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentConsultations.map((c, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '500' }}>{c.patient}</td>
                  <td>{c.doctor}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: '#6366f1' }} /> {c.district}
                    </span>
                  </td>
                  <td>{c.date}</td>
                  <td>{c.duration}</td>
                  <td style={{ fontSize: '12px' }}>{c.diagnosis}</td>
                  <td>
                    <span style={{
                      ...getStatusStyle(c.status),
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600'
                    }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription History Panel */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pill size={20} style={{ color: '#10b981' }} />
          Prescription History
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {prescriptions.map((rx, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{rx.patient}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  Prescribed by {rx.doctor} — {rx.date}
                </div>
              </div>
              <div style={{ flex: 2, minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '4px' }}>
                  <Pill size={14} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: '500' }}>{rx.medicines}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <AlertCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {rx.notes}
                </div>
              </div>
              <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                <FileText size={12} style={{ marginRight: '4px' }} /> View PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TelemedicinePage;

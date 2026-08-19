import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  User,
  MapPin,
  Clock,
  Lock,
  AlertTriangle,
  Search
} from 'lucide-react';

const DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul',
  'Kanchipuram', 'Villupuram', 'Cuddalore', 'Nagapattinam', 'Theni',
  'Sivaganga', 'Ramanathapuram', 'Virudhunagar', 'Thoothukudi', 'Tiruvannamalai',
  'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Perambalur', 'Ariyalur',
  'Karur', 'Pudukkottai', 'Nilgiris', 'Tiruppur', 'Kanyakumari',
  'Tiruvarur', 'Kallakurichi', 'Ranipet', 'Tenkasi', 'Chengalpattu',
  'Mayiladuthurai', 'Tirupattur'
];

const RECENT_VERIFICATIONS = [
  { id: 1, aadhaar: 'XXXX-XXXX-4521', name: 'Rajesh Kumar', district: 'Chennai', time: '14:22', status: 'Verified' },
  { id: 2, aadhaar: 'XXXX-XXXX-8734', name: 'Priya Sundaram', district: 'Madurai', time: '14:18', status: 'Verified' },
  { id: 3, aadhaar: 'XXXX-XXXX-2156', name: 'Karthik Selvam', district: 'Coimbatore', time: '14:10', status: 'Verified' },
  { id: 4, aadhaar: 'XXXX-XXXX-6893', name: 'Meena Devi', district: 'Salem', time: '13:55', status: 'Verified' },
  { id: 5, aadhaar: 'XXXX-XXXX-3467', name: 'Suresh Babu', district: 'Vellore', time: '13:42', status: 'Verified' }
];

export const AadhaarVerifyPage = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (aadhaarNumber.replace(/\s/g, '').length !== 12) return;

    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        name: name || 'Rajesh Kumar',
        address: `${district || 'Chennai'}, Tamil Nadu, India`,
        age: 34,
        gender: 'Male',
        verified: true
      });
    }, 2500);
  };

  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={24} style={{ color: 'var(--accent-primary)' }} />
          <span>Aadhaar Identity Verification</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
          Link patient disease reports to verified Aadhaar identity for data integrity
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Verifications Today</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>247</p>
        </div>
        <div className="glass-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Success Rate</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>98.4%</p>
        </div>
        <div className="glass-card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Avg Verification Time</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)' }}>2.3s</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Verification Form */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} style={{ color: 'var(--accent-primary)' }} />
            Verify Aadhaar
          </h2>
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Aadhaar Number (12 digits)
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(formatAadhaar(e.target.value))}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '2px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              >
                <option value="">Select District</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isVerifying || aadhaarNumber.replace(/\s/g, '').length !== 12}
              className="btn btn-primary"
              style={{ marginTop: '8px' }}
            >
              {isVerifying ? (
                <>
                  <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Shield size={15} />
                  <span>Verify Identity</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px' }}>Verification Result</h2>
          {verificationResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <span style={{ color: '#10b981', fontWeight: 700 }}>Identity Verified Successfully</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* Photo placeholder */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--bg-input)',
                  border: '2px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={32} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Name</p>
                    <p style={{ fontWeight: 600 }}>{verificationResult.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Address</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{verificationResult.address}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Age</p>
                      <p style={{ fontWeight: 600 }}>{verificationResult.age}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gender</p>
                      <p style={{ fontWeight: 600 }}>{verificationResult.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
              <User size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '13px' }}>Submit an Aadhaar number to see verification results</p>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <Lock size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#f59e0b' }}>Privacy Notice</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Aadhaar verification is performed exclusively to link disease reports to verified identities for public health tracking purposes.
            No biometric data is stored on VyaadhiShield servers. Only the verification status (yes/no) and a tokenized reference are retained.
            All transmissions are encrypted using TLS 1.3. Data handling complies with the Aadhaar (Targeted Delivery of Financial and Other Subsidies,
            Benefits and Services) Act, 2016 and IT Act 2000 guidelines. Users may request data deletion at any time.
          </p>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
          Recent Verifications
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Aadhaar (Masked)</th>
                <th>Name</th>
                <th>District</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_VERIFICATIONS.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{entry.aadhaar}</td>
                  <td style={{ fontWeight: 600 }}>{entry.name}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{entry.district}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{entry.time}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>{entry.status}</span>
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

export default AadhaarVerifyPage;

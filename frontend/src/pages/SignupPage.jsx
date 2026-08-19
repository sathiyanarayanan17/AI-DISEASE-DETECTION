import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Building2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';

const DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Tiruppur',
  'Dindigul', 'Thanjavur', 'Sivaganga', 'Kanchipuram', 'Krishnagiri',
  'Dharmapuri', 'Cuddalore', 'Nagapattinam', 'Villupuram', 'Perambalur',
  'Ariyalur', 'Karur', 'Namakkal', 'Ramanathapuram', 'Virudhunagar',
  'Tiruvannamalai', 'Tiruvarur', 'Pudukkottai', 'Nilgiris', 'Kallakurichi',
  'Chengalpattu', 'Tenkasi', 'Mayiladuthurai', 'Tirupattur', 'Ranipet',
  'Kanyakumari', 'Puducherry'
];

const ROLES = [
  { id: 'citizen', label: 'Public Citizen', icon: User, description: 'Report symptoms, view public dashboard, find hospitals', color: '#10b981' },
  { id: 'health_worker', label: 'Health Worker', icon: Briefcase, description: 'Field surveillance, data collection, vaccination drives', color: '#06b6d4' },
  { id: 'officer', label: 'District Health Officer', icon: Building2, description: 'Full monitoring, alerts, resource allocation, reports', color: '#6366f1' },
  { id: 'admin', label: 'System Administrator', icon: Shield, description: 'All access + model management, user control, audit', color: '#a855f7' }
];

export const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useAlerts();

  const [step, setStep] = useState(1); // 1: Role, 2: Details, 3: Verification, 4: Success
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    district: '',
    organization: '',
    employeeId: '',
    aadhaarLast4: '',
    agreeTerms: false
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 3) newErrors.fullName = 'Name must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) newErrors.password = 'Must contain uppercase letter and number';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.district) newErrors.district = 'Please select your district';
    
    if (selectedRole !== 'citizen' && !formData.organization.trim()) {
      newErrors.organization = 'Organization is required for official roles';
    }
    
    if (selectedRole === 'officer' || selectedRole === 'admin') {
      if (!formData.employeeId.trim()) newErrors.employeeId = 'Government Employee ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.aadhaarLast4 || formData.aadhaarLast4.length !== 4) {
      newErrors.aadhaarLast4 = 'Enter last 4 digits of Aadhaar';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
      login(selectedRole === 'citizen' ? 'public' : selectedRole);
      addToast('Account Created', `Welcome to VyaadhiShield, ${formData.fullName}!`);
    }, 2000);
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'var(--risk-high)' };
    if (score <= 3) return { score, label: 'Medium', color: 'var(--risk-medium)' };
    return { score, label: 'Strong', color: 'var(--accent-emerald)' };
  };

  const strength = getPasswordStrength();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
          }}>
            <ShieldAlert size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '24px' }}>Create Your VyaadhiShield Account</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Join Tamil Nadu's AI-powered disease surveillance network
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step >= s ? 'var(--accent-primary)' : 'var(--bg-input)',
              color: step >= s ? '#fff' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '13px',
              border: step >= s ? 'none' : '2px solid var(--border-base)',
              transition: 'all 200ms'
            }}>
              {step > s ? <CheckCircle size={16} /> : s}
            </div>
            {s < 4 && (
              <div style={{
                width: '40px', height: '3px', borderRadius: '2px',
                background: step > s ? 'var(--accent-primary)' : 'var(--border-base)',
                transition: 'all 200ms'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span style={{ color: step >= 1 ? 'var(--accent-primary)' : undefined }}>Role</span>
        <span style={{ color: step >= 2 ? 'var(--accent-primary)' : undefined }}>Details</span>
        <span style={{ color: step >= 3 ? 'var(--accent-primary)' : undefined }}>Verify</span>
        <span style={{ color: step >= 4 ? 'var(--accent-primary)' : undefined }}>Done</span>
      </div>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', textAlign: 'center' }}>Select Your Role</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center' }}>
            Choose the role that best describes your relationship with the health surveillance system
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${role.color}` : '2px solid var(--border-base)',
                    background: isSelected ? `${role.color}10` : 'var(--bg-input)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    display: 'flex', flexDirection: 'column', gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: isSelected ? role.color : 'var(--bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 200ms'
                    }}>
                      <Icon size={18} color={isSelected ? '#fff' : role.color} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? role.color : 'var(--text-primary)' }}>
                      {role.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {role.description}
                  </p>
                  {isSelected && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: role.color, fontWeight: 600 }}>
                      <CheckCircle size={13} />
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedRole}
            className="btn btn-primary"
            style={{ alignSelf: 'center', padding: '12px 32px', fontSize: '14px' }}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Personal Details */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '18px' }}>Personal & Professional Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Dr. Kavitha Sundaram"
                  className="input-control"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
              {errors.fullName && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="kavitha@tn.gov.in"
                  className="input-control"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
              {errors.email && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.email}</span>}
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Mobile Number *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="input-control"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
              {errors.phone && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.phone}</span>}
            </div>

            {/* District */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>District *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <select
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="input-control input-select"
                  style={{ paddingLeft: '36px' }}
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {errors.district && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.district}</span>}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Min 8 chars, uppercase + number"
                  className="input-control"
                  style={{ paddingLeft: '36px', paddingRight: '36px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--border-base)', overflow: 'hidden' }}>
                    <div style={{ width: `${strength.score * 20}%`, height: '100%', background: strength.color, borderRadius: '2px', transition: 'width 200ms' }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: strength.color }}>{strength.label}</span>
                </div>
              )}
              {errors.password && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className="input-control"
                  style={{ paddingLeft: '36px', paddingRight: '36px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Organization (for non-citizen roles) */}
          {selectedRole !== 'citizen' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Organization *</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => updateField('organization', e.target.value)}
                  placeholder="Directorate of Public Health, TN"
                  className="input-control"
                />
                {errors.organization && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.organization}</span>}
              </div>

              {(selectedRole === 'officer' || selectedRole === 'admin') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Government Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => updateField('employeeId', e.target.value)}
                    placeholder="TN/DPH/2024/XXXX"
                    className="input-control"
                  />
                  {errors.employeeId && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.employeeId}</span>}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '8px' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
            <button onClick={handleNext} className="btn btn-primary" style={{ padding: '10px 28px' }}>
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Verification */}
      {step === 3 && (
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px' }}>Identity Verification</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            For security, we verify your identity before granting access to the surveillance platform.
          </p>

          {/* Aadhaar Verification */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Last 4 Digits of Aadhaar Number *</label>
            <input
              type="text"
              value={formData.aadhaarLast4}
              onChange={(e) => updateField('aadhaarLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="XXXX"
              className="input-control"
              style={{ maxWidth: '200px', letterSpacing: '8px', fontFamily: 'var(--font-mono)', fontSize: '18px', textAlign: 'center' }}
              maxLength={4}
            />
            {errors.aadhaarLast4 && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.aadhaarLast4}</span>}
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>We only store the last 4 digits for verification. Full Aadhaar is never stored.</span>
          </div>

          {/* Summary */}
          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-base)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Registration Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> <strong>{formData.fullName}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{formData.email}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> <strong>+91 {formData.phone}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>District:</span> <strong>{formData.district}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Role:</span> <strong>{ROLES.find(r => r.id === selectedRole)?.label}</strong></div>
              {formData.organization && <div><span style={{ color: 'var(--text-muted)' }}>Org:</span> <strong>{formData.organization}</strong></div>}
            </div>
          </div>

          {/* Terms */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => updateField('agreeTerms', e.target.checked)}
              style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>. 
              I understand that this platform handles sensitive health data and I will maintain confidentiality 
              as per DISHA (Digital Information Security in Healthcare Act) guidelines.
            </span>
          </label>
          {errors.agreeTerms && <span style={{ fontSize: '11px', color: 'var(--risk-high)' }}>{errors.agreeTerms}</span>}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '8px' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
            <button onClick={handleNext} disabled={isSubmitting} className="btn btn-primary" style={{ padding: '10px 28px' }}>
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px' }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle size={40} color="#fff" />
          </div>

          <h2 style={{ fontSize: '22px' }}>Account Created Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px' }}>
            Welcome to VyaadhiShield AI, <strong>{formData.fullName}</strong>. Your account has been created 
            as <strong>{ROLES.find(r => r.id === selectedRole)?.label}</strong> for <strong>{formData.district}</strong> district.
          </p>

          <div style={{ padding: '14px 20px', borderRadius: '10px', background: 'var(--accent-primary-light)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
            A verification email has been sent to {formData.email}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '12px 28px' }}>
              <span>Go to Login</span>
            </button>
          </div>
        </div>
      )}

      {/* Already have account link */}
      {step < 4 && (
        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      )}
    </div>
  );
};

export default SignupPage;

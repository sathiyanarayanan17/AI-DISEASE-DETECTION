import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  CheckCircle,
  MessageSquare,
  Radio,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName } from '../data/districtsData';
import { useAlerts } from '../context/AlertContext';

export const SmsAlertsPage = () => {
  const { addToast } = useAlerts();
  const [selectedDistrictName, setSelectedDistrictName] = useState('Chennai');
  const [recipientNumber, setRecipientNumber] = useState('+91 98401 23456');
  const [riskLevel, setRiskLevel] = useState('high');
  const [language, setLanguage] = useState('en');

  const [sentLog, setSentLog] = useState([
    {
      id: "SMS-4401",
      recipient: "+91 98401 98765 (Medical Officer Chennai)",
      district: "Chennai",
      timestamp: "09:10:45",
      status: "DELIVERED",
      text: "[GOVT TN DPH] High Outbreak Alert for Chennai. Risk Score: 88. Immediate vector fumigation required."
    },
    {
      id: "SMS-4402",
      recipient: "+91 94432 11223 (PHC Singanallur)",
      district: "Coimbatore",
      timestamp: "08:45:10",
      status: "DELIVERED",
      text: "[GOVT TN DPH] Outbreak Warning: Coimbatore risk index 76. Inspect water storage tanks."
    }
  ]);

  const district = getDistrictByName(selectedDistrictName);

  const getTemplate = () => {
    if (language === 'ta') {
      if (riskLevel === 'high') {
        return `[தமிழக பொது சுகாதாரம்] எச்சரிக்கை: ${district.name} மாவட்டத்தில் நோய் பரவல் அபாயம் (${district.riskScore}/100). உடனடி கொசு ஒழிப்பு மற்றும் காய்ச்சல் முகாம் நடத்த உத்தரவு.`;
      }
      return `[தமிழக பொது சுகாதாரம்] தகவல்: ${district.name} மாவட்ட நோய் அபாய குறியீடு ${district.riskScore}/100. வழக்கமான தடுப்பு நடவடிக்கைகள் தொடரவும்.`;
    }

    if (riskLevel === 'high') {
      return `[GOVT OF TAMIL NADU - DPH] CRITICAL ALERT: ${district.name} risk index is ${district.riskScore}/100. ${district.totalCases7d} active cases. Immediate vector fumigation and hospital isolation readiness ordered.`;
    } else if (riskLevel === 'medium') {
      return `[GOVT OF TAMIL NADU - DPH] ADVISORY: ${district.name} risk score is ${district.riskScore}/100. Intensify larvicide operations and verify drinking water chlorination.`;
    }
    return `[GOVT OF TAMIL NADU - DPH] INFO: ${district.name} epidemiological status nominal (${district.riskScore}/100). Maintain weekly sentinel reporting.`;
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!recipientNumber.trim()) return;

    const newSms = {
      id: `SMS-${Date.now().toString().slice(-4)}`,
      recipient: recipientNumber,
      district: district.name,
      timestamp: new Date().toLocaleTimeString(),
      status: "DELIVERED",
      text: getTemplate()
    };

    setSentLog([newSms, ...sentLog]);
    addToast("SMS Dispatched", `Alert successfully transmitted via MSG91 Gateway to ${recipientNumber}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={24} className="text-emerald-400" />
            <span>SMS Emergency Dispatch Console</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Bulk & targeted SMS warning dispatch to District Medical Officers via MSG91 / Twilio Gateway.
          </p>
        </div>
      </div>

      {/* 2. Dispatch Form & Preview */}
      <div className="grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSendSms} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px' }}>Compose Outbreak SMS Broadcast</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target District:</label>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Alert Severity:</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="input-control input-select text-xs"
              >
                <option value="high">Critical High Risk</option>
                <option value="medium">Medium Warning</option>
                <option value="low">Low Informational</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Language Script:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-control input-select text-xs"
              >
                <option value="en">English (GSM-7)</option>
                <option value="ta">Tamil (Unicode)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recipient Phone Number:</label>
              <input
                type="text"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                placeholder="+91 98400 00000"
                className="input-control text-xs"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <Send size={15} />
            <span>Transmit SMS via Telephony Gateway</span>
          </button>
        </form>

        {/* Live Device SMS Preview */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="flex-between">
            <h2 style={{ fontSize: '16px' }}>Recipient Mobile Screen Preview</h2>
            <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>DPH-GOVTN</span>
          </div>

          <div
            style={{
              background: 'var(--bg-input)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>From: <strong>GOV-TNDPH</strong></span>
              <span>Just now</span>
            </div>
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                borderLeft: `4px solid ${riskLevel === 'high' ? 'var(--risk-high)' : 'var(--accent-primary)'}`
              }}
            >
              {getTemplate()}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' }}>
              Standard 160 char SMS packet | Encrypted transmission
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px' }}>
            <strong>Gateway Info: </strong>Connected via MSG91 Enterprise DLT Route with 99.9% 5-second delivery SLA across Tamil Nadu BSNL/Airtel/Jio networks.
          </div>
        </div>
      </div>

      {/* 3. Sent SMS Log */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Transmission Delivery Audit</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Message ID</th>
                <th>Time</th>
                <th>Recipient Contact</th>
                <th>District</th>
                <th>Status</th>
                <th>Transmitted SMS Text</th>
              </tr>
            </thead>
            <tbody>
              {sentLog.map((sms) => (
                <tr key={sms.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{sms.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{sms.timestamp}</td>
                  <td style={{ fontWeight: 600, fontSize: '12px' }}>{sms.recipient}</td>
                  <td>{sms.district}</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} />
                      <span>{sms.status}</span>
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sms.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmsAlertsPage;

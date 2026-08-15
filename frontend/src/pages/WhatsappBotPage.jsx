import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { DISTRICTS_DATA, getDistrictByName, getHighRiskDistricts } from '../data/districtsData';
import { DISEASE_DATA } from '../data/diseaseData';

export const WhatsappBotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Vanakkam. I am VyaadhiShield AI Public Health Bot for Tamil Nadu. How can I assist you today? You can ask about district risk scores, disease symptoms, or type "alerts".',
      time: '09:00'
    },
    {
      id: 2,
      sender: 'user',
      text: 'What is the risk level for Chennai?',
      time: '09:01'
    },
    {
      id: 3,
      sender: 'bot',
      text: 'Chennai (சென்னை) Outbreak Status: High Risk (Score: 88/100). 7-Day Case Count: 142 Dengue, 38 Cholera, 19 Malaria. Cumulative rainfall is 42.5mm with 82% humidity. Public health directive: Immediate vector fogging in coastal wards.',
      time: '09:01'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // AI Bot Response Parser
    setTimeout(() => {
      let botReply = '';
      const query = text.toLowerCase();

      // Check if query contains any district name
      const matchedDistrict = DISTRICTS_DATA.find((d) => query.includes(d.name.toLowerCase()));

      if (matchedDistrict) {
        botReply = `${matchedDistrict.name} (${matchedDistrict.tamilName}) Outbreak Status: ${matchedDistrict.riskLevel.toUpperCase()} RISK (Score: ${matchedDistrict.riskScore}/100). Total 7-day cases: ${matchedDistrict.totalCases7d}. Weather: ${matchedDistrict.weather.rainfall}mm rain, ${matchedDistrict.weather.temperature}°C, ${matchedDistrict.weather.humidity}% humidity. Recommendation: ${matchedDistrict.recommendation}`;
      } else if (query.includes('alert') || query.includes('high risk')) {
        const high = getHighRiskDistricts();
        botReply = `Currently ${high.length} districts are under High Outbreak Alert: ` + high.map(d => `${d.name} (${d.riskScore})`).join(', ') + `. Please take anti-vector precautions.`;
      } else if (query.includes('dengue')) {
        botReply = `Dengue Symptoms: High fever, retro-orbital headache, joint/muscle pain, and petechial rash. Prevention: Eliminate standing water in flowerpots, tires, and containers. Call 104 for free telemedicine consultation.`;
      } else if (query.includes('cholera')) {
        botReply = `Cholera Alert: Transmitted through contaminated food or water. Symptoms: Sudden watery diarrhea, rapid dehydration. Precaution: Drink only boiled water and consume hot food.`;
      } else if (query.includes('malaria')) {
        botReply = `Malaria Info: Spread by female Anopheles mosquitoes. Symptoms: Cyclical shivering fever paroxysms. Prevention: Sleep under insecticidal nets and inspect rooftop water tanks.`;
      } else if (query.includes('helpline') || query.includes('emergency') || query.includes('hospital') || query.includes('phone')) {
        botReply = `Emergency Medical Helplines: Ambulance Services: 108 | Tamil Nadu Health Helpline: 104 | DPH Control Room: 044-29510400 | Mental Health Helpline: 14416.`;
      } else {
        botReply = `I can help you monitor outbreaks across all 37 districts of Tamil Nadu. Try typing a district name like "Madurai", or ask "What are the high risk alerts?", or "Dengue symptoms".`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const quickChips = [
    "Chennai Risk",
    "High Risk Alerts",
    "Madurai Outbreak",
    "Dengue Symptoms",
    "Emergency Helplines",
    "Coimbatore Hospital Beds"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={24} className="text-emerald-500" />
            <span>Interactive WhatsApp AI Surveillance Bot</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            WhatsApp Webhook integration for citizen inquiries and automated district outbreak telemetry queries.
          </p>
        </div>
      </div>

      {/* 2. WhatsApp Device Frame */}
      <div
        className="glass-card"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid var(--border-strong)'
        }}
      >
        {/* WhatsApp Top Bar */}
        <div
          style={{
            padding: '12px 18px',
            background: '#075e54',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#128c7e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>VyaadhiShield AI Assistant</div>
              <div style={{ fontSize: '11px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
                <span>Verified Public Health Bot | online</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '6px' }}>
            +91 94450 12345
          </div>
        </div>

        {/* Chat Message Stream */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            background: 'var(--bg-main)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '75%',
                  background: isBot ? 'var(--bg-card)' : '#056162',
                  color: isBot ? 'var(--text-primary)' : '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  borderTopLeftRadius: isBot ? '2px' : '12px',
                  borderTopRightRadius: isBot ? '12px' : '2px',
                  border: isBot ? '1px solid var(--border-base)' : 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.6, textAlign: 'right', marginTop: '4px' }}>
                  {msg.time}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div
          style={{
            padding: '8px 16px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="btn btn-secondary text-xs"
              style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '9999px' }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-base)',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Type a message (e.g. 'Salem risk', 'dengue symptoms')..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="input-control text-xs"
            style={{ borderRadius: '9999px', padding: '10px 18px' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsappBotPage;

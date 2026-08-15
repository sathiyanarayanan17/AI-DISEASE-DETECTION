import React, { useState, useEffect, useRef } from 'react';
import { MOCK_DISTRICTS } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const DISTRICT_NAMES = MOCK_DISTRICTS.map(d => d.district);

function parseQuery(text) {
  const lower = text.toLowerCase().trim();

  if (lower === 'help' || lower === '/help') {
    return {
      type: 'help',
      content: 'Available commands:\n- Type a district name (e.g. "Chennai") to get its risk info\n- "alerts" to see all high-risk districts\n- "status" to see overall system status\n- "help" to see this message',
    };
  }

  if (lower.includes('alert') || lower.includes('high risk') || lower.includes('show alerts')) {
    const highRisk = MOCK_DISTRICTS.filter(d => d.risk_level === 'High');
    const list = highRisk.map(d => `- ${d.district}: Score ${d.risk_score}`).join('\n');
    return {
      type: 'alerts',
      content: `Currently ${highRisk.length} high-risk districts:\n${list}`,
    };
  }

  if (lower.includes('status') || lower.includes('overview')) {
    const high = MOCK_DISTRICTS.filter(d => d.risk_level === 'High').length;
    const med = MOCK_DISTRICTS.filter(d => d.risk_level === 'Medium').length;
    const low = MOCK_DISTRICTS.filter(d => d.risk_level === 'Low').length;
    return {
      type: 'status',
      content: `System Status:\n- High Risk: ${high} districts\n- Medium Risk: ${med} districts\n- Low Risk: ${low} districts\n- Total Monitored: ${MOCK_DISTRICTS.length} districts`,
    };
  }

  const matched = DISTRICT_NAMES.find(name => lower.includes(name.toLowerCase()));
  if (matched) {
    const d = MOCK_DISTRICTS.find(dd => dd.district === matched);
    return {
      type: 'district',
      content: `${d.district} Risk Report:\n- Risk Score: ${d.risk_score}/100\n- Risk Level: ${d.risk_level}\n- Avg Cases (7d): ${d.avg_cases_7d}\n- Confidence: ${(d.confidence * 100).toFixed(1)}%\n\nRecommendation: ${d.recommendation}`,
      district: d,
    };
  }

  return {
    type: 'unknown',
    content: `I could not understand "${text}". Try typing a district name like "Chennai" or "Madurai", or type "help" for available commands.`,
  };
}

const INITIAL_MESSAGES = [
  { id: 1, sender: 'bot', text: 'Welcome to VyaadhiShield Bot! I can help you check disease risk levels across Tamil Nadu districts.', time: '18:30' },
  { id: 2, sender: 'user', text: 'What is Chennai risk?', time: '18:31' },
  { id: 3, sender: 'bot', text: parseQuery('What is Chennai risk?').content, time: '18:31' },
  { id: 4, sender: 'bot', text: 'Type "help" to see all available commands, or just ask me about any district!', time: '18:32' },
];

export default function WhatsAppBot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const nextId = useRef(5);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

    const userMsg = { id: nextId.current++, sender: 'user', text, time: timeStr };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = parseQuery(text);
      const botMsg = { id: nextId.current++, sender: 'bot', text: response.content, time: timeStr, district: response.district };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* WhatsApp-style header */}
      <div style={{
        background: '#075e54',
        color: '#fff',
        padding: '14px 20px',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#128c7e', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.2rem',
        }}>
          Bot
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>VyaadhiShield Bot</div>
          <div style={{ fontSize: '0.72rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#25d366', display: 'inline-block' }}></span>
            online
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        background: '#e5ddd5',
        height: 500,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
          }}>
            <div style={{
              background: msg.sender === 'user' ? '#dcf8c6' : '#ffffff',
              padding: '8px 12px',
              borderRadius: msg.sender === 'user' ? '10px 10px 0 10px' : '10px 10px 10px 0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              fontSize: '0.84rem',
              color: '#303030',
              whiteSpace: 'pre-line',
              lineHeight: 1.5,
            }}>
              {msg.text}
              {msg.district && (
                <div style={{ marginTop: 6 }}>
                  <RiskBadge level={msg.district.risk_level} />
                </div>
              )}
              <div style={{ fontSize: '0.62rem', color: '#999', textAlign: 'right', marginTop: 4 }}>
                {msg.time}
                {msg.sender === 'user' && ' Read'}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        background: '#f0f0f0',
        padding: '10px 14px',
        borderRadius: '0 0 16px 16px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (try 'alerts' or a district name)"
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 20,
            border: 'none',
            background: '#fff',
            fontSize: '0.84rem',
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#075e54', border: 'none', color: '#fff',
            fontSize: '1.1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Send
        </button>
      </div>

      {/* Info card */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">About WhatsApp Bot Integration</h3>
        </div>
        <div className="card-body" style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
          <p>This is a demonstration of the WhatsApp chatbot interface. In production, the bot connects via the WhatsApp Business API (Twilio/Meta) to provide real-time risk alerts to health officers.</p>
          <p style={{ marginTop: 10 }}>Supported queries: district risk lookup, high-risk alerts summary, system status overview, and help commands.</p>
        </div>
      </div>
    </div>
  );
}

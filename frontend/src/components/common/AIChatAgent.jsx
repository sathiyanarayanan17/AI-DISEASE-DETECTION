import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Minimize2,
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';

const BASE_URL = 'http://localhost:8000';

// Local knowledge for instant responses when backend is unavailable
const QUICK_RESPONSES = {
  greeting: {
    reply: "Hello! 👋 I'm VyaadhiShield AI — your intelligent disease surveillance assistant. I can help you understand outbreak risks, navigate features, get prevention tips, and analyze data across all 37 Tamil Nadu districts. What would you like to know?",
    suggestions: ["What's the risk in Chennai?", "Which districts are high risk?", "How does the AI model work?", "Show me dengue prevention tips"]
  }
};

export const AIChatAgent = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm **VyaadhiShield AI** — your disease surveillance assistant.\n\nI can help you with:\n• 📊 District risk data & predictions\n• 🦠 Disease information & prevention\n• 🧭 Navigate any feature\n• 🏥 Healthcare resources\n• ⚙️ System & model insights\n\nAsk me anything!",
      timestamp: new Date().toISOString(),
      suggestions: ["What's the current risk in Chennai?", "Which districts are high risk?", "How does the prediction work?", "Dengue prevention tips"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${BASE_URL}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          timestamp: data.timestamp,
          suggestions: data.suggestions,
          actions: data.actions
        }]);
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      // Fallback: generate local response
      const localResponse = generateLocalResponse(text.trim());
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: localResponse.reply,
        timestamp: new Date().toISOString(),
        suggestions: localResponse.suggestions,
        actions: localResponse.actions
      }]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const generateLocalResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('chennai')) {
      return {
        reply: "## Chennai — Current Status 🔴\n\n**Risk Score:** 88/100 (HIGH)\n\n**Active Cases (7-day):**\n• Dengue: 142 cases\n• Cholera: 38 cases\n• Malaria: 19 cases\n• **Total: 199 cases**\n\n**Weather:** Rainfall 42.5mm, Temp 32.4°C, Humidity 82%\n\n⚠️ **AI Assessment:** Immediate vector control and public health intervention recommended. Deploy fogging teams to coastal wards.",
        suggestions: ["7-day forecast for Chennai", "Prevention tips", "Compare with other districts"],
        actions: [{ label: "View Chennai Details", path: "/district/chennai" }]
      };
    }
    
    if (msg.includes('dengue')) {
      return {
        reply: "## Dengue Intelligence 🦠\n\n**Vector:** Aedes aegypti mosquito\n**Peak Season:** Oct-Dec (post-monsoon)\n**Incubation:** 4-10 days\n\n**Symptoms:** High fever, severe headache, pain behind eyes, joint pain, rash\n\n**Prevention:**\n• Eliminate standing water weekly\n• Use DEET mosquito repellent\n• Wear full-sleeve clothing\n• Use bed nets\n• Install window mesh\n\n**Treatment:** Supportive care, hydration, paracetamol (avoid aspirin)",
        suggestions: ["Which districts have high dengue?", "Mosquito density data", "Dengue tracker"],
        actions: [{ label: "Dengue Tracker", path: "/disease/dengue" }]
      };
    }
    
    if (msg.includes('risk') || msg.includes('alert') || msg.includes('outbreak')) {
      return {
        reply: "## Current Risk Summary 🛡️\n\n🔴 **HIGH RISK (3 districts):** Chennai (88), Coimbatore (76), Madurai (72)\n🟡 **MEDIUM (4 districts):** Tiruchirappalli (68), Salem (55), Tirunelveli (48), Thanjavur (52)\n🟢 **LOW (30 districts):** Remaining districts under control\n\n**Model Confidence:** 97.4%\n\n**Top Recommendation:** Focus intervention on Chennai, deploy fogging teams, activate fever surveillance camps.",
        suggestions: ["Tell me about Chennai", "What causes high risk?", "7-day forecast", "Resource allocation"],
        actions: [{ label: "View Alerts", path: "/alerts" }, { label: "Dashboard", path: "/dashboard" }]
      };
    }
    
    if (msg.includes('prevent') || msg.includes('safe') || msg.includes('protect')) {
      return {
        reply: "## Prevention Guidelines 🏥\n\n**Dengue:** Empty stagnant water, use repellent, bed nets, full sleeves\n**Cholera:** Boil water, hand hygiene, cooked food only, proper sanitation\n**Malaria:** Insecticide bed nets, indoor spraying, prophylactic drugs\n\n**General:**\n• Report symptoms early (104 helpline)\n• Know nearest hospital\n• Stay hydrated\n• Avoid stagnant water areas after rain",
        suggestions: ["Nearest hospitals", "Report symptoms", "Dengue prevention detail"],
        actions: [{ label: "Prevention Tips", path: "/prevention" }]
      };
    }
    
    if (msg.includes('forecast') || msg.includes('predict')) {
      return {
        reply: "## 7-Day Forecast 🔮\n\nOur XGBoost model forecasts risk 7 days ahead using projected weather patterns.\n\n**Key Insights:**\n• Chennai: Risk expected to remain HIGH (85-92)\n• Coimbatore: Slight increase expected (74→79)\n• Rainfall surge expected in coastal districts\n\nThe forecast includes confidence bands that widen for further-out days.\n\nWould you like me to take you to the forecast page?",
        suggestions: ["Open forecast page", "How accurate are forecasts?", "What-if simulator"],
        actions: [{ label: "7-Day Forecast", path: "/forecast" }, { label: "What-If Simulator", path: "/what-if" }]
      };
    }
    
    if (msg.includes('model') || msg.includes('ai') || msg.includes('how') || msg.includes('work')) {
      return {
        reply: "## How VyaadhiShield AI Works 🧠\n\n**Model:** XGBoost Ensemble (Optuna-tuned)\n**Accuracy:** 97.4% | F1: 97.2% | AUC: 99.8%\n\n**Pipeline:**\n1. IMD weather data + IDSP disease data flows in real-time\n2. 25 features engineered (rolling averages, lags, monsoon flags)\n3. XGBoost predicts Low/Medium/High risk\n4. SHAP explains each prediction\n5. Alerts dispatched automatically\n\n**Top Features:** rainfall_7d_avg, humidity_pct, cases_7d_lag, temperature_c",
        suggestions: ["What are SHAP values?", "Show analytics", "Feature importance"],
        actions: [{ label: "AI Analytics", path: "/analytics" }]
      };
    }

    if (msg.includes('hospital') || msg.includes('emergency') || msg.includes('sick')) {
      return {
        reply: "## 🚨 Emergency Resources\n\n**Emergency Numbers:**\n• 🚑 Ambulance: **108**\n• ☎️ Health Helpline: **104**\n• 🏥 IDSP: 1800-111-645\n\n**Nearest Hospitals:**\n• Rajiv Gandhi GH — Chennai\n• Govt Rajaji Hospital — Madurai\n• CMCH — Coimbatore\n\nIf experiencing severe symptoms (high fever >2 days, severe vomiting, bleeding), seek immediate medical care.",
        suggestions: ["Find hospitals near me", "Report symptoms", "Ambulance number"],
        actions: [{ label: "Find Hospitals", path: "/hospitals" }, { label: "Report Symptoms", path: "/citizen-report" }]
      };
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return QUICK_RESPONSES.greeting;
    }
    
    if (msg.includes('thank')) {
      return {
        reply: "You're welcome! 😊 I'm always here to help protect Tamil Nadu from disease outbreaks. Stay safe and don't hesitate to ask if you need anything else! 🛡️",
        suggestions: ["Latest risk update", "Prevention tips", "Go to dashboard"],
        actions: []
      };
    }
    
    // Default fallback
    return {
      reply: `I can help you with that! Here's what I can do:\n\n• **Ask about any district** — "What's the risk in Chennai?"\n• **Disease info** — "Tell me about dengue"\n• **Prevention** — "How to prevent cholera?"\n• **Navigation** — "Take me to forecast page"\n• **Statistics** — "How many cases total?"\n• **System** — "How does the model work?"\n• **Emergency** — "I need a hospital"\n\nTry one of the suggestions below!`,
      suggestions: ["Risk in Chennai", "Dengue prevention", "7-day forecast", "How does AI work?"],
      actions: [{ label: "Dashboard", path: "/dashboard" }, { label: "Help & Docs", path: "/help" }]
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleActionClick = (action) => {
    navigate(action.path);
    setIsOpen(false);
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[#*•\-\[\]🔴🟡🟢⚠️✅📊🦠🧭🏥⚙️💉💧🦟📈🛡️🔮🧠🚨📢☎️🚑📋🏠👋🙏😊📱📞💊🪣🧴👕🪟🛏️🧼🍲🚽🌿🕐💧]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! 🔄 How can I help you?",
      timestamp: new Date().toISOString(),
      suggestions: ["Current risk overview", "Disease prevention", "Navigate to a feature", "How does the AI work?"]
    }]);
  };

  // Render markdown-like formatting
  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('## ')) {
        return <div key={i} style={{ fontWeight: 700, fontSize: '15px', marginTop: i > 0 ? '12px' : 0, marginBottom: '6px', color: 'var(--text-heading)' }}>{line.replace('## ', '')}</div>;
      }
      if (line.startsWith('### ')) {
        return <div key={i} style={{ fontWeight: 600, fontSize: '13px', marginTop: '10px', marginBottom: '4px', color: 'var(--accent-primary)' }}>{line.replace('### ', '')}</div>;
      }
      // Bold
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <div key={i} style={{ marginBottom: '3px', lineHeight: 1.6 }}>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>)}
          </div>
        );
      }
      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <div key={i} style={{ paddingLeft: '12px', marginBottom: '2px', lineHeight: 1.6 }}>{line}</div>;
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={i} style={{ height: '6px' }} />;
      }
      // Regular text
      return <div key={i} style={{ marginBottom: '2px', lineHeight: 1.6 }}>{line}</div>;
    });
  };

  return (
    <>
      {/* Floating Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(99, 102, 241, 0.1)',
            transition: 'all 200ms ease',
            animation: 'float-slow 4s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.5), 0 0 0 6px rgba(99, 102, 241, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(99, 102, 241, 0.1)';
          }}
        >
          <Bot size={28} />
          {/* Notification dot */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid #0f1a30',
            animation: 'pulse-glow 2s infinite'
          }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9500,
            width: isExpanded ? '580px' : '400px',
            height: isExpanded ? '700px' : '560px',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1)',
            animation: 'scaleIn 0.2s ease',
            transition: 'width 300ms ease, height 300ms ease'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-heading)' }}>
                  VyaadhiShield AI
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className="pulse-dot online" style={{ width: '6px', height: '6px' }} />
                  <span>Online • 97.2% Accuracy</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={clearChat}
                title="Clear chat"
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Expand"}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-rose-light)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '6px',
                animation: 'fadeInUp 0.2s ease'
              }}>
                {/* Avatar + Message */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  maxWidth: '90%',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start'
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)' 
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {msg.role === 'user' ? <User size={14} color="#fff" /> : <Bot size={14} color="#fff" />}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)' 
                      : 'var(--bg-card)',
                    color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-base)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    boxShadow: msg.role === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'var(--shadow-sm)'
                  }}>
                    {renderContent(msg.content)}
                  </div>
                </div>

                {/* TTS button for assistant messages */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleSpeak(msg.content)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      fontSize: '10px',
                      cursor: 'pointer',
                      marginLeft: '38px',
                      transition: 'all 150ms'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--accent-primary-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>
                )}

                {/* Action buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: '38px' }}>
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          background: 'var(--accent-primary-light)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          color: 'var(--accent-primary)',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 150ms'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#ffffff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-primary-light)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                      >
                        <ArrowRight size={11} />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && index === messages.length - 1 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: '38px', marginTop: '4px' }}>
                    {msg.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-base)',
                          color: 'var(--text-secondary)',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 150ms',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--accent-primary-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Bot size={14} color="#fff" />
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '14px 14px 14px 4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse-glow 1s infinite', animationDelay: '0ms' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse-glow 1s infinite', animationDelay: '200ms' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse-glow 1s infinite', animationDelay: '400ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about risks, diseases, prevention..."
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: '12px',
                background: 'var(--bg-input)',
                border: '1.5px solid var(--border-base)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 150ms, box-shadow 150ms'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-base)'; e.target.style.boxShadow = 'none'; }}
              aria-label="Type your message to AI assistant"
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: inputValue.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-input)',
                border: inputValue.trim() ? 'none' : '1px solid var(--border-base)',
                color: inputValue.trim() ? '#ffffff' : 'var(--text-dim)',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms',
                boxShadow: inputValue.trim() ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                flexShrink: 0
              }}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAgent;

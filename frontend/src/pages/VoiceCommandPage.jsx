import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, Send, Clock, Settings } from 'lucide-react';

const VoiceCommandPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Ready');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const exampleCommands = [
    'What is the risk in Chennai?',
    'Navigate to alerts',
    'Show dengue data',
    'How many cases today?',
    'Read me the forecast',
    'Go to dashboard',
    'Show water quality',
    'What is the mosquito density?'
  ];

  const navigationMap = {
    'dashboard': '/',
    'alerts': '/alerts',
    'dengue': '/disease-tracker',
    'disease': '/disease-tracker',
    'forecast': '/forecast',
    'analytics': '/analytics',
    'real-time': '/realtime',
    'realtime': '/realtime',
    'water quality': '/water-quality',
    'mosquito': '/mosquito',
    'vaccination': '/vaccination',
    'reports': '/reports',
    'settings': '/settings',
    'notifications': '/notifications',
    'citizen': '/citizen-report',
    'hospitals': '/hospitals',
    'simulator': '/epidemic-simulator',
    'heatmap': '/heatmap',
    'resources': '/resources'
  };

  const handleNavigation = useCallback((text) => {
    const lower = text.toLowerCase();
    for (const [keyword, route] of Object.entries(navigationMap)) {
      if (lower.includes(keyword)) {
        navigate(route);
        return true;
      }
    }
    return false;
  }, [navigate]);

  const speakResponse = useCallback((text) => {
    if (!autoSpeak) return;
    setStatus('Speaking...');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = speechRate;
    utterance.onend = () => setStatus('Ready');
    utterance.onerror = () => setStatus('Ready');
    synthRef.current.cancel();
    synthRef.current.speak(utterance);
  }, [autoSpeak, language, speechRate]);

  const sendToAgent = useCallback(async (message) => {
    setStatus('Processing...');
    try {
      // Check for navigation commands first
      const navKeywords = ['go to', 'navigate to', 'show', 'open', 'take me to'];
      const lower = message.toLowerCase();
      const isNavCommand = navKeywords.some(k => lower.startsWith(k) || lower.includes(k));

      if (isNavCommand && handleNavigation(message)) {
        const reply = `Navigating as requested.`;
        setAiResponse(reply);
        addToHistory(message, reply);
        speakResponse(reply);
        return;
      }

      const res = await fetch('http://localhost:8000/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not process that request.';
      setAiResponse(reply);
      addToHistory(message, reply);
      speakResponse(reply);

      // Handle navigation actions from backend
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach(action => {
          if (action.type === 'navigate' && action.route) {
            navigate(action.route);
          }
        });
      }
    } catch (err) {
      const errorMsg = 'Unable to connect to the AI agent. Please check if the backend is running.';
      setAiResponse(errorMsg);
      addToHistory(message, errorMsg);
      setStatus('Ready');
    }
  }, [handleNavigation, navigate, speakResponse]);

  const addToHistory = (userMsg, aiMsg) => {
    setHistory(prev => [
      { id: Date.now(), user: userMsg, ai: aiMsg, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 10));
  };

  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAiResponse('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening...');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
      if (finalTranscript) {
        sendToAgent(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setStatus('Ready');
      if (event.error === 'no-speech') {
        setAiResponse('No speech detected. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (status === 'Listening...') {
        setStatus('Ready');
      }
    };

    return recognition;
  }, [language, sendToAgent, status]);

  useEffect(() => {
    recognitionRef.current = initRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      synthRef.current.cancel();
    };
  }, [initRecognition]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatus('Ready');
    } else {
      setTranscript('');
      setAiResponse('');
      recognitionRef.current = initRecognition();
      recognitionRef.current?.start();
    }
  };

  const handleExampleClick = (cmd) => {
    setTranscript(cmd);
    sendToAgent(cmd);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setStatus('Ready');
  };

  const statusColors = {
    'Ready': 'var(--color-success, #10b981)',
    'Listening...': 'var(--color-danger, #ef4444)',
    'Processing...': 'var(--color-warning, #f59e0b)',
    'Speaking...': 'var(--color-primary, #6366f1)'
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
            🎙️ AI Voice Command Interface
          </h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', margin: '0.25rem 0 0' }}>
            Speak commands to interact with VyaadhiShield
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: 'var(--bg-secondary, rgba(255,255,255,0.05))',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'var(--text-primary, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          aria-label="Voice settings"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      {/* Status Indicator */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: statusColors[status],
            animation: status === 'Listening...' ? 'pulse 1.5s infinite' : 'none',
            boxShadow: `0 0 8px ${statusColors[status]}`
          }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: statusColors[status] }}>
            {status}
          </span>
        </div>
      </div>

      {/* Main Microphone Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button
          onClick={toggleListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: 'none',
            background: isListening
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening
              ? '0 0 0 8px rgba(239,68,68,0.2), 0 0 40px rgba(239,68,68,0.3)'
              : '0 0 0 4px rgba(99,102,241,0.2), 0 0 30px rgba(99,102,241,0.2)',
            transition: 'all 0.3s ease',
            animation: isListening ? 'micPulse 1.5s infinite' : 'none'
          }}
        >
          {isListening ? <MicOff size={48} /> : <Mic size={48} />}
        </button>
      </div>

      {/* Transcript and Response */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary, #94a3b8)' }}>
            🗣️ You Said
          </h3>
          <div style={{
            minHeight: '80px',
            padding: '1rem',
            borderRadius: '0.5rem',
            background: 'var(--bg-tertiary, rgba(255,255,255,0.03))',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            fontSize: '1.05rem',
            color: transcript ? 'var(--text-primary, #e2e8f0)' : 'var(--text-secondary, #64748b)',
            fontStyle: transcript ? 'normal' : 'italic'
          }}>
            {transcript || 'Your speech will appear here...'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary, #94a3b8)' }}>
              🤖 AI Response
            </h3>
            {status === 'Speaking...' && (
              <button
                onClick={stopSpeaking}
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '0.375rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem'
                }}
                aria-label="Stop speaking"
              >
                <VolumeX size={14} /> Stop
              </button>
            )}
          </div>
          <div style={{
            minHeight: '80px',
            padding: '1rem',
            borderRadius: '0.5rem',
            background: 'var(--bg-tertiary, rgba(255,255,255,0.03))',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            fontSize: '1.05rem',
            color: aiResponse ? 'var(--text-primary, #e2e8f0)' : 'var(--text-secondary, #64748b)',
            fontStyle: aiResponse ? 'normal' : 'italic'
          }}>
            {aiResponse || 'AI response will appear here...'}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Voice Settings
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Language */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.5rem' }}>
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-control"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  background: 'var(--bg-secondary, rgba(255,255,255,0.05))',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  color: 'var(--text-primary, #e2e8f0)'
                }}
              >
                <option value="en-IN">English (India)</option>
                <option value="ta-IN">Tamil (தமிழ்)</option>
              </select>
            </div>

            {/* Speech Rate */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.5rem' }}>
                Speech Rate: {speechRate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
                aria-label="Speech rate"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary, #64748b)' }}>
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Auto-Speak Toggle */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.5rem' }}>
                Auto-Speak Responses
              </label>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  background: autoSpeak ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary, rgba(255,255,255,0.05))',
                  color: autoSpeak ? '#818cf8' : 'var(--text-secondary, #94a3b8)',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
                aria-label={`Auto-speak is ${autoSpeak ? 'enabled' : 'disabled'}`}
              >
                {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {autoSpeak ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Example Commands and History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Example Commands */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={16} /> Example Commands
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {exampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(cmd)}
                style={{
                  textAlign: 'left',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                  background: 'var(--bg-tertiary, rgba(255,255,255,0.03))',
                  color: 'var(--text-primary, #e2e8f0)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(99,102,241,0.1)';
                  e.target.style.borderColor = 'rgba(99,102,241,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-tertiary, rgba(255,255,255,0.03))';
                  e.target.style.borderColor = 'var(--border-color, rgba(255,255,255,0.08))';
                }}
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>

        {/* Command History */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} /> Command History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-secondary, #64748b)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                No voice interactions yet. Tap the microphone to start.
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'var(--bg-tertiary, rgba(255,255,255,0.03))',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.08))'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)' }}>
                      {item.timestamp}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#818cf8' }}>
                    🗣️ {item.user}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)' }}>
                    🤖 {item.ai.length > 100 ? item.ai.substring(0, 100) + '...' : item.ai}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes micPulse {
          0% { box-shadow: 0 0 0 8px rgba(239,68,68,0.2), 0 0 40px rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 20px rgba(239,68,68,0.05), 0 0 60px rgba(239,68,68,0.15); }
          100% { box-shadow: 0 0 0 8px rgba(239,68,68,0.2), 0 0 40px rgba(239,68,68,0.3); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default VoiceCommandPage;

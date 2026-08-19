import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Search,
  Tag,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  Activity,
  FileText,
  Trash2,
  ChevronRight,
  Sparkles,
  Heart,
  Thermometer,
  ClipboardList
} from 'lucide-react';

const symptomPatterns = [
  { keyword: 'fever', aliases: ['high fever', 'mild fever', 'burning', 'temperature', 'pyrexia', 'febrile'], category: 'symptom' },
  { keyword: 'body pain', aliases: ['body ache', 'muscle pain', 'myalgia', 'aching', 'pain all over'], category: 'symptom' },
  { keyword: 'rash', aliases: ['skin rash', 'rashes', 'spots', 'eruption', 'red spots'], category: 'symptom' },
  { keyword: 'headache', aliases: ['head pain', 'migraine', 'head ache'], category: 'symptom' },
  { keyword: 'vomiting', aliases: ['vomit', 'throwing up', 'nausea', 'puking', 'emesis'], category: 'symptom' },
  { keyword: 'diarrhea', aliases: ['loose stools', 'loose motion', 'watery stool', 'diarrhoea', 'frequent stools'], category: 'symptom' },
  { keyword: 'dehydration', aliases: ['dehydrated', 'dry mouth', 'no tears', 'sunken eyes', 'thirst'], category: 'symptom' },
  { keyword: 'chills', aliases: ['chill', 'shivering', 'rigors', 'cold shiver'], category: 'symptom' },
  { keyword: 'sweating', aliases: ['sweat', 'sweats', 'night sweats', 'profuse sweating', 'diaphoresis'], category: 'symptom' },
  { keyword: 'cyclic fever', aliases: ['intermittent fever', 'recurring fever', 'periodic fever', 'fever comes and goes'], category: 'symptom' },
  { keyword: 'joint pain', aliases: ['joint ache', 'arthralgia', 'painful joints', 'swollen joints'], category: 'symptom' },
  { keyword: 'fatigue', aliases: ['tiredness', 'weakness', 'exhaustion', 'lethargy', 'tired', 'weak'], category: 'symptom' },
  { keyword: 'cough', aliases: ['coughing', 'dry cough', 'wet cough'], category: 'symptom' },
  { keyword: 'bleeding', aliases: ['blood', 'bleeding gums', 'nose bleed', 'hemorrhage'], category: 'symptom' },
  { keyword: 'abdominal pain', aliases: ['stomach pain', 'stomach ache', 'belly pain', 'cramps', 'abdominal cramps'], category: 'symptom' },
  { keyword: 'loss of appetite', aliases: ['no appetite', 'not eating', 'anorexia', 'poor appetite'], category: 'symptom' },
  { keyword: 'eye pain', aliases: ['pain behind eyes', 'retro-orbital pain', 'eye ache'], category: 'symptom' },
];

const bodyPartPatterns = [
  'arms', 'legs', 'chest', 'back', 'abdomen', 'head', 'neck', 'face',
  'hands', 'feet', 'stomach', 'throat', 'eyes', 'ears', 'nose',
  'joints', 'skin', 'mouth', 'torso', 'limbs', 'forehead'
];

const severityClues = [
  { keyword: 'high', level: 'high' },
  { keyword: 'severe', level: 'high' },
  { keyword: 'very', level: 'high' },
  { keyword: 'extreme', level: 'high' },
  { keyword: 'intense', level: 'high' },
  { keyword: 'unbearable', level: 'high' },
  { keyword: 'mild', level: 'low' },
  { keyword: 'slight', level: 'low' },
  { keyword: 'moderate', level: 'medium' },
  { keyword: 'persistent', level: 'medium' },
  { keyword: 'worsening', level: 'high' },
  { keyword: 'acute', level: 'high' },
];

const diseaseRules = [
  {
    disease: 'Dengue',
    required: ['fever', 'rash', 'body pain'],
    supporting: ['headache', 'joint pain', 'eye pain', 'bleeding', 'fatigue'],
    color: '#f59e0b'
  },
  {
    disease: 'Cholera',
    required: ['vomiting', 'diarrhea', 'dehydration'],
    supporting: ['abdominal pain', 'weakness', 'cramps'],
    color: '#06b6d4'
  },
  {
    disease: 'Malaria',
    required: ['cyclic fever', 'chills', 'sweating'],
    supporting: ['headache', 'fatigue', 'nausea', 'body pain'],
    color: '#8b5cf6'
  },
  {
    disease: 'Chikungunya',
    required: ['fever', 'joint pain', 'rash'],
    supporting: ['headache', 'fatigue', 'body pain'],
    color: '#ec4899'
  },
  {
    disease: 'Typhoid',
    required: ['fever', 'abdominal pain', 'headache'],
    supporting: ['loss of appetite', 'fatigue', 'diarrhea'],
    color: '#10b981'
  }
];

function extractEntities(text) {
  const lower = text.toLowerCase();
  const results = {
    symptoms: [],
    duration: null,
    patientAge: null,
    patientType: null,
    bodyParts: [],
    severity: [],
  };

  // Extract symptoms
  symptomPatterns.forEach(pattern => {
    const allTerms = [pattern.keyword, ...pattern.aliases];
    for (const term of allTerms) {
      if (lower.includes(term)) {
        const contextWindow = 30;
        const idx = lower.indexOf(term);
        const before = lower.slice(Math.max(0, idx - contextWindow), idx);
        let confidence = 0.85 + Math.random() * 0.12;

        // Boost confidence if severity word is near
        const hasSeverity = severityClues.some(s => before.includes(s.keyword));
        if (hasSeverity) confidence = Math.min(confidence + 0.05, 0.99);

        if (!results.symptoms.find(s => s.keyword === pattern.keyword)) {
          results.symptoms.push({
            keyword: pattern.keyword,
            matchedTerm: term,
            confidence: parseFloat(confidence.toFixed(2)),
          });
        }
        break;
      }
    }
  });

  // Extract duration
  const durationRegex = /(\d+)\s*(days?|weeks?|hours?|months?)\b/i;
  const sinceRegex = /since\s+(\d+)\s*(days?|weeks?|hours?|months?)/i;
  const forRegex = /for\s+(\d+)\s*(days?|weeks?|hours?|months?)/i;
  const durationMatch = text.match(sinceRegex) || text.match(forRegex) || text.match(durationRegex);
  if (durationMatch) {
    results.duration = {
      value: parseInt(durationMatch[1]),
      unit: durationMatch[2].replace(/s$/, ''),
      raw: durationMatch[0],
      confidence: 0.94,
    };
  }

  // Extract patient age
  const ageRegex = /(\d+)\s*(year|yr|month|mo)s?\s*old/i;
  const ageMatch = text.match(ageRegex);
  if (ageMatch) {
    const ageVal = parseInt(ageMatch[1]);
    const ageUnit = ageMatch[2].toLowerCase().startsWith('mo') ? 'months' : 'years';
    results.patientAge = {
      value: ageVal,
      unit: ageUnit,
      confidence: 0.96,
    };

    // Determine patient type
    if (ageUnit === 'months' || ageVal <= 12) {
      results.patientType = { type: 'child', confidence: 0.95 };
    } else if (ageVal <= 17) {
      results.patientType = { type: 'adolescent', confidence: 0.93 };
    } else if (ageVal <= 60) {
      results.patientType = { type: 'adult', confidence: 0.92 };
    } else {
      results.patientType = { type: 'elderly', confidence: 0.92 };
    }
  } else {
    // Check for keywords
    if (lower.includes('son') || lower.includes('daughter') || lower.includes('child') || lower.includes('kid') || lower.includes('baby') || lower.includes('infant')) {
      results.patientType = { type: 'child', confidence: 0.82 };
    } else if (lower.includes('husband') || lower.includes('wife') || lower.includes('myself') || lower.includes(' i ')) {
      results.patientType = { type: 'adult', confidence: 0.78 };
    } else if (lower.includes('grandmother') || lower.includes('grandfather') || lower.includes('elderly')) {
      results.patientType = { type: 'elderly', confidence: 0.80 };
    }
  }

  // Extract body parts
  bodyPartPatterns.forEach(part => {
    if (lower.includes(part)) {
      results.bodyParts.push({ part, confidence: 0.88 });
    }
  });

  // Extract severity
  severityClues.forEach(clue => {
    if (lower.includes(clue.keyword)) {
      if (!results.severity.find(s => s.keyword === clue.keyword)) {
        results.severity.push({ keyword: clue.keyword, level: clue.level, confidence: 0.82 });
      }
    }
  });

  return results;
}

function matchDiseases(symptoms) {
  const symptomKeywords = symptoms.map(s => s.keyword);
  const matches = [];

  diseaseRules.forEach(rule => {
    const requiredMatched = rule.required.filter(r => symptomKeywords.includes(r));
    const supportingMatched = rule.supporting.filter(s => symptomKeywords.includes(s));

    const requiredScore = requiredMatched.length / rule.required.length;
    const supportingScore = rule.supporting.length > 0 ? supportingMatched.length / rule.supporting.length : 0;

    const totalScore = (requiredScore * 0.75) + (supportingScore * 0.25);
    const percentage = Math.round(totalScore * 100);

    if (percentage > 20) {
      matches.push({
        disease: rule.disease,
        percentage,
        matchedRequired: requiredMatched,
        matchedSupporting: supportingMatched,
        allRequired: rule.required,
        color: rule.color,
      });
    }
  });

  matches.sort((a, b) => b.percentage - a.percentage);
  return matches;
}

export default function NLPSymptomPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [diseaseMatches, setDiseaseMatches] = useState([]);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const entities = extractEntities(inputText);
      const diseases = matchDiseases(entities.symptoms);
      setResults(entities);
      setDiseaseMatches(diseases);

      setHistory(prev => [{
        id: Date.now(),
        text: inputText.slice(0, 80) + (inputText.length > 80 ? '...' : ''),
        timestamp: new Date().toLocaleString(),
        symptomsCount: entities.symptoms.length,
        topDisease: diseases[0]?.disease || 'Unknown',
        topScore: diseases[0]?.percentage || 0,
      }, ...prev].slice(0, 10));

      setIsAnalyzing(false);
    }, 1200);
  };

  const handleAutoFill = () => {
    const params = new URLSearchParams();
    if (results) {
      params.set('symptoms', results.symptoms.map(s => s.keyword).join(','));
      if (results.duration) params.set('duration', `${results.duration.value} ${results.duration.unit}`);
      if (results.patientAge) params.set('age', `${results.patientAge.value}`);
      if (results.patientType) params.set('patientType', results.patientType.type);
      if (diseaseMatches[0]) params.set('suspectedDisease', diseaseMatches[0].disease);
    }
    navigate(`/citizen-report?${params.toString()}`);
  };

  const clearHistory = () => setHistory([]);

  const chipColors = {
    symptom: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#fca5a5' },
    duration: { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', text: '#93c5fd' },
    age: { bg: 'rgba(168,85,247,0.15)', border: '#a855f7', text: '#d8b4fe' },
    patientType: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', text: '#86efac' },
    bodyPart: { bg: 'rgba(249,115,22,0.15)', border: '#f97316', text: '#fdba74' },
    severity: { bg: 'rgba(234,179,8,0.15)', border: '#eab308', text: '#fde047' },
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Brain size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#f1f5f9' }}>
              NLP Symptom Extraction
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
              Extract symptoms, duration, and disease predictions from natural language
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column - Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Text Input Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FileText size={18} color="#8b5cf6" />
              <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '16px' }}>Patient Description</h3>
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type or paste natural language description, e.g.: 'My 5 year old son has had high fever and body pain since 3 days. He also has rash on his arms.'"
              style={{
                width: '100%', minHeight: '180px', padding: '16px',
                background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '12px', color: '#f1f5f9', fontSize: '15px',
                lineHeight: '1.6', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#8b5cf6'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'}
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="btn btn-primary"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', fontSize: '15px', fontWeight: 600,
                  opacity: (!inputText.trim() || isAnalyzing) ? 0.5 : 1,
                  cursor: (!inputText.trim() || isAnalyzing) ? 'not-allowed' : 'pointer',
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Analyze
                  </>
                )}
              </button>
              <button
                onClick={() => setInputText('My 5 year old son has had high fever and body pain since 3 days. He also has rash on his arms.')}
                className="btn btn-secondary"
                style={{ padding: '12px 18px', fontSize: '14px' }}
              >
                Load Example
              </button>
            </div>
          </div>

          {/* Disease Match Card */}
          {diseaseMatches.length > 0 && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Activity size={18} color="#f59e0b" />
                <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '16px' }}>Probable Disease Match</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {diseaseMatches.map((match, idx) => (
                  <div key={match.disease} style={{
                    padding: '16px', borderRadius: '12px',
                    background: idx === 0 ? `${match.color}15` : 'rgba(15,23,42,0.4)',
                    border: `1px solid ${idx === 0 ? match.color : 'rgba(148,163,184,0.1)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: idx === 0 ? '18px' : '15px', color: match.color }}>
                        {match.disease}
                      </span>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 700,
                        background: `${match.color}30`, color: match.color,
                      }}>
                        {match.percentage}% match
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: '6px', background: 'rgba(148,163,184,0.1)', borderRadius: '3px', marginBottom: '10px' }}>
                      <div style={{ height: '100%', width: `${match.percentage}%`, background: match.color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {match.allRequired.map(req => {
                        const matched = match.matchedRequired.includes(req);
                        return (
                          <span key={req} style={{
                            padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                            background: matched ? `${match.color}25` : 'rgba(148,163,184,0.1)',
                            color: matched ? match.color : '#64748b',
                            border: `1px solid ${matched ? match.color : 'transparent'}`,
                            textDecoration: matched ? 'none' : 'line-through',
                          }}>
                            {req} {matched ? '✓' : '✗'}
                          </span>
                        );
                      })}
                      {match.matchedSupporting.map(s => (
                        <span key={s} style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                          background: 'rgba(148,163,184,0.08)', color: '#94a3b8',
                          border: '1px dashed rgba(148,163,184,0.3)',
                        }}>
                          +{s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Auto-fill button */}
              <button
                onClick={handleAutoFill}
                className="btn btn-primary"
                style={{
                  marginTop: '16px', width: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', fontSize: '15px', fontWeight: 600,
                }}
              >
                <ClipboardList size={18} />
                Auto-Fill Citizen Report
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Extracted Entities */}
          {results && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Tag size={18} color="#22c55e" />
                <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '16px' }}>Extracted Entities</h3>
              </div>

              {/* Symptoms */}
              {results.symptoms.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Thermometer size={14} color={chipColors.symptom.border} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Symptoms ({results.symptoms.length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {results.symptoms.map(s => (
                      <div key={s.keyword} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '20px',
                        background: chipColors.symptom.bg,
                        border: `1px solid ${chipColors.symptom.border}`,
                      }}>
                        <span style={{ color: chipColors.symptom.text, fontSize: '14px', fontWeight: 500 }}>
                          {s.keyword}
                        </span>
                        <span style={{
                          fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                          padding: '2px 6px', borderRadius: '8px',
                        }}>
                          {Math.round(s.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              {results.duration && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Clock size={14} color={chipColors.duration.border} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Duration
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '20px',
                      background: chipColors.duration.bg,
                      border: `1px solid ${chipColors.duration.border}`,
                    }}>
                      <span style={{ color: chipColors.duration.text, fontSize: '14px', fontWeight: 500 }}>
                        {results.duration.value} {results.duration.unit}{results.duration.value > 1 ? 's' : ''}
                      </span>
                      <span style={{
                        fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                        padding: '2px 6px', borderRadius: '8px',
                      }}>
                        {Math.round(results.duration.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Age */}
              {results.patientAge && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <User size={14} color={chipColors.age.border} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Patient Age
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '20px',
                      background: chipColors.age.bg,
                      border: `1px solid ${chipColors.age.border}`,
                    }}>
                      <span style={{ color: chipColors.age.text, fontSize: '14px', fontWeight: 500 }}>
                        {results.patientAge.value} {results.patientAge.unit}
                      </span>
                      <span style={{
                        fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                        padding: '2px 6px', borderRadius: '8px',
                      }}>
                        {Math.round(results.patientAge.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Type */}
              {results.patientType && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Heart size={14} color={chipColors.patientType.border} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Patient Type
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '20px',
                      background: chipColors.patientType.bg,
                      border: `1px solid ${chipColors.patientType.border}`,
                    }}>
                      <span style={{ color: chipColors.patientType.text, fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>
                        {results.patientType.type}
                      </span>
                      <span style={{
                        fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                        padding: '2px 6px', borderRadius: '8px',
                      }}>
                        {Math.round(results.patientType.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Body Parts */}
              {results.bodyParts.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <MapPin size={14} color={chipColors.bodyPart.border} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Body Parts ({results.bodyParts.length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {results.bodyParts.map(bp => (
                      <div key={bp.part} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '20px',
                        background: chipColors.bodyPart.bg,
                        border: `1px solid ${chipColors.bodyPart.border}`,
                      }}>
                        <span style={{ color: chipColors.bodyPart.text, fontSize: '14px', fontWeight: 500 }}>
                          {bp.part}
                        </span>
                        <span style={{
                          fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                          padding: '2px 6px', borderRadius: '8px',
                        }}>
                          {Math.round(bp.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Severity Clues */}
              {results.severity.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={14} color={chipColors.severity.border} />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Severity Clues ({results.severity.length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {results.severity.map(s => (
                      <div key={s.keyword} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '20px',
                        background: chipColors.severity.bg,
                        border: `1px solid ${chipColors.severity.border}`,
                      }}>
                        <span style={{ color: chipColors.severity.text, fontSize: '14px', fontWeight: 500 }}>
                          {s.keyword}
                        </span>
                        <span style={{
                          fontSize: '11px', padding: '2px 6px', borderRadius: '8px',
                          background: s.level === 'high' ? 'rgba(239,68,68,0.3)' : s.level === 'medium' ? 'rgba(249,115,22,0.3)' : 'rgba(34,197,94,0.3)',
                          color: s.level === 'high' ? '#fca5a5' : s.level === 'medium' ? '#fdba74' : '#86efac',
                        }}>
                          {s.level}
                        </span>
                        <span style={{
                          fontSize: '11px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)',
                          padding: '2px 6px', borderRadius: '8px',
                        }}>
                          {Math.round(s.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.symptoms.length === 0 && (
                <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                  No symptoms detected. Try describing symptoms in natural language.
                </p>
              )}
            </div>
          )}

          {/* Placeholder when no results */}
          {!results && (
            <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Brain size={48} color="#475569" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#64748b', fontSize: '16px', fontWeight: 500, margin: '0 0 8px' }}>
                Enter patient description and click Analyze
              </h3>
              <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
                The NLP engine will extract symptoms, duration, patient info, and predict probable diseases
              </p>
            </div>
          )}

          {/* History */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#64748b" />
                <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '16px' }}>Extraction History</h3>
              </div>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    color: '#64748b', fontSize: '13px',
                  }}
                >
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                No extraction history yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {history.map(item => (
                  <div key={item.id} style={{
                    padding: '12px', borderRadius: '10px',
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(148,163,184,0.1)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>
                        {item.text}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{item.timestamp}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {item.symptomsCount} symptoms
                      </span>
                      {item.topDisease !== 'Unknown' && (
                        <span style={{
                          fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                          background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                        }}>
                          {item.topDisease} ({item.topScore}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spinning keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

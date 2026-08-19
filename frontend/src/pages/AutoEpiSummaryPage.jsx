import React, { useState, useEffect } from 'react';
import {
  FileText, MapPin, Star, Type, RefreshCw, Mail, MessageSquare,
  Phone, Clock, ChevronDown, ChevronUp, Check, AlertTriangle,
  TrendingUp, Droplets, Bug, Shield, Send, Archive, Calendar,
  Zap, Globe, FileCheck
} from 'lucide-react';

const mockDistrictData = [
  { name: 'Chennai', risk: 'high', dengue: 142, cholera: 18, malaria: 7, rainfall: 48, humidity: 87, trend: '+18%' },
  { name: 'Cuddalore', risk: 'high', dengue: 67, cholera: 12, malaria: 22, rainfall: 44, humidity: 84, trend: '+12%' },
  { name: 'Nagapattinam', risk: 'high', dengue: 53, cholera: 9, malaria: 15, rainfall: 34, humidity: 83, trend: '+9%' },
  { name: 'Madurai', risk: 'medium', dengue: 34, cholera: 28, malaria: 5, rainfall: 18, humidity: 72, trend: '+6%' },
  { name: 'Tiruchirappalli', risk: 'medium', dengue: 29, cholera: 6, malaria: 11, rainfall: 22, humidity: 74, trend: '+3%' },
  { name: 'Coimbatore', risk: 'low', dengue: 12, cholera: 2, malaria: 3, rainfall: 8, humidity: 65, trend: '-2%' },
  { name: 'Salem', risk: 'low', dengue: 9, cholera: 1, malaria: 4, rainfall: 6, humidity: 62, trend: '-4%' },
];

const pastSummaries = [
  { id: 1, date: '2026-08-18', title: 'Daily Epidemiological Intelligence Brief', quality: 94, words: 1842, tone: 'Technical' },
  { id: 2, date: '2026-08-17', title: 'Daily Epidemiological Intelligence Brief', quality: 91, words: 1756, tone: 'Technical' },
  { id: 3, date: '2026-08-16', title: 'Weekend Summary Report', quality: 88, words: 2340, tone: 'General' },
  { id: 4, date: '2026-08-15', title: 'Independence Day Special Brief', quality: 92, words: 1920, tone: 'General' },
  { id: 5, date: '2026-08-14', title: 'Urgent Outbreak Alert Summary', quality: 96, words: 1105, tone: 'Urgent' },
  { id: 6, date: '2026-08-13', title: 'Daily Epidemiological Intelligence Brief', quality: 89, words: 1680, tone: 'Technical' },
];

function generateSummary(tone, length, sections) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const highRiskDistricts = mockDistrictData.filter(d => d.risk === 'high');
  const avgRainfall = Math.round(highRiskDistricts.reduce((s, d) => s + d.rainfall, 0) / highRiskDistricts.length);
  const avgHumidity = Math.round(highRiskDistricts.reduce((s, d) => s + d.humidity, 0) / highRiskDistricts.length);
  const totalDengue = mockDistrictData.reduce((s, d) => s + d.dengue, 0);
  const totalCholera = mockDistrictData.reduce((s, d) => s + d.cholera, 0);
  const totalMalaria = mockDistrictData.reduce((s, d) => s + d.malaria, 0);

  let report = '';

  const header = tone === 'Urgent'
    ? `⚠️ URGENT EPIDEMIOLOGICAL ALERT — Tamil Nadu — ${dateStr}`
    : `DAILY EPIDEMIOLOGICAL INTELLIGENCE BRIEF\nTamil Nadu State Health Department\n${dateStr}\nClassification: ${tone === 'Technical' ? 'RESTRICTED — For Official Use Only' : 'PUBLIC DISTRIBUTION'}`;

  report += header + '\n\n';
  report += '━'.repeat(60) + '\n\n';

  if (sections.executive) {
    if (tone === 'Urgent') {
      report += `🔴 EXECUTIVE SUMMARY — ELEVATED RISK\n\n`;
      report += `IMMEDIATE ATTENTION REQUIRED: Disease outbreak risk remains CRITICALLY ELEVATED across ${highRiskDistricts.length} coastal districts (${highRiskDistricts.map(d => d.name).join(', ')}) driven by sustained rainfall (${avgRainfall}mm average over 7 days) and dangerously high humidity levels (${avgHumidity}%). Immediate deployment of emergency response teams is recommended.\n\n`;
    } else if (tone === 'Technical') {
      report += `EXECUTIVE SUMMARY\n\n`;
      report += `Disease outbreak risk classification remains at ELEVATED status across ${highRiskDistricts.length} coastal districts (${highRiskDistricts.map(d => d.name).join(', ')}) attributable to sustained precipitation patterns (${avgRainfall}mm 7-day rolling average) and elevated relative humidity (${avgHumidity}%). Epidemiological indicators suggest potential escalation within 7-14 day forecast window. Current effective reproduction number (Rt) for dengue estimated at 1.4 (95% CI: 1.2–1.6) in Chennai metropolitan area.\n\n`;
    } else {
      report += `EXECUTIVE SUMMARY\n\n`;
      report += `Disease outbreak risk is HIGH in ${highRiskDistricts.length} coastal districts — ${highRiskDistricts.map(d => d.name).join(', ')}. Heavy rainfall (${avgRainfall}mm average) and high humidity (${avgHumidity}%) are creating favorable conditions for disease spread. Health authorities should remain on alert.\n\n`;
    }
  }

  if (sections.keyFindings) {
    report += `KEY FINDINGS\n\n`;
    report += `1. DENGUE SURVEILLANCE: Chennai district reports ${mockDistrictData[0].dengue} confirmed cases this week, representing an ${mockDistrictData[0].trend} week-over-week increase. ${tone === 'Technical' ? 'Serotype DENV-2 predominant (68% of sequenced samples). Vector density indices exceed action thresholds (Breteau Index: 42, House Index: 28).' : 'Cases are concentrated in coastal wards with poor drainage infrastructure.'}\n\n`;
    report += `2. CHOLERA CLUSTER: ${tone === 'Urgent' ? '🔴 ' : ''}Active cluster detected in Madurai Ward 7 with ${mockDistrictData[3].cholera} confirmed cases. ${tone === 'Technical' ? 'Vibrio cholerae O1 Ogawa biotype El Tor confirmed via culture. Water samples from 3/7 tested bore wells show coliform counts >1800 MPN/100mL.' : 'Contaminated water supply suspected as primary transmission route. Boil-water advisory issued.'}\n\n`;
    report += `3. MALARIA INCIDENCE: Cuddalore reports ${mockDistrictData[1].malaria} new Plasmodium vivax cases, linked to stagnant water accumulation in post-monsoon paddy fields. ${tone === 'Technical' ? 'Slide positivity rate (SPR): 4.2%, exceeding 2% API threshold for enhanced surveillance.' : 'Agricultural areas near irrigation canals most affected.'}\n\n`;

    if (length !== 'Brief') {
      report += `4. ENVIRONMENTAL INDICATORS: Water Quality Index (WQI) scores below acceptable thresholds in ${highRiskDistricts.length + 1} districts. Dissolved oxygen levels critically low (<4 mg/L) in ${mockDistrictData[1].name} coastal zone. ${tone === 'Technical' ? 'Satellite-derived Normalized Difference Water Index (NDWI) indicates 23% increase in surface water bodies compared to 5-year August average.' : 'Increased stagnant water bodies observed via satellite imagery.'}\n\n`;
      report += `5. POPULATION MOVEMENT: Festival season migration patterns indicate approximately 180,000 additional transient population in Chennai over the next 10 days, potentially amplifying transmission dynamics.\n\n`;
    }
  }

  if (sections.statistics && length !== 'Brief') {
    report += `STATISTICAL OVERVIEW\n\n`;
    report += `┌─────────────────────────────────────────────────────┐\n`;
    report += `│ Disease        │ Total Cases │ WoW Change │ CFR     │\n`;
    report += `├─────────────────────────────────────────────────────┤\n`;
    report += `│ Dengue         │ ${String(totalDengue).padEnd(11)} │ +14.2%     │ 0.3%    │\n`;
    report += `│ Cholera        │ ${String(totalCholera).padEnd(11)} │ +8.7%      │ 1.2%    │\n`;
    report += `│ Malaria        │ ${String(totalMalaria).padEnd(11)} │ +5.1%      │ 0.1%    │\n`;
    report += `└─────────────────────────────────────────────────────┘\n\n`;
    report += `Total Surveillance Coverage: 37/37 districts reporting (100%)\n`;
    report += `Active Surveillance Sites: 847 | Sentinel Sites: 124\n`;
    report += `Lab Confirmation Rate: 78.4% (Target: >80%)\n\n`;
  }

  if (sections.recommendations) {
    report += `RECOMMENDATIONS & ACTION ITEMS\n\n`;
    if (tone === 'Urgent') {
      report += `⚡ IMMEDIATE ACTIONS REQUIRED:\n\n`;
    }
    report += `1. Deploy ${tone === 'Urgent' ? '12' : '8'} additional fogging teams to Chennai coastal wards (T. Nagar, Mylapore, Adyar, Besant Nagar) — Priority: ${tone === 'Urgent' ? 'CRITICAL' : 'HIGH'}\n\n`;
    report += `2. Activate emergency water testing protocol for Madurai Wards 5-9. Dispatch 4 mobile water testing units with chlorination equipment.\n\n`;
    report += `3. Issue public health advisory for Cuddalore district: personal protective measures, insecticide-treated nets distribution to agricultural households.\n\n`;

    if (length === 'Detailed') {
      report += `4. Pre-position 5,000 ORS packets and IV fluid supplies at Madurai GH and 3 PHCs in affected wards.\n\n`;
      report += `5. Activate syndromic surveillance at all Chennai transit hubs (Central Station, CMBT, Airport) for incoming festival travelers.\n\n`;
      report += `6. Schedule emergency review meeting with DMHOs of ${highRiskDistricts.map(d => d.name).join(', ')} within 48 hours.\n\n`;
      report += `7. Request IMD enhanced weather bulletin for next 10 days — potential cyclonic circulation in Bay of Bengal may escalate rainfall.\n\n`;
    }
  }

  if (sections.forecast && length !== 'Brief') {
    report += `7-DAY RISK FORECAST\n\n`;
    report += `• Day 1-3: ELEVATED risk persists. Continued rainfall expected (IMD: 30-45mm/day).\n`;
    report += `• Day 4-5: Potential ESCALATION if rainfall exceeds 50mm threshold. Dengue case surge likely (lag effect).\n`;
    report += `• Day 6-7: Gradual de-escalation expected as monsoon trough shifts northward. ${tone === 'Technical' ? 'Model confidence: 72% (ensemble agreement: 4/5 models).' : ''}\n\n`;
  }

  if (sections.aiConfidence) {
    report += `AI MODEL CONFIDENCE & METHODOLOGY\n\n`;
    report += `• Prediction Model: XGBoost Ensemble (v3.2.1) | Optuna-tuned\n`;
    report += `• Training Data: IDSP + IMD (2023-2026) | 37 districts × 1,095 days\n`;
    report += `• Model F1-Score: 0.92 | ROC-AUC: 0.97\n`;
    report += `• Current Prediction Confidence: ${tone === 'Urgent' ? '94' : '89'}%\n`;
    report += `• SHAP Top Features: rainfall_7d_avg (0.34), humidity_pct (0.21), dengue_cases_7d (0.18)\n`;
    report += `• Last Retrained: ${new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN')}\n\n`;
  }

  report += '━'.repeat(60) + '\n';
  report += `\nGenerated by VyaadhiShield AI Engine v3.2.1\n`;
  report += `Report ID: EPI-TN-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}\n`;
  report += `Timestamp: ${today.toISOString()}\n`;
  report += `Next Scheduled Report: ${new Date(Date.now() + 86400000).toLocaleDateString('en-IN')} 06:00 IST\n`;

  return report;
}

export default function AutoEpiSummaryPage() {
  const [tone, setTone] = useState('Technical');
  const [length, setLength] = useState('Standard');
  const [sections, setSections] = useState({
    executive: true,
    keyFindings: true,
    statistics: true,
    recommendations: true,
    forecast: true,
    aiConfidence: true,
  });
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const stats = {
    reportsToday: 3,
    districtsCovered: 37,
    avgQuality: 92.4,
    wordsGenerated: summary.split(/\s+/).filter(Boolean).length,
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setSummary(generateSummary(tone, length, sections));
      setGenerating(false);
    }, 1200);
  };

  const handleSectionToggle = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSend = (channel) => {
    setSendStatus(channel);
    setTimeout(() => setSendStatus(null), 2500);
  };

  const statCards = [
    { label: 'Reports Generated Today', value: stats.reportsToday, icon: FileText, color: '#6366f1' },
    { label: 'Districts Covered', value: stats.districtsCovered, icon: MapPin, color: '#10b981' },
    { label: 'Avg Report Quality Score', value: `${stats.avgQuality}%`, icon: Star, color: '#f59e0b' },
    { label: 'Words Generated', value: stats.wordsGenerated.toLocaleString(), icon: Type, color: '#8b5cf6' },
  ];

  const sectionOptions = [
    { key: 'executive', label: 'Executive Summary' },
    { key: 'keyFindings', label: 'Key Findings' },
    { key: 'statistics', label: 'Statistical Overview' },
    { key: 'recommendations', label: 'Recommendations' },
    { key: 'forecast', label: '7-Day Forecast' },
    { key: 'aiConfidence', label: 'AI Confidence & Methodology' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FileCheck size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>AI Auto-Generated Epidemiological Summary</h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Intelligent daily briefs powered by VyaadhiShield AI Engine
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{stat.label}</span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${stat.color}20`, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <stat.icon size={18} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Left Panel - Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tone Control */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="#f59e0b" /> Tone
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Technical', 'General', 'Urgent'].map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: '10px 14px', borderRadius: '8px', border: 'none',
                    background: tone === t ? (t === 'Urgent' ? '#ef444420' : '#6366f120') : '#1e293b',
                    color: tone === t ? (t === 'Urgent' ? '#ef4444' : '#818cf8') : '#94a3b8',
                    cursor: 'pointer', textAlign: 'left', fontWeight: tone === t ? '600' : '400',
                    fontSize: '13px', transition: 'all 0.2s',
                    outline: tone === t ? `1px solid ${t === 'Urgent' ? '#ef444450' : '#6366f150'}` : '1px solid transparent'
                  }}
                >
                  {t === 'Urgent' && '⚠️ '}{t}
                </button>
              ))}
            </div>
          </div>

          {/* Length Control */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#10b981" /> Length
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Brief', 'Standard', 'Detailed'].map(l => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  style={{
                    padding: '10px 14px', borderRadius: '8px', border: 'none',
                    background: length === l ? '#10b98120' : '#1e293b',
                    color: length === l ? '#10b981' : '#94a3b8',
                    cursor: 'pointer', textAlign: 'left', fontWeight: length === l ? '600' : '400',
                    fontSize: '13px', transition: 'all 0.2s',
                    outline: length === l ? '1px solid #10b98150' : '1px solid transparent'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Include Sections */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#8b5cf6" /> Include Sections
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sectionOptions.map(opt => (
                <label
                  key={opt.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                    background: sections[opt.key] ? '#8b5cf610' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div
                    onClick={() => handleSectionToggle(opt.key)}
                    style={{
                      width: '20px', height: '20px', borderRadius: '5px',
                      border: sections[opt.key] ? '2px solid #8b5cf6' : '2px solid #475569',
                      background: sections[opt.key] ? '#8b5cf6' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', flexShrink: 0
                    }}
                  >
                    {sections[opt.key] && <Check size={12} color="#fff" />}
                  </div>
                  <span style={{ fontSize: '13px', color: sections[opt.key] ? '#e2e8f0' : '#94a3b8' }}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Regenerate Button */}
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '14px', borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '14px', fontWeight: '600', width: '100%'
            }}
          >
            <RefreshCw size={16} className={generating ? 'spin' : ''} style={generating ? { animation: 'spin 1s linear infinite' } : {}} />
            {generating ? 'Generating...' : 'Regenerate Summary'}
          </button>

          {/* Send Buttons */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={16} color="#06b6d4" /> Distribute Report
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { channel: 'Email', icon: Mail, color: '#6366f1' },
                { channel: 'SMS', icon: Phone, color: '#10b981' },
                { channel: 'WhatsApp', icon: MessageSquare, color: '#22c55e' },
              ].map(({ channel, icon: Icon, color }) => (
                <button
                  key={channel}
                  className="btn btn-secondary"
                  onClick={() => handleSend(channel)}
                  style={{
                    padding: '10px 14px', borderRadius: '8px', display: 'flex',
                    alignItems: 'center', gap: '10px', fontSize: '13px', width: '100%',
                    justifyContent: 'flex-start'
                  }}
                >
                  <Icon size={16} color={color} />
                  {sendStatus === channel ? '✓ Sent!' : `Send via ${channel}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Summary Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Summary Output */}
          <div className="glass-card" style={{ padding: '24px', flex: 1 }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <FileText size={18} color="#6366f1" />
                Generated Report
                {tone === 'Urgent' && (
                  <span style={{
                    fontSize: '11px', background: '#ef444420', color: '#ef4444',
                    padding: '2px 8px', borderRadius: '12px', fontWeight: '600'
                  }}>URGENT</span>
                )}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {stats.wordsGenerated} words • {length}
                </span>
                <div style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                  fontWeight: '600', background: '#10b98120', color: '#10b981'
                }}>
                  Quality: 92%
                </div>
              </div>
            </div>

            {generating ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '80px 0', gap: '16px'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '3px solid #1e293b', borderTopColor: '#6366f1',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>AI generating epidemiological summary...</p>
              </div>
            ) : (
              <pre style={{
                whiteSpace: 'pre-wrap', wordWrap: 'break-word',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '12.5px', lineHeight: '1.7', color: '#e2e8f0',
                background: '#0f172a', borderRadius: '12px', padding: '24px',
                border: '1px solid #1e293b', maxHeight: '600px', overflowY: 'auto',
                margin: 0
              }}>
                {summary}
              </pre>
            )}
          </div>

          {/* Past Summaries Archive */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div
              className="flex-between"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowArchive(!showArchive)}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Archive size={18} color="#f59e0b" />
                Past Summaries Archive
                <span style={{
                  fontSize: '11px', background: '#f59e0b20', color: '#f59e0b',
                  padding: '2px 8px', borderRadius: '12px'
                }}>{pastSummaries.length}</span>
              </h3>
              {showArchive ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
            </div>

            {showArchive && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pastSummaries.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: '10px', background: '#1e293b',
                      border: '1px solid #334155', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Calendar size={16} color="#64748b" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {item.date} • {item.words} words • {item.tone}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
                      background: item.quality >= 92 ? '#10b98120' : item.quality >= 88 ? '#f59e0b20' : '#94a3b820',
                      color: item.quality >= 92 ? '#10b981' : item.quality >= 88 ? '#f59e0b' : '#94a3b8'
                    }}>
                      {item.quality}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

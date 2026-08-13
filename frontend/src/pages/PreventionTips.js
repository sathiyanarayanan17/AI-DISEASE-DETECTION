import React, { useState } from 'react';

const CURRENT_MONTH = new Date().getMonth() + 1;

const DISEASES = [
  {
    name: 'Dengue',
    icon: '🦟',
    seasonalMonths: [6, 7, 8, 9, 10, 11],
    tips: [
      'Eliminate standing water in containers, flower pots, and tyres around your home',
      'Use mosquito nets and repellents, especially during dawn and dusk hours',
      'Wear long-sleeved clothing and light-colored garments when outdoors',
      'Install mesh screens on windows and doors to prevent mosquito entry',
      'Support community fogging drives and report stagnant water collections to authorities',
    ],
    dos: ['Keep water storage containers tightly covered', 'Change water in coolers and vases weekly', 'Use larvicides in water tanks', 'Report dengue symptoms early to nearest PHC'],
    donts: ['Do not store water in open containers', 'Do not ignore persistent high fever', 'Do not self-medicate with aspirin or ibuprofen', 'Do not allow garbage accumulation near homes'],
  },
  {
    name: 'Cholera',
    icon: '💧',
    seasonalMonths: [4, 5, 6, 7, 8],
    tips: [
      'Always drink boiled or filtered water from clean sources',
      'Wash hands thoroughly with soap before eating and after using the toilet',
      'Avoid eating raw or undercooked seafood from contaminated waters',
      'Ensure proper disposal of human waste and maintain sanitary toilets',
      'Store food in clean, covered containers and reheat thoroughly before eating',
    ],
    dos: ['Use ORS solution at first sign of watery diarrhea', 'Chlorinate stored water regularly', 'Eat freshly cooked food only', 'Seek medical help immediately if dehydrated'],
    donts: ['Do not drink water from unknown sources', 'Do not eat street food during outbreaks', 'Do not defecate in open areas', 'Do not ignore watery diarrhea symptoms'],
  },
  {
    name: 'Malaria',
    icon: '🩸',
    seasonalMonths: [7, 8, 9, 10, 11, 12],
    tips: [
      'Sleep under insecticide-treated bed nets (ITNs) every night',
      'Apply DEET-based mosquito repellent on exposed skin during evening hours',
      'Clear bushes and vegetation near residential areas to reduce breeding sites',
      'Take prophylactic antimalarial medication if traveling to endemic zones',
      'Get a blood smear test done immediately if you have fever with chills',
    ],
    dos: ['Complete the full course of antimalarial drugs if prescribed', 'Report fever with chills within 24 hours to health center', 'Participate in indoor residual spraying programs', 'Keep surroundings clean and well-drained'],
    donts: ['Do not sleep without mosquito protection', 'Do not stop medication midway even if feeling better', 'Do not ignore recurring fever patterns', 'Do not allow water logging around your house'],
  },
];

export default function PreventionTips() {
  const [copied, setCopied] = useState('');

  const handleShare = (disease) => {
    const d = DISEASES.find(dd => dd.name === disease);
    if (!d) return;
    const text = `${d.name} Prevention Tips:\n\n${d.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nDo's:\n${d.dos.map(x => `- ${x}`).join('\n')}\n\nDon'ts:\n${d.donts.map(x => `- ${x}`).join('\n')}\n\n- EarlyAlert Disease Warning System`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(disease);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const isHighRisk = (months) => months.includes(CURRENT_MONTH);

  return (
    <div>
      {/* Seasonal Relevance */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h3 className="card-head-title">Seasonal Risk Status (August)</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {DISEASES.map(d => (
              <div key={d.name} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
                borderRadius: 10, border: '1px solid var(--border)',
                background: isHighRisk(d.seasonalMonths) ? 'var(--red-bg)' : 'var(--green-bg)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{d.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text1)' }}>{d.name}</div>
                  <div style={{ fontSize: '0.7rem', color: isHighRisk(d.seasonalMonths) ? '#dc2626' : '#059669', fontWeight: 600 }}>
                    {isHighRisk(d.seasonalMonths) ? '⚠ HIGH RISK this month' : '✓ Low risk this month'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Cards */}
      {DISEASES.map(disease => (
        <div key={disease.name} className="card" style={{ marginBottom: 20 }}>
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.4rem' }}>{disease.icon}</span>
              <h3 className="card-head-title">{disease.name}</h3>
              {isHighRisk(disease.seasonalMonths) ? (
                <span className="badge badge-high">⚠ High Risk</span>
              ) : (
                <span className="badge badge-low">✓ Low Risk</span>
              )}
            </div>
            <button
              className="btn-detail"
              onClick={() => handleShare(disease.name)}
            >
              {copied === disease.name ? '✓ Copied!' : '📋 Share Tips'}
            </button>
          </div>
          <div className="card-body">
            {/* Prevention Tips */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Prevention Tips
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 2.2 }}>
                {disease.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>

            {/* Do's and Don'ts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 14, background: 'var(--green-bg)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', marginBottom: 8 }}>DO's</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 2 }}>
                  {disease.dos.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div style={{ padding: 14, background: 'var(--red-bg)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>DON'Ts</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 2 }}>
                  {disease.donts.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Emergency Numbers */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-head-title">Emergency Contact Numbers</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { label: 'Health Helpline (TN)', number: '104', icon: '📞' },
              { label: 'Ambulance', number: '108', icon: '🚑' },
              { label: 'Disaster Management', number: '1070', icon: '🆘' },
              { label: 'District Collector', number: '1800-425-1234', icon: '🏛' },
              { label: 'ICMR Helpline', number: '011-2398-0000', icon: '🔬' },
              { label: 'National Health Portal', number: '1800-180-1104', icon: '🏥' },
            ].map(c => (
              <div key={c.label} style={{ padding: 14, background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>{c.number}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 4, fontWeight: 600 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

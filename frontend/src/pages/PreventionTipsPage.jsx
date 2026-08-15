import React, { useState } from 'react';
import {
  HeartPulse,
  Share2,
  Check,
  Flame,
  Droplet,
  Bug,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { DISEASE_DATA } from '../data/diseaseData';
import { useAlerts } from '../context/AlertContext';

export const PreventionTipsPage = () => {
  const { addToast } = useAlerts();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const advisory = `[TAMIL NADU PUBLIC HEALTH ADVISORY]\n` +
      `1. DENGUE: Empty all standing water in coolers, tires, and pots weekly.\n` +
      `2. CHOLERA: Drink only boiled water and wash hands before meals.\n` +
      `3. MALARIA: Sleep under mosquito nets and seal overhead water tanks.\n` +
      `Toll-Free Health Helpline: 104 | Ambulance: 108`;

    navigator.clipboard.writeText(advisory);
    setCopied(true);
    addToast("Advisory Copied", "Public health prevention guidelines copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const dosAndDonts = {
    dengue: {
      dos: [
        "Cover all overhead tanks, sumps, and drums with tight lids",
        "Clean flower vase trays and refrigerator drip trays every 5 days",
        "Apply DEET-based mosquito repellent on exposed skin during daytime",
        "Seek immediate medical care if severe retro-orbital headache develops"
      ],
      donts: [
        "Do NOT allow rain water to accumulate in discarded coconut shells or tires",
        "Do NOT take Aspirin or Ibuprofen for suspected dengue fever (use Paracetamol)",
        "Do NOT ignore petechial skin rashes or gum bleeding",
        "Do NOT self-medicate with antibiotics for viral dengue infections"
      ]
    },
    cholera: {
      dos: [
        "Boil drinking water vigorously for at least 1 minute before drinking",
        "Wash hands thoroughly with soap for 20 seconds before eating and cooking",
        "Immediately administer Oral Rehydration Solution (ORS) at onset of diarrhea",
        "Consume freshly prepared, steaming hot home-cooked food"
      ],
      donts: [
        "Do NOT drink unboiled tap water or ice made from unverified water sources",
        "Do NOT consume raw seafood, cut fruits from street vendors, or unpasteurized dairy",
        "Do NOT delay hospital admission if excessive vomiting occurs",
        "Do NOT defecate near open water bodies or irrigation channels"
      ]
    },
    malaria: {
      dos: [
        "Sleep under Long-Lasting Insecticidal Nets (LLINs) especially at night",
        "Introduce Gambusia or Guppy larvivorous fish in domestic cisterns",
        "Ensure window screens and door mesh are free from tears",
        "Complete full prescribed course of antimalarial medication even if fever stops"
      ],
      donts: [
        "Do NOT leave water storage ponds untreated near construction sites",
        "Do NOT venture out with exposed limbs during nocturnal feeding hours",
        "Do NOT delay diagnostic blood smear tests if experiencing cyclical shivering chills",
        "Do NOT allow slow-moving drains to become choked with plastic waste"
      ]
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeartPulse size={24} className="text-rose-400" />
            <span>Clinical Prevention Guidelines & Protocols</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Authoritative public health hygiene directives and clinical Do's and Don'ts.
          </p>
        </div>

        <button onClick={handleCopy} className="btn btn-primary text-xs">
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          <span>{copied ? 'Advisory Copied' : 'Copy Advisory Text'}</span>
        </button>
      </div>

      {/* 2. Seasonal Risk Calendar Ribbon */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px' }}>Tamil Nadu Epidemiological Seasonality Matrix</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px' }}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => {
            const isHighMonsoon = idx >= 9; // Oct, Nov, Dec
            const isMediumSW = idx >= 5 && idx <= 8; // Jun - Sep
            const color = isHighMonsoon ? '#f43f5e' : (isMediumSW ? '#f59e0b' : '#10b981');

            return (
              <div
                key={m}
                style={{
                  background: 'var(--bg-input)',
                  padding: '10px 4px',
                  borderRadius: '6px',
                  borderTop: `3px solid ${color}`
                }}
              >
                <div style={{ fontWeight: 700 }}>{m}</div>
                <div style={{ fontSize: '10px', color, marginTop: '2px', fontWeight: 600 }}>
                  {isHighMonsoon ? 'PEAK' : (isMediumSW ? 'MODERATE' : 'LOW')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Disease Do's and Don'ts Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Dengue */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={20} className="text-rose-400" />
            <h2 style={{ fontSize: '18px' }}>Dengue Fever Vector Prevention (Aedes aegypti)</h2>
          </div>

          <div className="grid-cols-2">
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Recommended Do's:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dosAndDonts.dengue.dos.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ color: 'var(--risk-high)', fontWeight: 700, fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={16} /> Strict Don'ts:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dosAndDonts.dengue.donts.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Cholera */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Droplet size={20} className="text-cyan-400" />
            <h2 style={{ fontSize: '18px' }}>Cholera & Enteric Infection Prevention (Vibrio cholerae)</h2>
          </div>

          <div className="grid-cols-2">
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Recommended Do's:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dosAndDonts.cholera.dos.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ color: 'var(--risk-high)', fontWeight: 700, fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={16} /> Strict Don'ts:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dosAndDonts.cholera.donts.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Malaria */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bug size={20} className="text-emerald-400" />
            <h2 style={{ fontSize: '18px' }}>Malaria Eradication Protocol (Anopheles)</h2>
          </div>

          <div className="grid-cols-2">
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Recommended Do's:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dosAndDonts.malaria.dos.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ color: 'var(--risk-high)', fontWeight: 700, fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <XCircle size={16} /> Strict Don'ts:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {dosAndDonts.malaria.donts.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventionTipsPage;

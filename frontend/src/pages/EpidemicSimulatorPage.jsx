import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Play,
  Save,
  GitCompare,
  Activity,
  Users,
  TrendingUp,
  Clock,
  Shield,
  RotateCcw,
  Info
} from 'lucide-react';

/**
 * SIR Epidemic Simulator using Euler's method.
 *
 * dS/dt = -beta * S * I / N
 * dI/dt = beta * S * I / N - gamma * I
 * dR/dt = gamma * I
 *
 * beta = R0 * gamma
 * gamma = 1 / infectionPeriod
 */
const runSIRSimulation = ({ r0, infectionPeriod, incubationPeriod, population, initialInfected, days = 180 }) => {
  const gamma = 1 / infectionPeriod;
  const beta = r0 * gamma;
  const dt = 0.5; // half-day step for accuracy
  const steps = Math.round(days / dt);

  let S = population - initialInfected;
  let I = initialInfected;
  let R = 0;

  const data = [];
  let peakInfections = 0;
  let timeToPeak = 0;

  for (let step = 0; step <= steps; step++) {
    const day = step * dt;

    if (Math.abs(day - Math.round(day)) < dt / 2 && (data.length === 0 || data[data.length - 1].day !== Math.round(day))) {
      const dayInt = Math.round(day);
      data.push({
        day: dayInt,
        susceptible: Math.max(0, Math.round(S)),
        infected: Math.max(0, Math.round(I)),
        recovered: Math.max(0, Math.round(R))
      });

      if (I > peakInfections) {
        peakInfections = Math.round(I);
        timeToPeak = dayInt;
      }
    }

    // Euler's method for SIR
    const dS = -beta * S * I / population;
    const dI = beta * S * I / population - gamma * I;
    const dR = gamma * I;

    S += dS * dt;
    I += dI * dt;
    R += dR * dt;

    // Clamp values
    S = Math.max(0, S);
    I = Math.max(0, I);
    R = Math.max(0, R);
  }

  const totalInfected = Math.round(population - data[data.length - 1].susceptible);
  const herdImmunityThreshold = r0 > 1 ? ((1 - 1 / r0) * 100).toFixed(1) : 0;

  return { data, peakInfections, timeToPeak, totalInfected, herdImmunityThreshold };
};

const EpidemicSimulatorPage = () => {
  // Simulation parameters
  const [r0, setR0] = useState(2.5);
  const [infectionPeriod, setInfectionPeriod] = useState(10);
  const [incubationPeriod, setIncubationPeriod] = useState(5);
  const [population, setPopulation] = useState(100000);
  const [initialInfected, setInitialInfected] = useState(10);

  // Simulation results
  const [simData, setSimData] = useState(null);
  const [stats, setStats] = useState(null);

  // Scenario comparison
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [compareMode, setCompareMode] = useState(false);

  // Run simulation
  const runSimulation = useCallback(() => {
    const result = runSIRSimulation({
      r0,
      infectionPeriod,
      incubationPeriod,
      population,
      initialInfected
    });
    setSimData(result.data);
    setStats({
      peakInfections: result.peakInfections,
      timeToPeak: result.timeToPeak,
      totalInfected: result.totalInfected,
      herdImmunityThreshold: result.herdImmunityThreshold
    });
  }, [r0, infectionPeriod, incubationPeriod, population, initialInfected]);

  // Run on mount
  useEffect(() => {
    runSimulation();
  }, []);

  // Save current scenario
  const saveScenario = () => {
    if (savedScenarios.length >= 5) return;
    setSavedScenarios((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: `Scenario ${prev.length + 1}`,
        params: { r0, infectionPeriod, incubationPeriod, population, initialInfected },
        stats: { ...stats },
        data: simData
      }
    ]);
  };

  // Remove scenario
  const removeScenario = (id) => {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  // Reset parameters
  const resetParams = () => {
    setR0(2.5);
    setInfectionPeriod(10);
    setIncubationPeriod(5);
    setPopulation(100000);
    setInitialInfected(10);
  };

  const formatNumber = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    appearance: 'none',
    WebkitAppearance: 'none',
    background: 'var(--bg-input)',
    outline: 'none',
    cursor: 'pointer'
  };

  const sliderLabelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
          <Activity size={24} style={{ color: '#6366f1' }} />
          SIR Epidemic Simulator
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
          Interactive compartmental model simulation using Euler's method — adjust parameters and visualize outbreak dynamics over 180 days.
        </p>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-4" style={{ gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <TrendingUp size={20} style={{ color: '#f43f5e', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#f43f5e' }}>
              {formatNumber(stats.peakInfections)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Peak Infections</div>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <Clock size={20} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#f59e0b' }}>
              Day {stats.timeToPeak}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Time to Peak</div>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <Users size={20} style={{ color: '#8b5cf6', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#8b5cf6' }}>
              {formatNumber(stats.totalInfected)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Infected</div>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <Shield size={20} style={{ color: '#10b981', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#10b981' }}>
              {stats.herdImmunityThreshold}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Herd Immunity Threshold</div>
          </div>
        </div>
      )}

      {/* Main Content: Control Panel + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Control Panel */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} style={{ color: '#6366f1' }} />
            Simulation Parameters
          </h2>

          {/* R0 Slider */}
          <div>
            <div style={sliderLabelStyle}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>R₀ (Reproduction Number)</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: r0 > 4 ? '#f43f5e' : r0 > 2 ? '#f59e0b' : '#10b981' }}>{r0.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.1"
              value={r0}
              onChange={(e) => setR0(parseFloat(e.target.value))}
              style={sliderStyle}
              aria-label="R0 reproduction number"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span>0.5</span>
              <span>8.0</span>
            </div>
          </div>

          {/* Infection Period Slider */}
          <div>
            <div style={sliderLabelStyle}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Infection Period (days)</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{infectionPeriod}</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={infectionPeriod}
              onChange={(e) => setInfectionPeriod(parseInt(e.target.value))}
              style={sliderStyle}
              aria-label="Infection period in days"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span>1</span>
              <span>30</span>
            </div>
          </div>

          {/* Incubation Period Slider */}
          <div>
            <div style={sliderLabelStyle}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Incubation Period (days)</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{incubationPeriod}</span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              step="1"
              value={incubationPeriod}
              onChange={(e) => setIncubationPeriod(parseInt(e.target.value))}
              style={sliderStyle}
              aria-label="Incubation period in days"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span>1</span>
              <span>14</span>
            </div>
          </div>

          {/* Population Size */}
          <div>
            <div style={sliderLabelStyle}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Population Size</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{formatNumber(population)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000000"
              step="1000"
              value={population}
              onChange={(e) => setPopulation(parseInt(e.target.value))}
              style={sliderStyle}
              aria-label="Population size"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span>1K</span>
              <span>10M</span>
            </div>
          </div>

          {/* Initial Infected */}
          <div>
            <div style={sliderLabelStyle}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Initial Infected</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{initialInfected}</span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              step="1"
              value={initialInfected}
              onChange={(e) => setInitialInfected(parseInt(e.target.value))}
              style={sliderStyle}
              aria-label="Initial infected count"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span>1</span>
              <span>1000</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <button
              className="btn btn-primary"
              onClick={runSimulation}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <Play size={14} />
              Run Simulation
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn"
                onClick={saveScenario}
                disabled={!stats || savedScenarios.length >= 5}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: savedScenarios.length >= 5 ? 'not-allowed' : 'pointer',
                  opacity: savedScenarios.length >= 5 ? 0.5 : 1
                }}
              >
                <Save size={12} />
                Save
              </button>
              <button
                className="btn"
                onClick={resetParams}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>
          </div>

          {/* Disease Presets */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Disease Presets
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: 'COVID-19', r0: 2.5, ip: 10, inc: 5 },
                { label: 'Measles', r0: 12, ip: 8, inc: 10 },
                { label: 'Dengue', r0: 2.2, ip: 7, inc: 5 },
                { label: 'Cholera', r0: 1.5, ip: 5, inc: 2 },
                { label: 'Ebola', r0: 1.8, ip: 12, inc: 9 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setR0(preset.r0);
                    setInfectionPeriod(preset.ip);
                    setIncubationPeriod(preset.inc);
                  }}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    cursor: 'pointer'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px' }}>
            SIR Compartmental Model — 180-Day Projection
          </h2>
          {simData && (
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={simData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)', fontSize: 11 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [formatNumber(value), name]}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="susceptible"
                  name="Susceptible (S)"
                  stroke="#3b82f6"
                  fill="url(#gradS)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="infected"
                  name="Infected (I)"
                  stroke="#f43f5e"
                  fill="url(#gradI)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="recovered"
                  name="Recovered (R)"
                  stroke="#10b981"
                  fill="url(#gradR)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Parameters display below chart */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>R₀ = <strong style={{ color: 'var(--text-primary)' }}>{r0.toFixed(1)}</strong></span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>γ = <strong style={{ color: 'var(--text-primary)' }}>{(1 / infectionPeriod).toFixed(3)}</strong></span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>β = <strong style={{ color: 'var(--text-primary)' }}>{(r0 / infectionPeriod).toFixed(3)}</strong></span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>N = <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(population)}</strong></span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>I₀ = <strong style={{ color: 'var(--text-primary)' }}>{initialInfected}</strong></span>
          </div>
        </div>
      </div>

      {/* Scenario Comparison Section */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCompare size={16} style={{ color: '#8b5cf6' }} />
            Scenario Comparison
          </h2>
          {savedScenarios.length >= 2 && (
            <button
              className="btn"
              onClick={() => setCompareMode(!compareMode)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                borderRadius: '8px',
                background: compareMode ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                color: compareMode ? '#a78bfa' : 'var(--text-secondary)',
                border: compareMode ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer'
              }}
            >
              {compareMode ? 'Hide Comparison' : 'Compare Side-by-Side'}
            </button>
          )}
        </div>

        {savedScenarios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <Save size={24} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
            <p>No saved scenarios yet. Adjust parameters, run a simulation, and click <strong>Save</strong> to store snapshots for comparison.</p>
          </div>
        ) : (
          <>
            {/* Saved scenario chips */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: compareMode ? '20px' : '0' }}>
              {savedScenarios.map((scenario, idx) => (
                <div
                  key={scenario.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    minWidth: '160px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scenario.label}</span>
                    <button
                      onClick={() => removeScenario(scenario.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
                      aria-label={`Remove ${scenario.label}`}
                    >
                      ×
                    </button>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                    R₀={scenario.params.r0} · IP={scenario.params.infectionPeriod}d · N={formatNumber(scenario.params.population)}
                  </span>
                  <span style={{ color: '#f43f5e', fontSize: '11px' }}>
                    Peak: {formatNumber(scenario.stats.peakInfections)} @ Day {scenario.stats.timeToPeak}
                  </span>
                </div>
              ))}
            </div>

            {/* Side-by-side comparison */}
            {compareMode && savedScenarios.length >= 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {savedScenarios.slice(0, 2).map((scenario, idx) => (
                  <div key={scenario.id} style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                      {scenario.label}
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={scenario.data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} tickFormatter={(v) => formatNumber(v)} />
                        <RechartsTooltip
                          contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px' }}
                          formatter={(value) => [formatNumber(value)]}
                          labelFormatter={(l) => `Day ${l}`}
                        />
                        <Area type="monotone" dataKey="susceptible" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={1.5} />
                        <Area type="monotone" dataKey="infected" stroke="#f43f5e" fill="rgba(244,63,94,0.15)" strokeWidth={1.5} />
                        <Area type="monotone" dataKey="recovered" stroke="#10b981" fill="rgba(16,185,129,0.1)" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Peak: <strong style={{ color: '#f43f5e' }}>{formatNumber(scenario.stats.peakInfections)}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Day: <strong style={{ color: '#f59e0b' }}>{scenario.stats.timeToPeak}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Total: <strong style={{ color: '#8b5cf6' }}>{formatNumber(scenario.stats.totalInfected)}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        HIT: <strong style={{ color: '#10b981' }}>{scenario.stats.herdImmunityThreshold}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Card */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Info size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>SIR Model Equations:</strong>{' '}
          dS/dt = −βSI/N, dI/dt = βSI/N − γI, dR/dt = γI. Where β = R₀ × γ and γ = 1/infection_period.
          The herd immunity threshold (HIT) = 1 − 1/R₀. Simulation uses Euler's method with dt=0.5 for numerical stability.
          The incubation period parameter is reserved for SEIR extension (Exposed compartment).
        </div>
      </div>
    </div>
  );
};

export default EpidemicSimulatorPage;

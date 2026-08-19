import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, SkipForward, RotateCcw, Users, Bug, Heart, Skull, Timer, Shield, Syringe, Lock } from 'lucide-react';

const GRID_SIZE = 20;
const STATUS = { HEALTHY: 0, INFECTED: 1, RECOVERED: 2, DEAD: 3 };
const DISTRICTS = ['North', 'South', 'East', 'West', 'Central'];

function createAgent(id, gridSize, status = STATUS.HEALTHY) {
  return {
    id,
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
    status,
    infectedTick: -1,
    district: DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)],
    quarantined: false,
    vaccinated: false,
    movementSpeed: 1,
  };
}

function initAgents(count, gridSize, initialInfected = 3) {
  const agents = [];
  for (let i = 0; i < count; i++) {
    agents.push(createAgent(i, gridSize, i < initialInfected ? STATUS.INFECTED : STATUS.HEALTHY));
  }
  agents.filter(a => a.status === STATUS.INFECTED).forEach(a => { a.infectedTick = 0; });
  return agents;
}

function buildGrid(agents, gridSize) {
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  agents.forEach(agent => {
    if (agent.status !== STATUS.DEAD) {
      const cellStatus = grid[agent.y][agent.x];
      if (cellStatus === null || agent.status === STATUS.INFECTED) {
        grid[agent.y][agent.x] = agent.status;
      }
    }
  });
  return grid;
}

export default function MultiAgentSimPage() {
  const [population, setPopulation] = useState(150);
  const [infectionRadius, setInfectionRadius] = useState(2);
  const [infectionProb, setInfectionProb] = useState(0.4);
  const [recoveryTime, setRecoveryTime] = useState(14);
  const [mortalityRate, setMortalityRate] = useState(0.05);
  const [movementSpeed, setMovementSpeed] = useState(1);
  const [speed, setSpeed] = useState(200);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [agents, setAgents] = useState(() => initAgents(150, GRID_SIZE));
  const [grid, setGrid] = useState(() => buildGrid(initAgents(150, GRID_SIZE), GRID_SIZE));
  const [sirData, setSirData] = useState([]);
  const [lockdownActive, setLockdownActive] = useState(false);

  const intervalRef = useRef(null);
  const agentsRef = useRef(agents);
  const tickRef = useRef(tick);

  useEffect(() => { agentsRef.current = agents; }, [agents]);
  useEffect(() => { tickRef.current = tick; }, [tick]);

  const computeStats = useCallback((agentList) => {
    let healthy = 0, infected = 0, recovered = 0, dead = 0;
    agentList.forEach(a => {
      if (a.status === STATUS.HEALTHY) healthy++;
      else if (a.status === STATUS.INFECTED) infected++;
      else if (a.status === STATUS.RECOVERED) recovered++;
      else if (a.status === STATUS.DEAD) dead++;
    });
    return { healthy, infected, recovered, dead };
  }, []);

  const simulateStep = useCallback(() => {
    setAgents(prev => {
      const next = prev.map(a => ({ ...a }));
      const currentTick = tickRef.current + 1;

      // Movement
      next.forEach(agent => {
        if (agent.status === STATUS.DEAD || agent.quarantined) return;
        const moveRange = lockdownActive ? 0 : agent.movementSpeed;
        if (moveRange === 0) return;

        // District mobility: 5% chance to move to adjacent district area
        if (Math.random() < 0.05 && !lockdownActive) {
          agent.district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
        }

        const dx = Math.floor(Math.random() * (moveRange * 2 + 1)) - moveRange;
        const dy = Math.floor(Math.random() * (moveRange * 2 + 1)) - moveRange;
        agent.x = Math.max(0, Math.min(GRID_SIZE - 1, agent.x + dx));
        agent.y = Math.max(0, Math.min(GRID_SIZE - 1, agent.y + dy));
      });

      // Infection spread
      const infected = next.filter(a => a.status === STATUS.INFECTED && !a.quarantined);
      const healthy = next.filter(a => a.status === STATUS.HEALTHY && !a.vaccinated);

      infected.forEach(inf => {
        healthy.forEach(h => {
          const dist = Math.abs(inf.x - h.x) + Math.abs(inf.y - h.y);
          if (dist <= infectionRadius && Math.random() < infectionProb) {
            h.status = STATUS.INFECTED;
            h.infectedTick = currentTick;
          }
        });
      });

      // Recovery / Death
      next.forEach(agent => {
        if (agent.status === STATUS.INFECTED && agent.infectedTick >= 0) {
          const duration = currentTick - agent.infectedTick;
          if (duration >= recoveryTime) {
            if (Math.random() < mortalityRate) {
              agent.status = STATUS.DEAD;
            } else {
              agent.status = STATUS.RECOVERED;
            }
          }
        }
      });

      return next;
    });

    setTick(prev => {
      const newTick = prev + 1;
      return newTick;
    });
  }, [infectionRadius, infectionProb, recoveryTime, mortalityRate, lockdownActive]);

  // Update grid and SIR data when agents change
  useEffect(() => {
    setGrid(buildGrid(agents, GRID_SIZE));
    const stats = computeStats(agents);
    setSirData(prev => [...prev, { day: tick, susceptible: stats.healthy, infected: stats.infected, recovered: stats.recovered, dead: stats.dead }]);
  }, [agents, tick, computeStats]);

  // Interval management
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(simulateStep, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, speed, simulateStep]);

  const handleReset = () => {
    setRunning(false);
    setTick(0);
    setLockdownActive(false);
    const newAgents = initAgents(population, GRID_SIZE);
    setAgents(newAgents);
    setGrid(buildGrid(newAgents, GRID_SIZE));
    setSirData([]);
  };

  const handlePopChange = (val) => {
    const num = Math.max(10, Math.min(400, parseInt(val) || 10));
    setPopulation(num);
  };

  const handleQuarantine = () => {
    setAgents(prev => prev.map(a => a.status === STATUS.INFECTED ? { ...a, quarantined: true } : a));
  };

  const handleVaccination = () => {
    setAgents(prev => {
      const healthyAgents = prev.filter(a => a.status === STATUS.HEALTHY && !a.vaccinated);
      const toVaccinate = healthyAgents.slice(0, Math.floor(healthyAgents.length * 0.3));
      const vaccinatedIds = new Set(toVaccinate.map(a => a.id));
      return prev.map(a => vaccinatedIds.has(a.id) ? { ...a, vaccinated: true } : a);
    });
  };

  const handleLockdown = () => {
    setLockdownActive(prev => !prev);
  };

  const stats = computeStats(agents);
  const cellSize = 20;

  const getColor = (status) => {
    switch (status) {
      case STATUS.HEALTHY: return '#10b981';
      case STATUS.INFECTED: return '#ef4444';
      case STATUS.RECOVERED: return '#3b82f6';
      case STATUS.DEAD: return '#6b7280';
      default: return '#1e293b';
    }
  };

  // District mobility stats
  const districtCounts = DISTRICTS.map(d => ({
    name: d,
    count: agents.filter(a => a.district === d && a.status !== STATUS.DEAD).length,
    infected: agents.filter(a => a.district === d && a.status === STATUS.INFECTED).length,
  }));

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bug size={28} /> Multi-Agent Disease Spread Simulation
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
        Agent-based model simulating disease transmission across a 20×20 grid with district mobility patterns.
      </p>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <Users size={20} style={{ color: '#10b981', margin: '0 auto 0.25rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{population}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Agents (Population)</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <Bug size={20} style={{ color: '#ef4444', margin: '0 auto 0.25rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{stats.infected}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Infected</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <Heart size={20} style={{ color: '#3b82f6', margin: '0 auto 0.25rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{stats.recovered}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recovered</div>
        </div>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <Timer size={20} style={{ color: '#f59e0b', margin: '0 auto 0.25rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tick}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Days Simulated</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Left Column: Grid + Chart */}
        <div>
          {/* Simulation Grid */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Simulation Grid (20×20)</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gap: '1px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              overflow: 'hidden',
              width: 'fit-content',
            }}>
              {grid.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(cell),
                      transition: 'background-color 0.15s ease',
                    }}
                  />
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#10b981', display: 'inline-block' }} /> Healthy</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Infected</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /> Recovered</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 12, height: 12, borderRadius: 2, background: '#6b7280', display: 'inline-block' }} /> Dead</span>
            </div>
          </div>

          {/* SIR Curve Chart */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>SIR Curve (Real-Time)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sirData.slice(-100)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="susceptible" stroke="#10b981" name="Susceptible" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="infected" stroke="#ef4444" name="Infected" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="recovered" stroke="#3b82f6" name="Recovered" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="dead" stroke="#6b7280" name="Dead" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* District Mobility Patterns */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>District Mobility Patterns</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {districtCounts.map(d => (
                <div key={d.name} style={{ textAlign: 'center', padding: '0.5rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{d.name}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{d.count}</div>
                  <div style={{ fontSize: '0.65rem', color: '#ef4444' }}>{d.infected} infected</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls + Parameters */}
        <div>
          {/* Controls */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Controls</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} onClick={() => setRunning(!running)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {running ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
              </button>
              <button className="btn btn-secondary" onClick={simulateStep} disabled={running} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <SkipForward size={14} /> Step
              </button>
              <button className="btn btn-secondary" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Speed: {speed}ms/tick
            </label>
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '0.75rem' }}
            />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Population Size
            </label>
            <input
              className="input-control"
              type="number"
              min={10}
              max={400}
              value={population}
              onChange={e => handlePopChange(e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Press Reset after changing population.</p>
          </div>

          {/* Parameters */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Parameters</h3>

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Infection Radius: {infectionRadius}
            </label>
            <input type="range" min={1} max={5} value={infectionRadius} onChange={e => setInfectionRadius(Number(e.target.value))} style={{ width: '100%', marginBottom: '0.75rem' }} />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Infection Probability: {(infectionProb * 100).toFixed(0)}%
            </label>
            <input type="range" min={5} max={100} value={infectionProb * 100} onChange={e => setInfectionProb(Number(e.target.value) / 100)} style={{ width: '100%', marginBottom: '0.75rem' }} />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Recovery Time: {recoveryTime} days
            </label>
            <input type="range" min={3} max={30} value={recoveryTime} onChange={e => setRecoveryTime(Number(e.target.value))} style={{ width: '100%', marginBottom: '0.75rem' }} />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Mortality Rate: {(mortalityRate * 100).toFixed(0)}%
            </label>
            <input type="range" min={0} max={50} value={mortalityRate * 100} onChange={e => setMortalityRate(Number(e.target.value) / 100)} style={{ width: '100%', marginBottom: '0.75rem' }} />

            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Movement Speed: {movementSpeed}
            </label>
            <input type="range" min={0} max={3} value={movementSpeed} onChange={e => setMovementSpeed(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          {/* Interventions */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Interventions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleQuarantine} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
                <Shield size={14} /> Quarantine Infected
              </button>
              <button className="btn btn-secondary" onClick={handleVaccination} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
                <Syringe size={14} /> Vaccination Drive (30%)
              </button>
              <button className={`btn ${lockdownActive ? 'btn-danger' : 'btn-secondary'}`} onClick={handleLockdown} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
                <Lock size={14} /> {lockdownActive ? 'Lift Lockdown' : 'Lockdown Zone'}
              </button>
            </div>
            {lockdownActive && (
              <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.5rem' }}>
                ⚠️ Lockdown active — all agent movement halted.
              </p>
            )}
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span>Quarantined:</span>
                <strong>{agents.filter(a => a.quarantined).length}</strong>
              </div>
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <span>Vaccinated:</span>
                <strong>{agents.filter(a => a.vaccinated).length}</strong>
              </div>
              <div className="flex-between">
                <span>Dead:</span>
                <strong style={{ color: '#6b7280' }}>{stats.dead}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

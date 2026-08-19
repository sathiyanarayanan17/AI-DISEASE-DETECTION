import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  RotateCcw,
  Cpu,
  Calendar,
  Database,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Mail,
  Shield,
  Play,
  Clock
} from 'lucide-react';

const RETRAIN_HISTORY = [
  { date: '2026-08-17', trigger: 'Scheduled', oldF1: 96.8, newF1: 97.2, status: 'improved' },
  { date: '2026-08-10', trigger: 'Scheduled', oldF1: 96.5, newF1: 96.8, status: 'improved' },
  { date: '2026-08-03', trigger: 'Drift Alert', oldF1: 96.9, newF1: 96.5, status: 'regressed' },
  { date: '2026-07-27', trigger: 'Scheduled', oldF1: 96.7, newF1: 96.9, status: 'improved' },
  { date: '2026-07-20', trigger: 'Scheduled', oldF1: 96.7, newF1: 96.7, status: 'stable' },
  { date: '2026-07-13', trigger: 'Manual', oldF1: 96.2, newF1: 96.7, status: 'improved' },
  { date: '2026-07-06', trigger: 'Scheduled', oldF1: 95.9, newF1: 96.2, status: 'improved' },
  { date: '2026-06-29', trigger: 'Drift Alert', oldF1: 96.1, newF1: 95.9, status: 'regressed' },
  { date: '2026-06-22', trigger: 'Scheduled', oldF1: 95.8, newF1: 96.1, status: 'improved' },
  { date: '2026-06-15', trigger: 'Scheduled', oldF1: 95.5, newF1: 95.8, status: 'improved' }
];

const F1_CHART_DATA = RETRAIN_HISTORY.map((entry, idx) => ({
  cycle: `Cycle ${10 - idx}`,
  f1: entry.newF1
})).reverse();

const RETRAIN_STAGES = [
  'Loading dataset from warehouse...',
  'Preprocessing and feature engineering...',
  'Training XGBoost ensemble model...',
  'Evaluating on holdout validation set...',
  'Deploying to production inference cluster...'
];

export const AutoRetrainPage = () => {
  const [frequency, setFrequency] = useState('Weekly');
  const [scheduleTime, setScheduleTime] = useState('02:00');
  const [dataSource, setDataSource] = useState('Full Pipeline');
  const [autoRollback, setAutoRollback] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainStage, setRetrainStage] = useState(0);

  const handleRetrainNow = () => {
    setIsRetraining(true);
    setRetrainStage(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < RETRAIN_STAGES.length) {
        setRetrainStage(stage);
      } else {
        clearInterval(interval);
        setIsRetraining(false);
      }
    }, 1500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'improved': return <ArrowUp size={14} style={{ color: '#10b981' }} />;
      case 'regressed': return <ArrowDown size={14} style={{ color: '#ef4444' }} />;
      default: return <Minus size={14} style={{ color: '#f59e0b' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'improved': return '#10b981';
      case 'regressed': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>Automatic Model Retraining</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Scheduled retraining pipeline with automated evaluation and rollback
          </p>
        </div>
        <button
          onClick={handleRetrainNow}
          disabled={isRetraining}
          className="btn btn-primary"
          style={{ minWidth: '160px' }}
        >
          <Play size={15} />
          <span>{isRetraining ? 'Retraining...' : 'Retrain Now'}</span>
        </button>
      </div>

      {/* Retrain Progress */}
      {isRetraining && (
        <div className="glass-card" style={{
          padding: '24px',
          border: '1px solid var(--accent-primary)',
          background: 'linear-gradient(135deg, rgba(15, 22, 41, 0.95), rgba(99, 102, 241, 0.15))'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Retraining - Stage {retrainStage + 1} of 5</span>
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
              {Math.round(((retrainStage + 1) / 5) * 100)}%
            </span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-input)', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{
              height: '100%',
              width: `${((retrainStage + 1) / 5) * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            &gt; {RETRAIN_STAGES[retrainStage]}
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Schedule Config */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
            Schedule Configuration
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Time (IST)</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Data Source</label>
              <select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px' }}
              >
                <option value="Full Pipeline">Full Pipeline (All Sources)</option>
                <option value="IDSP Only">IDSP Reports Only</option>
                <option value="Hospital Data">Hospital Data Only</option>
                <option value="Satellite + Weather">Satellite + Weather</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '13px' }}>Auto-Rollback (keep old model if worse)</span>
              </div>
              <button
                onClick={() => setAutoRollback(!autoRollback)}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                  background: autoRollback ? '#10b981' : 'var(--border-subtle)',
                  position: 'relative', transition: 'background 0.3s'
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: '3px',
                  left: autoRollback ? '21px' : '3px',
                  transition: 'left 0.3s'
                }} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '13px' }}>Email notification on completion</span>
              </div>
              <button
                onClick={() => setEmailNotify(!emailNotify)}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                  background: emailNotify ? '#10b981' : 'var(--border-subtle)',
                  position: 'relative', transition: 'background 0.3s'
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: '3px',
                  left: emailNotify ? '21px' : '3px',
                  transition: 'left 0.3s'
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Current Model Info */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} style={{ color: '#10b981' }} />
            Current Production Model
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Version</p>
              <p style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '14px' }}>v2.4.2-prod</p>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Trained Date</p>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>2026-08-17</p>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>F1 Score</p>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#10b981' }}>97.2%</p>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--bg-input)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Training Samples</p>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>1.48M</p>
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>Model is healthy and serving predictions</span>
            </div>
          </div>
        </div>
      </div>

      {/* F1 Score Chart */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>F1 Score Over Last 10 Retraining Cycles</h2>
        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={F1_CHART_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="cycle" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[95, 98]} stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-strong)', borderRadius: '8px', color: 'var(--text-primary)' }}
                formatter={(value) => [`${value}%`, 'F1 Score']}
              />
              <Line type="monotone" dataKey="f1" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Retraining History Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
          Retraining History
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Trigger</th>
                <th>Old F1</th>
                <th>New F1</th>
                <th>Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RETRAIN_HISTORY.map((entry, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{entry.date}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: entry.trigger === 'Drift Alert' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-input)',
                      color: entry.trigger === 'Drift Alert' ? '#f59e0b' : 'var(--text-secondary)'
                    }}>
                      {entry.trigger}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{entry.oldF1}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>{entry.newF1}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: getStatusColor(entry.status) }}>
                    {entry.newF1 > entry.oldF1 ? '+' : ''}{(entry.newF1 - entry.oldF1).toFixed(1)}%
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getStatusIcon(entry.status)}
                      <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', color: getStatusColor(entry.status) }}>
                        {entry.status}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutoRetrainPage;

import React, { useState, useCallback } from 'react';
import {
  Layout, Map, Bell, PieChart, TrendingUp, Cloud, Table2, Brain,
  Zap, Plus, X, Save, Download, RotateCcw, Grid3X3, Monitor,
  BarChart3, Users, Shield, GripVertical, Check, Layers
} from 'lucide-react';

const WIDGET_DEFINITIONS = {
  riskMap: {
    id: 'riskMap',
    name: 'Risk Map',
    icon: Map,
    color: '#ef4444',
    description: 'District-level risk heatmap'
  },
  alertCounter: {
    id: 'alertCounter',
    name: 'Alert Counter',
    icon: Bell,
    color: '#f59e0b',
    description: 'Active alerts summary'
  },
  diseasePie: {
    id: 'diseasePie',
    name: 'Disease Pie',
    icon: PieChart,
    color: '#8b5cf6',
    description: 'Disease distribution chart'
  },
  forecastChart: {
    id: 'forecastChart',
    name: 'Forecast Chart',
    icon: TrendingUp,
    color: '#10b981',
    description: '7-day risk forecast'
  },
  weatherCard: {
    id: 'weatherCard',
    name: 'Weather Card',
    icon: Cloud,
    color: '#3b82f6',
    description: 'Current weather conditions'
  },
  casesTable: {
    id: 'casesTable',
    name: 'Cases Table',
    icon: Table2,
    color: '#ec4899',
    description: 'Recent case reports'
  },
  modelMetrics: {
    id: 'modelMetrics',
    name: 'Model Metrics',
    icon: Brain,
    color: '#6366f1',
    description: 'ML model performance'
  },
  quickActions: {
    id: 'quickActions',
    name: 'Quick Actions',
    icon: Zap,
    color: '#14b8a6',
    description: 'Shortcut actions panel'
  }
};

const LAYOUT_PRESETS = {
  monitoring: {
    name: 'Monitoring',
    icon: Monitor,
    description: 'Real-time outbreak monitoring',
    slots: ['riskMap', 'alertCounter', 'diseasePie', 'forecastChart', 'weatherCard', 'casesTable', null, null, null]
  },
  analytics: {
    name: 'Analytics',
    icon: BarChart3,
    description: 'Data analysis & model insights',
    slots: ['modelMetrics', 'forecastChart', 'diseasePie', 'casesTable', 'riskMap', null, null, null, null]
  },
  fieldWorker: {
    name: 'Field Worker',
    icon: Users,
    description: 'Simplified field view',
    slots: ['alertCounter', 'weatherCard', 'quickActions', 'riskMap', null, null, null, null, null]
  },
  administrator: {
    name: 'Administrator',
    icon: Shield,
    description: 'Full system overview',
    slots: ['riskMap', 'alertCounter', 'diseasePie', 'forecastChart', 'weatherCard', 'casesTable', 'modelMetrics', 'quickActions', null]
  }
};

function MiniRiskMap() {
  const districts = [
    { name: 'Chennai', risk: 'high' },
    { name: 'Coimbatore', risk: 'medium' },
    { name: 'Madurai', risk: 'low' },
    { name: 'Tiruchirappalli', risk: 'medium' },
    { name: 'Salem', risk: 'high' }
  ];
  const riskColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {districts.map(d => (
          <div key={d.name} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 8px', borderRadius: '6px',
            background: `${riskColors[d.risk]}15`
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: riskColors[d.risk]
            }} />
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{d.name}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '8px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {Object.entries(riskColors).map(([level, color]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' }}>{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniAlertCounter() {
  const alerts = [
    { level: 'Critical', count: 3, color: '#ef4444' },
    { level: 'Warning', count: 8, color: '#f59e0b' },
    { level: 'Info', count: 12, color: '#3b82f6' }
  ];

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {alerts.map(a => (
        <div key={a.level} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 10px', borderRadius: '8px',
          background: `${a.color}15`, border: `1px solid ${a.color}30`
        }}>
          <span style={{ fontSize: '12px', color: '#e2e8f0' }}>{a.level}</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: a.color }}>{a.count}</span>
        </div>
      ))}
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
        Total: 23 active alerts
      </div>
    </div>
  );
}

function MiniDiseasePie() {
  const diseases = [
    { name: 'Dengue', pct: 45, color: '#ef4444' },
    { name: 'Malaria', pct: 30, color: '#f59e0b' },
    { name: 'Cholera', pct: 25, color: '#3b82f6' }
  ];

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: `conic-gradient(${diseases[0].color} 0% ${diseases[0].pct}%, ${diseases[1].color} ${diseases[0].pct}% ${diseases[0].pct + diseases[1].pct}%, ${diseases[2].color} ${diseases[0].pct + diseases[1].pct}% 100%)`
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {diseases.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }} />
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{d.name} {d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniForecastChart() {
  const data = [32, 45, 58, 72, 65, 48, 40];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...data);

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '70px', justifyContent: 'center' }}>
        {data.map((val, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{
              width: '20px', height: `${(val / max) * 55}px`,
              borderRadius: '4px 4px 0 0',
              background: val > 60 ? 'linear-gradient(to top, #ef4444, #f87171)' :
                val > 40 ? 'linear-gradient(to top, #f59e0b, #fbbf24)' :
                  'linear-gradient(to top, #10b981, #34d399)'
            }} />
            <span style={{ fontSize: '9px', color: '#64748b' }}>{days[i]}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
        Peak risk: Thursday (72%)
      </div>
    </div>
  );
}

function MiniWeatherCard() {
  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { label: 'Temperature', value: '31°C', icon: '🌡️' },
          { label: 'Humidity', value: '78%', icon: '💧' },
          { label: 'Rainfall', value: '12mm', icon: '🌧️' },
          { label: 'Wind', value: '15km/h', icon: '💨' }
        ].map(item => (
          <div key={item.label} style={{
            padding: '6px', borderRadius: '8px',
            background: 'rgba(59,130,246,0.08)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px' }}>{item.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{item.value}</div>
            <div style={{ fontSize: '9px', color: '#64748b' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCasesTable() {
  const cases = [
    { district: 'Chennai', disease: 'Dengue', count: 24, trend: '↑' },
    { district: 'Madurai', disease: 'Malaria', count: 18, trend: '→' },
    { district: 'Salem', disease: 'Cholera', count: 9, trend: '↓' }
  ];

  return (
    <div style={{ padding: '8px' }}>
      <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
            <th style={{ padding: '4px', textAlign: 'left' }}>District</th>
            <th style={{ padding: '4px', textAlign: 'left' }}>Disease</th>
            <th style={{ padding: '4px', textAlign: 'right' }}>Cases</th>
            <th style={{ padding: '4px', textAlign: 'center' }}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c.district} style={{ color: '#cbd5e1', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              <td style={{ padding: '4px' }}>{c.district}</td>
              <td style={{ padding: '4px' }}>{c.disease}</td>
              <td style={{ padding: '4px', textAlign: 'right', fontWeight: 600 }}>{c.count}</td>
              <td style={{ padding: '4px', textAlign: 'center' }}>{c.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniModelMetrics() {
  const metrics = [
    { label: 'F1-Score', value: 0.92, color: '#10b981' },
    { label: 'ROC-AUC', value: 0.97, color: '#8b5cf6' },
    { label: 'Accuracy', value: 0.94, color: '#3b82f6' }
  ];

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {metrics.map(m => (
        <div key={m.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{m.label}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: m.color }}>{(m.value * 100).toFixed(0)}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(148,163,184,0.15)' }}>
            <div style={{
              height: '100%', borderRadius: '3px', width: `${m.value * 100}%`,
              background: `linear-gradient(to right, ${m.color}80, ${m.color})`
            }} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>
        Last trained: 2 hours ago
      </div>
    </div>
  );
}

function MiniQuickActions() {
  const actions = [
    { label: 'New Alert', icon: '🚨', color: '#ef4444' },
    { label: 'Run Predict', icon: '🤖', color: '#8b5cf6' },
    { label: 'Export Data', icon: '📊', color: '#3b82f6' },
    { label: 'Send Report', icon: '📧', color: '#10b981' }
  ];

  return (
    <div style={{ padding: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
      {actions.map(a => (
        <button key={a.label} style={{
          padding: '8px 6px', borderRadius: '8px', border: `1px solid ${a.color}30`,
          background: `${a.color}10`, cursor: 'pointer', textAlign: 'center',
          transition: 'all 0.2s'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>{a.icon}</div>
          <div style={{ fontSize: '10px', color: '#cbd5e1' }}>{a.label}</div>
        </button>
      ))}
    </div>
  );
}

const WIDGET_RENDERERS = {
  riskMap: MiniRiskMap,
  alertCounter: MiniAlertCounter,
  diseasePie: MiniDiseasePie,
  forecastChart: MiniForecastChart,
  weatherCard: MiniWeatherCard,
  casesTable: MiniCasesTable,
  modelMetrics: MiniModelMetrics,
  quickActions: MiniQuickActions
};

export default function CustomDashboardPage() {
  const [slots, setSlots] = useState(LAYOUT_PRESETS.monitoring.slots);
  const [activePreset, setActivePreset] = useState('monitoring');
  const [savedLayouts, setSavedLayouts] = useState({});
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveLayoutName, setSaveLayoutName] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const applyPreset = (presetKey) => {
    setSlots([...LAYOUT_PRESETS[presetKey].slots]);
    setActivePreset(presetKey);
    showNotification(`Applied "${LAYOUT_PRESETS[presetKey].name}" preset`);
  };

  const addWidgetToSlot = (slotIndex, widgetId) => {
    const newSlots = [...slots];
    newSlots[slotIndex] = widgetId;
    setSlots(newSlots);
    setActivePreset(null);
  };

  const removeWidgetFromSlot = (slotIndex) => {
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setActivePreset(null);
  };

  const saveLayout = () => {
    if (!saveLayoutName.trim()) return;
    const key = saveLayoutName.trim().toLowerCase().replace(/\s+/g, '_');
    const updated = { ...savedLayouts, [key]: { name: saveLayoutName.trim(), slots: [...slots] } };
    setSavedLayouts(updated);
    localStorage.setItem('vyaadhi_custom_layouts', JSON.stringify(updated));
    setShowSaveDialog(false);
    setSaveLayoutName('');
    showNotification(`Layout "${saveLayoutName.trim()}" saved!`);
  };

  const loadLayouts = () => {
    try {
      const stored = localStorage.getItem('vyaadhi_custom_layouts');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedLayouts(parsed);
        showNotification(`Loaded ${Object.keys(parsed).length} saved layout(s)`);
      } else {
        showNotification('No saved layouts found', 'info');
      }
    } catch {
      showNotification('Error loading layouts', 'error');
    }
  };

  const loadSavedLayout = (key) => {
    if (savedLayouts[key]) {
      setSlots([...savedLayouts[key].slots]);
      setActivePreset(null);
      showNotification(`Loaded layout "${savedLayouts[key].name}"`);
    }
  };

  const resetLayout = () => {
    setSlots(Array(9).fill(null));
    setActivePreset(null);
    showNotification('Layout cleared');
  };

  const getAvailableWidgets = (currentSlotIndex) => {
    const usedWidgets = slots.filter((s, i) => s !== null && i !== currentSlotIndex);
    return Object.keys(WIDGET_DEFINITIONS).filter(w => !usedWidgets.includes(w));
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
          padding: '12px 20px', borderRadius: '12px',
          background: notification.type === 'error' ? 'rgba(239,68,68,0.9)' :
            notification.type === 'info' ? 'rgba(59,130,246,0.9)' : 'rgba(16,185,129,0.9)',
          color: '#fff', fontSize: '13px', fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={14} />
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Layout size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Custom Dashboard Builder
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Drag & arrange widgets to create your personalized monitoring view
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
            <Grid3X3 size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Available Widgets
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Save size={12} /> Save Layout
            </button>
            <button
              onClick={loadLayouts}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Download size={12} /> Load Layouts
            </button>
            <button
              onClick={resetLayout}
              className="btn btn-ghost"
              style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Clear All
            </button>
          </div>
        </div>

        {/* Widget Palette */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.values(WIDGET_DEFINITIONS).map(widget => {
            const Icon = widget.icon;
            const isUsed = slots.includes(widget.id);
            return (
              <div key={widget.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', borderRadius: '10px',
                background: isUsed ? 'rgba(148,163,184,0.08)' : `${widget.color}12`,
                border: `1px solid ${isUsed ? 'rgba(148,163,184,0.15)' : widget.color + '40'}`,
                opacity: isUsed ? 0.5 : 1,
                cursor: isUsed ? 'default' : 'grab',
                transition: 'all 0.2s'
              }}>
                <GripVertical size={12} color="#64748b" />
                <Icon size={14} color={widget.color} />
                <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 500 }}>{widget.name}</span>
                {isUsed && <Check size={12} color="#10b981" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Layout Presets */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', margin: '0 0 12px 0' }}>
          <Layers size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Layout Presets
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {Object.entries(LAYOUT_PRESETS).map(([key, preset]) => {
            const Icon = preset.icon;
            const isActive = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                style={{
                  padding: '12px', borderRadius: '12px', border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))'
                    : 'rgba(30,41,59,0.5)',
                  border: `1px solid ${isActive ? '#6366f1' : 'rgba(148,163,184,0.15)'}`,
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                }}
              >
                <Icon size={20} color={isActive ? '#a78bfa' : '#94a3b8'} style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '12px', fontWeight: 600, color: isActive ? '#e2e8f0' : '#94a3b8' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Saved Layouts */}
        {Object.keys(savedLayouts).length > 0 && (
          <div style={{ marginTop: '12px', borderTop: '1px solid rgba(148,163,184,0.15)', paddingTop: '12px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Saved Layouts:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(savedLayouts).map(([key, layout]) => (
                <button
                  key={key}
                  onClick={() => loadSavedLayout(key)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)',
                    background: 'rgba(99,102,241,0.1)', cursor: 'pointer', fontSize: '11px',
                    color: '#a78bfa', fontWeight: 500
                  }}
                >
                  {layout.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout Area (3x3) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }}>
        {slots.map((widgetId, index) => {
          if (widgetId && WIDGET_DEFINITIONS[widgetId]) {
            const widget = WIDGET_DEFINITIONS[widgetId];
            const Icon = widget.icon;
            const Renderer = WIDGET_RENDERERS[widgetId];
            return (
              <div key={index} className="glass-card" style={{
                padding: '0', overflow: 'hidden', minHeight: '220px',
                border: `1px solid ${widget.color}30`,
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}>
                {/* Widget Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: `linear-gradient(135deg, ${widget.color}15, transparent)`,
                  borderBottom: `1px solid ${widget.color}20`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GripVertical size={12} color="#64748b" style={{ cursor: 'grab' }} />
                    <Icon size={14} color={widget.color} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>
                      {widget.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeWidgetFromSlot(index)}
                    style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      border: '1px solid rgba(239,68,68,0.3)',
                      background: 'rgba(239,68,68,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    title="Remove widget"
                  >
                    <X size={12} color="#ef4444" />
                  </button>
                </div>
                {/* Widget Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {Renderer && <Renderer />}
                </div>
              </div>
            );
          }

          // Empty Slot
          const available = getAvailableWidgets(index);
          return (
            <div key={index} className="glass-card" style={{
              padding: '16px', minHeight: '220px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              border: '1px dashed rgba(148,163,184,0.25)',
              background: 'rgba(15,23,42,0.3)'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(148,163,184,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <Plus size={18} color="#475569" />
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px' }}>
                Slot {index + 1} — Empty
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                {available.map(wId => {
                  const w = WIDGET_DEFINITIONS[wId];
                  const WIcon = w.icon;
                  return (
                    <button
                      key={wId}
                      onClick={() => addWidgetToSlot(index, wId)}
                      title={`Add ${w.name}`}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        border: `1px solid ${w.color}40`,
                        background: `${w.color}12`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <WIcon size={13} color={w.color} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Layout Dialog */}
      {showSaveDialog && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ padding: '24px', width: '380px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', margin: '0 0 16px 0' }}>
              Save Custom Layout
            </h3>
            <input
              type="text"
              value={saveLayoutName}
              onChange={(e) => setSaveLayoutName(e.target.value)}
              placeholder="Enter layout name..."
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(15,23,42,0.8)', color: '#e2e8f0',
                fontSize: '14px', outline: 'none', marginBottom: '16px',
                boxSizing: 'border-box'
              }}
              onKeyDown={(e) => e.key === 'Enter' && saveLayout()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowSaveDialog(false); setSaveLayoutName(''); }}
                className="btn btn-ghost"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={saveLayout}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
                disabled={!saveLayoutName.trim()}
              >
                <Save size={14} style={{ marginRight: '4px' }} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="glass-card" style={{ padding: '12px 16px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Widgets placed: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                {slots.filter(Boolean).length}
              </span> / 9
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Available: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                {Object.keys(WIDGET_DEFINITIONS).length - slots.filter(Boolean).length}
              </span>
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#475569' }}>
            {activePreset ? `Preset: ${LAYOUT_PRESETS[activePreset].name}` : 'Custom layout'}
          </span>
        </div>
      </div>
    </div>
  );
}

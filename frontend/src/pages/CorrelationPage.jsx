import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { GitCommit, Activity, Info, BarChart2 } from 'lucide-react';
import { CORRELATION_MATRIX_DATA } from '../data/mlAnalyticsData';
import { DISTRICTS_DATA } from '../data/districtsData';

export const CorrelationPage = () => {
  const [xAxisFeature, setXAxisFeature] = useState('rainfall');
  const [yAxisFeature, setYAxisFeature] = useState('dengueCases');

  const featureOptions = [
    { key: 'rainfall', label: '7-Day Rainfall (mm)', accessor: (d) => d.weather.rainfall },
    { key: 'humidity', label: 'Relative Humidity (%)', accessor: (d) => d.weather.humidity },
    { key: 'temperature', label: 'Mean Temperature (°C)', accessor: (d) => d.weather.temperature },
    { key: 'riskScore', label: 'XGBoost Risk Score', accessor: (d) => d.riskScore },
    { key: 'dengueCases', label: 'Dengue Cases', accessor: (d) => d.dengueCases },
    { key: 'choleraCases', label: 'Cholera Cases', accessor: (d) => d.choleraCases },
    { key: 'malariaCases', label: 'Malaria Cases', accessor: (d) => d.malariaCases },
    { key: 'totalCases7d', label: 'Total 7-Day Cases', accessor: (d) => d.totalCases7d }
  ];

  const getAccessor = (key) => {
    return featureOptions.find((f) => f.key === key)?.accessor || ((d) => d.riskScore);
  };

  const scatterPlotData = DISTRICTS_DATA.map((d) => ({
    district: d.name,
    x: getAccessor(xAxisFeature)(d),
    y: getAccessor(yAxisFeature)(d),
    riskLevel: d.riskLevel
  }));

  const matrixFeatures = ["Rainfall", "Humidity", "Temperature", "Dengue Risk", "Cholera Risk", "Malaria Risk", "Bed Occupancy"];
  const matrixKeys = ["rainfall", "humidity", "temperature", "dengueRisk", "choleraRisk", "malariaRisk", "bedOccupancy"];

  const getCellColor = (val) => {
    if (val === 1) return 'rgba(99, 102, 241, 0.4)';
    if (val > 0.7) return 'rgba(244, 63, 94, 0.3)';
    if (val > 0.4) return 'rgba(245, 158, 11, 0.25)';
    if (val > 0) return 'rgba(16, 185, 129, 0.15)';
    return 'rgba(100, 116, 139, 0.2)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitCommit size={24} className="text-indigo-400" />
            <span>Multivariate Feature Correlation Analysis</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Pearson correlation matrix and dynamic bivariate scatter regression exploration.
          </p>
        </div>
      </div>

      {/* 2. Color-coded Correlation Matrix Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Pearson Correlation Coefficient Heatmap (r-values)</h2>

        <div className="data-table-container">
          <table className="data-table" style={{ textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Variable</th>
                {matrixFeatures.map((f, i) => (
                  <th key={i}>{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CORRELATION_MATRIX_DATA.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td style={{ fontWeight: 700, textAlign: 'left' }}>{row.feature}</td>
                  {matrixKeys.map((k, cIdx) => {
                    const val = row[k];
                    return (
                      <td
                        key={cIdx}
                        style={{
                          backgroundColor: getCellColor(val),
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: val > 0.6 ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Dynamic Bivariate Scatter Plot */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex-between flex-wrap gap-4">
          <div>
            <h2 style={{ fontSize: '16px' }}>Interactive Bivariate Scatter Regression</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Select customized independent (X) and dependent (Y) axes across 37 districts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>X-Axis:</span>
              <select
                value={xAxisFeature}
                onChange={(e) => setXAxisFeature(e.target.value)}
                className="input-control input-select text-xs"
                style={{ width: '180px' }}
              >
                {featureOptions.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Y-Axis:</span>
              <select
                value={yAxisFeature}
                onChange={(e) => setYAxisFeature(e.target.value)}
                className="input-control input-select text-xs"
                style={{ width: '180px' }}
              >
                {featureOptions.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis type="number" dataKey="x" name={featureOptions.find(f => f.key === xAxisFeature)?.label} stroke="var(--text-muted)" fontSize={11} />
              <YAxis type="number" dataKey="y" name={featureOptions.find(f => f.key === yAxisFeature)?.label} stroke="var(--text-muted)" fontSize={11} />
              <RechartsTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ background: 'var(--bg-card)', padding: '10px', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.district}</div>
                        <div>X: {data.x}</div>
                        <div>Y: {data.y}</div>
                        <div>Risk: {data.riskLevel.toUpperCase()}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Districts" data={scatterPlotData} fill="#6366f1" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CorrelationPage;

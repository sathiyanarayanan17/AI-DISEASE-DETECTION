import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RiskBadge from '../components/RiskBadge';

function riskColor(l) {
  return l === 'High' ? '#ef4444' : l === 'Medium' ? '#f59e0b' : '#10b981';
}

function scoreGradient(s) {
  if (s >= 70) return 'linear-gradient(90deg,#ef4444,#f97316)';
  if (s >= 40) return 'linear-gradient(90deg,#f59e0b,#eab308)';
  return 'linear-gradient(90deg,#10b981,#06b6d4)';
}

function StatsRow({ districts }) {
  const high   = districts.filter(d => d.risk_level === 'High').length;
  const medium = districts.filter(d => d.risk_level === 'Medium').length;
  const low    = districts.filter(d => d.risk_level === 'Low').length;
  const avgConf = districts.length > 0
    ? (districts.reduce((s, d) => s + (d.confidence || 0.75), 0) / districts.length * 100).toFixed(0)
    : '--';

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-icon-wrap si-blue"></div>
        <div>
          <div className="stat-num">{districts.length}</div>
          <div className="stat-lbl">Districts Monitored</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon-wrap si-red"></div>
        <div>
          <div className="stat-num" style={{ color: '#fca5a5' }}>{high}</div>
          <div className="stat-lbl">High Risk</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon-wrap si-amber"></div>
        <div>
          <div className="stat-num" style={{ color: '#fcd34d' }}>{medium}</div>
          <div className="stat-lbl">Medium Risk</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon-wrap si-green"></div>
        <div>
          <div className="stat-num" style={{ color: '#6ee7b7' }}>{avgConf}%</div>
          <div className="stat-lbl">Model Confidence</div>
        </div>
      </div>
    </div>
  );
}

function DiseaseBreakdown({ districts }) {
  const data = [
    { name: 'Dengue', value: districts.filter(d => d.risk_score >= 60).length, color: '#f59e0b' },
    { name: 'Cholera', value: districts.filter(d => d.risk_score >= 70).length, color: '#3b82f6' },
    { name: 'Malaria', value: districts.filter(d => d.risk_score >= 50 && d.risk_score < 70).length, color: '#10b981' },
  ];

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-head">
        <h3 className="card-head-title">Disease Risk Distribution</h3>
      </div>
      <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(99,179,237,0.2)', borderRadius: 8, fontSize: '0.8rem' }} />
          </PieChart>
        </ResponsiveContainer>
        <div>
          {data.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} />
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{d.name}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginLeft: 'auto' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskMap({ districts }) {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-head">
        <h3 className="card-head-title">Live Risk Map - Tamil Nadu</h3>
        <div style={{ display: 'flex', gap: 14, fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ color: '#fca5a5' }}>● High</span>
          <span style={{ color: '#fcd34d' }}>● Medium</span>
          <span style={{ color: '#6ee7b7' }}>● Low</span>
        </div>
      </div>
      <div className="map-wrap">
        <MapContainer center={[10.8, 78.5]} zoom={7} className="map-container" scrollWheelZoom>
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {districts.map(d => d.lat && d.lng ? (
            <CircleMarker key={d.district} center={[d.lat, d.lng]}
              radius={d.risk_level === 'High' ? 14 : d.risk_level === 'Medium' ? 11 : 8}
              pathOptions={{ color: riskColor(d.risk_level), fillColor: riskColor(d.risk_level), fillOpacity: 0.85, weight: 2 }}>
              <Popup>
                <div style={{ minWidth: 180, fontFamily: 'Inter,sans-serif' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 8, color: '#1e293b' }}>{d.district}</div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ background: riskColor(d.risk_level) + '22', color: riskColor(d.risk_level), padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700 }}>
                      {d.risk_level} Risk
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Score: <strong>{d.risk_score}</strong>/100
                  </div>
                  <div style={{ marginTop: 4, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {(d.recommendation || '').slice(0, 80)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ) : null)}
        </MapContainer>
      </div>
    </div>
  );
}

function DistrictTable({ districts, onRowClick }) {
  const [sortKey, setSortKey] = useState('risk_score');
  const [sortDir, setSortDir] = useState('desc');
  const [q, setQ] = useState('');

  const toggle = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const rows = useMemo(() => {
    const ql = q.toLowerCase();
    return [...districts]
      .filter(d => d.district.toLowerCase().includes(ql))
      .sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'string') av = av.toLowerCase();
        if (typeof bv === 'string') bv = bv.toLowerCase();
        return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
      });
  }, [districts, sortKey, sortDir, q]);

  const th = (key, label) => (
    <th onClick={() => toggle(key)} className={sortKey === key ? 'th-active' : ''}>
      {label} {sortKey === key ? (sortDir === 'asc' ? ' [A]' : ' [D]') : ''}
    </th>
  );

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-head-title">District Risk Summary</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input className="search-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search district..." />
          <span style={{ fontSize: '0.72rem', color: '#475569' }}>{rows.length} results</span>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              {th('district', 'District')}
              {th('risk_level', 'Risk Level')}
              {th('risk_score', 'Score')}
              {th('confidence', 'Confidence')}
              <th>AI Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(d => (
              <tr key={d.district} onClick={() => onRowClick(d.district)}>
                <td>
                  <div style={{ fontWeight: 700 }}>{d.district}</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>{d.state || 'Tamil Nadu'}</div>
                </td>
                <td><RiskBadge level={d.risk_level} /></td>
                <td>
                  <div className="score-wrap">
                    <div className="score-track">
                      <div className="score-fill" style={{ width: `${d.risk_score}%`, background: scoreGradient(d.risk_score) }} />
                    </div>
                    <span className="score-num">{d.risk_score}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#cbd5e1' }}>
                  {d.confidence ? `${(d.confidence * 100).toFixed(0)}%` : '--'}
                </td>
                <td style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: 260 }}>
                  {(d.recommendation || '').slice(0, 85)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard({ districts = [], loading }) {
  const nav = useNavigate();

  if (loading) return (
    <>
      <div className="stats-row">
        {[1,2,3,4].map(i => (
          <div key={i} className="stat-card">
            <div className="skel" style={{ width: 48, height: 48, borderRadius: 12 }} />
            <div style={{ flex: 1 }}>
              <div className="skel" style={{ height: 28, width: 56, marginBottom: 8 }} />
              <div className="skel" style={{ height: 10, width: 100 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="skel" style={{ height: 480, borderRadius: 0 }} />
      </div>
    </>
  );

  return (
    <>
      <StatsRow districts={districts} />
      <DiseaseBreakdown districts={districts} />
      <RiskMap districts={districts} />
      <DistrictTable districts={districts} onRowClick={n => nav(`/district/${encodeURIComponent(n)}`)} />
      <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#334155', marginTop: 18 }}>
        Last refreshed: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' })}
      </div>
    </>
  );
}

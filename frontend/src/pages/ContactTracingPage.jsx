import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Search,
  GitBranch,
  Clock,
  AlertTriangle,
  ArrowRight,
  Activity,
  MapPin,
  Calendar,
  Link2,
  UserX,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

// --- Mock Data ---

const STATS = {
  activeCases: 47,
  contactsIdentified: 312,
  quarantined: 189,
  cleared: 1024
};

const TRACE_ENTRIES = [
  { id: 'CT-2026-0471', patient: 'Rajesh Kumar', district: 'Chennai', contactsFound: 14, status: 'Active', date: '2026-08-18' },
  { id: 'CT-2026-0470', patient: 'Meena Devi', district: 'Coimbatore', contactsFound: 8, status: 'Active', date: '2026-08-18' },
  { id: 'CT-2026-0469', patient: 'Arjun Shankar', district: 'Madurai', contactsFound: 11, status: 'Quarantined', date: '2026-08-17' },
  { id: 'CT-2026-0468', patient: 'Lakshmi Narayan', district: 'Tiruchirappalli', contactsFound: 6, status: 'Cleared', date: '2026-08-17' },
  { id: 'CT-2026-0467', patient: 'Vijay Anand', district: 'Salem', contactsFound: 19, status: 'Active', date: '2026-08-16' },
  { id: 'CT-2026-0466', patient: 'Priya Venkatesh', district: 'Tirunelveli', contactsFound: 5, status: 'Cleared', date: '2026-08-16' },
  { id: 'CT-2026-0465', patient: 'Karthik Rajan', district: 'Erode', contactsFound: 9, status: 'Quarantined', date: '2026-08-15' },
  { id: 'CT-2026-0464', patient: 'Sunitha Balan', district: 'Vellore', contactsFound: 7, status: 'Active', date: '2026-08-15' },
];

const TIMELINE_EVENTS = [
  { time: '10:32 AM', date: '19 Aug', event: 'New cluster identified in Chennai T. Nagar ward', severity: 'high' },
  { time: '09:15 AM', date: '19 Aug', event: '3 secondary contacts of CT-0471 tested positive', severity: 'high' },
  { time: '08:00 AM', date: '19 Aug', event: 'Quarantine compliance check completed — Zone B', severity: 'medium' },
  { time: '06:45 PM', date: '18 Aug', event: 'CT-0470 household contacts added to trace list', severity: 'medium' },
  { time: '03:20 PM', date: '18 Aug', event: 'CT-0468 all contacts cleared after 14-day observation', severity: 'low' },
  { time: '11:10 AM', date: '18 Aug', event: 'Workplace cluster mapping initiated — Coimbatore IT Park', severity: 'medium' },
  { time: '09:00 AM', date: '18 Aug', event: 'Daily contact tracing summary dispatched to DDHS', severity: 'low' },
  { time: '04:30 PM', date: '17 Aug', event: 'CT-0469 moved to institutional quarantine', severity: 'high' },
];

const NETWORK_NODES = {
  patient: { id: 'CT-0471', name: 'Rajesh K.', type: 'index' },
  primary: [
    { id: 'P1', name: 'Spouse', risk: 'high', status: 'positive' },
    { id: 'P2', name: 'Son', risk: 'medium', status: 'quarantined' },
    { id: 'P3', name: 'Colleague A', risk: 'high', status: 'positive' },
    { id: 'P4', name: 'Colleague B', risk: 'medium', status: 'quarantined' },
    { id: 'P5', name: 'Neighbor', risk: 'low', status: 'monitoring' },
  ],
  secondary: [
    { id: 'S1', name: 'Co-worker X', from: 'P3', risk: 'medium', status: 'quarantined' },
    { id: 'S2', name: 'Co-worker Y', from: 'P3', risk: 'low', status: 'monitoring' },
    { id: 'S3', name: 'Friend Z', from: 'P4', risk: 'low', status: 'monitoring' },
    { id: 'S4', name: 'Family W', from: 'P1', risk: 'high', status: 'quarantined' },
  ]
};

const RISK_DATA = [
  { category: 'Primary Contacts', high: 12, medium: 23, low: 18 },
  { category: 'Secondary Contacts', high: 4, medium: 31, low: 56 },
  { category: 'Tertiary Contacts', high: 1, medium: 8, low: 159 },
];

const DAILY_CONTACTS = [
  { date: '13 Aug', newContacts: 18, cleared: 12 },
  { date: '14 Aug', newContacts: 24, cleared: 15 },
  { date: '15 Aug', newContacts: 31, cleared: 19 },
  { date: '16 Aug', newContacts: 27, cleared: 22 },
  { date: '17 Aug', newContacts: 42, cleared: 28 },
  { date: '18 Aug', newContacts: 38, cleared: 31 },
  { date: '19 Aug', newContacts: 45, cleared: 26 },
];

const PIE_DATA = [
  { name: 'High Risk', value: 17, color: '#f43f5e' },
  { name: 'Medium Risk', value: 62, color: '#f59e0b' },
  { name: 'Low Risk', value: 233, color: '#10b981' },
];

// --- Helper Components ---

const getStatusBadge = (status) => {
  const styles = {
    Active: { background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
    Quarantined: { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
    Cleared: { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
  };
  const s = styles[status] || styles.Active;
  return (
    <span style={{ ...s, padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
      {status.toUpperCase()}
    </span>
  );
};

const getSeverityDot = (severity) => {
  const colors = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
  return (
    <span style={{
      width: '8px', height: '8px', borderRadius: '50%',
      background: colors[severity] || colors.low, display: 'inline-block', flexShrink: 0
    }} />
  );
};

const getRiskColor = (risk) => {
  if (risk === 'high') return '#f43f5e';
  if (risk === 'medium') return '#f59e0b';
  return '#10b981';
};

const getNodeStatusIcon = (status) => {
  if (status === 'positive') return <AlertTriangle size={10} style={{ color: '#f43f5e' }} />;
  if (status === 'quarantined') return <ShieldAlert size={10} style={{ color: '#fbbf24' }} />;
  return <CheckCircle2 size={10} style={{ color: '#10b981' }} />;
};

// --- Main Component ---

const ContactTracingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEntries = TRACE_ENTRIES.filter((entry) => {
    const matchesStatus = statusFilter === 'all' || entry.status.toLowerCase() === statusFilter;
    const matchesSearch =
      entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Page Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitBranch size={24} style={{ color: 'var(--accent-primary)' }} />
            <span>Contact Tracing Network</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Real-time patient-contact chain mapping, quarantine tracking, and transmission risk assessment.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last synced: 10:32 AM today</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid-cols-4">
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{STATS.activeCases}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Active Cases Traced</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{STATS.contactsIdentified}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Contacts Identified</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={22} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{STATS.quarantined}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Currently Quarantined</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{STATS.cleared}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Cleared (All Time)</div>
          </div>
        </div>
      </div>

      {/* 3. Network Visualization + Risk Assessment Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Network Graph Mockup */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link2 size={16} style={{ color: 'var(--accent-primary)' }} />
            Transmission Chain — {NETWORK_NODES.patient.id}
          </h3>

          {/* Tree/Graph Visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            {/* Index Patient */}
            <div style={{
              padding: '12px 20px', borderRadius: '12px', border: '2px solid #f43f5e',
              background: 'rgba(244, 63, 94, 0.08)', textAlign: 'center', minWidth: '140px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f43f5e' }}>INDEX CASE</div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>{NETWORK_NODES.patient.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{NETWORK_NODES.patient.id}</div>
            </div>

            {/* Connector Line */}
            <div style={{ width: '2px', height: '20px', background: 'var(--border-base)' }} />

            {/* Primary Contacts */}
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Primary Contacts ({NETWORK_NODES.primary.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {NETWORK_NODES.primary.map((node) => (
                  <div key={node.id} style={{
                    padding: '8px 14px', borderRadius: '8px',
                    border: `1.5px solid ${getRiskColor(node.risk)}`,
                    background: `${getRiskColor(node.risk)}10`,
                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px'
                  }}>
                    {getNodeStatusIcon(node.status)}
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{node.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connector Line */}
            <div style={{ width: '2px', height: '20px', background: 'var(--border-base)' }} />

            {/* Secondary Contacts */}
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Secondary Contacts ({NETWORK_NODES.secondary.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {NETWORK_NODES.secondary.map((node) => (
                  <div key={node.id} style={{
                    padding: '8px 14px', borderRadius: '8px',
                    border: `1.5px solid ${getRiskColor(node.risk)}`,
                    background: `${getRiskColor(node.risk)}10`,
                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px'
                  }}>
                    {getNodeStatusIcon(node.status)}
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{node.name}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>via {node.from}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', justifyContent: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-base)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
              <AlertTriangle size={10} style={{ color: '#f43f5e' }} /> Positive
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
              <ShieldAlert size={10} style={{ color: '#fbbf24' }} /> Quarantined
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={10} style={{ color: '#10b981' }} /> Monitoring
            </span>
          </div>
        </div>

        {/* Risk Assessment Panel */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} style={{ color: '#f59e0b' }} />
            Contact Risk Assessment
          </h3>

          {/* Stacked Bar Chart */}
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RISK_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <YAxis dataKey="category" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} width={110} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', borderRadius: '8px', fontSize: '11px' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="high" stackId="a" fill="#f43f5e" name="High Risk" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium Risk" />
                <Bar dataKey="low" stackId="a" fill="#10b981" name="Low Risk" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Distribution */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '120px', height: '120px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={35}>
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PIE_DATA.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-base)' }}>
            <div style={{ background: 'var(--bg-input)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f43f5e' }}>5.4%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Secondary Attack Rate</div>
            </div>
            <div style={{ background: 'var(--bg-input)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-primary)' }}>2.3 days</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Avg. Trace Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Daily Contacts Chart */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} style={{ color: 'var(--accent-primary)' }} />
          Daily Contact Discovery vs. Clearance (Last 7 Days)
        </h3>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DAILY_CONTACTS} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="newContacts" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} name="New Contacts" />
              <Line type="monotone" dataKey="cleared" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Cleared" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Trace Entries Table */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex-between flex-wrap gap-4">
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: 'var(--accent-primary)' }} />
            Recent Trace Entries
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search case, patient, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-control text-xs"
                style={{ paddingLeft: '32px' }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-control input-select text-xs"
              style={{ width: '140px' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="quarantined">Quarantined</option>
              <option value="cleared">Cleared</option>
            </select>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Patient</th>
                <th>District</th>
                <th>Contacts Found</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', color: 'var(--accent-primary)' }}>{entry.id}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{entry.patient}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                      {entry.district}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      background: entry.contactsFound > 10 ? 'rgba(244, 63, 94, 0.12)' : 'var(--bg-input)',
                      color: entry.contactsFound > 10 ? '#f43f5e' : 'var(--text-primary)',
                      padding: '2px 10px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'
                    }}>
                      {entry.contactsFound}
                    </span>
                  </td>
                  <td>{getStatusBadge(entry.status)}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      {entry.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <UserX size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p>No trace entries match the current filter.</p>
          </div>
        )}
      </div>

      {/* 6. Event Timeline */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
          Contact Tracing Event Timeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {TIMELINE_EVENTS.map((event, index) => (
            <div key={index} style={{
              display: 'flex', gap: '16px', padding: '14px 0',
              borderBottom: index < TIMELINE_EVENTS.length - 1 ? '1px solid var(--border-base)' : 'none'
            }}>
              {/* Timeline dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '20px', paddingTop: '4px' }}>
                {getSeverityDot(event.severity)}
                {index < TIMELINE_EVENTS.length - 1 && (
                  <div style={{ width: '1px', flex: 1, background: 'var(--border-base)', marginTop: '6px' }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {event.event}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={10} />
                  {event.time} · {event.date}
                </div>
              </div>

              {/* Severity Label */}
              <div style={{
                fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                color: event.severity === 'high' ? '#f43f5e' : (event.severity === 'medium' ? '#f59e0b' : '#10b981'),
                alignSelf: 'center'
              }}>
                {event.severity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactTracingPage;

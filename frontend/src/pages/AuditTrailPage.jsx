import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Download,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { AUDIT_LOGS } from '../data/mockAuditData';
import ExportButton from '../components/common/ExportButton';

export const AuditTrailPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = AUDIT_LOGS.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch = log.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    if (sev === 'CRITICAL') return <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: 'var(--risk-high)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>CRITICAL</span>;
    if (sev === 'HIGH') return <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--risk-high)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '10px' }}>HIGH</span>;
    if (sev === 'MEDIUM') return <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--risk-medium)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '10px' }}>MEDIUM</span>;
    return <span style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>INFO</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} className="text-indigo-400" />
            <span>Compliance & Operations Audit Trail</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Immutable chronological transaction logs for security compliance and epidemiological verification.
          </p>
        </div>

        <ExportButton data={filteredLogs} filename="compliance_audit_trail" label="Export Audit Log CSV" />
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search district, actor, or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control text-xs"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="input-control input-select text-xs"
            style={{ width: '200px' }}
          >
            <option value="ALL">All Action Events ({AUDIT_LOGS.length})</option>
            <option value="BATCH_PREDICTION">BATCH_PREDICTION</option>
            <option value="ALERT_BROADCAST">ALERT_BROADCAST</option>
            <option value="SMS_DISPATCH">SMS_DISPATCH</option>
            <option value="CITIZEN_REPORT">CITIZEN_REPORT</option>
            <option value="RESOURCE_REALLOCATION">RESOURCE_REALLOCATION</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="ANOMALY_FLAGGED">ANOMALY_FLAGGED</option>
          </select>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredLogs.length}</strong> logged events
        </div>
      </div>

      {/* 3. Audit Log Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Timestamp</th>
                <th>Actor / Service</th>
                <th>Action Type</th>
                <th>District Scope</th>
                <th>Severity</th>
                <th>Operation Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700 }}>
                    {log.id}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>
                    {log.actor}
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.district}</td>
                  <td>{getSeverityBadge(log.severity)}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {log.details}
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

export default AuditTrailPage;

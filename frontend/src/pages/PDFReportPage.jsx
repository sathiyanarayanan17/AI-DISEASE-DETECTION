import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Printer,
  BarChart3,
  Shield,
  Activity,
  Package,
  CheckSquare,
  FileSpreadsheet,
  File,
  Eye,
  RefreshCw,
  MapPin,
  Table,
  PieChart,
  ListChecks,
  BookOpen
} from 'lucide-react';

const districts = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Dindigul',
  'Kancheepuram', 'Cuddalore', 'Nagapattinam', 'Ramanathapuram',
  'Villupuram', 'Sivaganga', 'Theni', 'Thoothukudi', 'Virudhunagar',
  'Namakkal', 'Krishnagiri', 'Dharmapuri', 'Karur', 'Perambalur',
  'Ariyalur', 'Nilgiris', 'Tiruvarur', 'Pudukkottai', 'Tiruvannamalai',
  'Kanyakumari', 'Tiruvallur', 'Chengalpattu', 'Ranipet', 'Tirupathur',
  'Kallakurichi', 'Tenkasi', 'Mayiladuthurai'
];

const templates = [
  {
    id: 'weekly-epi',
    title: 'Weekly Epidemiological Report',
    description: 'Comprehensive weekly summary of disease surveillance data across all monitored districts',
    icon: Activity,
    color: '#3b82f6',
    pages: '12-15'
  },
  {
    id: 'district-outbreak',
    title: 'District Outbreak Summary',
    description: 'Detailed outbreak analysis for selected districts with risk trends and case data',
    icon: Shield,
    color: '#ef4444',
    pages: '8-10'
  },
  {
    id: 'model-performance',
    title: 'Model Performance Report',
    description: 'ML model metrics, SHAP analysis, prediction accuracy, and drift monitoring results',
    icon: BarChart3,
    color: '#8b5cf6',
    pages: '6-8'
  },
  {
    id: 'resource-utilization',
    title: 'Resource Utilization Report',
    description: 'Hospital capacity, supply inventory, workforce deployment, and budget utilization',
    icon: Package,
    color: '#10b981',
    pages: '10-12'
  }
];

const generationHistory = [
  { date: '2026-08-19 09:30', type: 'Weekly Epidemiological Report', districts: 'All 37 Districts', pages: 14, size: '2.4 MB' },
  { date: '2026-08-18 16:15', type: 'District Outbreak Summary', districts: 'Chennai, Coimbatore, Madurai', pages: 9, size: '1.8 MB' },
  { date: '2026-08-18 11:00', type: 'Model Performance Report', districts: 'N/A (System-wide)', pages: 7, size: '1.2 MB' },
  { date: '2026-08-17 14:45', type: 'Resource Utilization Report', districts: 'Tiruchirappalli, Salem, Erode', pages: 11, size: '2.1 MB' },
  { date: '2026-08-16 08:00', type: 'Weekly Epidemiological Report', districts: 'All 37 Districts', pages: 13, size: '2.3 MB' },
  { date: '2026-08-15 17:30', type: 'District Outbreak Summary', districts: 'Thanjavur, Nagapattinam', pages: 8, size: '1.5 MB' }
];

export default function PDFReportPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('weekly-epi');
  const [dateFrom, setDateFrom] = useState('2026-08-12');
  const [dateTo, setDateTo] = useState('2026-08-19');
  const [selectedDistricts, setSelectedDistricts] = useState(['Chennai', 'Coimbatore', 'Madurai']);
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    charts: true,
    tables: true,
    recommendations: true
  });
  const [format, setFormat] = useState('pdf');
  const [showPreview, setShowPreview] = useState(false);

  const toggleDistrict = (district) => {
    setSelectedDistricts(prev =>
      prev.includes(district)
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const selectAllDistricts = () => {
    setSelectedDistricts(districts);
  };

  const clearAllDistricts = () => {
    setSelectedDistricts([]);
  };

  const toggleSection = (section) => {
    setIncludeSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenerate = () => {
    window.print();
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={32} color="#3b82f6" />
          PDF Report Generation
        </h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
          Generate comprehensive epidemiological reports with charts, tables, and AI-driven recommendations
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>8</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Reports Generated Today</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="#8b5cf6" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>4</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Templates Available</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>3</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Scheduled Reports</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>09:30 AM</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Last Generated</div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} />
          Select Report Template
        </h2>
        <div className="grid-cols-4" style={{ gap: '16px' }}>
          {templates.map(template => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;
            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${template.color}` : '2px solid rgba(255,255,255,0.1)',
                  background: isSelected ? `${template.color}15` : 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Icon size={22} color={template.color} />
                  {isSelected && <CheckSquare size={16} color={template.color} />}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>{template.title}</div>
                <div style={{ fontSize: '12px', opacity: 0.6, lineHeight: '1.4' }}>{template.description}</div>
                <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px' }}>~{template.pages} pages</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration & Preview */}
      <div className="grid-cols-2" style={{ marginBottom: '24px', gap: '24px' }}>
        {/* Configuration Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListChecks size={20} />
            Report Configuration
          </h2>

          {/* Date Range */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Date Range
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="date"
                className="input-control"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ alignSelf: 'center', opacity: 0.5 }}>to</span>
              <input
                type="date"
                className="input-control"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Districts Multi-Select */}
          <div style={{ marginBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>
                <MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Districts ({selectedDistricts.length} selected)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={selectAllDistricts}
                  style={{ fontSize: '11px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Select All
                </button>
                <button
                  onClick={clearAllDistricts}
                  style={{ fontSize: '11px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear
                </button>
              </div>
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {districts.map(district => (
                  <label key={district} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', padding: '3px 0' }}>
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(district)}
                      onChange={() => toggleDistrict(district)}
                      style={{ accentColor: '#3b82f6' }}
                    />
                    {district}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Include Sections */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Include Sections
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                { key: 'summary', label: 'Summary', icon: FileText },
                { key: 'charts', label: 'Charts', icon: PieChart },
                { key: 'tables', label: 'Tables', icon: Table },
                { key: 'recommendations', label: 'Recommendations', icon: ListChecks }
              ].map(section => {
                const SIcon = section.icon;
                return (
                  <label key={section.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeSections[section.key]}
                      onChange={() => toggleSection(section.key)}
                      style={{ accentColor: '#3b82f6' }}
                    />
                    <SIcon size={14} />
                    {section.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Output Format
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { value: 'pdf', label: 'PDF', icon: File, color: '#ef4444' },
                { value: 'excel', label: 'Excel', icon: FileSpreadsheet, color: '#10b981' },
                { value: 'word', label: 'Word', icon: FileText, color: '#3b82f6' }
              ].map(f => {
                const FIcon = f.icon;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: format === f.value ? `2px solid ${f.color}` : '2px solid rgba(255,255,255,0.1)',
                      background: format === f.value ? `${f.color}15` : 'transparent',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: format === f.value ? '600' : '400'
                    }}
                  >
                    <FIcon size={16} color={f.color} />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Printer size={18} />
            Generate & Download
          </button>
        </div>

        {/* Report Preview Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} />
              Report Preview
            </h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{ fontSize: '12px', background: 'rgba(59,130,246,0.15)', border: 'none', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              {showPreview ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {/* Preview Document */}
          <div style={{
            background: '#ffffff',
            color: '#1a1a2e',
            borderRadius: '8px',
            padding: '24px',
            minHeight: '400px',
            fontSize: '12px',
            lineHeight: '1.6',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            {/* Report Header */}
            <div style={{ borderBottom: '3px solid #3b82f6', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1a1a2e' }}>
                    🛡 VyaadhiShield
                  </h3>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af' }}>
                    {currentTemplate?.title || 'Report'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280' }}>
                  <div>Generated: {new Date().toLocaleDateString()}</div>
                  <div>Period: {dateFrom} to {dateTo}</div>
                  <div>Districts: {selectedDistricts.length}</div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {includeSections.summary && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', margin: '0 0 8px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                  1. Executive Summary
                </h4>
                <p style={{ margin: '0 0 6px 0', color: '#374151' }}>
                  During the reporting period ({dateFrom} to {dateTo}), disease surveillance across {selectedDistricts.length} districts
                  detected elevated risk levels in 5 districts, with Dengue showing highest activity due to monsoon conditions.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>5</div>
                    <div style={{ fontSize: '10px', color: '#991b1b' }}>High Risk Districts</div>
                  </div>
                  <div style={{ background: '#fefce8', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#ca8a04' }}>12</div>
                    <div style={{ fontSize: '10px', color: '#854d0e' }}>Medium Risk Districts</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>20</div>
                    <div style={{ fontSize: '10px', color: '#166534' }}>Low Risk Districts</div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Placeholder */}
            {includeSections.charts && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', margin: '0 0 8px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                  2. Visual Analytics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
                    <BarChart3 size={24} color="#64748b" />
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Risk Trend Chart</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
                    <PieChart size={24} color="#64748b" />
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Disease Distribution</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tables Section */}
            {includeSections.tables && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', margin: '0 0 8px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                  3. District Data Table
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>District</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Risk</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Cases</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDistricts.slice(0, 5).map((d, i) => (
                      <tr key={d} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '5px 8px' }}>{d}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: '600',
                            background: i < 2 ? '#fef2f2' : i < 4 ? '#fefce8' : '#f0fdf4',
                            color: i < 2 ? '#dc2626' : i < 4 ? '#ca8a04' : '#16a34a'
                          }}>
                            {i < 2 ? 'HIGH' : i < 4 ? 'MEDIUM' : 'LOW'}
                          </span>
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: 'center' }}>{Math.floor(Math.random() * 50) + 10}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'center' }}>{i < 3 ? '↑' : '↓'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedDistricts.length > 5 && (
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px', fontStyle: 'italic' }}>
                    ... and {selectedDistricts.length - 5} more districts
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {includeSections.recommendations && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', margin: '0 0 8px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                  4. AI Recommendations
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#374151' }}>
                  <li style={{ marginBottom: '4px' }}>Deploy additional vector control teams in high-risk coastal districts</li>
                  <li style={{ marginBottom: '4px' }}>Increase Dengue testing capacity in Chennai, Coimbatore zones</li>
                  <li style={{ marginBottom: '4px' }}>Pre-position ORS supplies in cholera-prone areas ahead of rainfall</li>
                  <li>Schedule public awareness campaigns in medium-risk districts</li>
                </ul>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#9ca3af' }}>
              <span>VyaadhiShield — AI-Based Early Warning System</span>
              <span>Confidential — For Official Use Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generation History */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} />
          Generation History
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Report Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Districts</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Pages</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Size</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {generationHistory.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{item.date}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500' }}>{item.type}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', opacity: 0.8, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.districts}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>{item.pages}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>{item.size}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      style={{
                        background: 'rgba(59,130,246,0.15)',
                        border: 'none',
                        color: '#3b82f6',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Bed,
  Activity,
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { HOSPITALS_DATA } from '../data/hospitalsData';
import HospitalMap from '../components/maps/HospitalMap';
import ExportButton from '../components/common/ExportButton';

export const HospitalsPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = HOSPITALS_DATA.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.district.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'icu') return matchesSearch && h.availableIcu > 15;
    if (filterType === 'isolation') return matchesSearch && h.availableIsolation > 20;
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={24} className="text-emerald-400" />
            <span>Tamil Nadu Tertiary Hospital & ICU Locator</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
            Real-time bed availability tracking across Government Medical College Hospitals (GMCH).
          </p>
        </div>

        <ExportButton data={HOSPITALS_DATA} filename="tn_government_hospitals" label="Export Hospital Directory" />
      </div>

      {/* 2. Filter Pills & Search */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilterType('all')}
            className={`btn text-xs ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Hospitals ({HOSPITALS_DATA.length})
          </button>
          <button
            onClick={() => setFilterType('icu')}
            className={`btn text-xs ${filterType === 'icu' ? 'btn-primary' : 'btn-secondary'}`}
          >
            High ICU Capacity (&gt;15)
          </button>
          <button
            onClick={() => setFilterType('isolation')}
            className={`btn text-xs ${filterType === 'isolation' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Isolation Wards (&gt;20)
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search hospital or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control text-xs"
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      {/* 3. Interactive Leaflet Hospital Map */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="flex-between">
          <h2 style={{ fontSize: '16px' }}>Geospatial Facility Map & ICU Nodes</h2>
          <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>Live Capacity Synced</span>
        </div>

        <div style={{ height: '440px', width: '100%' }}>
          <HospitalMap height="100%" filterType={filterType} />
        </div>
      </div>

      {/* 4. Hospitals Directory Table */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '16px' }}>Hospital Logistics & Bed Roster</h2>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>District</th>
                <th>Classification</th>
                <th>Available Beds</th>
                <th>Available ICU</th>
                <th>Isolation Units</th>
                <th>Contact Hotline</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hosp) => (
                <tr key={hosp.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{hosp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Oxygen: {hosp.oxygenPlant}</div>
                  </td>
                  <td>{hosp.district}</td>
                  <td>
                    <span style={{ fontSize: '11px', background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      {hosp.type}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-emerald)' }}>{hosp.availableBeds}</strong> / {hosp.totalBeds}
                  </td>
                  <td>
                    <strong style={{ color: hosp.availableIcu > 15 ? 'var(--accent-emerald)' : 'var(--risk-high)' }}>
                      {hosp.availableIcu}
                    </strong> / {hosp.icuBeds}
                  </td>
                  <td>
                    {hosp.availableIsolation} / {hosp.isolationBeds}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontSize: '12px' }}>
                      <Phone size={12} />
                      <span>{hosp.phone}</span>
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

export default HospitalsPage;

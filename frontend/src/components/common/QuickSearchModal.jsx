import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Activity, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DISTRICTS_DATA } from '../../data/districtsData';
import RiskBadge from './RiskBadge';

export const QuickSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDistricts = DISTRICTS_DATA.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.tamilName.includes(query)
  ).slice(0, 8);

  const diseases = [
    { name: 'Dengue Fever', path: '/disease/dengue', desc: 'Aedes vector surveillance & platelet monitoring' },
    { name: 'Cholera Outbreak', path: '/disease/cholera', desc: 'Water safety & Vibrio cholerae surveillance' },
    { name: 'Malaria Surveillance', path: '/disease/malaria', desc: 'Anopheles vector & blood smear tracking' }
  ].filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelectDistrict = (districtName) => {
    navigate(`/district/${districtName.toLowerCase()}`);
    onClose();
  };

  const handleSelectRoute = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 8, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '100px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '600px',
          maxWidth: '92vw',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-base)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-surface)'
          }}
        >
          <Search size={18} className="text-indigo-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all 37 districts, diseases, tools... (e.g. Chennai, Dengue)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '15px'
            }}
          />
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ overflowY: 'auto', padding: '12px' }}>
          {/* Diseases Category */}
          {diseases.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
                Disease Trackers
              </div>
              {diseases.map((dis) => (
                <div
                  key={dis.name}
                  onClick={() => handleSelectRoute(dis.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 150ms'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={16} className="text-cyan-400" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{dis.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dis.desc}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-muted" />
                </div>
              ))}
            </div>
          )}

          {/* Districts Category */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
              Tamil Nadu Districts ({filteredDistricts.length})
            </div>
            {filteredDistricts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No district matching "{query}"
              </div>
            ) : (
              filteredDistricts.map((dist) => (
                <div
                  key={dist.id}
                  onClick={() => handleSelectDistrict(dist.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 150ms'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} className="text-indigo-400" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {dist.name} <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>{dist.tamilName}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        7-Day Cases: {dist.totalCases7d} | Rain: {dist.weather.rainfall}mm
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RiskBadge level={dist.riskLevel} score={dist.riskScore} size="sm" />
                    <ArrowRight size={14} className="text-muted" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}
        >
          <span>Use arrow keys to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSearchModal;

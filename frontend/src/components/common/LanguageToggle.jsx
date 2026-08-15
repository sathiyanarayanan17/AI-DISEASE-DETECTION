import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-secondary btn-icon"
      title={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
      aria-label="Toggle language"
    >
      <div className="flex items-center gap-1">
        <Globe size={16} />
        <span className="font-mono text-xs font-bold uppercase">{language}</span>
      </div>
    </button>
  );
};

export default LanguageToggle;

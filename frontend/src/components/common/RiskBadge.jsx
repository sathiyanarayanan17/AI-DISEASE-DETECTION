import React from 'react';

export const RiskBadge = ({ level = 'low', score, showIcon = true, size = 'md' }) => {
  const normLevel = level ? level.toLowerCase() : 'low';
  
  // Custom symbol requested: High="!", Medium="~", Low="OK"
  let symbol = 'OK';
  if (normLevel === 'high') symbol = '!';
  else if (normLevel === 'medium') symbol = '~';

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-xs py-1 px-2.5',
    lg: 'text-sm py-1.5 px-3.5'
  };

  return (
    <span className={`risk-badge ${normLevel} ${sizeClasses[size] || sizeClasses.md}`}>
      {showIcon && (
        <span className={`pulse-dot ${normLevel}`} />
      )}
      <span className="font-mono font-bold">{symbol}</span>
      <span>{normLevel.toUpperCase()}</span>
      {score !== undefined && (
        <span className="opacity-90 font-mono">({score})</span>
      )}
    </span>
  );
};

export default RiskBadge;

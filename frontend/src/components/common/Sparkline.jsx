import React from 'react';

export const Sparkline = ({ data = [], width = 100, height = 30, color = '#6366f1' }) => {
  if (!data || data.length < 2) {
    return <svg width={width} height={height} className="opacity-30" />;
  }

  const values = data.map((d) => (typeof d === 'number' ? d : (d.cases || d.riskScore || 0)));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min === 0 ? 1 : max - min;

  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - 4) + 2;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End point dot */}
      {values.length > 0 && (
        <circle
          cx={(width - 4) + 2}
          cy={height - 4 - ((values[values.length - 1] - min) / range) * (height - 8)}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};

export default Sparkline;

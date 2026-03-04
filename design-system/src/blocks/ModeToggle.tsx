import React from 'react';

interface ModeToggleProps {
  mode: 'human' | 'machine';
  onToggle: (mode: 'human' | 'machine') => void;
}

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 32,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  background: '#161616',
  borderRadius: 100,
  padding: 4,
  border: '1px solid rgba(241,241,241,0.1)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
};

const segmentBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  borderRadius: 100,
  border: 'none',
  cursor: 'pointer',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  transition: 'background 0.2s, color 0.2s',
};

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
  const isHuman = mode === 'human';

  return (
    <div style={containerStyle}>
      <button
        style={{
          ...segmentBase,
          background: isHuman ? 'rgba(241,241,241,0.1)' : 'transparent',
          color: isHuman ? '#f1f1f1' : '#777',
        }}
        onClick={() => onToggle('human')}
      >
        <span style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          border: isHuman ? '2px solid #f1f1f1' : '1.5px solid #777',
          background: 'transparent',
          display: 'inline-block',
          flexShrink: 0,
        }} />
        Human
      </button>
      <button
        style={{
          ...segmentBase,
          background: !isHuman ? 'rgba(241,241,241,0.1)' : 'transparent',
          color: !isHuman ? '#f1f1f1' : '#777',
        }}
        onClick={() => onToggle('machine')}
      >
        <span style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: !isHuman ? '#22c55e' : '#777',
          display: 'inline-block',
          flexShrink: 0,
          transition: 'background 0.2s',
        }} />
        Machine
      </button>
    </div>
  );
};

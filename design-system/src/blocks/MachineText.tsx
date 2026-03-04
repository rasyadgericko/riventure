import React from 'react';

interface MachineTextProps {
  children: string;
}

const wrapperStyle: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid rgba(241,241,241,0.08)',
  borderRadius: 8,
  padding: '2rem 2.5rem',
  marginBottom: 32,
  overflow: 'auto',
};

const preStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  fontSize: '0.82rem',
  lineHeight: 1.7,
  color: '#ccc',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  margin: 0,
};

export const MachineText: React.FC<MachineTextProps> = ({ children }) => (
  <div style={wrapperStyle}>
    <pre style={preStyle}>{children}</pre>
  </div>
);

import React from 'react';
import { useMode } from '../context/ModeContext';
import type { SpacingToken } from '../tokens/spacing';

const barStyle = (px: number): React.CSSProperties => ({
  width: Math.max(px, 2),
  height: 32,
  background: 'var(--accent)',
  opacity: 0.2 + (px / 96) * 0.6,
  borderRadius: 'var(--radius-sm)',
  transition: 'width 0.3s var(--ease)',
});

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '120px 120px 1fr',
  alignItems: 'center',
  gap: 16,
  padding: '8px 0',
  borderBottom: '1px solid var(--border)',
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--fg-muted)',
};

export const SpacingScale: React.FC<{ tokens: SpacingToken[] }> = ({ tokens }) => {
  const mode = useMode();

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Header */}
      <div style={{
        ...rowStyle,
        borderBottom: '2px solid var(--border)',
        padding: '8px 0',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--fg-muted)',
      }}>
        <span>Token</span>
        <span>Value</span>
        <span>{mode === 'human' ? 'Preview' : 'Description'}</span>
      </div>

      {tokens.map((t) => (
        <div key={t.variable} style={rowStyle}>
          <span style={monoStyle}>{t.variable}</span>
          <span style={monoStyle}>{t.value}</span>
          {mode === 'human' ? (
            <div style={barStyle(t.px)} />
          ) : (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-dim)' }}>{t.description}</span>
          )}
        </div>
      ))}
    </div>
  );
};

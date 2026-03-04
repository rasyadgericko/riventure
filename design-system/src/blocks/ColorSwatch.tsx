import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import type { ColorToken } from '../tokens/colors';

const swatchStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minWidth: 160,
};

const colorBoxStyle = (color: string): React.CSSProperties => ({
  width: '100%',
  height: 80,
  borderRadius: 'var(--radius-md)',
  background: color,
  border: '1px solid var(--border)',
});

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--fg)',
};

const metaStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--fg-muted)',
  fontFamily: 'var(--font-mono)',
};

const copyBtnStyle: React.CSSProperties = {
  fontSize: 11,
  padding: '2px 8px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-sub)',
  color: 'var(--fg-muted)',
  cursor: 'pointer',
  marginLeft: 8,
};

export const ColorSwatch: React.FC<{ token: ColorToken; theme?: 'light' | 'dark' }> = ({ token, theme = 'dark' }) => {
  const mode = useMode();
  const color = theme === 'dark' ? token.dark : token.light;
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={swatchStyle}>
      <div style={colorBoxStyle(color)} />
      <div style={labelStyle}>{token.description}</div>
      {mode === 'human' ? (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.4 }}>
          {token.usage}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={metaStyle}>{token.variable}</span>
            <button style={copyBtnStyle} onClick={() => copy(`var(${token.variable})`)}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <span style={metaStyle}>{color}</span>
        </div>
      )}
    </div>
  );
};

export const ColorGrid: React.FC<{ tokens: ColorToken[]; title: string; theme?: 'light' | 'dark' }> = ({ tokens, title, theme = 'dark' }) => {
  return (
    <div style={{ marginBottom: 48 }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-tight)',
      }}>{title}</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 24,
      }}>
        {tokens.map((t) => (
          <ColorSwatch key={t.variable} token={t} theme={theme} />
        ))}
      </div>
    </div>
  );
};

/* ── Text Color Preview ── */

interface TextSample {
  label: string;
  variable: string;
  description: string;
}

const textSamples: TextSample[] = [
  { label: 'Primary Text', variable: '--fg', description: 'Headings, primary content' },
  { label: 'Muted Text', variable: '--fg-muted', description: 'Body text, descriptions' },
  { label: 'Dim Text', variable: '--fg-dim', description: 'Captions, labels, decorative' },
];

const TextSampleRow: React.FC<{ sample: TextSample; fg: string; bg: string }> = ({ sample, fg, bg }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '12px 0', borderBottom: `1px solid ${bg === '#0f0f0f' ? 'rgba(241,241,241,0.1)' : 'rgba(22,22,22,0.12)'}` }}>
    <span style={{
      fontFamily: "'Cabinet Grotesk', sans-serif",
      fontSize: '1.4rem',
      fontWeight: 700,
      color: fg,
      textTransform: 'uppercase' as const,
      letterSpacing: '-0.03em',
      minWidth: 200,
    }}>
      {sample.label}
    </span>
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.88rem',
      color: fg,
      opacity: 0.6,
    }}>
      {sample.variable}
    </span>
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.78rem',
      color: fg,
      opacity: 0.4,
      marginLeft: 'auto',
    }}>
      {sample.description}
    </span>
  </div>
);

export const TextColorPreview: React.FC = () => {
  const darkColors: Record<string, string> = { '--fg': '#f1f1f1', '--fg-muted': '#aaa', '--fg-dim': '#777' };
  const lightColors: Record<string, string> = { '--fg': '#161616', '--fg-muted': '#555', '--fg-dim': '#777' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
      {/* Dark theme panel */}
      <div style={{
        background: '#0f0f0f',
        border: '1px solid rgba(241,241,241,0.1)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
      }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          color: '#777',
          marginBottom: 20,
          fontFamily: "'Inter', sans-serif",
        }}>
          Dark Theme
        </div>
        {textSamples.map((s) => (
          <TextSampleRow key={s.variable + '-dark'} sample={s} fg={darkColors[s.variable]} bg="#0f0f0f" />
        ))}
      </div>

      {/* Light theme panel */}
      <div style={{
        background: '#f1f1f1',
        border: '1px solid rgba(22,22,22,0.12)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
      }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          color: '#777',
          marginBottom: 20,
          fontFamily: "'Inter', sans-serif",
        }}>
          Light Theme
        </div>
        {textSamples.map((s) => (
          <TextSampleRow key={s.variable + '-light'} sample={s} fg={lightColors[s.variable]} bg="#f1f1f1" />
        ))}
      </div>
    </div>
  );
};

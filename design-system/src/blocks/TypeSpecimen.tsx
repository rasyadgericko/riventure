import React from 'react';
import { useMode } from '../context/ModeContext';
import type { TypeToken } from '../tokens/typography';
import { fontFamilies } from '../tokens/typography';

const specimenStyle = (token: TypeToken): React.CSSProperties => ({
  fontFamily: fontFamilies[token.fontFamily].value,
  fontSize: token.value.startsWith('clamp') ? `var(${token.variable})` : token.value,
  fontWeight: token.weight,
  lineHeight: token.lineHeight,
  letterSpacing: token.letterSpacing,
  textTransform: token.variable === '--text-xs' ? 'uppercase' as const : undefined,
  color: 'var(--fg)',
  marginBottom: 4,
});

const metaStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--fg-dim)',
  lineHeight: 1.6,
};

export const TypeSpecimen: React.FC<{ token: TypeToken; sample?: string }> = ({ token, sample }) => {
  const mode = useMode();
  const text = sample || (token.fontFamily === 'display' ? 'Turn Your Goals Into Growth.' : 'The quick brown fox jumps over the lazy dog.');

  return (
    <div style={{
      padding: '24px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      {mode === 'human' ? (
        <>
          <div style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--fg-muted)',
            marginBottom: 12,
          }}>
            {token.description}
          </div>
          <div style={specimenStyle(token)}>{text}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', marginTop: 8 }}>
            {token.usage}
          </div>
        </>
      ) : (
        <>
          <div style={specimenStyle(token)}>{text}</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={metaStyle}>{token.variable}: {token.value}</span>
            <span style={metaStyle}>font-family: {fontFamilies[token.fontFamily].variable}</span>
            <span style={metaStyle}>font-weight: {token.weight} · line-height: {token.lineHeight} · letter-spacing: {token.letterSpacing || '0'}</span>
          </div>
        </>
      )}
    </div>
  );
};

export const TypeScale: React.FC<{ tokens: TypeToken[] }> = ({ tokens }) => (
  <div style={{ marginBottom: 48 }}>
    {tokens.map((t) => (
      <TypeSpecimen key={t.variable} token={t} />
    ))}
  </div>
);

/* ── Heading Hierarchy Preview ── */

export interface HeadingDef {
  level: string;
  size: string;
  cssSize: string;
  fontFamily: string;
  weight: number;
  letterSpacing: string;
  lineHeight: string;
  transform?: string;
}

export const headingDefs: HeadingDef[] = [
  {
    level: 'H1',
    size: 'clamp(2.8rem, 8vw, 7rem)',
    cssSize: 'var(--text-4xl)',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    weight: 900,
    letterSpacing: '-0.05em',
    lineHeight: '0.92',
    transform: 'uppercase',
  },
  {
    level: 'H2',
    size: 'clamp(1.8rem, 5vw, 4rem)',
    cssSize: 'var(--text-3xl)',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    weight: 900,
    letterSpacing: '-0.05em',
    lineHeight: '1.0',
    transform: 'uppercase',
  },
  {
    level: 'H3',
    size: 'clamp(1.3rem, 3vw, 1.8rem)',
    cssSize: 'var(--text-2xl)',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    weight: 700,
    letterSpacing: '-0.03em',
    lineHeight: '1.1',
    transform: 'uppercase',
  },
  {
    level: 'H4',
    size: '1.2rem',
    cssSize: 'var(--text-xl)',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    weight: 700,
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    transform: 'uppercase',
  },
  {
    level: 'H5',
    size: '1rem',
    cssSize: '1rem',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    weight: 700,
    letterSpacing: '-0.02em',
    lineHeight: '1.3',
    transform: 'uppercase',
  },
  {
    level: 'H6',
    size: '0.82rem',
    cssSize: 'var(--text-sm)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    weight: 600,
    letterSpacing: '0',
    lineHeight: '1.5',
  },
];

const sampleTexts: Record<string, string> = {
  H1: 'Turn Your Goals Into Growth.',
  H2: 'What We Do Best.',
  H3: 'Strategy & Direction',
  H4: 'Our Process',
  H5: 'Step One: Discovery',
  H6: 'Additional Details',
};

export const HeadingPreview: React.FC = () => {
  const mode = useMode();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {headingDefs.map((h) => (
        <div
          key={h.level}
          style={{
            padding: '2rem 0',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {mode === 'human' ? (
            <>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: 'var(--fg-dim)',
                marginBottom: 16,
                fontFamily: "'Inter', sans-serif",
              }}>
                {h.level}
              </div>
              <div
                style={{
                  fontFamily: h.fontFamily,
                  fontSize: h.cssSize,
                  fontWeight: h.weight,
                  letterSpacing: h.letterSpacing,
                  lineHeight: h.lineHeight,
                  textTransform: h.transform as any,
                  color: 'var(--fg)',
                }}
              >
                {sampleTexts[h.level]}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontFamily: h.fontFamily,
                  fontSize: h.cssSize,
                  fontWeight: h.weight,
                  letterSpacing: h.letterSpacing,
                  lineHeight: h.lineHeight,
                  textTransform: h.transform as any,
                  color: 'var(--fg)',
                  marginBottom: 12,
                }}
              >
                {sampleTexts[h.level]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={metaStyle}>
                  {h.level.toLowerCase()} {'{'} font-size: {h.size}; font-weight: {h.weight}; letter-spacing: {h.letterSpacing}; line-height: {h.lineHeight};{h.transform ? ` text-transform: ${h.transform};` : ''} {'}'}
                </span>
                <span style={metaStyle}>font-family: {h.fontFamily.includes('Cabinet') ? 'var(--font-display)' : 'var(--font-body)'}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

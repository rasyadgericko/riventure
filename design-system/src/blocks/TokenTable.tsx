import React, { useState } from 'react';

interface TokenRow {
  variable: string;
  value: string;
  description: string;
  preview?: React.ReactNode;
}

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
  fontSize: 'var(--text-sm)',
  verticalAlign: 'middle',
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  fontSize: 'var(--text-xs)',
  textTransform: 'uppercase',
  letterSpacing: 'var(--tracking-wide)',
  color: 'var(--fg-muted)',
  borderBottom: '2px solid var(--border)',
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--fg-muted)',
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{
        fontSize: 10,
        padding: '1px 6px',
        borderRadius: 3,
        border: '1px solid var(--border)',
        background: 'var(--bg-sub)',
        color: 'var(--fg-dim)',
        cursor: 'pointer',
        marginLeft: 8,
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

export const TokenTable: React.FC<{ tokens: TokenRow[]; title?: string }> = ({ tokens, title }) => {
  return (
    <div style={{ marginBottom: 48 }}>
      {title && (
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          marginBottom: 16,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-tight)',
        }}>{title}</h3>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {tokens[0]?.preview !== undefined && <th style={{ ...headerStyle, width: 60 }}>Preview</th>}
              <th style={headerStyle}>Token</th>
              <th style={headerStyle}>Value</th>
              <th style={headerStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.variable}>
                {t.preview !== undefined && <td style={cellStyle}>{t.preview}</td>}
                <td style={cellStyle}>
                  <span style={monoStyle}>{t.variable}</span>
                  <CopyButton text={`var(${t.variable})`} />
                </td>
                <td style={cellStyle}><span style={monoStyle}>{t.value}</span></td>
                <td style={{ ...cellStyle, color: 'var(--fg-muted)' }}>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

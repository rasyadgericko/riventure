import React, { useState } from 'react';

export const CodeBlock: React.FC<{ code: string; language?: string; title?: string }> = ({ code, language = 'css', title }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      marginBottom: 24,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: 'var(--bg-sub)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {title || language}
        </span>
        <button onClick={copy} style={{
          fontSize: 11,
          padding: '2px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--fg-muted)',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <pre style={{
        padding: 16,
        margin: 0,
        fontSize: 13,
        lineHeight: 1.6,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg)',
        background: 'var(--bg)',
        overflowX: 'auto',
        tabSize: 2,
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export interface TypeToken {
  variable: string;
  value: string;
  fontFamily: 'display' | 'body' | 'mono';
  weight: number;
  lineHeight: string;
  letterSpacing: string;
  description: string;
  usage: string;
}

export const fontFamilies = {
  display: { variable: '--font-display', value: "'Cabinet Grotesk', sans-serif", description: 'Display / Headings' },
  body: { variable: '--font-body', value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", description: 'Body / UI Text' },
  mono: { variable: '--font-mono', value: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace", description: 'Code / Monospace' },
};

export const typeScale: TypeToken[] = [
  { variable: '--text-4xl', value: 'clamp(2.8rem, 8vw, 7rem)', fontFamily: 'display', weight: 900, lineHeight: '0.92', letterSpacing: '-0.05em', description: 'Display / Hero', usage: 'Hero headings, page titles' },
  { variable: '--text-3xl', value: 'clamp(1.8rem, 5vw, 4rem)', fontFamily: 'display', weight: 900, lineHeight: '1.0', letterSpacing: '-0.05em', description: 'Section Heading', usage: 'Section H2 headings' },
  { variable: '--text-2xl', value: 'clamp(1.3rem, 3vw, 1.8rem)', fontFamily: 'display', weight: 700, lineHeight: '1.1', letterSpacing: '-0.03em', description: 'Subsection Heading', usage: 'H3 headings, card titles' },
  { variable: '--text-xl', value: '1.2rem', fontFamily: 'body', weight: 600, lineHeight: '1.3', letterSpacing: '0', description: 'Large Body', usage: 'Subheadings, emphasized text' },
  { variable: '--text-lg', value: '1.05rem', fontFamily: 'body', weight: 400, lineHeight: '1.8', letterSpacing: '0', description: 'Body Large', usage: 'Hero descriptions, lead paragraphs' },
  { variable: '--text-base', value: '0.95rem', fontFamily: 'body', weight: 400, lineHeight: '1.8', letterSpacing: '0', description: 'Body', usage: 'Default body text, descriptions' },
  { variable: '--text-sm', value: '0.82rem', fontFamily: 'body', weight: 500, lineHeight: '1.5', letterSpacing: '0', description: 'Small', usage: 'Labels, form hints, metadata' },
  { variable: '--text-xs', value: '0.7rem', fontFamily: 'body', weight: 600, lineHeight: '1.3', letterSpacing: '0.08em', description: 'Micro', usage: 'Tags, eyebrows, section numbers (uppercase)' },
];

export const lineHeights = [
  { variable: '--leading-tight', value: '0.92', description: 'Display headings' },
  { variable: '--leading-snug', value: '1.1', description: 'Subheadings' },
  { variable: '--leading-normal', value: '1.5', description: 'Default body text' },
  { variable: '--leading-relaxed', value: '1.8', description: 'Long-form body text' },
];

export const letterSpacings = [
  { variable: '--tracking-tight', value: '-0.05em', description: 'Display headings' },
  { variable: '--tracking-normal', value: '0', description: 'Body text' },
  { variable: '--tracking-wide', value: '0.08em', description: 'Uppercase labels' },
  { variable: '--tracking-wider', value: '0.1em', description: 'Section eyebrows' },
];

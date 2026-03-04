export interface ColorToken {
  variable: string;
  light: string;
  dark: string;
  description: string;
  usage: string;
}

export const coreColors: ColorToken[] = [
  { variable: '--bg', light: '#f1f1f1', dark: '#0f0f0f', description: 'Page background', usage: 'Primary background for all pages and sections' },
  { variable: '--fg', light: '#161616', dark: '#f1f1f1', description: 'Primary foreground', usage: 'Main text, headings, icons' },
  { variable: '--fg-muted', light: '#555', dark: '#aaa', description: 'Muted foreground', usage: 'Secondary text, descriptions, subtitles' },
  { variable: '--fg-dim', light: '#777', dark: '#777', description: 'Dim foreground', usage: 'Tertiary text, decorative labels, counters' },
  { variable: '--border', light: 'rgba(22,22,22,0.12)', dark: 'rgba(241,241,241,0.1)', description: 'Border color', usage: 'Card borders, dividers, separators' },
  { variable: '--bg-sub', light: '#e8e8e8', dark: '#151515', description: 'Subtle background', usage: 'Alternating rows, shaded cells, hover states' },
  { variable: '--accent', light: '#161616', dark: '#f1f1f1', description: 'Accent / interactive', usage: 'Buttons, active states, focus rings' },
  { variable: '--accent-glow', light: 'rgba(22,22,22,0.06)', dark: 'rgba(241,241,241,0.04)', description: 'Accent glow', usage: 'Soft shadows, magnetic button aura' },
];

export const extendedColors: ColorToken[] = [
  { variable: '--bg-elevated', light: '#ffffff', dark: '#1a1a1a', description: 'Elevated surface', usage: 'Cards, modals, popovers above background' },
  { variable: '--bg-overlay', light: 'rgba(0,0,0,0.4)', dark: 'rgba(0,0,0,0.6)', description: 'Overlay', usage: 'Modal backdrops, image overlays' },
  { variable: '--accent-hover', light: '#333', dark: '#ddd', description: 'Accent hover', usage: 'Interactive elements on hover' },
  { variable: '--accent-active', light: '#000', dark: '#fff', description: 'Accent active', usage: 'Interactive elements on press' },
];

export const semanticColors: ColorToken[] = [
  { variable: '--success', light: '#22c55e', dark: '#22c55e', description: 'Success', usage: 'Confirmation, availability, positive states' },
  { variable: '--error', light: '#ef4444', dark: '#ef4444', description: 'Error', usage: 'Validation errors, destructive actions' },
  { variable: '--warning', light: '#f59e0b', dark: '#f59e0b', description: 'Warning', usage: 'Caution states, attention needed' },
  { variable: '--info', light: '#3b82f6', dark: '#3b82f6', description: 'Info', usage: 'Informational states, help text' },
];

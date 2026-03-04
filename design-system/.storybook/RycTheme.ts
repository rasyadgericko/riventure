import { create } from '@storybook/theming/create';

export const rycTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'RYC Design System',
  brandUrl: 'https://www.rycworks.com',
  brandTarget: '_blank',

  // Colors
  colorPrimary: '#f1f1f1',
  colorSecondary: '#f1f1f1',

  // UI
  appBg: '#0f0f0f',
  appContentBg: '#0f0f0f',
  appPreviewBg: '#0f0f0f',
  appBorderColor: 'rgba(241,241,241,0.1)',
  appBorderRadius: 8,

  // Text
  textColor: '#f1f1f1',
  textInverseColor: '#161616',
  textMutedColor: '#aaa',

  // Toolbar
  barTextColor: '#aaa',
  barSelectedColor: '#f1f1f1',
  barHoverColor: '#f1f1f1',
  barBg: '#0f0f0f',

  // Forms
  inputBg: '#151515',
  inputBorder: 'rgba(241,241,241,0.1)',
  inputTextColor: '#f1f1f1',
  inputBorderRadius: 4,

  // Typography
  fontBase: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontCode: "ui-monospace, 'SF Mono', Menlo, monospace",
});

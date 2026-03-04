import type { Preview } from '@storybook/react';
import React from 'react';
import { ModeProvider, type ViewMode } from '../src/context/ModeContext';
import { RycDocsContainer } from './DocsContainer';
import { MODE_KEY } from './mode-addon/constants';

import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/reset.css';

const THEME_KEY = 'ryc-theme';

// Set initial DOM attributes for CSS-based mode/theme visibility
document.documentElement.dataset.rycMode = 'human';
document.documentElement.dataset.theme = 'dark';

const preview: Preview = {
  globalTypes: {
    [MODE_KEY]: {
      description: 'Toggle between Human and Machine view',
    },
    [THEME_KEY]: {
      description: 'Switch between light and dark theme',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    [MODE_KEY]: 'human',
    [THEME_KEY]: 'dark',
  },
  decorators: [
    (Story, context) => {
      const mode = (context.globals[MODE_KEY] || 'human') as ViewMode;
      const theme = context.globals[THEME_KEY] || 'dark';

      // Sync DOM attributes for CSS-based mode visibility
      document.documentElement.dataset.rycMode = mode;
      document.documentElement.dataset.theme = theme;

      return React.createElement(
        ModeProvider,
        { mode },
        React.createElement('div', {
          'data-theme': theme,
          'data-ryc-mode': mode,
          style: {
            background: 'var(--bg)',
            color: 'var(--fg)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            minHeight: '100vh',
            padding: '2rem',
          },
        }, React.createElement(Story))
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    layout: 'fullscreen',
    docs: {
      container: RycDocsContainer,
    },
  },
};

export default preview;

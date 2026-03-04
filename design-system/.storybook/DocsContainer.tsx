import React, { useState, useEffect, useCallback } from 'react';
import { DocsContainer as BaseDocsContainer } from '@storybook/blocks';
import { ModeProvider, type ViewMode } from '../src/context/ModeContext';
import { ModeToggle } from '../src/blocks/ModeToggle';

const MODE_KEY = 'ryc-mode';
const THEME_KEY = 'ryc-theme';

export const RycDocsContainer = (props: any) => {
  const { children, context, ...rest } = props;
  const [mode, setMode] = useState<ViewMode>('human');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Read initial globals from the Storybook store
    try {
      const store = context?.store;
      const globals = store?.userGlobals?.globals || {};
      if (globals[MODE_KEY]) setMode(globals[MODE_KEY]);
      if (globals[THEME_KEY]) setTheme(globals[THEME_KEY]);
    } catch {}

    // Listen for globals updates via Storybook's addon channel
    const channel = (window as any).__STORYBOOK_ADDONS_CHANNEL__;
    if (!channel) return;

    const onUpdate = ({ globals }: any) => {
      if (globals[MODE_KEY]) setMode(globals[MODE_KEY]);
      if (globals[THEME_KEY]) setTheme(globals[THEME_KEY]);
    };
    channel.on('globalsUpdated', onUpdate);
    return () => channel.off('globalsUpdated', onUpdate);
  }, [context]);

  // Sync DOM attributes for CSS-based mode visibility
  useEffect(() => {
    document.documentElement.dataset.rycMode = mode;
    document.documentElement.dataset.theme = theme;
  }, [mode, theme]);

  const handleToggle = useCallback((newMode: ViewMode) => {
    setMode(newMode);
    // Sync to Storybook globals so toolbar & decorators stay in sync
    const channel = (window as any).__STORYBOOK_ADDONS_CHANNEL__;
    if (channel) {
      channel.emit('updateGlobals', { globals: { [MODE_KEY]: newMode } });
    }
  }, []);

  return (
    <BaseDocsContainer context={context} {...rest}>
      <ModeProvider mode={mode}>
        <div
          className="ryc-docs"
          data-theme={theme}
          data-ryc-mode={mode}
          style={{
            background: 'var(--bg)',
            color: 'var(--fg)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: '2rem 2.5rem',
            paddingBottom: '6rem',
          }}
        >
          {children}
          <ModeToggle mode={mode} onToggle={handleToggle} />
        </div>
      </ModeProvider>
    </BaseDocsContainer>
  );
};

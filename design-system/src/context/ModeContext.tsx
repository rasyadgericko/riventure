import React, { createContext, useContext } from 'react';

export type ViewMode = 'human' | 'machine';

const ModeContext = createContext<ViewMode>('human');

export const ModeProvider: React.FC<{ mode: ViewMode; children: React.ReactNode }> = ({ mode, children }) => (
  <ModeContext.Provider value={mode}>{children}</ModeContext.Provider>
);

export const useMode = () => useContext(ModeContext);

// CSS-class approach: visibility controlled by [data-ryc-mode] on <html>.
// Works everywhere — stories, autodocs, and standalone MDX docs pages.
export const HumanOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ryc-human-only">{children}</div>
);

export const MachineOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ryc-machine-only">{children}</div>
);

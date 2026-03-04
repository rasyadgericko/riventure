export interface ShadowToken {
  variable: string;
  value: string;
  description: string;
  usage: string;
}

export const shadowScale: ShadowToken[] = [
  { variable: '--shadow-xs', value: '0 1px 2px rgba(0,0,0,0.04)', description: 'Extra small', usage: 'Subtle lift for small elements' },
  { variable: '--shadow-sm', value: '0 2px 8px color-mix(in srgb, var(--fg) 5%, transparent)', description: 'Small', usage: 'Default card resting state' },
  { variable: '--shadow-md', value: '0 4px 16px color-mix(in srgb, var(--fg) 7%, transparent)', description: 'Medium', usage: 'Hovered cards, dropdowns' },
  { variable: '--shadow-lg', value: '0 0 0 1px color-mix(in srgb, var(--fg) 8%, transparent), 0 4px 16px color-mix(in srgb, var(--fg) 7%, transparent), 0 12px 36px color-mix(in srgb, var(--fg) 10%, transparent), 0 28px 72px color-mix(in srgb, var(--fg) 9%, transparent)', description: 'Large', usage: 'Elevated cards, service card hover' },
  { variable: '--shadow-xl', value: '0 28px 80px rgba(0,0,0,0.55)', description: 'Extra large', usage: 'Browser mockups, hero elements' },
];

export interface SpacingToken {
  variable: string;
  value: string;
  px: number;
  description: string;
}

export const spacingScale: SpacingToken[] = [
  { variable: '--space-0', value: '0', px: 0, description: 'None' },
  { variable: '--space-1', value: '4px', px: 4, description: 'Micro — icon gaps, inline spacing' },
  { variable: '--space-2', value: '8px', px: 8, description: 'Tight — tag padding, compact gaps' },
  { variable: '--space-3', value: '12px', px: 12, description: 'Small — card grid gaps, form gaps' },
  { variable: '--space-4', value: '16px', px: 16, description: 'Base — default component spacing' },
  { variable: '--space-5', value: '20px', px: 20, description: 'Medium — card padding compact' },
  { variable: '--space-6', value: '24px', px: 24, description: 'Comfortable — form field gaps' },
  { variable: '--space-8', value: '32px', px: 32, description: 'Large — section sub-spacing' },
  { variable: '--space-10', value: '40px', px: 40, description: 'Extra large — layout gaps' },
  { variable: '--space-12', value: '48px', px: 48, description: 'Section inner — card padding' },
  { variable: '--space-16', value: '64px', px: 64, description: 'Section — desktop horizontal padding' },
  { variable: '--space-20', value: '80px', px: 80, description: 'Section vertical — large sections' },
  { variable: '--space-24', value: '96px', px: 96, description: 'Section max — hero spacing' },
];

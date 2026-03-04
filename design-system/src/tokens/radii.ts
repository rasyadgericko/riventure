export interface RadiusToken {
  variable: string;
  value: string;
  description: string;
  usage: string;
}

export const radiiScale: RadiusToken[] = [
  { variable: '--radius-none', value: '0', description: 'None', usage: 'Sharp elements, dividers' },
  { variable: '--radius-sm', value: '4px', description: 'Small', usage: 'Input fields, subtle rounding' },
  { variable: '--radius-md', value: '8px', description: 'Medium', usage: 'Cards, containers' },
  { variable: '--radius-lg', value: '12px', description: 'Large', usage: 'Testimonial cards, modals' },
  { variable: '--radius-pill', value: '100px', description: 'Pill', usage: 'Buttons, tags, badges' },
  { variable: '--radius-round', value: '50%', description: 'Round', usage: 'Avatars, circular icons' },
];

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { coreColors, extendedColors, semanticColors } from '../../src/tokens/colors.js';
import { spacingScale } from '../../src/tokens/spacing.js';
import { radiiScale } from '../../src/tokens/radii.js';
import { lineHeights, letterSpacings } from '../../src/tokens/typography.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../../tokens');

function strip(variable: string, prefix: string): string {
  return variable.replace(new RegExp(`^--${prefix}-`), '');
}

// ---------------------------------------------------------------------------
// light.json / dark.json — color tokens, one file per mode
// ---------------------------------------------------------------------------
function buildColorSet(mode: 'light' | 'dark'): Record<string, Record<string, unknown>> {
  const groups: Record<string, Record<string, unknown>> = {};
  const allColors = [
    ...coreColors.map(c => ({ ...c, group: 'core' })),
    ...extendedColors.map(c => ({ ...c, group: 'extended' })),
    ...semanticColors.map(c => ({ ...c, group: 'semantic' })),
  ];
  for (const color of allColors) {
    const name = color.variable.replace(/^--/, '');
    if (!groups[color.group]) groups[color.group] = {};
    groups[color.group][name] = {
      value: color[mode],
      type: 'color',
      description: `${color.description} — ${color.usage}`,
    };
  }
  return groups;
}

// ---------------------------------------------------------------------------
// global.json — spacing, radii, typography (single-mode)
// ---------------------------------------------------------------------------
function buildGlobal(): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {
    space: {},
    radius: {},
    lineHeight: {},
    letterSpacing: {},
  };

  for (const t of spacingScale) {
    out.space[strip(t.variable, 'space')] = {
      value: t.value,       // e.g. "0", "4px"
      type: 'spacing',
      description: t.description,
    };
  }

  for (const t of radiiScale.filter(r => !r.value.includes('%'))) {
    out.radius[strip(t.variable, 'radius')] = {
      value: t.value,       // e.g. "0", "4px"
      type: 'borderRadius',
      description: `${t.description} — ${t.usage}`,
    };
  }

  for (const t of lineHeights) {
    out.lineHeight[strip(t.variable, 'leading')] = {
      value: t.value,       // e.g. "0.92", "1.5"
      type: 'lineHeights',
      description: t.description,
    };
  }

  for (const t of letterSpacings) {
    out.letterSpacing[strip(t.variable, 'tracking')] = {
      value: t.value,       // e.g. "-0.05em", "0"
      type: 'letterSpacing',
      description: t.description,
    };
  }

  return out;
}

// ---------------------------------------------------------------------------
// $metadata.json — token set order for Tokens Studio
// ---------------------------------------------------------------------------
const metadata = {
  tokenSetOrder: ['global', 'light', 'dark'],
};

// ---------------------------------------------------------------------------
// $themes.json — Light / Dark themes for Tokens Studio
// ---------------------------------------------------------------------------
const themes = [
  {
    id: 'light',
    name: 'Light',
    selectedTokenSets: { global: 'enabled', light: 'enabled', dark: 'disabled' },
  },
  {
    id: 'dark',
    name: 'Dark',
    selectedTokenSets: { global: 'enabled', light: 'disabled', dark: 'enabled' },
  },
];

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, 'light.json'),      JSON.stringify(buildColorSet('light'), null, 2));
writeFileSync(join(outDir, 'dark.json'),       JSON.stringify(buildColorSet('dark'), null, 2));
writeFileSync(join(outDir, 'global.json'),     JSON.stringify(buildGlobal(), null, 2));
writeFileSync(join(outDir, '$metadata.json'),  JSON.stringify(metadata, null, 2));
writeFileSync(join(outDir, '$themes.json'),    JSON.stringify(themes, null, 2));

const totalColors = [...coreColors, ...extendedColors, ...semanticColors].length;
const totalRadii  = radiiScale.filter(t => !t.value.includes('%')).length;

console.log('Tokens Studio export complete!\n');
console.log(`  Output:       tokens/`);
console.log(`  Files:        light.json, dark.json, global.json, $metadata.json, $themes.json`);
console.log(`  Colors:       ${totalColors} tokens`);
console.log(`  Spacing:      ${spacingScale.length} tokens`);
console.log(`  Radii:        ${totalRadii} tokens`);
console.log(`  Typography:   ${lineHeights.length + letterSpacings.length} tokens`);

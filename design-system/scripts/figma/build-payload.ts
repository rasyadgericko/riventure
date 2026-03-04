import { coreColors, extendedColors, semanticColors } from '../../src/tokens/colors.js';
import { spacingScale } from '../../src/tokens/spacing.js';
import { radiiScale } from '../../src/tokens/radii.js';
import { lineHeights, letterSpacings } from '../../src/tokens/typography.js';
import { parseColorToFigma } from './color-parser.js';
import type {
  FigmaVariablesPostBody,
  VariableCollectionCreate,
  VariableModeAction,
  VariableCreate,
  VariableModeValueSet,
} from './types.js';

function stripPrefix(variable: string): string {
  return variable.replace(/^--/, '');
}

function slugify(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}

function parsePixelValue(value: string): number {
  if (value === '0') return 0;
  const match = value.match(/^([\d.]+)px$/);
  if (!match) throw new Error(`Cannot parse pixel value: "${value}"`);
  return parseFloat(match[1]);
}

function parseEmValue(value: string): number {
  if (value === '0') return 0;
  const match = value.match(/^(-?[\d.]+)em$/);
  if (!match) throw new Error(`Cannot parse em value: "${value}"`);
  return parseFloat(match[1]);
}

// ---------------------------------------------------------------------------
// Colors — Light/Dark modes
// ---------------------------------------------------------------------------
function buildColorCollection(
  collections: VariableCollectionCreate[],
  modes: VariableModeAction[],
  variables: VariableCreate[],
  values: VariableModeValueSet[],
): void {
  const collectionId = 'vc_colors';
  const lightModeId = 'vm_light';
  const darkModeId = 'vm_dark';

  collections.push({
    action: 'CREATE',
    id: collectionId,
    name: 'Colors',
    initialModeId: lightModeId,
  });

  // Rename the auto-created initial mode, then create the second mode
  modes.push(
    { action: 'UPDATE', id: lightModeId, name: 'Light', variableCollectionId: collectionId },
    { action: 'CREATE', id: darkModeId, name: 'Dark', variableCollectionId: collectionId },
  );

  const allColors = [
    ...coreColors.map(c => ({ ...c, group: 'core' })),
    ...extendedColors.map(c => ({ ...c, group: 'extended' })),
    ...semanticColors.map(c => ({ ...c, group: 'semantic' })),
  ];

  for (const color of allColors) {
    const varName = stripPrefix(color.variable);
    const varId = `v_color_${slugify(varName)}`;
    const figmaName = `${color.group}/${varName}`;

    variables.push({
      action: 'CREATE',
      id: varId,
      name: figmaName,
      resolvedType: 'COLOR',
      variableCollectionId: collectionId,
      description: `${color.description} — ${color.usage}`,
    });

    values.push(
      { variableId: varId, modeId: lightModeId, value: parseColorToFigma(color.light) },
      { variableId: varId, modeId: darkModeId, value: parseColorToFigma(color.dark) },
    );
  }
}

// ---------------------------------------------------------------------------
// Spacing — single Default mode
// ---------------------------------------------------------------------------
function buildSpacingCollection(
  collections: VariableCollectionCreate[],
  modes: VariableModeAction[],
  variables: VariableCreate[],
  values: VariableModeValueSet[],
): void {
  const collectionId = 'vc_spacing';
  const modeId = 'vm_spacing_default';

  collections.push({
    action: 'CREATE',
    id: collectionId,
    name: 'Spacing',
    initialModeId: modeId,
  });

  modes.push({ action: 'UPDATE', id: modeId, name: 'Default', variableCollectionId: collectionId });

  for (const token of spacingScale) {
    const varName = stripPrefix(token.variable);
    const varId = `v_spacing_${slugify(varName)}`;

    variables.push({
      action: 'CREATE',
      id: varId,
      name: varName,
      resolvedType: 'FLOAT',
      variableCollectionId: collectionId,
      description: token.description,
    });

    values.push({ variableId: varId, modeId, value: token.px });
  }
}

// ---------------------------------------------------------------------------
// Radii — single Default mode, skip percentage values
// ---------------------------------------------------------------------------
function buildRadiiCollection(
  collections: VariableCollectionCreate[],
  modes: VariableModeAction[],
  variables: VariableCreate[],
  values: VariableModeValueSet[],
): void {
  const collectionId = 'vc_radii';
  const modeId = 'vm_radii_default';

  collections.push({
    action: 'CREATE',
    id: collectionId,
    name: 'Radii',
    initialModeId: modeId,
  });

  modes.push({ action: 'UPDATE', id: modeId, name: 'Default', variableCollectionId: collectionId });

  const supported = radiiScale.filter(t => !t.value.includes('%'));

  for (const token of supported) {
    const varName = stripPrefix(token.variable);
    const varId = `v_radii_${slugify(varName)}`;

    variables.push({
      action: 'CREATE',
      id: varId,
      name: varName,
      resolvedType: 'FLOAT',
      variableCollectionId: collectionId,
      description: `${token.description} — ${token.usage}`,
    });

    values.push({ variableId: varId, modeId, value: parsePixelValue(token.value) });
  }
}

// ---------------------------------------------------------------------------
// Typography — line-heights + letter-spacings as FLOAT
// ---------------------------------------------------------------------------
function buildTypographyCollection(
  collections: VariableCollectionCreate[],
  modes: VariableModeAction[],
  variables: VariableCreate[],
  values: VariableModeValueSet[],
): void {
  const collectionId = 'vc_typography';
  const modeId = 'vm_typography_default';

  collections.push({
    action: 'CREATE',
    id: collectionId,
    name: 'Typography',
    initialModeId: modeId,
  });

  modes.push({ action: 'UPDATE', id: modeId, name: 'Default', variableCollectionId: collectionId });

  // Line heights (unitless floats)
  for (const token of lineHeights) {
    const name = stripPrefix(token.variable).replace('leading-', '');
    const varId = `v_typo_lh_${slugify(name)}`;

    variables.push({
      action: 'CREATE',
      id: varId,
      name: `line-height/${name}`,
      resolvedType: 'FLOAT',
      variableCollectionId: collectionId,
      description: token.description,
    });

    values.push({ variableId: varId, modeId, value: parseFloat(token.value) });
  }

  // Letter spacings (em values stored as raw numbers)
  for (const token of letterSpacings) {
    const name = stripPrefix(token.variable).replace('tracking-', '');
    const varId = `v_typo_ls_${slugify(name)}`;

    variables.push({
      action: 'CREATE',
      id: varId,
      name: `letter-spacing/${name}`,
      resolvedType: 'FLOAT',
      variableCollectionId: collectionId,
      description: `${token.description} (value in em)`,
    });

    values.push({ variableId: varId, modeId, value: parseEmValue(token.value) });
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function buildPayload(): FigmaVariablesPostBody {
  const collections: VariableCollectionCreate[] = [];
  const modes: VariableModeAction[] = [];
  const variables: VariableCreate[] = [];
  const values: VariableModeValueSet[] = [];

  buildColorCollection(collections, modes, variables, values);
  buildSpacingCollection(collections, modes, variables, values);
  buildRadiiCollection(collections, modes, variables, values);
  buildTypographyCollection(collections, modes, variables, values);

  return {
    variableCollections: collections,
    variableModes: modes,
    variables,
    variableModeValues: values,
  };
}

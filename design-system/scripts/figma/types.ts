// Figma Variables REST API types
// https://developers.figma.com/docs/rest-api/variables/

export type FigmaVariableResolvedType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

export interface FigmaColor {
  r: number; // 0–1
  g: number; // 0–1
  b: number; // 0–1
  a: number; // 0–1
}

export interface VariableCollectionCreate {
  action: 'CREATE';
  id: string;
  name: string;
  initialModeId: string;
}

export type VariableModeAction =
  | { action: 'CREATE'; id: string; name: string; variableCollectionId: string }
  | { action: 'UPDATE'; id: string; name: string; variableCollectionId: string };

export interface VariableCreate {
  action: 'CREATE';
  id: string;
  name: string;
  resolvedType: FigmaVariableResolvedType;
  variableCollectionId: string;
  description?: string;
}

export interface VariableModeValueSet {
  variableId: string;
  modeId: string;
  value: FigmaColor | number | string | boolean;
}

export interface FigmaVariablesPostBody {
  variableCollections: VariableCollectionCreate[];
  variableModes: VariableModeAction[];
  variables: VariableCreate[];
  variableModeValues: VariableModeValueSet[];
}

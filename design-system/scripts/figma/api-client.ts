import type { FigmaVariablesPostBody } from './types.js';

const FIGMA_API_BASE = 'https://api.figma.com';

export interface PushResult {
  success: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

export async function pushVariables(
  fileKey: string,
  token: string,
  payload: FigmaVariablesPostBody,
): Promise<PushResult> {
  const url = `${FIGMA_API_BASE}/v1/files/${fileKey}/variables`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      data,
      error: formatApiError(response.status, data),
    };
  }

  return { success: true, status: response.status, data };
}

function formatApiError(status: number, data: unknown): string {
  if (status === 403) {
    return [
      'Figma Variables API returned 403 Forbidden.',
      'This endpoint requires a Figma Enterprise plan.',
      '',
      'Alternatives:',
      '  1. Use the Figma Plugin API (Variables.createVariable) via a local plugin',
      '  2. Import tokens via the "Tokens Studio" community plugin (JSON format)',
      '  3. Manually create variables in Figma using the dry-run JSON as reference',
    ].join('\n');
  }
  if (status === 401) {
    return 'Authentication failed. Check your FIGMA_TOKEN in .env';
  }
  if (status === 404) {
    return 'File not found. Check your FIGMA_FILE_KEY in .env';
  }

  const message =
    typeof data === 'object' && data !== null && 'err' in data
      ? (data as { err: string }).err
      : JSON.stringify(data);
  return `Figma API error (${status}): ${message}`;
}

import 'dotenv/config';
import { buildPayload } from './figma/build-payload.js';
import { pushVariables } from './figma/api-client.js';

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('Building Figma Variables payload...\n');
  const payload = buildPayload();

  console.log(`  Collections: ${payload.variableCollections.length}`);
  console.log(`  Modes:       ${payload.variableModes.length}`);
  console.log(`  Variables:   ${payload.variables.length}`);
  console.log(`  Values:      ${payload.variableModeValues.length}`);

  // Dry-run mode: print payload and exit without calling the API
  if (isDryRun) {
    console.log('\n--- DRY RUN: Payload (not sent) ---\n');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;

  if (!token || !fileKey) {
    console.error('Missing required environment variables.');
    console.error('Create a .env file in design-system/ with:');
    console.error('  FIGMA_TOKEN=your_personal_access_token');
    console.error('  FIGMA_FILE_KEY=your_figma_file_key');
    process.exit(1);
  }

  console.log(`\nPushing to Figma file ${fileKey}...`);
  const result = await pushVariables(fileKey, token, payload);

  if (result.success) {
    console.log('\nVariables pushed successfully!');
    if (result.data && typeof result.data === 'object' && 'tempIdToRealId' in result.data) {
      const map = (result.data as { tempIdToRealId: Record<string, string> }).tempIdToRealId;
      console.log(`  Mapped ${Object.keys(map).length} temp IDs to real IDs.`);
    }
  } else {
    console.error(`\nFailed (HTTP ${result.status}):\n`);
    console.error(result.error);
    process.exit(1);
  }
}

main();

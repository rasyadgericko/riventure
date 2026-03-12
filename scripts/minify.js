// Minification build script — runs on Vercel only (via vercel.json buildCommand)
// Minifies all .css and .js files in-place before deployment.

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const ROOT = path.resolve(__dirname, '..');

// Directories to skip entirely
const SKIP_DIRS = new Set([
  'design-system',
  'storybook',
  'node_modules',
  'backups',
  'previews',
  'scripts',
  '.git',
]);

function collectFiles(dir, ext, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        collectFiles(path.join(dir, entry.name), ext, results);
      }
    } else if (entry.name.endsWith(ext)) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

async function run() {
  const cssFiles = collectFiles(ROOT, '.css');
  const jsFiles  = collectFiles(ROOT, '.js');

  // ── CSS ──────────────────────────────────────────────────────────────
  console.log(`\nMinifying ${cssFiles.length} CSS files…`);
  const css = new CleanCSS({ level: 2 });
  for (const file of cssFiles) {
    const src = fs.readFileSync(file, 'utf8');
    const result = css.minify(src);
    if (result.errors.length) {
      console.error(`  ✗ ${path.relative(ROOT, file)}`, result.errors);
    } else {
      fs.writeFileSync(file, result.styles);
      console.log(`  ✓ ${path.relative(ROOT, file)}`);
    }
  }

  // ── JS ───────────────────────────────────────────────────────────────
  console.log(`\nMinifying ${jsFiles.length} JS files…`);
  for (const file of jsFiles) {
    const src = fs.readFileSync(file, 'utf8');
    try {
      const result = await minify(src, { compress: true, mangle: true });
      if (result.code) {
        fs.writeFileSync(file, result.code);
        console.log(`  ✓ ${path.relative(ROOT, file)}`);
      }
    } catch (err) {
      console.error(`  ✗ ${path.relative(ROOT, file)}`, err.message);
    }
  }

  console.log('\nBuild complete.\n');
}

run().catch(err => { console.error(err); process.exit(1); });

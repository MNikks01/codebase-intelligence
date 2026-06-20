// Single source of truth = engine/src. The web app can't import it directly (Turbopack
// won't resolve outside its root; Node native-TS needs .ts import extensions the bundler
// rejects). So web/lib/engine is a GENERATED copy with .ts import extensions stripped.
//
//   node engine/scripts/sync-to-web.mjs          # regenerate web/lib/engine
//   node engine/scripts/sync-to-web.mjs --check   # exit 1 if out of sync

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, "../src");
const destRoot = resolve(here, "../../web/lib/engine");

const files = (await readdir(srcRoot)).filter((f) => f.endsWith(".ts"));

function transform(rel, content) {
  const stripped = content.replace(/from "(\.\.?\/[^"]+?)\.ts"/g, 'from "$1"');
  return (
    `// GENERATED from engine/src/${rel} — DO NOT EDIT.\n` +
    `// Single source of truth: engine/src. Regenerate: node engine/scripts/sync-to-web.mjs\n\n` +
    stripped
  );
}

const check = process.argv.includes("--check");
let drift = 0;

for (const rel of files) {
  const generated = transform(rel, await readFile(join(srcRoot, rel), "utf8"));
  const destPath = join(destRoot, rel);
  if (check) {
    let existing = "";
    try {
      existing = await readFile(destPath, "utf8");
    } catch {}
    if (existing !== generated) {
      drift++;
      console.log(`✗ out of sync: web/lib/engine/${rel}`);
    }
  } else {
    await mkdir(destRoot, { recursive: true });
    await writeFile(destPath, generated, "utf8");
    console.log(`✓ wrote web/lib/engine/${rel}`);
  }
}

if (check) {
  console.log(drift === 0 ? "\n✅ engine copy in sync." : `\n❌ ${drift} out of sync — run: node engine/scripts/sync-to-web.mjs`);
  process.exit(drift === 0 ? 0 : 1);
}
console.log("\n✅ synced web/lib/engine from engine/src");

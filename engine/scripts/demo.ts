// Demo: index a real codebase and ask it questions. Zero-network by default.
//   node scripts/demo.ts [path-to-repo]
// Defaults to indexing THIS engine's own source (so it runs in a fresh clone). Pass a
// path to point it at any local repo. With ANTHROPIC_API_KEY set, also prints a grounded answer.

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CodebaseIndex } from "../src/index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(process.argv[2] ?? resolve(here, "../src"));

const t0 = Date.now();
const index = new CodebaseIndex();
const stats = await index.indexDir(target);
console.log(`\n▸ Indexed ${target}`);
console.log(`  ${stats.files} files -> ${stats.chunks} chunks in ${Date.now() - t0}ms`);

const questions = [
  "how does the re-ranker score candidate chunks?",
  "how are local embeddings computed without an API key?",
  "where is the file import graph built?",
];

for (const q of questions) {
  const result = await index.ask(q, 4);
  console.log(`\n▸ Q: ${q}`);
  if (result.grounded) {
    console.log(`  answer: ${result.answer}`);
  }
  console.log(`  top evidence (file:line):`);
  for (const c of result.chunks.slice(0, 3)) {
    console.log(`    - ${c.path}:${c.startLine}-${c.endLine}${c.symbol ? ` (${c.symbol})` : ""}  score=${c.score.toFixed(3)}`);
  }
  const related = result.chunks[0] ? index.related(result.chunks[0].path) : [];
  if (related.length) console.log(`  related files (import graph): ${related.join(", ")}`);
}

console.log(`\n✅ Demo complete${process.env.ANTHROPIC_API_KEY ? "" : " (retrieval-only — set ANTHROPIC_API_KEY for grounded answers)"}.\n`);

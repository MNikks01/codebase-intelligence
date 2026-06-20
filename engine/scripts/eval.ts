// Retrieval eval — measures whether the engine retrieves the RIGHT file for a question,
// and A/B-compares hybrid retrieval vs. hybrid + re-ranker. Self-contained: the golden
// set is over THIS engine's own source, so it runs in a fresh clone with no external repo.
//   node scripts/eval.ts  [optional path to another repo for ad-hoc runs]

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CodebaseIndex } from "../src/index.ts";
import type { ScoredChunk } from "../src/types.ts";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "../src"); // the engine's own source

const GOLDEN: { q: string; expect: string }[] = [
  { q: "where is BM25 lexical retrieval implemented", expect: "lexical.ts" },
  { q: "how are repository files ingested by walking directories", expect: "ingest.ts" },
  { q: "how is source code split into chunks", expect: "chunk.ts" },
  { q: "where is the file import graph built", expect: "graph.ts" },
  { q: "how are vector and lexical results fused with reciprocal rank fusion", expect: "retrieve.ts" },
  { q: "how does the re-ranker score candidate chunks", expect: "rerank.ts" },
  { q: "where is the in-memory vector index with cosine search", expect: "store.ts" },
  { q: "how are local embeddings computed without an API key", expect: "embed.ts" },
  { q: "how does it generate a grounded answer using Claude", expect: "answer.ts" },
  { q: "how is a query tokenized handling camelCase identifiers", expect: "tokenize.ts" },
  { q: "where is the CodebaseIndex class with indexDir and ask", expect: "index.ts" },
];

const index = new CodebaseIndex();
const stats = await index.indexDir(target);
console.log(`Indexed ${stats.files} files -> ${stats.chunks} chunks. ${GOLDEN.length} golden questions.\n`);

function rankOf(chunks: ScoredChunk[], expect: string): number {
  return chunks.findIndex((c) => c.path.endsWith(expect));
}

async function measure(searchFn: (q: string, k: number) => Promise<ScoredChunk[]>) {
  let r3 = 0,
    r5 = 0,
    mrr = 0;
  const ranks: number[] = [];
  for (const { q, expect } of GOLDEN) {
    const chunks = await searchFn(q, 5);
    const rank = rankOf(chunks, expect);
    ranks.push(rank);
    if (rank >= 0 && rank < 3) r3++;
    if (rank >= 0 && rank < 5) r5++;
    if (rank >= 0) mrr += 1 / (rank + 1);
  }
  return { r3: r3 / GOLDEN.length, r5: r5 / GOLDEN.length, mrr: mrr / GOLDEN.length, ranks };
}

const raw = await measure((q, k) => index.searchRaw(q, k));
const reranked = await measure((q, k) => index.search(q, k));

console.log("per-question rank (lower is better):  hybrid -> +rerank");
GOLDEN.forEach(({ expect }, i) => {
  const a = raw.ranks[i];
  const b = reranked.ranks[i];
  const fmt = (r: number) => (r < 0 ? "miss" : `#${r + 1}`);
  const arrow = b < a || (a < 0 && b >= 0) ? "↑" : b > a ? "↓" : "=";
  console.log(`  ${expect.padEnd(14)} ${fmt(a).padStart(5)} -> ${fmt(b).padStart(5)}  ${arrow}`);
});

const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
console.log(`\n              recall@3   recall@5    MRR`);
console.log(`  hybrid      ${pct(raw.r3).padStart(6)}   ${pct(raw.r5).padStart(7)}   ${raw.mrr.toFixed(3)}`);
console.log(`  +re-ranker  ${pct(reranked.r3).padStart(6)}   ${pct(reranked.r5).padStart(7)}   ${reranked.mrr.toFixed(3)}`);
console.log(
  `\n  ${process.env.ANTHROPIC_API_KEY ? "" : "(LOCAL embeddings + BM25 baseline — a real embedding API raises semantic recall further)"}`,
);

// The eval is a quality benchmark; gate on recall@5 (the headline retrieval metric).
// Re-ranker vs hybrid MRR is reported above for tuning; on tiny golden sets they can tie.
process.exit(reranked.r5 >= 0.8 ? 0 : 1);

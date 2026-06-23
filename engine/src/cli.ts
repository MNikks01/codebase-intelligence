#!/usr/bin/env node
// Codebase Intelligence CLI — index a repo and ask questions about it, with citations.
// One-shot: indexes the directory in memory, runs the query, prints cited code.
// Zero-network by default (hybrid lexical+local-vector retrieval); set ANTHROPIC_API_KEY
// for a written grounded answer.
//
//   codeintel search <dir> "<query>"     # top cited code chunks
//   codeintel ask    <dir> "<question>"  # grounded answer (retrieval-only without a key)
//   codeintel related <dir> <file>       # files related via imports

import { CodebaseIndex } from "./index.ts";
import type { ScoredChunk } from "./types.ts";

const HELP = `codeintel — deep, queryable understanding of any codebase (with citations)

Usage:
  codeintel search <dir> "<query>"      top cited code chunks for a query
  codeintel ask    <dir> "<question>"   grounded answer (set ANTHROPIC_API_KEY for prose)
  codeintel related <dir> <file>        files related to <file> via imports

Examples:
  codeintel search ./src "where is auth handled?"
  codeintel ask ./ "how does retrieval fuse vector and lexical hits?"
`;

function cite(c: ScoredChunk): string {
  const where = c.symbol ? `${c.path}:${c.startLine} (${c.symbol})` : `${c.path}:${c.startLine}-${c.endLine}`;
  const preview = c.content.split("\n").find((l) => l.trim())?.slice(0, 100) ?? "";
  return `  • ${where}  [score ${c.score.toFixed(3)}]\n      ${preview}`;
}

async function main(): Promise<void> {
  const [cmd, dir, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === "-h" || cmd === "--help" || !dir) {
    process.stdout.write(HELP);
    process.exit(cmd && cmd !== "-h" && cmd !== "--help" ? 1 : 0);
  }

  const index = new CodebaseIndex();
  const stats = await index.indexDir(dir);
  process.stderr.write(`indexed ${stats.files} files -> ${stats.chunks} chunks\n`);

  if (cmd === "related") {
    const file = rest[0];
    if (!file) {
      process.stderr.write("✗ usage: codeintel related <dir> <file>\n");
      process.exit(1);
    }
    const related = index.related(file);
    process.stdout.write(related.length ? related.map((r) => `  • ${r}`).join("\n") + "\n" : "(no related files found)\n");
    return;
  }

  const query = rest.join(" ");
  if (!query) {
    process.stderr.write(`✗ usage: codeintel ${cmd} <dir> "<query>"\n`);
    process.exit(1);
  }

  if (cmd === "search") {
    const hits = await index.search(query, 8);
    process.stdout.write(hits.length ? hits.map(cite).join("\n") + "\n" : "(no matches)\n");
    return;
  }
  if (cmd === "ask") {
    const result = await index.ask(query);
    process.stdout.write("Sources:\n" + result.chunks.map(cite).join("\n") + "\n");
    if (result.answer) process.stdout.write(`\nAnswer:\n${result.answer}\n`);
    else process.stdout.write("\n(Set ANTHROPIC_API_KEY for a written answer; showing retrieval only.)\n");
    return;
  }

  process.stdout.write(HELP);
  process.exit(1);
}

main().catch((e) => {
  process.stderr.write(`✗ ${(e as Error).message}\n`);
  process.exit(1);
});

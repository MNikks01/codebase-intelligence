import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "../src/tokenize.ts";
import { LexicalIndex } from "../src/lexical.ts";
import { rrfFuse } from "../src/retrieve.ts";
import { buildImportGraph } from "../src/graph.ts";
import type { FileDoc, ScoredChunk } from "../src/types.ts";

test("tokenize splits camelCase and snake_case", () => {
  assert.deepEqual(tokenize("getUserById"), ["get", "user", "by", "id"]);
  assert.ok(tokenize("find_user_token").includes("token"));
});

test("lexical BM25 ranks the chunk containing query terms", () => {
  const lex = new LexicalIndex();
  lex.add({ id: "a", path: "a.ts", language: "ts", startLine: 1, endLine: 2, content: "BM25 lexical retrieval term frequency" });
  lex.add({ id: "b", path: "b.ts", language: "ts", startLine: 1, endLine: 2, content: "unrelated cache logic" });
  lex.finalize();
  const hits = lex.search("BM25 lexical", 2);
  assert.equal(hits[0].id, "a");
});

test("rrfFuse merges rankings and rewards agreement", () => {
  const mk = (id: string): ScoredChunk => ({ id, path: id, language: "ts", startLine: 1, endLine: 1, content: "", score: 1 });
  const fused = rrfFuse([[mk("x"), mk("y")], [mk("y"), mk("z")]]);
  assert.equal(fused[0].id, "y"); // appears high in both lists
});

test("import graph links importer <-> imported", () => {
  const docs: FileDoc[] = [
    { path: "auth.ts", language: "ts", content: `import { f } from "./db";`, sizeBytes: 0 },
    { path: "db.ts", language: "ts", content: `export function f(){}`, sizeBytes: 0 },
  ];
  const g = buildImportGraph(docs);
  assert.ok(g.related("auth.ts").includes("db.ts"));
  assert.ok(g.related("db.ts").includes("auth.ts"));
});

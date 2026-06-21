import { test } from "node:test";
import assert from "node:assert/strict";
import { CodebaseIndex } from "../src/index.ts";
import type { FileDoc } from "../src/types.ts";

const REPO: FileDoc[] = [
  { path: "auth.ts", language: "typescript", content: `import { findUser } from "./db";\n// Authentication: verify a bearer token.\nexport async function verifyToken(token: string) { return findUser(token); }`, sizeBytes: 0 },
  { path: "db.ts", language: "typescript", content: `// Data layer.\nexport async function findUser(token: string) { return { token }; }`, sizeBytes: 0 },
  { path: "search.ts", language: "typescript", content: `// BM25 lexical retrieval over chunks (term frequency, idf).\nexport function bm25() {}`, sizeBytes: 0 },
];

test("index a repo, then hybrid+rerank retrieval returns the right file", async () => {
  const index = new CodebaseIndex();
  const stats = await index.indexDocs(REPO);
  assert.equal(stats.files, 3);
  assert.ok(stats.chunks >= 3);

  const auth = await index.search("verify a bearer token", 3);
  assert.equal(auth[0].path, "auth.ts");

  const bm = await index.search("BM25 lexical retrieval", 3);
  assert.ok(bm.some((c) => c.path === "search.ts"));
});

test("ask() returns cited chunks (retrieval-only without an LLM key)", async () => {
  const index = new CodebaseIndex();
  await index.indexDocs(REPO);
  const res = await index.ask("how is a user found from a token?", 3);
  assert.equal(res.grounded, false);
  assert.ok(res.chunks.length > 0);
  assert.ok(res.chunks.some((c) => c.path === "db.ts" || c.path === "auth.ts"));
});

test("related() exposes the import graph after indexing", async () => {
  const index = new CodebaseIndex();
  await index.indexDocs(REPO);
  assert.ok(index.related("auth.ts").includes("db.ts"));
});

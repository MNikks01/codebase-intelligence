// Unit tests for the Codebase Intelligence engine — indexing, hybrid retrieval, re-ranking,
// import graph, tokenizer. Deterministic (no fragile thresholds; the eval harness in
// eval.ts measures retrieval quality separately).

import { CodebaseIndex } from "../src/index.ts";
import { tokenize } from "../src/tokenize.ts";
import type { FileDoc } from "../src/types.ts";

let fails = 0;
function ok(cond: boolean, label: string) {
  console.log(`${cond ? "✓" : "✗"} ${label}`);
  if (!cond) fails++;
}

ok(tokenize("getUserById").join(" ") === "get user by id", "tokenizer splits camelCase");

const docs: FileDoc[] = [
  { path: "auth.ts", language: "typescript", content: `import { findUser } from "./db";\n// Authentication: verify a bearer token.\nexport async function verifyToken(token: string) { return findUser(token); }`, sizeBytes: 0 },
  { path: "db.ts", language: "typescript", content: `// Data layer.\nexport async function findUser(token: string) { return { token }; }`, sizeBytes: 0 },
  { path: "search.ts", language: "typescript", content: `// BM25 lexical retrieval over chunks.\nexport function bm25() { /* term frequency, idf */ }`, sizeBytes: 0 },
];

const index = new CodebaseIndex();
const stats = await index.indexDocs(docs);
ok(stats.files === 3 && stats.chunks >= 3, `indexDocs -> ${stats.files} files, ${stats.chunks} chunks`);

const auth = await index.search("verify a bearer token", 3);
ok(auth.length > 0 && auth[0].path === "auth.ts", "search 'verify bearer token' -> auth.ts ranks first");

const bm = await index.search("BM25 lexical retrieval", 3);
ok(bm.some((c) => c.path === "search.ts"), "search 'BM25 lexical retrieval' -> cites search.ts");

const cites = (await index.search("findUser data layer", 3)).map((c) => c.path);
ok(cites.includes("db.ts"), "search 'findUser data layer' -> cites db.ts");

ok(index.related("auth.ts").includes("db.ts"), "import graph: auth.ts related to db.ts (imports)");
ok(index.related("db.ts").includes("auth.ts"), "import graph: db.ts related to auth.ts (imported-by)");

console.log(fails === 0 ? "\n✅ Codebase Intelligence engine: all tests passed" : `\n❌ ${fails} failed`);
process.exit(fails === 0 ? 0 : 1);

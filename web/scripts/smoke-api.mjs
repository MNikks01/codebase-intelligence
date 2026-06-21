// End-to-end web API proof: index a demo repo + a real uploaded zip, then ask questions
// and check the answers cite the right files. No browser, no keys.
import { readFile } from "node:fs/promises";
const BASE = process.env.BASE || "http://localhost:3950";
const __h = await fetch(BASE + "/api/health").then((r) => r.json()).catch(() => ({}));
if (__h.status !== "ok") throw new Error("health check failed");
console.log("\u2713 /api/health -> ok");

async function ask(indexId, question) {
  const r = await fetch(BASE + "/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ indexId, question }),
  });
  return { status: r.status, body: await r.json() };
}

// 1) index the bundled demo repo
let r = await fetch(BASE + "/api/index", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ demo: true }),
});
let j = await r.json();
if (!r.ok) throw new Error("demo index failed: " + JSON.stringify(j));
console.log(`✓ /api/index (demo) -> ${j.files} files, ${j.chunks} chunks`);
const demoId = j.indexId;

// 2) ask the demo repo
let a = await ask(demoId, "where is authentication handled?");
if (!a.body.chunks.some((c) => c.path.includes("auth.ts"))) throw new Error("auth query missed auth.ts");
console.log(`✓ ask "authentication" -> top cite ${a.body.chunks[0].path}`);
a = await ask(demoId, "how are orders created?");
if (!a.body.chunks.some((c) => c.path.includes("orders.ts"))) throw new Error("orders query missed orders.ts");
console.log(`✓ ask "orders created" -> cites orders.ts`);

// 3) upload a real zip (the engine's own source) and query it
const buf = await readFile("/tmp/engine-src.zip");
const form = new FormData();
form.append("repo", new Blob([buf]), "engine.zip");
r = await fetch(BASE + "/api/index", { method: "POST", body: form });
j = await r.json();
if (!r.ok) throw new Error("zip index failed: " + JSON.stringify(j));
console.log(`✓ /api/index (zip upload) -> ${j.files} files, ${j.chunks} chunks`);
a = await ask(j.indexId, "where is BM25 lexical retrieval implemented");
if (!a.body.chunks.some((c) => c.path.includes("lexical.ts"))) {
  throw new Error("zip ask missed lexical.ts: " + a.body.chunks.map((c) => c.path).join(","));
}
console.log(`✓ ask zip-indexed repo "BM25" -> cites lexical.ts`);

// 4) unknown index id -> 404
const bad = await ask("does-not-exist", "x");
if (bad.status !== 404) throw new Error("expected 404 for unknown indexId, got " + bad.status);
console.log("✓ unknown indexId -> 404");

console.log("\n✅ #2 web API end-to-end PASSED");

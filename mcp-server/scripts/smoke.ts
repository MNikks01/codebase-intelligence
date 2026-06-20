// Drives the Codebase Intelligence MCP server over real stdio JSON-RPC:
// initialize -> tools/list -> call search_code + ask_codebase + get_related_files.
// Headless proof that any MCP host could query a codebase through it.

import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const serverEntry = resolve(here, "../src/server.ts");
const child = spawn("node", [serverEntry], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
const pending = new Map<number, (m: any) => void>();
child.stdout.on("data", (chunk) => {
  buf += chunk.toString();
  let nl: number;
  while ((nl = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg: any;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)!(msg); pending.delete(msg.id); }
  }
});
const send = (o: any) => child.stdin.write(JSON.stringify(o) + "\n");
const request = (id: number, method: string, params?: any) =>
  new Promise<any>((res) => { pending.set(id, res); send({ jsonrpc: "2.0", id, method, params }); });

function assert(cond: boolean, label: string) {
  if (!cond) { console.error(`✗ ${label}`); child.kill(); process.exit(1); }
  console.log(`✓ ${label}`);
}

const init = await request(1, "initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "smoke", version: "1.0.0" },
});
assert(init.result?.serverInfo?.name === "codebase-intel", `initialize -> ${init.result?.serverInfo?.name}`);
send({ jsonrpc: "2.0", method: "notifications/initialized" });

const tools = (await request(2, "tools/list", {})).result?.tools ?? [];
const names = tools.map((t: any) => t.name);
assert(["search_code", "ask_codebase", "get_related_files"].every((n) => names.includes(n)), `tools/list -> ${names.join(", ")}`);

const sc = await request(3, "tools/call", { name: "search_code", arguments: { query: "BM25 lexical retrieval", k: 3 } });
const scText = sc.result?.content?.[0]?.text ?? "";
assert(scText.includes("lexical.ts"), `search_code("BM25 lexical retrieval") cites lexical.ts`);

const ac = await request(4, "tools/call", { name: "ask_codebase", arguments: { question: "how are local embeddings computed without a key" } });
const acText = ac.result?.content?.[0]?.text ?? "";
assert(acText.includes("embed.ts"), `ask_codebase(...) cites embed.ts`);

const rf = await request(5, "tools/call", { name: "get_related_files", arguments: { path: "index.ts" } });
const rfText = rf.result?.content?.[0]?.text ?? "";
assert(rfText.length > 0, `get_related_files("index.ts") -> related files`);

child.kill();
console.log("\n✅ Codebase Intelligence MCP server works end-to-end over MCP.");

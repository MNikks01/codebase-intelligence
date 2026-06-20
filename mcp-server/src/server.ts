#!/usr/bin/env node
// MCP server for Codebase Intelligence. Indexes a repo on startup and exposes it to any
// MCP host (Claude Desktop, Cursor, agents). Retrieval works with no keys; set
// ANTHROPIC_API_KEY for grounded natural-language answers.
//
//   CODEBASE_PATH=/path/to/repo node src/server.ts
//
// IMPORTANT: stdout is the MCP JSON-RPC channel — never console.log to it. Status -> stderr.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CodebaseIndex } from "../../engine/src/index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoPath = resolve(process.env.CODEBASE_PATH ?? process.argv[2] ?? resolve(here, "../../engine/src"));

const index = new CodebaseIndex();
const stats = await index.indexDir(repoPath);
console.error(`[codebase-intel-mcp] indexed ${repoPath}: ${stats.files} files, ${stats.chunks} chunks`);

const server = new McpServer({ name: "codebase-intel", version: "0.1.0" });

server.tool(
  "search_code",
  "Search the indexed codebase and return the most relevant code chunks with file:line citations. " +
    "Use when the user asks where something is or how something works. Returns ranked snippets.",
  { query: z.string().describe("Natural-language or keyword query"), k: z.number().optional().describe("How many results (default 6)") },
  async ({ query, k }) => {
    const hits = await index.search(query, k ?? 6);
    if (hits.length === 0) return { content: [{ type: "text", text: "No matching code found." }] };
    const text = hits
      .map((c) => `### ${c.path}:${c.startLine}-${c.endLine}${c.symbol ? ` (${c.symbol})` : ""}\n${snippet(c.content)}`)
      .join("\n\n");
    return { content: [{ type: "text", text }] };
  },
);

server.tool(
  "ask_codebase",
  "Answer a natural-language question about the indexed codebase, grounded in retrieved code with " +
    "file:line citations. Use for 'how/where/why' questions. Without an LLM key, returns the cited evidence.",
  { question: z.string().describe("A question about the codebase") },
  async ({ question }) => {
    const result = await index.ask(question, 6);
    const cites = result.chunks
      .map((c) => `- ${c.path}:${c.startLine}-${c.endLine}${c.symbol ? ` (${c.symbol})` : ""}`)
      .join("\n");
    const body = result.grounded
      ? `${result.answer}\n\nSources:\n${cites}`
      : `(retrieval-only — set ANTHROPIC_API_KEY for a written answer)\n\nMost relevant code:\n${cites}`;
    return { content: [{ type: "text", text: body }] };
  },
);

server.tool(
  "get_related_files",
  "Given a file path, return files related to it via imports (importers + dependencies). Use to explore " +
    "cross-file structure ('what uses this', 'what does this depend on').",
  { path: z.string().describe("Repo-relative file path") },
  async ({ path }) => {
    const related = index.related(path);
    return {
      content: [{ type: "text", text: related.length ? related.map((p) => `- ${p}`).join("\n") : "No related files found." }],
    };
  },
);

function snippet(content: string, maxLines = 14): string {
  const lines = content.split("\n");
  const body = lines.slice(0, maxLines).join("\n");
  return "```\n" + body + (lines.length > maxLines ? "\n…" : "") + "\n```";
}

await server.connect(new StdioServerTransport());
console.error("[codebase-intel-mcp] ready");

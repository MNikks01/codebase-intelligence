# Codebase Intelligence — MCP server

Exposes the [`../engine`](../engine) (RAG over code) as an **MCP server**, so any MCP host —
Claude Desktop, Cursor, or a custom agent — can query a codebase. This is the
"code-understanding tool every agent reaches for" surface (per the project docs).

## Status: works end-to-end (verified over MCP, 2026-06-20)
- ✅ Indexes a repo on startup (zero-network; real embeddings/LLM swap in for production).
- ✅ Tools: `search_code`, `ask_codebase`, `get_related_files`.
- ✅ Driven over real stdio JSON-RPC (`scripts/smoke.ts`): initialize → tools/list → calls,
  with `search_code` citing the right files.

## Tools
| Tool | Input | Returns |
|------|-------|---------|
| `search_code` | `{ query, k? }` | ranked code chunks with `file:line` citations |
| `ask_codebase` | `{ question }` | grounded answer + citations (retrieval-only without an LLM key) |
| `get_related_files` | `{ path }` | files related via imports (graph-RAG) |

## Run it
```bash
npm install
CODEBASE_PATH=/path/to/your/repo node src/server.ts   # speaks MCP over stdio
npm run smoke                                          # drive it over the protocol
```

## Add to Claude Desktop
Merge [`mcp.json`](./mcp.json) into your Claude Desktop config (use absolute paths):
```json
{ "mcpServers": { "codebase-intel": {
  "command": "node",
  "args": ["/abs/path/to/codebase-intelligence/mcp-server/src/server.ts"],
  "env": { "CODEBASE_PATH": "/abs/path/to/your/repo", "ANTHROPIC_API_KEY": "sk-ant-..." }
}}}
```
`ANTHROPIC_API_KEY` is optional — without it, `ask_codebase` returns cited evidence instead of a written answer.

## Notes
- The server imports the engine source directly (`../../engine/src`) — keep them together.
- stdout is the MCP channel; all status goes to stderr.
- Production: real embedding model + pgvector + a re-ranker upgrade (see `../engine/README.md`).

# Codebase Intelligence — API reference

_Generated from the source; see each subproject's README for usage._

## MCP server tools

Served over stdio JSON-RPC (`mcp-server/src/server.ts`).

| Tool | Description |
|------|-------------|
| `search_code` | Search the indexed codebase and return the most relevant code chunks with file:line citations.… |
| `ask_codebase` | Answer a natural-language question about the indexed codebase, grounded in retrieved code with… |
| `get_related_files` | Given a file path, return files related to it via imports (importers + dependencies). Use to explore… |

## Web HTTP API

Next.js route handlers under `web/app/api`.

| Endpoint | Methods |
|----------|---------|
| `/api/ask` | POST |
| `/api/index` | POST |

> All inputs are validated; errors return a JSON `{ error: { message } }` with an appropriate status. No secrets are logged. See `.github/SECURITY.md`.
# Codebase Intelligence — MCP

Primarily an **MCP server** (expose the code-understanding engine to any agent/host). Protocol basics: MCP_GUIDE.md.

## Strategy
Be the **code-understanding tool every agent reaches for.** Instead of each agent building mediocre RAG-over-code, they call our MCP server and get accurate, cited answers. This is engine-as-distribution: we ride into Claude Desktop, Cursor, Claude Code, and custom agents as the codebase brain.

## ContextOS-as-MCP-server (outbound)
At `/mcp` (streamable HTTP, API-key auth, org+repo scoped).

**Tools**
- `search_code(repo_id, query, filters?)` → ranked snippets (file:line)
- `ask_codebase(repo_id, question)` → grounded answer + citations + confidence
- `impact_of(repo_id, symbol)` → blast radius (transitive callers)
- `get_symbol_context(repo_id, symbol)` → definition + callers/callees
- `get_repo_summary(repo_id)` → overview, key modules, entry points

**Resources**
- `code://{repo}/{path}` — file contents
- `docs://{repo}/{module}` — generated living docs
- `graph://{repo}/dependencies` — dependency graph

**Prompts**
- `/explain {symbol}` · `/onboard {repo}` · `/review-impact {symbol}`

## Tool description quality
Per MCP_GUIDE.md §3, descriptions are prompt-engineering. Example for `ask_codebase`: *"Answer a natural-language question about THIS repository's code. Returns a grounded answer with file:line citations, or says it doesn't know. Use when the user asks how something works, where something is, or why code exists. Do NOT use for questions unrelated to this codebase."*

## Inbound MCP (optional)
Connect a GitHub MCP server for richer history (PRs/issues/blame) to enrich "why is this here?" answers. Managed via the same governance as ContextOS's hub.

## Client config
See [mcp.json](./mcp.json):
```json
{ "mcpServers": { "codebase-intel": {
  "url": "https://api.codebase-intel.dev/mcp",
  "headers": { "Authorization": "Bearer ${CI_API_KEY}", "X-Repo-Id": "${REPO_ID}" }
}}}
```

## Governance
API-key scopes per repo; read-only tools by default; rate limits; every tool call audited + costed; tenant-isolated retrieval. (See [SECURITY.md](./SECURITY.md), [GUARDRAILS.md](./GUARDRAILS.md).)

## Why MCP matters strategically
The MCP server is how Codebase Intelligence becomes infrastructure (reused by ContextOS #1, System Design Assistant #6, and third-party agents) rather than just another app — and it's distribution into every MCP-aware tool.

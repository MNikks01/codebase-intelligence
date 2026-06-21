# Folder structure — Codebase Intelligence

```
engine/
  src/        # the engine (modules: ingest, chunk, tokenize, embed, store, lexical, retrieve, rerank, graph, answer, index)
  test/       # node:test unit + integration
  scripts/    # demo + dev scripts
mcp-server/
  src/server.ts   # MCP server (stdio)
  scripts/smoke.ts
web/
  app/        # Next.js App Router (pages + api routes)
  lib/engine/ # GENERATED copy of the engine (do not edit)
  lib/        # web-only helpers
  scripts/smoke-api.mjs
.claude/      # this workspace
.github/      # CI, CodeQL, dependabot, templates
API.md  CHANGELOG.md  CONTRIBUTING.md  SECURITY (.github)
```

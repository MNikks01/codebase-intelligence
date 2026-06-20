# Codebase Intelligence — API DESIGN

The API/MCP surface IS a product (engine-as-a-service, ICP-4). REST primary; GraphQL for dashboards; MCP server for agents. Conventions match contextos/API_DESIGN.md (Bearer auth, org-scoped, problem+json, idempotency on cost-incurring POSTs, cursor pagination, `/v1`).

## REST

### Repos & indexing
```
POST   /repositories                 (connect: provider, url, branch)
GET    /repositories/:id             (status, last_indexed_sha)
POST   /repositories/:id/index       (force reindex)
GET    /repositories/:id/index-jobs/:jobId   (progress)
DELETE /repositories/:id             (remove + purge index)
```

### Search & Q&A (core)
```
POST   /repositories/:id/search      body:{query, filters?{path,language}, k?}
                                     -> ranked chunks (file:line, snippet, score)
POST   /repositories/:id/ask         body:{question, scope?, conversation_id?}  (streams)
                                     -> {answer, citations:[{path,start,end}], confidence, cost, model}
POST   /repositories/:id/chat        (conversational follow-ups)
POST   /messages/:id/feedback        ({rating, note})
```

### Structure & impact
```
GET    /repositories/:id/symbols?q=          (search symbols)
GET    /symbols/:id/callers                  (who calls this)
GET    /symbols/:id/callees                  (what this calls)
POST   /repositories/:id/impact              body:{symbol|path} -> {blast_radius:[...], risk}
GET    /repositories/:id/graph?scope=        (module dependency graph)
```

### Docs & diagrams
```
GET    /repositories/:id/summary             (auto repo summary)
GET    /repositories/:id/docs?path=          (living docs)
POST   /repositories/:id/docs/regenerate
GET    /repositories/:id/diagram?type=architecture|dependency   (Mermaid source)
```

### Governance & billing
```
GET    /orgs/:id/audit-logs
GET    /orgs/:id/usage?group_by=repo|user
POST   /repositories/:id/spend-cap
GET    /billing/subscription   POST /billing/checkout   POST /webhooks/stripe
```

### Webhooks
```
POST   /webhooks/github          (push -> incremental reindex; PR -> review agent)
```

## MCP server (engine for agents)
Exposed at `/mcp` (streamable HTTP, API-key auth, org+repo scoped). Tools:
- `search_code(repo_id, query, filters?)` → ranked snippets
- `ask_codebase(repo_id, question)` → grounded answer + citations
- `impact_of(repo_id, symbol)` → blast radius
- `get_symbol_context(repo_id, symbol)` → definition + callers/callees
- `get_repo_summary(repo_id)` → overview

Resources: `code://{repo}/{path}`, `docs://{repo}/{module}`. See [MCP.md](./MCP.md).

## GraphQL (read-optimized)
`/graphql` for dashboards: nested reads over repos/usage/symbols/top-questions. Mutations stay REST. Ship only if dashboard needs demand it.

## SDKs
`@codebase-intel/sdk` (TS) + Python client, generated from OpenAPI. OpenAPI is source of truth → docs + SDKs.

## Errors
problem+json; e.g., `index-not-ready` (409), `spend-cap-exceeded` (402), `low-confidence` (200 with `confidence:"low"` + "I don't know").

## Rate limits & keys
Per-key + per-org limits; `X-RateLimit-*` headers. API usage metered for usage-based billing (ICP-4).

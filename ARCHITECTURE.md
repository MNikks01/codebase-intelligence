# Codebase Intelligence — ARCHITECTURE

## 1. System architecture
```mermaid
flowchart TB
    subgraph Clients
      WEB[Next.js App]
      API2[API / SDK consumers]
      MCPC[Agents via MCP]
    end
    WEB & API2 & MCPC --> GW[API Gateway - NestJS]
    GW --> ING[Ingestion Service]
    GW --> SEARCH[Search/Q&A Service]
    GW --> DOCS[Docs/Diagram Service]
    GW --> IMPACT[Impact/Graph Service]
    GW --> GOV[Governance: RBAC/Audit/Billing]
    ING --> PARSE[Parser - tree-sitter]
    PARSE --> CHUNK[AST Chunker]
    CHUNK --> EMBW[Embedding Worker]
    EMBW --> VEC[(pgvector + FTS)]
    PARSE --> GRAPHB[Symbol Graph Builder]
    GRAPHB --> PG[(Postgres - graph + metadata)]
    SEARCH --> VEC
    SEARCH --> PG
    SEARCH --> RERANK[Re-ranker]
    SEARCH --> LLM[LLM Provider Abstraction]
    IMPACT --> PG
    DOCS --> LLM
    ALL[All services] -.OTel.-> OBS[Observability]
```
Modular monolith first; heaviest pieces (Ingestion, Embedding workers) extract first under load (D-009).

## 2. Components
| Component | Responsibility | Tech |
|-----------|----------------|------|
| Ingestion | Clone, detect language, parse, chunk, queue embeddings, build graph | NestJS + tree-sitter + BullMQ |
| Embedding Worker | Embed chunks (code + NL summary), content-hash cache | Worker + `packages/llm` |
| Search/Q&A | Hybrid retrieve + graph expand + rerank + grounded generate | NestJS + pgvector + FTS |
| Docs/Diagram | Generate living docs + Mermaid architecture from graph | NestJS + LLM |
| Impact/Graph | Symbol graph queries, callers/callees, blast radius | NestJS + Postgres (recursive CTEs / graph) |
| Governance | RBAC, audit, billing, spend caps | NestJS + Postgres + Stripe |

## 3. Service boundaries
- **Ingestion vs. Search:** write path (heavy, async) vs. read path (latency-sensitive). Clean seam to scale independently.
- **Graph as first-class:** the symbol/dependency graph is separate from vectors — powers impact analysis + graph-RAG.
- **Engine exposed via API/MCP:** Search/Q&A + Impact are the public product surface (this is how #1 and #6 consume it).

## 4. Data flow — index a repo
```mermaid
sequenceDiagram
    actor Dev
    Dev->>GW: connect repo
    GW->>Ingestion: clone + enqueue
    Ingestion->>Parser: parse files (tree-sitter)
    Parser->>Chunker: AST chunks + metadata
    Chunker->>EmbWorker: enqueue (skip unchanged by hash)
    EmbWorker->>pgvector: store vectors
    Parser->>GraphBuilder: symbols, imports, calls
    GraphBuilder->>Postgres: store graph
    Ingestion-->>Dev: index ready (progress events)
```

## 5. Data flow — answer a question
```mermaid
sequenceDiagram
    actor Dev
    Dev->>Search: question + repoId
    Search->>pgvector: vector search (top 30-50)
    Search->>Postgres: lexical (FTS) + graph expand (callers/callees)
    Search->>Reranker: rerank candidates -> top K
    Search->>LLM: grounded prompt (cached prefix, file:line)
    LLM-->>Search: answer + citations
    Search->>Governance: audit + cost
    Search-->>Dev: streamed answer + clickable citations
```

## 6. Event flow
`repo.connected` → index job. `repo.pushed` (webhook) → incremental reindex (changed files) + doc-drift check. `index.completed` → generate/refresh summary + docs. `query.answered` → sample into evals. Redis streams/BullMQ.

## 7. Multi-tenancy
Tenant = org. `org_id` + RLS; vector queries always `org_id`-filtered; per-repo isolation. (See [DATABASE.md](./DATABASE.md), [SECURITY.md](./SECURITY.md).)

## 8. Scaling path
Monolith → extract Ingestion+Embedding workers → shard vectors by tenant/repo → dedicated vector store at threshold (D-004) → K8s for enterprise/VPC.

## 9. NFRs
Index 100k LOC < 10 min; incremental reindex < 1 min for small pushes; answer first-token < 1.5s, p95 < 4s; 99.9% uptime (V3). Every answer cited + costed.

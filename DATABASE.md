# Codebase Intelligence — DATABASE

PostgreSQL + pgvector. Multi-tenant via `org_id` + RLS (D-004). Adds the **symbol graph** to the standard entities.

## Entities
| Entity | Purpose |
|--------|---------|
| `users`, `organizations`, `memberships` | Identity + tenancy + RBAC |
| `repositories` | Connected repos (provider, url, default_branch, last_indexed_sha, status) |
| `index_jobs` | Ingestion runs (status, progress, files, duration) |
| `documents` | Files (path, language, size, hash) |
| `chunks` | AST chunks (+ metadata, tsv for lexical) |
| `chunk_summaries` | LLM NL summary per chunk |
| `embeddings` | Vector per chunk (pgvector) |
| `symbols` | Graph nodes (function/class/module + location) |
| `symbol_edges` | Graph edges (calls/imports/inherits/references) |
| `docs` | Generated living docs (per module/symbol, versioned) |
| `diagrams` | Generated architecture diagrams (Mermaid source) |
| `conversations`, `messages` | Q&A history |
| `feedback` | Ratings on answers |
| `audit_logs` | Append-only access/query trail |
| `usage_records`, `subscriptions`, `plans` | Billing/metering |
| `api_keys` | API/MCP access |

## ERD
```mermaid
erDiagram
    organizations ||--o{ repositories : owns
    repositories ||--o{ index_jobs : runs
    repositories ||--o{ documents : contains
    documents ||--o{ chunks : split_into
    chunks ||--|| embeddings : has
    chunks ||--o| chunk_summaries : summarized_by
    repositories ||--o{ symbols : defines
    symbols ||--o{ symbol_edges : from
    symbols ||--o{ symbol_edges : to
    repositories ||--o{ docs : documents
    repositories ||--o{ diagrams : visualizes
    repositories ||--o{ conversations : about
    conversations ||--o{ messages : has
    messages ||--o{ feedback : rated_by
    organizations ||--o{ audit_logs : records
    organizations ||--o{ usage_records : meters
```

## Key DDL sketch
```sql
create extension if not exists vector;

create table chunks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  repo_id uuid not null references repositories(id),
  document_id uuid not null references documents(id),
  content text not null,
  symbol text, kind text, language text,
  start_line int, end_line int,
  content_hash text not null,
  tsv tsvector
);
create index on chunks using gin (tsv);
create index on chunks (org_id, repo_id);

create table embeddings (
  chunk_id uuid primary key references chunks(id) on delete cascade,
  org_id uuid not null,
  embedding vector(1536) not null
);
create index on embeddings using hnsw (embedding vector_cosine_ops);

create table symbols (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null, repo_id uuid not null,
  name text not null, kind text, path text,
  start_line int, end_line int
);
create table symbol_edges (
  org_id uuid not null, repo_id uuid not null,
  from_symbol uuid references symbols(id),
  to_symbol uuid references symbols(id),
  edge_type text  -- calls|imports|inherits|references
);
create index on symbol_edges (org_id, repo_id, from_symbol);
create index on symbol_edges (org_id, repo_id, to_symbol);
```

## Indexing strategy
- Vector: HNSW cosine on `embeddings`.
- Lexical: GIN on `chunks.tsv`; optional trigram for identifier fuzzy match.
- Graph: indexes on `symbol_edges(from)` and `(to)` for fast callers/callees + recursive CTE blast-radius.
- Tenancy: `(org_id, repo_id)` composite on hot tables.

## Impact analysis query (blast radius)
Recursive CTE over `symbol_edges` (reverse `calls`/`references`) from a target symbol → transitive callers = blast radius. Bounded depth; cached per SHA.

## Multi-tenant strategy
Shared schema + `org_id` + RLS; every vector/graph/lexical query filtered by `org_id` (+ repo scope). Enterprise: schema/DB-per-tenant, per-tenant keys, residency (V3). No cross-tenant query without audited admin scope.

## Lifecycle
Incremental reindex on push (changed files via `content_hash`); index tied to `last_indexed_sha`; old chunks/embeddings/symbols for deleted files purged. `audit_logs` immutable. Backups + PITR; tested restores ([DEVOPS.md](./DEVOPS.md)).

# Codebase Intelligence — DEVOPS

Shared approach with contextos/DEVOPS.md (managed-first → K8s; Docker; GitHub Actions; eval gate in CI). Project-specific notes below.

## Environments
Local (Docker Compose: Postgres+pgvector, Redis, app, ingestion workers, otel) · Preview (per-PR + ephemeral DB branch) · Staging · Production.

## Ingestion-specific ops
- **Indexing is the heaviest workload** — runs on dedicated, autoscaling workers (BullMQ), isolated from the latency-sensitive query path.
- Idempotent, resumable index jobs; checkpoint progress; retry with backoff; DLQ for failures.
- Per-language parser images; tree-sitter grammars bundled.
- Clone with shallow/partial fetch; respect repo size limits per plan; stream large files.
- Incremental reindex on webhook (changed files only by content-hash).

## CI/CD
lint → typecheck → unit → **AI eval suite (faithfulness/recall gate)** → e2e → build → preview → staging → canary prod. Migrations auto (forward-only, RLS-aware). Eval gate is mandatory — chunking/retrieval/model changes must not regress accuracy.

## Deployments
Canary with auto-rollback on error/latency/cost/quality regression; feature flags; blue/green for risky index-schema migrations; zero-downtime.

## Data ops
Managed Postgres + PITR; daily backups; **tested restores** (quarterly drill). Vector index rebuild runbook. Embedding cost tracked per job. Reindex-all runbook for grammar/embedding-model upgrades (versioned embeddings; dual-read during migration).

## Scale path
Extract Ingestion + Embedding workers first; shard vectors by tenant/repo; dedicated vector DB at threshold (D-004); K8s for enterprise/VPC.

## Observability & secrets
OTel → Prometheus/Grafana; Sentry; vault for secrets; see [OBSERVABILITY.md](./OBSERVABILITY.md), [SECURITY.md](./SECURITY.md).

## Cost ops
Embedding + query LLM costs tracked per repo/org; spend caps; autoscale-to-zero idle workers; cache aggressively. Gross margin > 70%.

## Runbooks
Index job failure · reindex-all (model/grammar upgrade) · DB restore · vector rebuild · provider outage failover · cost spike · secret-leak incident · GitHub App token rotation.

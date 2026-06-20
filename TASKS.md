# Codebase Intelligence — TASKS

Epic → Feature → Task. Maps to [USER_STORIES.md](./USER_STORIES.md), [SPRINTS.md](./SPRINTS.md). Tasks ~0.5–2 days. DoD: typed · tested (unit + eval) · traced + costed · RLS-safe · spec updated.

## E1 — Foundation
- [ ] Turborepo + pnpm; apps/{web,api}; packages/{rag,llm,mcp,db,auth,observability,evals}
- [ ] Docker Compose (Postgres+pgvector, Redis, otel); CI (lint/type/test/build)
- [ ] Drizzle schema + RLS; auth (GitHub/Google OAuth); orgs/memberships/RBAC
- [ ] Stripe Free/Pro + usage metering + spend caps

## E2 — Ingestion
- [ ] GitHub App + repo connect flow (OAuth, webhooks)
- [ ] Repo clone (shallow); language detection
- [ ] tree-sitter parser integration (TS/JS, Python first)
- [ ] AST chunker → `chunks` + metadata; non-code recursive chunking
- [ ] Symbol graph builder → `symbols` + `symbol_edges`
- [ ] Index job orchestration (BullMQ): progress, resumable, idempotent, DLQ
- [ ] Incremental reindex on push (content-hash diff)
- [ ] Secret detection + redaction at ingest

## E3 — Embedding & Storage
- [ ] `packages/llm` embeddings (provider-abstracted); dual embedding (code + NL summary)
- [ ] Content-hash cache; batched embedding workers
- [ ] pgvector HNSW index; Postgres FTS (+ trigram) setup

## E4 — Search & Q&A (core)
- [ ] Hybrid retrieve (vector + lexical) + RRF fusion
- [ ] Graph expansion (callers/callees) for matched symbols
- [ ] Re-ranker (cross-encoder/LLM)
- [ ] Context assembler (budget, dedupe, file:line citations)
- [ ] `/search` endpoint (ranked snippets, syntax highlight via Shiki)
- [ ] `/ask` grounded Q&A (streaming, citations, confidence, "I don't know")
- [ ] `/chat` conversational follow-ups (query rewrite/expand)
- [ ] Feedback on answers → evals

## E5 — Docs & Diagrams (V1)
- [ ] Auto repo summary (modules, entry points)
- [ ] Living per-module/function docs (regenerate on change); doc-drift detection
- [ ] Architecture/dependency diagram generation (Mermaid from graph)
- [ ] Export to Markdown/Confluence

## E6 — Structure & Impact (V1)
- [ ] Callers/callees endpoints
- [ ] Impact/blast-radius (recursive CTE over symbol_edges)
- [ ] Module dependency graph endpoint
- [ ] Multi-repo support

## E7 — Teams & Reporting (V1)
- [ ] Shared workspaces, per-repo RBAC
- [ ] Usage/top-questions/knowledge-gap reports
- [ ] Cost dashboard

## E8 — API & MCP (V2)
- [ ] Public REST API + keys + usage metering + rate limits
- [ ] MCP server (`/mcp`): search_code, ask_codebase, impact_of, get_symbol_context, get_repo_summary
- [ ] SDKs (TS/Python) from OpenAPI; webhooks on reindex

## E9 — Agents (V2)
- [ ] Codebase Q&A agent (multi-hop, graph-aware, budgeted, traced)
- [ ] PR review agent (impact + convention + summary, suggest-only)
- [ ] Trajectory tracing + failure taxonomy

## E10 — Governance/Security
- [ ] Audit logs everywhere; tenant-isolation tests
- [ ] Secret redaction (ingest + egress); injection detection
- [ ] SSO/SAML, on-prem packaging, compliance exports (V3)

## E11 — Observability & Evals
- [ ] OTel instrumentation (incl. retrieval/quality/cost spans)
- [ ] Dashboards (system/quality/cost/usage/business) + alerts
- [ ] Golden Q&A dataset over known repos; LLM-as-judge + citation checks; CI eval gate
- [ ] "Show retrieved code" debug view; publish eval scores

## E12 — Launch
- [ ] Landing, docs, pricing; OSS chunker/grammars (open-core)
- [ ] Onboarding flow (connect → summary → first answer)
- [ ] Product Hunt / HN / build-in-public assets

# CLAUDE.md — Codebase Intelligence

Guidance for Claude Code and other AI agents in this project. Spec-first (D-011).

## What this is
Codebase Intelligence — production RAG-over-code engine (search, grounded Q&A, auto-docs, impact analysis), exposed via API + MCP. Project #2 of the AI Startup Lab; the wedge's technical core; reused by ContextOS (#1) and System Design Assistant (#6).

## Golden rules
1. **Respect DECISION_LOG.md:** no model training (D-001); Claude default + provider abstraction (D-003); Postgres+pgvector (D-004); TS/NestJS (D-005); monorepo (D-006).
2. **Accuracy is the product.** Ground every answer in retrieved code; cite file:line; return "I don't know" on low confidence. Never invent APIs/behavior.
3. **Don't regress evals.** The CI eval gate (faithfulness/recall) is mandatory.
4. **Tenant + repo scope every retrieval** (`org_id` + RLS). No cross-tenant queries.
5. **Redact secrets** at ingest and egress; treat repo content as untrusted (injection).
6. **Read-only by default** — agents/tools don't mutate code.
7. **Trace + cost** every LLM/embedding call.
8. **Update the spec** in the same change when behavior diverges.

## The hard part (where to focus)
`packages/rag`: AST chunking (tree-sitter) → dual embedding → hybrid retrieve (vector+lexical, RRF) → symbol-graph expansion → rerank → grounded generate + cite. This is the moat. See [RAG.md](./RAG.md), [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md).

## Context to load
[README](./README.md) → [ARCHITECTURE](./ARCHITECTURE.md) → [RAG](./RAG.md) → [AI_ARCHITECTURE](./AI_ARCHITECTURE.md) → [DATABASE](./DATABASE.md) → [API_DESIGN](./API_DESIGN.md) → [MCP](./MCP.md) → [TASKS](./TASKS.md) → [SPRINTS](./SPRINTS.md) → [SECURITY](./SECURITY.md) → [GUARDRAILS](./GUARDRAILS.md).

## Stack
Next.js+TS+Tailwind+shadcn (+Shiki, Mermaid) · NestJS · Postgres+pgvector+FTS · Redis+BullMQ · tree-sitter · MCP SDK · OTel/Prometheus/Grafana/Sentry · Stripe · Turborepo+pnpm · Drizzle.

## Commands (once code exists)
`pnpm dev` · `pnpm test` · `pnpm test:eval` (the accuracy gate) · `pnpm db:migrate` · `docker compose up`.

## Definition of Done
Typed · unit + eval tested (no faithfulness/recall regression) · traced + costed · RLS/tenant-safe · spec updated.

## Don'ts
- No vector DB other than pgvector without a logged decision (D-004).
- No direct vendor SDK calls — use `packages/llm` (D-003).
- No code mutation from agents (read-only).
- No unredacted secrets in embeddings/answers/logs.

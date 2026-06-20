# Codebase Intelligence — SPRINTS

2-week sprints to MVP (≈8–10 weeks), then V1. This is the wedge's **core engine** — build after #3, before #1. Solo founder + AI agents.

## Sprint 0 — Setup (Wk 0)
Monorepo, Docker, CI, base apps, Drizzle+RLS. **Exit:** `pnpm dev` runs; CI green.

## Sprint 1 — Auth, Org, Billing (Wk 1–2)
Auth (GitHub/Google), orgs/RBAC/RLS, Stripe Free/Pro + metering. **Exit:** signup → org → upgrade.

## Sprint 2 — Ingestion (Wk 3–4)
GitHub App connect; clone; tree-sitter (TS/JS, Python); AST chunker + metadata; index job pipeline (progress/resumable). **Exit:** connect a repo → it chunks → progress visible.

## Sprint 3 — Embedding + Search (Wk 5–6)
Dual embedding + content-hash cache; pgvector HNSW + FTS; hybrid retrieve + RRF. **Exit:** semantic + keyword search returns relevant snippets with file:line.

## Sprint 4 — Grounded Q&A (Wk 7–8)  ← the wow
Provider abstraction + model router; rerank; context assembler; `/ask` with citations + streaming + "I don't know"; cost shown. **Exit:** ask "how does X work?" → accurate, cited, streamed answer. **Demoable.**

## Sprint 5 — Graph + Summary + Evals + Polish (Wk 9–10)
Symbol graph builder; graph expansion in retrieval; auto repo summary; secret redaction; golden eval dataset + CI gate; incremental reindex on push; feedback. **Exit:** cross-file answers improve; summary on connect; evals gate CI; **ready for Private Beta + Product Hunt.**

### → MVP COMPLETE (≈10 weeks).

---

## V1 sprints (team + depth)
- **S6 (Wk 11–12):** Living auto-docs + doc-drift; architecture diagrams (Mermaid).
- **S7 (Wk 13–14):** Impact/blast-radius (recursive CTE); callers/callees nav; multi-repo.
- **S8 (Wk 15–16):** Teams/RBAC, shared workspaces, reporting (top questions, knowledge gaps), cost dashboard.
- **S9 (Wk 17–18):** Reliability (provider failover, large-repo handling), more languages (Go/Java), Team tier live. **Exit: V1 GA.**

## V2 sprints (engine-as-product)
- **S10–11:** Public API + keys + usage billing; **MCP server** (the strategic surface) + SDKs.
- **S12–13:** Codebase Q&A agent (multi-hop) + PR review agent + trajectory observability.
- **S14:** Automation, enterprise controls, more languages.

## V3 (enterprise)
SSO/SAML/SCIM, on-prem/VPC, org-wide knowledge graph, SOC 2 Type II, audit exports.

## Cadence
Each sprint: 1 demoable increment, evals green (faithfulness/recall not regressed), spec updated, weekly build-in-public post. The MCP server (S10–11) is the moment this becomes infrastructure for #1/#6.

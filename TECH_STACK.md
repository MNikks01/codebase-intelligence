# Codebase Intelligence — TECH STACK

Same portfolio stack as contextos/TECH_STACK.md (D-003–D-009); here are the project-specific emphases and additions.

| Layer | Choice | Project-specific why |
|-------|--------|----------------------|
| Frontend | Next.js + TS + Tailwind + shadcn/ui | Search/answer UX, code snippets (syntax highlight via Shiki), diagrams (Mermaid render) |
| Backend | NestJS (TS) | Ingestion + Search + Graph services as modules |
| **Parsing** | **tree-sitter** (multi-language grammars) | AST-aware chunking + symbol graph — the core differentiator |
| DB | PostgreSQL + **pgvector** + **FTS** (+ trigram) | Vectors + lexical + graph (recursive CTEs) in one store (D-004) |
| Graph | Postgres tables + recursive CTEs (Apache AGE optional later) | Symbol/dependency graph; avoid a separate graph DB early |
| Queue | Redis + BullMQ | Heavy async indexing/embedding jobs |
| AI | Claude default + GPT/Gemini via abstraction; embeddings abstracted | Opus for multi-hop Q&A; cheap models for summaries/docs (D-003) |
| Rerank | Cross-encoder / LLM scoring | Precision lever |
| Code highlight | Shiki | Accurate snippet rendering |
| Diagrams | Mermaid | Diffable, GitHub-native architecture maps |
| Observability | OTel → Prometheus/Grafana; Sentry | + retrieval/quality/cost metrics |
| Payments | Stripe (seat + repo + usage/API metering) | Engine usage billing (D-008) |
| Cloud/Infra/CI | Managed-first; Docker; GitHub Actions; K8s later | D-009 |
| Monorepo | Turborepo + pnpm; shared `packages/{rag,llm,mcp,db,...}` | Reuse engine in #1/#6 (D-006) |
| Testing | Vitest/Jest, Playwright, **eval harness** | Eval gate is mandatory — quality is the product |

## Notable additions vs. ContextOS
- **tree-sitter grammars** for each supported language (start: TS/JS, Python, Go, Java; expand by demand).
- **Symbol-graph builder** (custom) — the structural intelligence layer.
- **Re-ranker** as a first-class component.
- **Shiki** for code rendering; **Mermaid** for generated diagrams.

## Language support roadmap
MVP: TypeScript/JavaScript, Python. V1: Go, Java, Ruby, C#. V2+: Rust, PHP, Kotlin, C/C++ — prioritized by customer demand. tree-sitter makes adding languages incremental.

## Why this wins here
The hard part (AST chunking, symbol graph, hybrid+graph retrieval, rerank, evals) is concentrated in `packages/rag` — built once, reused across the lab. The rest is standard MERN-adjacent SaaS the founder already knows.

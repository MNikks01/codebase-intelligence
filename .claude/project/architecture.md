# Architecture — Codebase Intelligence

Ingest a repo -> chunk -> embed -> hybrid retrieve (vector + BM25, RRF) -> re-rank -> import-graph -> cite/answer.

**Shape:** a pure-TypeScript **engine** (`engine/src`, zero-network, zero-dep) wrapped by thin adapters: engine/ (engine), mcp-server/ (MCP server), web/ (Next.js app).

- **Engine = single source of truth.** Surfaces never duplicate logic; they call the engine.
- Generated copies (e.g. `web/lib/engine`) are produced by a sync script and kept in lock-step (drift-checked in CI).
- Real external services (LLM, embeddings, Stripe, Postgres/pgvector, OTel) are swapped in behind interfaces/env; nothing is required to run the dev/test path.

Key modules: `ingest`, `chunk`, `tokenize`, `embed`, `store`, `lexical`, `retrieve`, `rerank`, `graph`, `answer`, `index`.

See the root `ARCHITECTURE.md` for the full product/scale design.

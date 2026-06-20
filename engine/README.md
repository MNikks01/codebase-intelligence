# Codebase Intelligence — engine (Phase A) ✅

The RAG-over-code engine for project #2: **ingest a repo → chunk → embed → hybrid retrieve (vector + lexical) → grounded Q&A with citations.** This is the "technical center of gravity" reused by ContextOS (#1). Pure TypeScript, runs on **Node 24 native TS**, **zero-network by default** (real embedding/LLM APIs swap in for production).

## Status: Phase A built + evaluated (2026-06-20)
Proven on a real codebase (the mcpforge engine):
- ✅ **Ingest** — walk a repo, read code/docs, skip junk (`node_modules`, `dist`, …).
- ✅ **Chunk** — declaration-aware (functions/classes kept whole; symbol names captured; markdown by heading; windowed fallback).
- ✅ **Embed** — pluggable; zero-network `LocalHashEmbedding` fallback so it runs without keys.
- ✅ **Retrieve** — hybrid: in-memory vector (cosine) + **BM25 lexical**, fused with **RRF**; code-aware tokenizer (splits `camelCase`/`snake_case`).
- ✅ **Re-rank** — heuristic re-ranker (filename / symbol / term-coverage signals; no model needed).
- ✅ **Graph-RAG** — file-level **import graph**; surfaces related (importing/imported) files and feeds cross-file context into grounded answers.
- ✅ **Cite** — every result is `path:startLine-endLine` (+ symbol).
- ✅ **Answer** — grounded LLM answer when `ANTHROPIC_API_KEY` is set; otherwise retrieval-only (cited chunks).
- ✅ **Eval harness** — golden Q→expected-file over a known repo, A/B (hybrid vs +re-ranker), 11 questions:

  | | recall@3 | recall@5 | MRR |
  |---|---|---|---|
  | hybrid | 91% | 100% | 0.624 |
  | **+re-ranker** | **100%** | **100%** | **0.788** |

  (local-embeddings baseline; a real embedding API raises semantic recall further.)

## Run it
```bash
node scripts/demo.ts                 # index the mcpforge engine, ask 3 questions
node scripts/demo.ts /path/to/repo   # index any local repo
node scripts/eval.ts                 # retrieval quality (recall@k, MRR) — exits 1 below 60%
ANTHROPIC_API_KEY=sk-... node scripts/demo.ts   # grounded answers (not just retrieval)
```

## Structure
```
src/
  types.ts       # Chunk, FileDoc, QueryResult
  ingest.ts      # walk repo -> FileDoc[]
  chunk.ts       # declaration-aware chunking
  tokenize.ts    # code-aware tokenizer (camelCase/snake_case)
  embed.ts       # EmbeddingProvider + LocalHashEmbedding (+ real-API swap point)
  store.ts       # in-memory vector index (cosine)  -> pgvector in production
  lexical.ts     # BM25 lexical index
  retrieve.ts    # reciprocal rank fusion
  rerank.ts      # heuristic re-ranker (filename/symbol/coverage signals)
  graph.ts       # file import graph (graph-RAG building block)
  answer.ts      # AnswerProvider (Claude) — null without a key (retrieval-only)
  index.ts       # CodebaseIndex: indexDir() / search() / searchRaw() / ask() / related()
scripts/
  demo.ts        # index a real repo + retrieve
  eval.ts        # the retrieval eval harness (recall@k, MRR)
```

## Production swaps (when keys are added)
| Dev (now) | Production |
|-----------|------------|
| `LocalHashEmbedding` (hashed token vectors) | real embedding model (OpenAI/Voyage/Gemini) → true semantic recall |
| in-memory `VectorIndex` | **pgvector** (HNSW) per the lab DB strategy |
| no LLM → retrieval-only | Claude grounded answers (already wired via `ANTHROPIC_API_KEY`) |
| declaration heuristic chunker | tree-sitter AST chunking (the documented upgrade) |

The contracts (Chunk/IR, `indexDir`/`search`/`ask`) don't change — only the providers do.

## Next quality levers (per the docs)
**Real embeddings** (the biggest remaining lift — needs an embedding API key) · upgrade the heuristic re-ranker to a cross-encoder/LLM re-ranker · symbol-level graph (callers/callees, not just file imports) · tree-sitter AST chunking · incremental reindex on push. The eval harness is here to measure each one — the re-ranker already lifted MRR 0.624 → 0.788.

> This engine is reused by ContextOS (#1) for grounded codebase Q&A. Build #2 → then assemble #1 (the wedge order).

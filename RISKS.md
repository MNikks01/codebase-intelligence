# Codebase Intelligence — RISKS

L×I + mitigation.

## Technical
| Risk | L×I | Mitigation |
|------|-----|------------|
| Answer accuracy insufficient (hallucination) | H×H | AST chunk + graph + rerank + evals + citations + "I don't know"; publish scores; THE core bet |
| Scaling indexing/vectors on huge monorepos | M×H | Incremental reindex, partitioning, autoscaling workers, dedicated vector DB at threshold (D-004) |
| Secret leakage via embeddings/answers | M×H | Ingest redaction + egress filter ([GUARDRAILS.md](./GUARDRAILS.md)) |
| Cross-tenant code leak | L×H | RLS + scoped retrieval + tests |
| LLM/embedding COGS > margin | M×H | Caching, routing, lean retrieval, incremental embedding, usage pricing |
| Language coverage gaps lose deals | M×M | tree-sitter makes adding languages incremental; prioritize by demand |
| Provider outage/changes | M×M | Multi-provider abstraction + failover (D-003) |

## Business
| Risk | L×I | Mitigation |
|------|-----|------------|
| Crowded "chat with codebase" market | H×M | Differentiate on accuracy (published evals) + API/MCP engine + lighter adoption than Sourcegraph |
| Slow conversion | M×H | Public demo + nail activation (time-to-cited-answer) + agency ROI |
| Enterprise cycle vs. runway | M×M | SMB self-serve + API revenue first; enterprise after PMF |
| Solo-founder focus | H×H | Sequence (this is #2 of the wedge); reuse engine across lab |

## Market
| Risk | L×I | Mitigation |
|------|-----|------------|
| Incumbent (GitHub/Cursor/Sourcegraph) bundles deep code-understanding | M×H | API/MCP engine play (be embedded), accuracy edge, speed |
| Commoditization of code Q&A | M×M | Depth (graph/impact/evals) + engine reuse; compete on accuracy not features |
| Model improvements make RAG less necessary (bigger context) | M×M | Even huge context needs retrieval at repo scale + cost; graph/impact remain valuable; ride model gains |

## AI-specific
| Risk | L×I | Mitigation |
|------|-----|------------|
| Model drift breaks prompts/quality | M×M | Evals in CI, quarterly model review, pinned+tested versions |
| Confident wrong answer kills trust | M×H | Grounding, citations, self-check, conservative "I don't know" |
| Embedding model upgrade requires costly reindex | M×M | Versioned embeddings, dual-read migration, content-hash cache |

## Top 3 to watch
1. **Accuracy** — the entire value prop; over-invest in RAG quality + evals.
2. **Differentiation in a crowded space** — published evals + API/MCP engine.
3. **COGS at scale** — instrument from line one.

## Kill criteria
If accuracy can't beat "good enough" rivals after honest effort and retention stays low → pivot to the pure API/engine play (sell to builders) or fold the engine into ContextOS as a feature rather than a standalone product.

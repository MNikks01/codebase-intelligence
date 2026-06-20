# Codebase Intelligence — AI ARCHITECTURE

Builds on AI_STACK_GUIDE.md. The differentiator is **depth of code understanding**.

## Models
Claude default (Opus for complex multi-hop Q&A/agents; Haiku/Sonnet for summaries, doc generation, simple lookups) via provider abstraction (D-003). Low temperature; structured output; prompt caching on the stable grounding prompt.

## Embeddings
- Provider-abstracted; 1536-dim in pgvector.
- **Dual embedding per code chunk:** the raw code + an LLM-generated natural-language summary ("what this function does"). English queries match the summary; identifier queries match code/lexical. Biggest quality lever after AST chunking.
- Content-hash cache → re-embed only changed chunks. Batched.

## Retrieval (the core)
Hybrid + graph + rerank — see [RAG.md](./RAG.md). Pipeline: vector (HNSW cosine) + lexical (Postgres FTS) → fuse (RRF) → symbol-graph expansion (pull callers/callees of matched symbols) → cross-encoder/LLM rerank → assemble within budget with file:line citations.

## The symbol graph (what makes us deep)
Built at ingest from AST: nodes = files/symbols (functions/classes/modules); edges = imports, calls, inherits, references. Powers:
- **Graph RAG:** retrieve structurally-related code, not just semantically-similar text.
- **Impact analysis:** blast radius = transitive callers of a symbol.
- **Architecture diagrams:** module dependency graph → Mermaid.
- **Navigation:** callers/callees, "trace this request."

## Memory / state
Mostly stateless per query (the codebase is the knowledge). Conversational Q&A keeps short-term context; no long-term user memory needed at engine level (that's ContextOS's job). Index state tied to commit SHA.

## Tool calling / agents
Read-only by default. Codebase Q&A agent (multi-hop: retrieve → reason → retrieve again via graph). PR review agent uses impact + conventions. Exposed via MCP so external agents get `ask_codebase`/`search_code`/`impact_of`. See [AGENT_DESIGN.md](./AGENT_DESIGN.md), [MCP.md](./MCP.md).

## Evaluation (trust is the product)
- **Golden Q&A dataset** over known open-source repos with verified answers + expected citations.
- **Retrieval metrics:** recall@k, precision@k, MRR (did we fetch the right code?).
- **Generation metrics:** faithfulness/groundedness, citation correctness, answer relevance.
- **Impact-analysis accuracy:** precision/recall of predicted blast radius vs. ground truth.
- LLM-as-judge for faithfulness; deterministic checks for citations/graph. **In CI** — chunking/retrieval/model changes can't silently regress. Production answers sampled (+ thumbs feedback) grow the dataset. Publish eval scores (GTM trust asset).

## Cost architecture
Prompt + answer caching (same SHA + same question → cached); model routing (cheap for summaries/docs); lean retrieval (few high-quality chunks); incremental embedding. Per-query cost recorded; spend caps; gross margin > 70%.

## Failure modes
Low retrieval confidence → "I don't know" + suggest where to look (no hallucination). Provider outage → failover. Oversized context → tighter budget + graph-prioritized chunks.

# Known issues — Codebase Intelligence

- **Production not wired:** real keys/infra (LLM, embeddings, auth, billing, Postgres + pgvector) are interface-ready but not connected; dev/test runs without them.
- **Web UI not click-tested headlessly** — verify in a browser (`npm run dev`); API paths are covered by smoke tests.
- **Local embeddings baseline:** retrieval quality is measured by the eval harness; a real embedding model will raise semantic recall. The heuristic re-ranker can tie/slightly-trail pure hybrid on tiny golden sets.
- No deploy yet (Vercel for web). Track new issues here.

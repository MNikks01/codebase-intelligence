# .claude — Codebase Intelligence workspace

Project #2 of the AI Startup Lab. RAG over code — search, grounded Q&A, citations.

**What it does:** Ingest a repo -> chunk -> embed -> hybrid retrieve (vector + BM25, RRF) -> re-rank -> import-graph -> cite/answer.

**Surfaces:** engine/ (engine), mcp-server/ (MCP server), web/ (Next.js app)

This `.claude/` folder helps humans and AI agents work in this repo consistently:
- `agents/` — role-based subagents (architect, backend, frontend, tester, reviewer, devops, docs, ui).
- `skills/` — stack reference notes (what we use, and what we deliberately don't).
- `project/` — the living source of truth: architecture, standards, structure, API contracts, schema, stack, roadmap.
- `prompts/` — reusable task prompts (feature, bugfix, refactor, review, tests, docs).
- `memory/` — decisions, changelog, known issues, lessons learned.
- `commands/` — operational runbooks (build, deploy, release, publish). Also usable as slash commands.
- `templates/` — code scaffolds (component, api-route, hook, test, PR).

> Ground truth lives in code + the root spec docs. **Engines run on Node 24 native TypeScript (zero build step); never add a build for them.** The engine is the single source of truth — generated copies (`web/lib/engine`) are synced, never hand-edited.

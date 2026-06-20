# Codebase Intelligence — web app

The browser surface for [`../engine`](../engine): **index a repo → ask questions → get answers grounded in the actual code with `file:line` citations.** Next.js 16 + Tailwind. **No keys needed for search** (hybrid retrieval + re-ranking + import-graph); set an LLM key for written answers.

## Status: built + API-verified (2026-06-20)
- ✅ `next build` compiles + typechecks (engine synced into `lib/engine/`).
- ✅ `POST /api/index` — **demo repo** (`{ demo: true }`) or **upload a `.zip`** of your repo → builds an index → returns `{ indexId, files, chunks }`.
- ✅ `POST /api/ask` — `{ indexId, question }` → cited chunks (+ a written answer when `ANTHROPIC_API_KEY` is set).
- ✅ End-to-end via `scripts/smoke-api.mjs`: demo + a **real zip upload** (the engine's own 12 files) → "BM25" query cites `lexical.ts`; unknown index → 404.
- 🔲 Visual UI renders + wired — **verify locally** (`npm run dev`); not click-tested headlessly.

## Run it
```bash
npm install
npm run dev          # http://localhost:3000 — "Try a demo repo" or upload a .zip, then ask
# headless API proof:
npm run build
PORT=3950 npx next start &
( cd ../engine/src && zip -rq /tmp/engine-src.zip . )   # a test repo for the upload path
BASE=http://localhost:3950 node scripts/smoke-api.mjs
```

## How a repo gets in
- **Demo** — a tiny bundled service (`lib/demo-corpus.ts`) so the "aha" needs no upload.
- **Zip upload** — the user uploads a `.zip`; `lib/zip.ts` reads code/doc files (skips `node_modules`/`dist`, caps size/count) into the engine. No git, no GitHub token, no cloning arbitrary URLs.
- Indexes live in an in-memory store keyed by `indexId` (`lib/engine-store.ts`); production persists embeddings in pgvector.

## Structure
```
app/
  page.tsx                 # index (demo/zip) -> ask -> cited answers
  api/index/route.ts       # zip|demo -> build index -> indexId
  api/ask/route.ts         # indexId + question -> cited chunks (+ answer)
lib/
  engine/                  # GENERATED from ../engine/src (sync-to-web.mjs)
  zip.ts                   # uploaded zip -> FileDoc[]
  demo-corpus.ts           # bundled demo repo
  engine-store.ts          # in-memory indexId -> CodebaseIndex (LRU)
scripts/smoke-api.mjs      # end-to-end API proof
```

## To go live (production swaps)
- `ANTHROPIC_API_KEY` → written grounded answers (otherwise retrieval-only).
- Real embedding model → true semantic recall; **pgvector** → persistent indexes (vs. the in-memory store).
- See [`../engine/README.md`](../engine/README.md). `lib/engine/` is generated — edit `../engine/src` and run `node ../engine/scripts/sync-to-web.mjs`.

# Go-live checklist — Codebase Intelligence

> **Nothing here is needed for the dev/test path** — `npm test`, the demos, and the smoke tests all run **offline with no keys**. This is only for shipping to production.

## 1. Environment variables
| Variable | When | Unlocks |
|----------|------|---------|
| `ANTHROPIC_API_KEY` | optional | written grounded answers (else cited chunks only) |
| `OPENAI_API_KEY or VOYAGE_API_KEY` | recommended | real embeddings → true semantic recall (else local-hash baseline) |
| `DATABASE_URL` | production | persistent indexes in pgvector (HNSW) vs in-memory |

Set these in the host's settings (Vercel project env), never in committed files. `.env` is gitignored.

## 2. Deploy
- **Web app** → Vercel: `cd web && vercel --prod` (or connect the repo in the Vercel dashboard, root = `web/`). Add the env vars above.
- **MCP server** → runs on Node ≥ 24 anywhere; add to Claude Desktop / Cursor via `mcp-server/mcp.json` (optional ANTHROPIC_API_KEY (ask_codebase written answers)).
- Provision Postgres + pgvector when enabling the production data layer.

## 3. Production swaps (flip dev → prod behind existing interfaces)
- LocalHashEmbedding → a real embedding model (behind the EmbeddingProvider interface)
- in-memory VectorIndex → pgvector
- heuristic re-ranker → cross-encoder/LLM re-ranker

## 4. Verify after deploy
- `curl https://<your-deploy>/api/health` → `{"status":"ok"}`
- Run the smoke against the live URL: `BASE=https://<your-deploy> node web/scripts/smoke-api.mjs`
- Re-run `npm test` on the deploy commit (CI does this automatically).

## 5. Enforce CI on GitHub (branch protection)
> Adopt a **feature-branch → PR** flow first. Branch protection requires checks to pass *before merge*, which conflicts with pushing straight to `main`. Run this **after CI has run once** on `main` (so the checks exist). Solo-friendly: requires green CI, no second reviewer, owner not locked out.

```bash
gh api -X PUT repos/MNikks01/codebase-intelligence/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["typecheck + unit + integration","mcp server contract smoke","web build","e2e (playwright)"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```
(Add the `CodeQL` check too once it appears in the branch-protection check list.)

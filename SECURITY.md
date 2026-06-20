# Codebase Intelligence — SECURITY

We ingest customers' source code — the most sensitive asset they have. Security IS the sale. Baseline patterns shared with contextos/SECURITY.md; project-specific emphases below.

## RBAC
Owner/Admin/Member/Viewer at org; per-repo access control; API keys scoped per repo + read-only by default. Enforced at gateway + RLS.

## Audit logs
Append-only `audit_logs`: every repo connect, index, search, question, doc access, API call (actor, repo, query, timestamp). Immutable; retained per compliance; exportable (V3).

## Secrets management
Integration tokens (GitHub App, provider keys) in vault/secret manager — never in DB/logs/context. **Code-scanning at ingest: detect & redact secrets/keys in source so they're never embedded or returned.** Short-lived GitHub App tokens; rotation.

## Encryption
TLS in transit; disk/DB encryption at rest; sensitive blobs envelope-encrypted with per-tenant keys (Enterprise BYOK). Backups encrypted.

## Data handling & privacy (D-010)
- **Customer code never trains any model** (ours or providers'); provider zero-retention/no-train tiers only.
- Per-tenant index isolation (RLS; every retrieval `org_id`+repo scoped). Cross-tenant retrieval is impossible by construction + tested.
- On-prem/VPC option so code never leaves the customer network (V3).
- Delete repo → purge all chunks/embeddings/symbols/docs. Configurable retention.

## App security
Input validation (Zod); parameterized queries; deny-by-default authz; rate limiting; dependency + secret scanning + SAST in CI; security headers/CSP.

## AI-specific security
- **Prompt injection via repo content:** malicious instructions in code comments/READMEs are *data*, never instructions; injection detection on ingest/retrieval; tool allowlist; see [GUARDRAILS.md](./GUARDRAILS.md).
- **Secret leakage:** redaction at ingest (above) + egress filtering on answers.
- Read-only agents; no code mutation.

## Compliance roadmap
Launch: privacy policy, DPA, security page, sub-processors. Y1: SOC 2 Type I + pen test. Y2: SOC 2 Type II, GDPR, on-prem/VPC, residency. On demand: ISO 27001.

## Threat model (top)
1. Cross-tenant code leak → RLS + scoped retrieval + tests (highest priority).
2. Secret exposure via embeddings/answers → ingest redaction + egress filter.
3. Prompt injection via repo files → untrusted-data handling.
4. Credential theft (GitHub tokens) → vault + short-lived + least privilege.
5. Supply chain → dep scanning + pinning.

## Trust assets (sell with these)
Security page, "your code never trains a model" guarantee, on-prem option, SOC 2 (when ready), published eval scores. These close the #1 objection from every engineering buyer.

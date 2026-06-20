# Codebase Intelligence — PRICING

Seat + usage hybrid (D-008), plus a **usage-based API tier** (engine-as-a-service). Validate with design partners.

| | **Free** | **Pro** | **Team** | **Enterprise** |
|---|---|---|---|---|
| Price | $0 | **$19/mo** | **$29/user/mo** (min 3) or per-repo | Custom (annual) |
| Repos | 1 (size-capped) | 3 | unlimited | unlimited |
| Queries | limited/mo (hard cap) | generous + metered overage | pooled team quota | committed + overage |
| Search + Q&A | ✅ | ✅ | ✅ | ✅ |
| Auto-docs + diagrams | basic | ✅ | ✅ | ✅ |
| Impact analysis | — | ✅ | ✅ | ✅ |
| Multi-repo | — | limited | ✅ | ✅ |
| Teams/RBAC | — | — | ✅ | ✅ |
| API + MCP access | — | limited | ✅ (rate-limited) | ✅ (high limits) |
| SSO / on-prem | — | — | — | ✅ |
| Audit/compliance | 7-day | 30-day | 1-year | export |
| Support | community | email | priority | dedicated + SLA |

## API / Engine tier (ICP-4)
Separate **usage-based pricing** for builders embedding the engine: per-1k-queries + per-repo-indexed, volume tiers. This monetizes the MCP/API surface that powers third-party agents (and internally powers #1/#6).

## Logic
- **Free** must answer real questions on a real repo (the wow) → developers evangelize.
- **Pro** = individual unlimited-ish; predictable + metered overage.
- **Team** = collaboration + multi-repo + API → the money tier.
- **Enterprise** = security/scale/on-prem/compliance.
- Usage passes LLM+embedding COGS above free credits; spend caps + transparency (no bill shock); margin > 70%.
- Annual discount ~2 months.

## Expansion levers
More repos, more queries, more seats, API usage, tier upgrades. Land free → Pro/Team → Enterprise/API.

## Experiments
Per-seat vs. per-repo Team pricing; free query cap (activation vs. COGS); API price points; index-size limits per tier.

# Codebase Intelligence — FEATURES

Maturity ladder. Cat: 🔍 search/Q&A · 📚 docs · 🗺️ structure/impact · 🤝 team · 🔌 API/MCP · 🛡️ governance · 🤖 agents

## MVP (connect → understand)
| # | Feature | Cat | Why |
|---|---------|-----|-----|
| M1 | Auth + billing (Free/Pro) | — | Table stakes / monetize |
| M2 | Connect repo (GitHub App), ingest + AST chunk | — | Entry point |
| M3 | Incremental indexing on push (changed files only) | — | Always current; cost control |
| M4 | **Semantic + keyword (hybrid) code search** | 🔍 | Core utility |
| M5 | **Grounded Q&A with file:line citations** ("how does X work?") | 🔍 | The wow; trust via citations |
| M6 | "I don't know" on low confidence | 🔍 | Trust |
| M7 | Auto repo summary (what is this, key modules, entry points) | 📚 | Instant orientation |
| M8 | Cost/usage visibility per query | 🛡️ | COGS awareness |
| M9 | Feedback on answers → evals | 🔍 | Quality compounding |

**MVP DoD:** connect a repo, get a useful summary, and ask questions that return accurate, cited answers.

## V1 (team + depth)
| # | Feature | Cat |
|---|---------|-----|
| V1-1 | Teams, RBAC, shared workspace | 🤝 |
| V1-2 | **Living auto-docs** (per-module/function, regenerated on change) | 📚 |
| V1-3 | **Architecture diagrams** (auto-generated from symbol graph, Mermaid) | 🗺️ |
| V1-4 | **Impact / blast-radius analysis** ("what breaks if I change this?") | 🗺️ |
| V1-5 | Multi-repo / polyrepo support | 🔍 |
| V1-6 | Symbol-graph navigation (callers/callees, dependencies) | 🗺️ |
| V1-7 | Reporting (usage, top questions, knowledge gaps) | 🤝 |
| V1-8 | Conversational follow-ups (context-aware chat) | 🔍 |

## V2 (agents, API/MCP, automation)
| # | Feature | Cat |
|---|---------|-----|
| V2-1 | **Public API + MCP server** (expose the engine) | 🔌 |
| V2-2 | Codebase Q&A agent (multi-hop, graph-aware) | 🤖 |
| V2-3 | PR context/review agent (flag convention/impact issues) | 🤖 |
| V2-4 | Onboarding flows ("learning path" through a codebase) | 📚 |
| V2-5 | Automation (reindex/regenerate docs on events) | — |
| V2-6 | Enterprise controls (policy, retention, spend caps) | 🛡️ |

## V3 (enterprise + org graph)
| # | Feature | Cat |
|---|---------|-----|
| V3-1 | SSO/SAML/SCIM | 🛡️ |
| V3-2 | On-prem / VPC | 🛡️ |
| V3-3 | Org-wide knowledge graph (all repos/services) | 🗺️ |
| V3-4 | Audit logs + compliance exports | 🛡️ |
| V3-5 | Advanced governance (data residency, BYO-key) | 🛡️ |

## Future
- Cross-repo dependency/impact across microservices.
- Code-change risk scoring in CI.
- Natural-language → code-navigation in IDE.
- Historical "why" reconstruction from git + PRs.
- Test-gap and dead-code detection.

## Reuse note
This engine *is* the retrieval layer of ContextOS (#1) and the grounding for System Design Assistant (#6). MVP/V1 here are prerequisites for those products — building #2 well is leverage across the lab.

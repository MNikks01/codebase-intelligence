# Codebase Intelligence — OPEN SOURCE

Open-core (D-007): open the primitives developers trust + contribute to; keep the hosted engine, scale infra, and governance proprietary.

## Open source (Apache-2.0)
| Component | Why open |
|-----------|----------|
| **AST chunker** (tree-sitter-based code splitter) | Devs trust + improve it; authority in RAG-over-code; funnel |
| **tree-sitter grammar configs / language packs** | Community adds languages → coverage grows for free |
| **Eval harness for RAG-over-code** (golden-set runner, faithfulness/citation checks) | Thought leadership; community quality; trust in our accuracy claims |
| **SDKs** (TS/Python clients) | Integration ease |
| **MCP server reference** (thin client/templates) | Ride MCP adoption; distribution |

## Proprietary
| Component | Why closed |
|-----------|-----------|
| Hosted indexing + multi-tenant engine | The product/revenue; hard to operate at scale |
| Symbol-graph builder + graph-RAG orchestration (at scale) | Core differentiator |
| Re-ranking pipeline + retrieval tuning | Quality moat |
| Living docs / diagram generation | Product surface |
| Dashboards, billing, governance, on-prem packaging | Enterprise value |
| Accumulated eval datasets | Compounding asset |

## Rationale
Give away the **chunker + eval harness** (commodity primitives that build trust and recruit contributors); keep the **hosted, accurate, scaled engine + graph + rerank + governance** (the part that's hard to run and improves with data). Publishing the eval harness also lets us credibly publish accuracy scores — a unique GTM/sales asset.

## Licensing
OSS Apache-2.0; engine commercial; source-available/escrow for Enterprise on request; CLA for contributors.

## Community
Public roadmap for OSS chunker/grammars/evals; "add your language" is a great contributor on-ramp; OSS repos double as build-in-public surface. The public OSS-repo demo is open-data marketing, not a code giveaway of the moat.

## Risk: fork
The chunker alone isn't the business — accuracy at scale (graph + rerank + tuned retrieval + hosted ops + eval data) is. We open the on-ramp, keep the compound.

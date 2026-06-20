# Codebase Intelligence — OBSERVABILITY

Shared pillars with contextos/OBSERVABILITY.md; project-specific signals below. Stack: OTel → Prometheus/Grafana; Sentry; structured logs.

## Metrics
**System:** request rate, latency p50/95/99, error rate, **index job duration/throughput**, queue depth, reindex lag.
**Retrieval/quality:** retrieval recall@k (sampled), rerank impact, **answer faithfulness score** (sampled), citation-correctness rate, "I don't know" rate, low-confidence rate.
**AI cost:** tokens + **cost per query**, cost per indexed repo, embedding cost, cache hit rate, model mix.
**Product:** repos connected, queries/day, activation (first useful answer), WAU/MAU, top questions, knowledge-gap hits.
**Business:** signups, free→paid, MRR, API usage revenue, churn.

## Logs
Structured (request/org/repo id, latency, cost); AI call logs (model, tokens, cost, cache, redacted I/O); index job logs (files parsed, chunks, errors). Correlated to traces. No secrets/PII.

## Traces
Full request spans: gateway → search (vector+lexical+graph) → rerank → LLM → response. Index pipeline spans: clone → parse → chunk → embed → graph. AI spans carry tokens/cost/cache/retrieval-k. Tail sampling keeps errors + slow + expensive.

## Dashboards
| Dashboard | Shows |
|-----------|-------|
| System | latency, errors, index throughput, queue |
| Retrieval quality | recall, faithfulness, citation correctness, "don't know" rate trend |
| AI cost | cost/query, cost/repo, cache hit, margin |
| Product usage | repos, queries, activation, top questions, gaps |
| Business | funnel + MRR + API revenue |

## Alerts
Latency/error SLO breaches; index job failures; **quality regression** (faithfulness drop from live sampling or CI evals); cost anomalies (per repo/org); provider outage (→ failover); cross-tenant access attempt.

## Quality observability (the differentiator)
- Live answers sampled into eval pipeline (LLM-as-judge faithfulness + deterministic citation checks) + thumbs feedback.
- Track per-language and per-repo-size quality (where does accuracy degrade?).
- "Show retrieved code" debug view for any answer.
- Published eval scores (GTM trust).

## SLOs
Answer first-token < 1.5s, p95 < 4s; index 100k LOC < 10 min; incremental reindex < 1 min (small push); faithfulness above threshold; gross margin > 70%.

## Rule
No answer ships without citation + cost attribution + a trace. Quality is measured continuously, not assumed.

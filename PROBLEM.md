# Codebase Intelligence — PROBLEM

## Core problem
**Codebases are too big and too tangled for anyone — human or AI — to fully understand.** Knowledge lives in senior engineers' heads and scattered, stale docs. Understanding code is slow, risky, and doesn't scale.

## The pains (mechanism + cost)
| Pain | What happens | Cost |
|------|--------------|------|
| **Onboarding delays** | New devs spend weeks reading code + interrupting seniors | 2–8 weeks ramp; senior interrupt tax |
| **Context loss** | Nobody remembers why code is the way it is; tribal knowledge walks out | Repeated mistakes, fear of change |
| **Poor/stale documentation** | Docs lie or don't exist; AI grounds on nothing | Wrong decisions, hallucinated AI output |
| **Risky changes** | "What breaks if I touch this?" is unanswerable | Regressions, incidents, slow refactors |
| **Shallow AI answers** | Generic AI doesn't know *your* code; naive RAG misses cross-file logic | Low trust, low adoption |
| **Search that doesn't understand** | Keyword search misses meaning; semantic-only misses identifiers | Time lost hunting code |

## Why existing tools fall short
- **Sourcegraph/Cody:** powerful but heavy, enterprise-priced, complex to adopt.
- **Editor `@codebase` (Cursor):** per-user, editor-bound, not a shared platform/API.
- **GitHub code search + Copilot:** shallow understanding; weak cross-repo/cross-file reasoning.
- **Generic "chat with repo" tools:** naive chunking, no graph, no rerank, no evals → mediocre answers, no trust.

The gap: a **team-grade, API/MCP-first, deeply-accurate** code-understanding engine that's lighter to adopt than Sourcegraph but far deeper than editor indexes. (See COMPETITOR_ANALYSIS.md.)

## Root cause
RAG-over-code is hard and under-invested: code isn't prose (identifiers, structure, cross-file dependencies, constant change). Most tools apply prose-RAG techniques to code and get mediocre results. Doing it *well* (AST chunking + hybrid retrieval + symbol-graph expansion + re-ranking + evals) is the differentiator few bother with.

## Validation signals
- Explosion of "talk to your codebase" products = demand is real.
- Persistent complaints about onboarding, stale docs, fear of refactoring.
- Teams adopting AI coding tools immediately hit "the AI doesn't understand our codebase."
- IDEs hard-coding `@codebase` features = the market validating the need.

## Success = problem solved
- Any developer/agent gets accurate, cited answers about the codebase in seconds.
- Onboarding drops from weeks to days.
- "What breaks if I change X?" is answerable before you change it.
- Docs and architecture maps stay current automatically.
- Adoption is fast (connect a repo, get value in minutes) and answers are trusted (citations, "I don't know").

## The wedge
MVP solves the loudest, most demoable pain: **connect a repo → ask a question → get a grounded, cited answer**, plus an auto-generated repo summary. Depth (graph, rerank, evals) is what makes the answers trustworthy enough to pay for.

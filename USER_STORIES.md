# Codebase Intelligence — USER STORIES

100+ stories. Personas: **Dev**, **NewHire**, **Lead**, **Architect**, **Agent**, **Admin**, **Sec**, **Agency**, **APIuser** (builds on our API/MCP). Tags `[MVP|V1|V2|V3]`.

## Epic A — Connect & Index
1. As a Dev, I want to connect a GitHub repo in one click, so that indexing starts immediately. [MVP]
2. As a Dev, I want to see indexing progress, so that I know when it's ready. [MVP]
3. As a Dev, I want indexing to be incremental on push, so that the index stays current cheaply. [MVP]
4. As a Lead, I want to connect multiple repos, so that our whole system is searchable. [V1]
5. As an Admin, I want to choose which branches/paths are indexed, so that noise is excluded. [V1]
6. As a Dev, I want private repos handled securely, so that my code is safe. [MVP]
7. As a Lead, I want to connect GitLab/Bitbucket too, so that we're not GitHub-locked. [V2]
8. As a Dev, I want large monorepos handled, so that scale isn't a blocker. [V1]
9. As an Admin, I want to disconnect/delete a repo and its index, so that I control data. [MVP]
10. As a Dev, I want re-index to only touch changed files, so that it's fast and cheap. [MVP]

## Epic B — Search
11. As a Dev, I want semantic search by meaning, so that I find code without exact terms. [MVP]
12. As a Dev, I want keyword/identifier search, so that I find exact symbols like `getUserById`. [MVP]
13. As a Dev, I want hybrid results ranked well, so that the best match is on top. [MVP]
14. As a Dev, I want to filter by path/language/module, so that I scope my search. [V1]
15. As a Dev, I want results to show file:line + snippet, so that I jump straight to code. [MVP]
16. As a Dev, I want to search across multiple repos, so that I find cross-service code. [V1]
17. As a Dev, I want recent/most-relevant ordering options, so that I control ranking. [V1]
18. As a Dev, I want to search comments/docs too, so that intent is findable. [V1]

## Epic C — Q&A (grounded)
19. As a Dev, I want to ask "how does authentication work here?", so that I understand a subsystem. [MVP]
20. As a Dev, I want answers with file:line citations, so that I can verify them. [MVP]
21. As a Dev, I want "I don't know" when the answer isn't in the code, so that I trust it. [MVP]
22. As a Dev, I want to ask follow-ups in context, so that I can drill in. [V1]
23. As a NewHire, I want to ask "where do I start to add feature X?", so that I orient fast. [V1]
24. As a Dev, I want multi-file/cross-function answers, so that complex logic is explained. [V1]
25. As a Dev, I want to ask "why is this code here?" using git/PR history, so that I learn intent. [V2]
26. As a Dev, I want the cheapest adequate model used, so that my costs stay low. [MVP]
27. As a Dev, I want streamed answers, so that I'm not waiting. [MVP]
28. As a Dev, I want to see exactly what code was used to answer, so that there are no surprises. [V1]
29. As an Architect, I want to ask "how do services A and B communicate?", so that I understand integration. [V1]
30. As a Dev, I want to ask about a specific function's behavior/edge cases, so that I use it correctly. [V1]

## Epic D — Documentation
31. As a Dev, I want an auto-generated repo summary, so that I grasp it in minutes. [MVP]
32. As a Lead, I want living per-module docs that update on change, so that docs never go stale. [V1]
33. As a Dev, I want function/class docs generated from code+comments, so that I don't write them. [V1]
34. As an Architect, I want auto architecture diagrams, so that the system is visual. [V1]
35. As a Lead, I want docs exported to Markdown/Confluence, so that they live where the team looks. [V2]
36. As a NewHire, I want a "learning path" through the codebase, so that I ramp in order. [V2]
37. As a Dev, I want doc drift flagged when code changes without doc updates, so that we stay honest. [V2]
38. As a Lead, I want a "knowledge gaps" report (undocumented hot code), so that we prioritize docs. [V1]

## Epic E — Structure & Impact
39. As a Dev, I want to see callers/callees of a function, so that I understand usage. [V1]
40. As a Dev, I want "what breaks if I change this?" impact analysis, so that I refactor safely. [V1]
41. As an Architect, I want a dependency graph of modules/services, so that I see coupling. [V1]
42. As a Dev, I want to find dead/unused code, so that I can clean up. [Future]
43. As a Dev, I want to see test coverage gaps for a change's blast radius, so that I test the right things. [Future]
44. As an Architect, I want cross-repo dependency mapping, so that microservice impact is visible. [V3]
45. As a Dev, I want to trace a request's code path end-to-end, so that I debug faster. [V2]

## Epic F — Teams & Collaboration
46. As a Lead, I want to share the indexed codebase with the team, so that everyone benefits. [V1]
47. As an Admin, I want RBAC on repos, so that access matches policy. [V1]
48. As a Dev, I want to share an answer/link with a teammate, so that knowledge spreads. [V1]
49. As a Lead, I want to see top questions asked, so that I find documentation gaps. [V1]
50. As an Agency, I want to onboard a contractor to client code instantly, so that ramp is fast. [V1]
51. As a Dev, I want to save/bookmark answers, so that I reuse them. [V1]
52. As a Lead, I want usage reporting per repo/team, so that I measure value. [V1]

## Epic G — API / MCP (engine as a product)
53. As an APIuser, I want a REST API to ask the codebase, so that I build on it. [V2]
54. As an APIuser, I want an MCP server, so that my agent can query the codebase. [V2]
55. As an APIuser, I want search + Q&A + impact endpoints, so that I get full capability. [V2]
56. As an APIuser, I want webhooks on reindex, so that I react to changes. [V2]
57. As an APIuser, I want usage-based billing, so that costs match value. [V2]
58. As an Agent, I want `ask_codebase` and `search_code` tools, so that I act with real understanding. [V2]
59. As an APIuser, I want SDKs (TS/Python), so that integration is easy. [V2]
60. As an APIuser, I want rate limits + keys, so that access is controlled. [V2]

## Epic H — Agents
61. As a Dev, I want a codebase Q&A agent for multi-hop questions, so that complex queries resolve. [V2]
62. As a Lead, I want a PR review agent that flags impact/convention issues, so that reviews improve. [V2]
63. As a Lead, I want to see the agent's reasoning/trajectory, so that I trust it. [V2]
64. As a Dev, I want agents read-only by default, so that they can't damage code. [V2]
65. As a Dev, I want the agent to cite sources, so that I verify. [V2]

## Epic I — Governance, Security, Cost
66. As a Sec, I want assurance code never trains any model, so that I can approve it. [MVP] (D-010)
67. As a Sec, I want tenant isolation of indexes, so that no cross-customer leakage. [MVP]
68. As a Sec, I want an audit log of access/queries, so that we can investigate. [V1]
69. As an Admin, I want spend caps per repo/team, so that costs are bounded. [V1]
70. As a Sec, I want secrets in code redacted/never embedded, so that we don't leak keys. [MVP]
71. As a Sec, I want SSO and on-prem options, so that enterprise policy is met. [V3]
72. As a Sec, I want compliance exports (SOC2), so that audits are easy. [V3]
73. As an Admin, I want data residency control, so that we meet jurisdiction rules. [V3]
74. As a Dev, I want per-query cost shown, so that I'm cost-aware. [MVP]
75. As a Lead, I want a cost dashboard, so that I manage spend vs. value. [V1]

## Epic J — Quality & Trust
76. As a Dev, I want to rate answers, so that the system improves. [MVP]
77. As a Lead, I want answer-quality trends, so that I know it's reliable. [V1]
78. As a Dev, I want citations to be clickable to the exact lines, so that verification is instant. [MVP]
79. As a Dev, I want the system to refuse to guess, so that I never act on a hallucination. [MVP]
80. As a Lead, I want eval scores published, so that I trust the product's accuracy claims. [V1]

## Epic K — Billing & Plans
81. As a Dev, I want a free tier (1 repo, limited queries), so that I can evaluate. [MVP]
82. As a Dev, I want self-serve Pro, so that I unlock more. [MVP]
83. As a Lead, I want per-seat or per-repo Team pricing, so that scaling is simple. [V1]
84. As an APIuser, I want usage-based API pricing, so that I pay for what I use. [V2]
85. As an Admin, I want Enterprise invoicing, so that procurement works. [V3]

## Epic L — Reliability & Ops
86. As a Dev, I want fast answers (p95 < 4s), so that it fits my flow. [MVP]
87. As a Dev, I want graceful behavior if a provider is down, so that I'm not blocked. [V1]
88. As a Lead, I want an uptime SLA, so that we can depend on it. [V3]
89. As a Dev, I want reindex to never lose my data, so that I trust it. [MVP]
90. As a Dev, I want huge files/repos handled without timeouts, so that scale works. [V1]

## Epic M — Onboarding-specific
91. As a NewHire, I want a guided tour of the architecture, so that I understand the big picture. [V2]
92. As a NewHire, I want to ask "who owns this code?" (from git), so that I know whom to ask. [V2]
93. As a NewHire, I want a glossary of domain terms found in code, so that I learn the language. [V2]
94. As a Lead, I want onboarding time measured before/after, so that I prove ROI. [V1]
95. As an Agency, I want a "codebase briefing" doc generated per client, so that handoffs are fast. [V1]

## Epic N — Search/answer UX
96. As a Dev, I want a fast command-palette search, so that it's frictionless. [V1]
97. As a Dev, I want syntax-highlighted snippets, so that results are readable. [MVP]
98. As a Dev, I want to open results in my editor (deep link), so that I act immediately. [V1]
99. As a Dev, I want answer history, so that I revisit prior queries. [V1]
100. As a Dev, I want a browser extension / IDE panel, so that I query without leaving code. [Future]
101. As a Dev, I want to ask about a pasted snippet ("explain this"), so that I understand fast. [V1]
102. As a Dev, I want comparison answers ("difference between these two implementations"), so that I choose well. [V2]

---
*Drives [TASKS.md](./TASKS.md) / [SPRINTS.md](./SPRINTS.md). MVP scope = stories tagged [MVP].*

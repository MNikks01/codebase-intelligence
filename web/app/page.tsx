"use client";

import { useState } from "react";

type Chunk = {
  path: string;
  startLine: number;
  endLine: number;
  symbol: string | null;
  score: number;
  snippet: string;
};
type Indexed = { indexId: string; files: number; chunks: number; fileList: string[] };
type AskResult = { grounded: boolean; answer: string | null; chunks: Chunk[] };

export default function Home() {
  const [indexed, setIndexed] = useState<Indexed | null>(null);
  const [question, setQuestion] = useState("where is authentication handled?");
  const [result, setResult] = useState<AskResult | null>(null);
  const [busy, setBusy] = useState<"" | "index" | "ask">("");
  const [error, setError] = useState("");

  async function indexDemo() {
    await doIndex(() =>
      fetch("/api/index", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ demo: true }) }),
    );
  }
  async function indexZip(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("repo", file);
    await doIndex(() => fetch("/api/index", { method: "POST", body: form }));
  }
  async function doIndex(call: () => Promise<Response>) {
    setError("");
    setResult(null);
    setIndexed(null);
    setBusy("index");
    try {
      const res = await call();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Indexing failed");
      setIndexed(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  async function ask() {
    if (!indexed) return;
    setError("");
    setBusy("ask");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ indexId: indexed.indexId, question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Ask failed");
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Codebase Intelligence</h1>
      <p className="mt-2 text-zinc-500">
        Ask questions about a codebase and get answers grounded in the actual code, with{" "}
        <code className="text-sm">file:line</code> citations. Hybrid retrieval (vector + lexical) + re-ranking. No keys
        needed for search; set an LLM key for written answers.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium">1. Index a repo</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={indexDemo}
            disabled={busy === "index"}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {busy === "index" ? "Indexing…" : "Try a demo repo"}
          </button>
          <span className="text-sm text-zinc-400">or upload a .zip of your repo:</span>
          <input type="file" accept=".zip" onChange={indexZip} disabled={busy === "index"} className="text-xs" />
        </div>
        {indexed && (
          <p className="mt-3 text-sm text-emerald-600">
            ✓ Indexed {indexed.files} files → {indexed.chunks} chunks.
          </p>
        )}
      </section>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {indexed && (
        <section className="mt-8">
          <h2 className="text-sm font-medium">2. Ask</h2>
          <div className="mt-2 flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="how does X work? where is Y handled?"
            />
            <button
              onClick={ask}
              disabled={busy === "ask"}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {busy === "ask" ? "…" : "Ask"}
            </button>
          </div>
        </section>
      )}

      {result && (
        <section className="mt-6">
          {result.grounded ? (
            <div className="rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
              <div className="mb-1 text-xs font-medium text-zinc-500">Answer</div>
              <div className="whitespace-pre-wrap">{result.answer}</div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">
              Retrieval-only (no LLM key set). Showing the most relevant code — set <code>ANTHROPIC_API_KEY</code> for a
              written answer.
            </p>
          )}
          <div className="mt-3 space-y-3">
            {result.chunks.map((c) => (
              <div key={`${c.path}:${c.startLine}`} className="rounded-md border border-zinc-200 dark:border-zinc-800">
                <div className="border-b border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800">
                  {c.path}:{c.startLine}-{c.endLine}
                  {c.symbol ? ` · ${c.symbol}` : ""} · score {c.score}
                </div>
                <pre className="max-h-64 overflow-auto p-3 text-xs">{c.snippet}</pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

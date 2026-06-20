// In-memory store of built indexes, keyed by indexId, with simple LRU eviction.
// Dev/MVP only — production persists embeddings in pgvector keyed by repo.

import { CodebaseIndex } from "@/lib/engine/index";

const MAX_INDEXES = 20;
const g = globalThis as unknown as { __ciIndexes?: Map<string, { index: CodebaseIndex; at: number }> };

function store() {
  if (!g.__ciIndexes) g.__ciIndexes = new Map();
  return g.__ciIndexes;
}

export function putIndex(id: string, index: CodebaseIndex): void {
  const m = store();
  m.set(id, { index, at: Date.now() });
  if (m.size > MAX_INDEXES) {
    const oldest = [...m.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    if (oldest) m.delete(oldest[0]);
  }
}

export function getIndex(id: string): CodebaseIndex | null {
  const e = store().get(id);
  if (e) e.at = Date.now();
  return e?.index ?? null;
}

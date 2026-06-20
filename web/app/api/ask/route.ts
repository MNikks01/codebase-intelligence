import { NextResponse } from "next/server";
import { getIndex } from "@/lib/engine-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { indexId, question } = await req.json().catch(() => ({}) as { indexId?: string; question?: string });
  if (!indexId || !question) {
    return NextResponse.json({ error: { message: "indexId and question are required." } }, { status: 400 });
  }
  const index = getIndex(indexId);
  if (!index) {
    return NextResponse.json(
      { error: { code: "index_expired", message: "Index not found (server restarted or evicted). Re-index the repo." } },
      { status: 404 },
    );
  }

  const result = await index.ask(question, 8);
  return NextResponse.json({
    grounded: result.grounded,
    answer: result.answer ?? null,
    chunks: result.chunks.map((c) => ({
      path: c.path,
      startLine: c.startLine,
      endLine: c.endLine,
      symbol: c.symbol ?? null,
      score: Number(c.score.toFixed(3)),
      snippet: c.content.split("\n").slice(0, 18).join("\n"),
    })),
  });
}

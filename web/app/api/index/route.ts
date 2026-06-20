import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { CodebaseIndex } from "@/lib/engine/index";
import { filesFromZip } from "@/lib/zip";
import { DEMO_CORPUS } from "@/lib/demo-corpus";
import { putIndex } from "@/lib/engine-store";
import type { FileDoc } from "@/lib/engine/types";

export const runtime = "nodejs";

const MAX_ZIP_BYTES = 20_000_000; // 20MB

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let docs: FileDoc[];

  try {
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      if (!body?.demo) {
        return NextResponse.json({ error: { message: "Send a .zip (multipart) or { demo: true }." } }, { status: 400 });
      }
      docs = DEMO_CORPUS;
    } else {
      const form = await req.formData();
      const file = form.get("repo");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: { message: "Upload a .zip file as field 'repo'." } }, { status: 400 });
      }
      if (file.size > MAX_ZIP_BYTES) {
        return NextResponse.json({ error: { message: "Zip too large (20MB max)." } }, { status: 413 });
      }
      docs = await filesFromZip(new Uint8Array(await file.arrayBuffer()));
    }
  } catch {
    return NextResponse.json({ error: { message: "Could not read the upload (is it a valid .zip?)." } }, { status: 400 });
  }

  if (docs.length === 0) {
    return NextResponse.json({ error: { message: "No supported code files found in the repo." } }, { status: 400 });
  }

  const index = new CodebaseIndex();
  const stats = await index.indexDocs(docs);
  const indexId = randomUUID();
  putIndex(indexId, index);

  return NextResponse.json({
    indexId,
    files: stats.files,
    chunks: stats.chunks,
    fileList: docs.map((d) => d.path).slice(0, 300),
  });
}

// A tiny sample repo so users can try the engine without uploading anything.
import type { FileDoc } from "@/lib/engine/types";

function doc(path: string, language: string, content: string): FileDoc {
  return { path, language, content, sizeBytes: Buffer.byteLength(content) };
}

export const DEMO_CORPUS: FileDoc[] = [
  doc(
    "src/auth.ts",
    "typescript",
    `import { findUserByToken } from "./db";

// Authentication: verify a bearer token and return the user, or null.
export async function verifyToken(token: string) {
  if (!token) return null;
  return findUserByToken(token);
}

// Express-style middleware that requires a valid auth token.
export async function requireAuth(req: any, res: any, next: any) {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const user = await verifyToken(token);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  req.user = user;
  next();
}
`,
  ),
  doc(
    "src/db.ts",
    "typescript",
    `// Minimal in-memory data layer for the demo.
const users = new Map<string, { id: string; token: string }>();
const orders = new Map<string, any>();

export async function findUserByToken(token: string) {
  for (const u of users.values()) if (u.token === token) return u;
  return null;
}

export async function insertOrder(order: any) {
  orders.set(order.id, order);
  return order;
}

export async function findOrderById(id: string) {
  return orders.get(id) ?? null;
}
`,
  ),
  doc(
    "src/orders.ts",
    "typescript",
    `import { insertOrder, findOrderById } from "./db";

// Create a new order for the authenticated user.
export async function createOrder(userId: string, items: any[]) {
  const order = { id: crypto.randomUUID(), userId, items, status: "pending", createdAt: Date.now() };
  await insertOrder(order);
  return order;
}

// Fetch a single order by id.
export async function getOrder(id: string) {
  return findOrderById(id);
}
`,
  ),
  doc(
    "src/server.ts",
    "typescript",
    `import { requireAuth } from "./auth";
import { createOrder, getOrder } from "./orders";

// Wire up the HTTP routes for the orders service.
export function registerRoutes(app: any) {
  app.post("/orders", requireAuth, async (req: any, res: any) => {
    const order = await createOrder(req.user.id, req.body.items);
    res.json(order);
  });
  app.get("/orders/:id", requireAuth, async (req: any, res: any) => {
    const order = await getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "not found" });
    res.json(order);
  });
}
`,
  ),
  doc(
    "README.md",
    "markdown",
    `# Orders Service (demo)

A tiny example service with auth middleware, an in-memory data layer, and order endpoints.
Try asking about how a feature works — the engine answers from the actual source with citations.
`,
  ),
];

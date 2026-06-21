// A tiny sample repo so users can try the engine without uploading anything.
import type { FileDoc } from "@/lib/engine/types";

function doc(path: string, language: string, content: string): FileDoc {
  return { path, language, content, sizeBytes: Buffer.byteLength(content) };
}

export const DEMO_CORPUS: FileDoc[] = [
  doc(
    "src/auth.ts",
    "typescript",
    `import { findUserByToken, type User } from "./db";

interface AuthRequest { headers: { authorization?: string }; user?: User }
interface HttpResponse { status(code: number): HttpResponse; json(body: unknown): void }

// Authentication: verify a bearer token and return the user, or null.
export async function verifyToken(token: string): Promise<User | null> {
  if (!token) return null;
  return findUserByToken(token);
}

// Middleware that requires a valid auth token.
export async function requireAuth(req: AuthRequest, res: HttpResponse, next: () => void) {
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
export interface User { id: string; token: string }
export interface Order { id: string; userId: string; items: unknown[]; status: string; createdAt: number }

const users = new Map<string, User>();
const orders = new Map<string, Order>();

export async function findUserByToken(token: string): Promise<User | null> {
  for (const u of users.values()) if (u.token === token) return u;
  return null;
}

export async function insertOrder(order: Order): Promise<Order> {
  orders.set(order.id, order);
  return order;
}

export async function findOrderById(id: string): Promise<Order | null> {
  return orders.get(id) ?? null;
}
`,
  ),
  doc(
    "src/orders.ts",
    "typescript",
    `import { insertOrder, findOrderById, type Order } from "./db";

// Create a new order for the authenticated user.
export async function createOrder(userId: string, items: unknown[]): Promise<Order> {
  const order: Order = { id: crypto.randomUUID(), userId, items, status: "pending", createdAt: Date.now() };
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

type Handler = (req: { user: { id: string }; body: { items: unknown[] }; params: { id: string } }, res: { json(b: unknown): void; status(c: number): { json(b: unknown): void } }) => unknown;
interface App { post(path: string, ...handlers: Handler[]): void; get(path: string, ...handlers: Handler[]): void }

// Wire up the HTTP routes for the orders service.
export function registerRoutes(app: App) {
  app.post("/orders", requireAuth as unknown as Handler, async (req, res) => {
    const order = await createOrder(req.user.id, req.body.items);
    res.json(order);
  });
  app.get("/orders/:id", requireAuth as unknown as Handler, async (req, res) => {
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

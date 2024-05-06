import { logger } from "hono/logger";
import { prisma } from "./db/prismaClient";
import { Hono } from "hono";
import foldersRouter from "./routes/folders/folder.routes";

const app = new Hono().basePath("/api");

app.use("*", logger());
app.route("/folder", foldersRouter);

try {
  await prisma.$connect();
  Bun.serve({ fetch: app.fetch, port: Bun.env.PORT || 4000 });
} catch (error) {
  console.error("Failed to connect to the database");
  console.error(error);
}

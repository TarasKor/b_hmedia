import { logger } from "hono/logger";
import { prisma } from "./db/prismaClient";
import * as Minio from "minio";
import { Hono } from "hono";
import musicFoldersRouter from "./routes/musicFolders/musicFolder.routes";
import musicFilesRouter from "./routes/musicFiles/musicFiles.routes";

const app = new Hono().basePath("/api");
export const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: Bun.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: Bun.env.MINIO_SECRET_KEY || "minioadmin",
});

app.use("*", logger());
app.route("m/folder", musicFoldersRouter);
app.route("m/file", musicFilesRouter);

try {
  await prisma.$connect();
  Bun.serve({ fetch: app.fetch, port: Bun.env.PORT || 4000 });
} catch (error) {
  console.error("Failed to connect to the database");
  console.error(error);
}

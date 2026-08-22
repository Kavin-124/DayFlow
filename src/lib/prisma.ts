import { PrismaClient } from "@prisma/client";
import path from "path";

// Normalize Windows backslashes to forward slashes for SQLite URI format
const dbPath = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
const sqliteUrl = `file:${dbPath}`;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: sqliteUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import path from "path";

// Normalize Windows/Linux path for SQLite file URI
const dbPath = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
const sqliteUrl = process.env.DATABASE_URL || `file:${dbPath}`;

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

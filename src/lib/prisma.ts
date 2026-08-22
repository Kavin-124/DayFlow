import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

// Locate dev.db path dynamically for local dev vs Vercel Serverless Function
let dbPath = path.join(process.cwd(), "prisma", "dev.db");
if (!fs.existsSync(dbPath)) {
  const fallbackPath = path.join(process.cwd(), "dev.db");
  if (fs.existsSync(fallbackPath)) {
    dbPath = fallbackPath;
  }
}

const sqliteUrl = process.env.DATABASE_URL || `file:${dbPath.replace(/\\/g, "/")}`;

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

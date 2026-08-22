import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

let dbPath = path.join(process.cwd(), "prisma", "dev.db");

if (isVercel) {
  // On Vercel Serverless Functions, copy bundled SQLite db to writable /tmp folder
  const tmpDbPath = "/tmp/dev.db";
  try {
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tmpDbPath);
    }
    if (fs.existsSync(tmpDbPath)) {
      dbPath = tmpDbPath;
      fs.chmodSync(tmpDbPath, 0o666);
    }
  } catch (e) {
    console.error("Vercel /tmp db copy error:", e);
  }
} else {
  // Local environment permission check
  try {
    const dbDir = path.join(process.cwd(), "prisma");
    if (fs.existsSync(dbPath)) {
      fs.chmodSync(dbPath, 0o666);
    }
    if (fs.existsSync(dbDir)) {
      fs.chmodSync(dbDir, 0o777);
    }
  } catch (e) {}
}

const sqliteUrl = `file:${dbPath.replace(/\\/g, "/")}`;

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

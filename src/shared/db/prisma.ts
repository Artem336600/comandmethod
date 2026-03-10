import { PrismaClient } from "@prisma/client";
import { appConfig } from "@/src/shared/lib/config";
import { logger } from "@/src/shared/lib/logger";

const prismaLogger = logger.child({
  module: "shared/db/prisma"
});

declare global {
  var __commandMethodPrisma__: PrismaClient | undefined;
}

function createPrismaClient() {
  prismaLogger.debug("[prisma] Creating Prisma client", {
    nodeEnv: appConfig.nodeEnv
  });

  return new PrismaClient({
    log:
      appConfig.nodeEnv === "development"
        ? [
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" }
          ]
        : [{ emit: "stdout", level: "error" }]
  });
}

export const prisma = globalThis.__commandMethodPrisma__ ?? createPrismaClient();

if (appConfig.nodeEnv !== "production") {
  globalThis.__commandMethodPrisma__ = prisma;
}

export async function verifyDatabaseConnection() {
  prismaLogger.debug("[prisma] Verifying database connection", {
    databaseUrlConfigured: Boolean(appConfig.database.url)
  });

  try {
    await prisma.$connect();
    prismaLogger.info("[prisma] Database connection established");
    return true;
  } catch (error) {
    prismaLogger.error("[prisma] Database connection failed", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
  }
}

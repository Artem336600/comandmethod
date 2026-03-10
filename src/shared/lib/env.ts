import { z } from "zod";
import { logger } from "@/src/shared/lib/logger";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_NAME: z.string().min(1).default("CommandMethod"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must contain at least 16 characters"),
  ENABLE_SECURE_COOKIES: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true")
});

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  APP_NAME: process.env.APP_NAME,
  APP_URL: process.env.APP_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DATABASE_URL:
    process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/commandmethod?schema=public",
  SESSION_SECRET: process.env.SESSION_SECRET ?? "change-me-to-a-long-random-secret-value",
  ENABLE_SECURE_COOKIES: process.env.ENABLE_SECURE_COOKIES ?? "false"
};

const parsedEnv = EnvSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  logger.error("[env] Invalid environment configuration", {
    issues: parsedEnv.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  });
  throw new Error("Invalid environment configuration. Check server logs for details.");
}

export const env = parsedEnv.data;

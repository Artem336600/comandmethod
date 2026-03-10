import { env } from "@/src/shared/lib/env";
import { logger } from "@/src/shared/lib/logger";

export const appConfig = {
  appName: env.APP_NAME,
  appUrl: env.APP_URL,
  logLevel: env.LOG_LEVEL,
  nodeEnv: env.NODE_ENV,
  database: {
    url: env.DATABASE_URL
  },
  auth: {
    sessionCookieName: "commandmethod-session",
    enableSecureCookies: env.ENABLE_SECURE_COOKIES,
    sessionSecret: env.SESSION_SECRET
  },
  security: {
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    referrerPolicy: "strict-origin-when-cross-origin"
  }
} as const;

logger.info("[config] Loaded application configuration", {
  appName: appConfig.appName,
  appUrl: appConfig.appUrl,
  nodeEnv: appConfig.nodeEnv,
  logLevel: appConfig.logLevel,
  enableSecureCookies: appConfig.auth.enableSecureCookies
});

export function getPublicRuntimeConfig() {
  return {
    appName: appConfig.appName,
    appUrl: appConfig.appUrl,
    nodeEnv: appConfig.nodeEnv
  };
}

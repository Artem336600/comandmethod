import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { appConfig } from "@/src/shared/lib/config";
import { logger } from "@/src/shared/lib/logger";
import { APP_ROLES, type AppRole } from "@/src/shared/domain";

const sessionLogger = logger.child({
  module: "shared/auth/session"
});

const SessionPayloadSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  roles: z.array(z.enum(APP_ROLES)).min(1),
  iat: z.number().optional(),
  exp: z.number().optional()
});

export type AppSession = {
  userId: string;
  email: string;
  displayName: string;
  roles: AppRole[];
  issuedAt?: number;
  expiresAt?: number;
};

export type SessionIdentity = {
  email: string;
  displayName: string;
  roles: AppRole[];
};

function getSessionSecret() {
  return new TextEncoder().encode(appConfig.auth.sessionSecret);
}

export function getSessionCookieName() {
  return appConfig.auth.sessionCookieName;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: appConfig.auth.enableSecureCookies,
    maxAge: 60 * 60 * 12
  };
}

export async function createSessionToken(identity: SessionIdentity) {
  const sessionLoggerWithContext = sessionLogger.child({
    email: identity.email,
    roles: identity.roles
  });

  sessionLoggerWithContext.info("[auth] Creating session token");

  return new SignJWT({
    userId: crypto.randomUUID(),
    email: identity.email,
    displayName: identity.displayName,
    roles: identity.roles
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<AppSession | null> {
  sessionLogger.debug("[auth] Verifying session token");

  try {
    const verified = await jwtVerify(token, getSessionSecret());
    const payload = SessionPayloadSchema.parse(verified.payload);

    sessionLogger.info("[auth] Session token verified", {
      email: payload.email,
      roles: payload.roles
    });

    return {
      userId: payload.userId,
      email: payload.email,
      displayName: payload.displayName,
      roles: payload.roles,
      issuedAt: payload.iat,
      expiresAt: payload.exp
    };
  } catch (error) {
    sessionLogger.warn("[auth] Session token verification failed", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return null;
  }
}

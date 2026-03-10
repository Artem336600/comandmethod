import { cookies } from "next/headers";
import { logger } from "@/src/shared/lib/logger";
import { getSessionCookieName, verifySessionToken } from "@/src/shared/auth/session";

const serverSessionLogger = logger.child({
  module: "shared/auth/server-session"
});

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  serverSessionLogger.debug("[auth] Loading server session", {
    hasToken: Boolean(token)
  });

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

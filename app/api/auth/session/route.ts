import { NextResponse } from "next/server";
import { getServerSession } from "@/src/shared/auth";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("auth/api/session");

export async function GET() {
  logger.debug("[auth-session] Session lookup requested");

  const session = await getServerSession();

  if (!session) {
    logger.warn("[auth-session] No active session");
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  logger.info("[auth-session] Active session returned", {
    email: session.email
  });

  return NextResponse.json({
    authenticated: true,
    session
  });
}

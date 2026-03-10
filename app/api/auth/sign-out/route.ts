import { NextResponse } from "next/server";
import { createModuleLogger } from "@/src/shared/lib";
import { getSessionCookieName, getSessionCookieOptions } from "@/src/shared/auth";

const logger = createModuleLogger("auth/api/sign-out");

export async function POST(request: Request) {
  logger.info("[auth-sign-out] Sign-out request received");

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set(getSessionCookieName(), "", {
    ...getSessionCookieOptions(),
    maxAge: 0
  });

  return response;
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/src/shared/auth";
import { appConfig } from "@/src/shared/lib/config";
import { logger } from "@/src/shared/lib/logger";

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", appConfig.security.contentSecurityPolicy);
  response.headers.set("Referrer-Policy", appConfig.security.referrerPolicy);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (appConfig.auth.enableSecureCookies) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return response;
}

export function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const requestLogger = logger.child({
    requestId,
    method: request.method,
    pathname: request.nextUrl.pathname
  });

  requestLogger.debug("[middleware] Request entry", {
    search: request.nextUrl.search,
    secureCookies: appConfig.auth.enableSecureCookies
  });

  if (request.nextUrl.pathname.startsWith("/projects")) {
    const sessionToken = request.cookies.get(getSessionCookieName())?.value;

    requestLogger.debug("[middleware] Checking workspace session cookie", {
      hasSessionToken: Boolean(sessionToken)
    });

    if (!sessionToken) {
      requestLogger.warn("[middleware] Workspace access denied: missing session");
      return NextResponse.redirect(
        new URL(`/sign-in?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
      );
    }
  }

  const response = applySecurityHeaders(NextResponse.next());
  response.headers.set("x-request-id", requestId);

  requestLogger.info("[middleware] Response prepared", {
    status: response.status
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};

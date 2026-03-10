import { NextResponse } from "next/server";
import { appConfig, getPublicRuntimeConfig } from "@/src/shared/lib/config";
import { logger } from "@/src/shared/lib/logger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestLogger = logger.child({
    route: "/api/health",
    method: "GET"
  });

  requestLogger.debug("[health] Request received", {
    url: request.url,
    userAgent: request.headers.get("user-agent")
  });

  const response = NextResponse.json(
    {
      status: "ok",
      service: appConfig.appName,
      environment: getPublicRuntimeConfig().nodeEnv,
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );

  requestLogger.info("[health] Health check succeeded", {
    statusCode: response.status
  });

  return response;
}

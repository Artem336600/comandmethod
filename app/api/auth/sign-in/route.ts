import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionCookieOptions
} from "@/src/shared/auth";
import { createModuleLogger } from "@/src/shared/lib";
import { APP_ROLES } from "@/src/shared/domain";

const logger = createModuleLogger("auth/api/sign-in");

const SignInSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  role: z.enum(APP_ROLES).default("member"),
  next: z.string().default("/projects")
});

export async function POST(request: Request) {
  logger.debug("[auth-sign-in] Sign-in request received", {
    contentType: request.headers.get("content-type")
  });

  const formData = await request.formData();
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    displayName: formData.get("displayName"),
    role: formData.get("role"),
    next: formData.get("next")
  });

  if (!parsed.success) {
    logger.error("[auth-sign-in] Sign-in validation failed", {
      issues: parsed.error.issues.map((issue) => issue.message)
    });

    return NextResponse.redirect(new URL("/sign-in?error=validation", request.url), 303);
  }

  const token = await createSessionToken({
    email: parsed.data.email,
    displayName: parsed.data.displayName,
    roles: [parsed.data.role]
  });

  const response = NextResponse.redirect(new URL(parsed.data.next, request.url), 303);
  response.cookies.set(getSessionCookieName(), token, getSessionCookieOptions());

  logger.info("[auth-sign-in] Session issued", {
    email: parsed.data.email,
    next: parsed.data.next
  });

  return response;
}

import type { AppSession } from "@/src/shared/auth";
import { getPrimaryRoleLabel, hasWorkspaceAccess } from "@/src/shared/domain";
import { createModuleLogger } from "@/src/shared/lib";

const logger = createModuleLogger("projects/application/workspace-access");

export type WorkspaceAccessViewModel = {
  displayName: string;
  email: string;
  primaryRole: string;
};

export function buildWorkspaceAccessViewModel(session: AppSession): WorkspaceAccessViewModel {
  logger.info("[workspace-access] Validating workspace access", {
    email: session.email,
    roles: session.roles
  });

  if (!hasWorkspaceAccess(session.roles)) {
    logger.warn("[workspace-access] Workspace access denied", {
      email: session.email
    });
    throw new Error("Workspace access denied.");
  }

  return {
    displayName: session.displayName,
    email: session.email,
    primaryRole: getPrimaryRoleLabel(session.roles)
  };
}

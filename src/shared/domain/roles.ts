export const APP_ROLES = ["admin", "pm", "lead", "member", "viewer"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export function hasWorkspaceAccess(roles: AppRole[]) {
  return roles.length > 0;
}

export function getPrimaryRoleLabel(roles: AppRole[]) {
  return roles[0] ?? "viewer";
}

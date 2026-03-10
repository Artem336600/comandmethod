import type { AppRole } from "@/src/shared/domain";

export const BLOCK_ASSIGNMENT_ROLES = ["owner", "assignee", "reviewer", "watcher"] as const;

export const ASSIGNMENT_TARGET_TYPES = ["project", "block"] as const;

export type BlockAssignmentRole = (typeof BLOCK_ASSIGNMENT_ROLES)[number];
export type AssignmentTargetType = (typeof ASSIGNMENT_TARGET_TYPES)[number];
export type ProjectAssignmentRole = AppRole;
export type AssignmentRole = ProjectAssignmentRole | BlockAssignmentRole;

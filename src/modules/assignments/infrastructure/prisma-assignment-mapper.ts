import type {
  Assignment as PrismaAssignmentRecord,
  AssignmentRole as PrismaAssignmentRole,
  AssignmentTargetType as PrismaAssignmentTargetType
} from "@prisma/client";
import { Assignment, AssignmentTarget } from "@/src/modules/assignments/domain";

const ASSIGNMENT_ROLE_TO_DOMAIN: Record<
  PrismaAssignmentRole,
  "admin" | "pm" | "lead" | "member" | "viewer" | "owner" | "assignee" | "reviewer" | "watcher"
> = {
  ADMIN: "admin",
  PM: "pm",
  LEAD: "lead",
  MEMBER: "member",
  VIEWER: "viewer",
  OWNER: "owner",
  ASSIGNEE: "assignee",
  REVIEWER: "reviewer",
  WATCHER: "watcher"
};

const ASSIGNMENT_ROLE_TO_PERSISTENCE: Record<
  "admin" | "pm" | "lead" | "member" | "viewer" | "owner" | "assignee" | "reviewer" | "watcher",
  PrismaAssignmentRole
> = {
  admin: "ADMIN",
  pm: "PM",
  lead: "LEAD",
  member: "MEMBER",
  viewer: "VIEWER",
  owner: "OWNER",
  assignee: "ASSIGNEE",
  reviewer: "REVIEWER",
  watcher: "WATCHER"
};

export function mapAssignmentRecordToDomain(record: PrismaAssignmentRecord) {
  return Assignment.create({
    id: record.id,
    target:
      record.targetType === "BLOCK" && record.blockId
        ? AssignmentTarget.forBlock(record.projectId, record.blockId)
        : AssignmentTarget.forProject(record.projectId),
    role: ASSIGNMENT_ROLE_TO_DOMAIN[record.role],
    subjectUserId: record.subjectUserId,
    assignedByUserId: record.assignedByUserId,
    createdAt: record.createdAt,
    revokedAt: record.revokedAt
  });
}

export function mapAssignmentDomainToPersistence(assignment: Assignment) {
  return {
    id: assignment.id,
    projectId: assignment.target.projectId,
    blockId: assignment.target.type === "block" ? assignment.target.targetId : null,
    targetType: assignment.target.type === "block" ? "BLOCK" : "PROJECT",
    role: ASSIGNMENT_ROLE_TO_PERSISTENCE[assignment.role],
    subjectUserId: assignment.subjectUserId,
    assignedByUserId: assignment.assignedByUserId,
    createdAt: assignment.createdAt,
    revokedAt: assignment.revokedAt
  } satisfies {
    id: string;
    projectId: string;
    blockId: string | null;
    targetType: PrismaAssignmentTargetType;
    role: PrismaAssignmentRole;
    subjectUserId: string;
    assignedByUserId: string;
    createdAt: Date;
    revokedAt: Date | null;
  };
}

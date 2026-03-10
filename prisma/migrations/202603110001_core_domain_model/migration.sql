-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlockStatus" AS ENUM ('DRAFT', 'READY', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BlockKind" AS ENUM ('DELIVERABLE', 'MILESTONE', 'DECISION', 'REVIEW', 'RELEASE');

-- CreateEnum
CREATE TYPE "DependencyKind" AS ENUM ('FINISH_TO_START');

-- CreateEnum
CREATE TYPE "AssignmentTargetType" AS ENUM ('PROJECT', 'BLOCK');

-- CreateEnum
CREATE TYPE "AssignmentRole" AS ENUM ('ADMIN', 'PM', 'LEAD', 'MEMBER', 'VIEWER', 'OWNER', 'ASSIGNEE', 'REVIEWER', 'WATCHER');

-- CreateEnum
CREATE TYPE "AssignmentHistoryEventType" AS ENUM ('ASSIGNED', 'REVOKED');

-- CreateEnum
CREATE TYPE "BlockStatusHistoryEventType" AS ENUM ('STATUS_CHANGED', 'STATUS_BACKFILLED');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "startBlockId" TEXT,
    "finishBlockId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentBlockId" TEXT,
    "title" VARCHAR(180) NOT NULL,
    "summary" TEXT,
    "expectedResult" TEXT,
    "definitionOfDoneItems" TEXT[],
    "acceptanceCriteria" TEXT[],
    "ownerId" VARCHAR(191),
    "status" "BlockStatus" NOT NULL DEFAULT 'DRAFT',
    "blockerReason" TEXT,
    "blockerSource" VARCHAR(200),
    "unblockCondition" TEXT,
    "kind" "BlockKind" NOT NULL DEFAULT 'DELIVERABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependency" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "predecessorBlockId" TEXT NOT NULL,
    "successorBlockId" TEXT NOT NULL,
    "kind" "DependencyKind" NOT NULL DEFAULT 'FINISH_TO_START',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "blockId" TEXT,
    "targetType" "AssignmentTargetType" NOT NULL,
    "role" "AssignmentRole" NOT NULL,
    "subjectUserId" VARCHAR(191) NOT NULL,
    "assignedByUserId" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentHistory" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "blockId" TEXT,
    "targetType" "AssignmentTargetType" NOT NULL,
    "role" "AssignmentRole" NOT NULL,
    "subjectUserId" VARCHAR(191) NOT NULL,
    "changedByUserId" VARCHAR(191) NOT NULL,
    "eventType" "AssignmentHistoryEventType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "blockId" TEXT,
    "authorUserId" VARCHAR(191) NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockStatusHistory" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "fromStatus" "BlockStatus",
    "toStatus" "BlockStatus" NOT NULL,
    "changedByUserId" VARCHAR(191) NOT NULL,
    "eventType" "BlockStatusHistoryEventType" NOT NULL DEFAULT 'STATUS_CHANGED',
    "reason" TEXT,
    "blockerReason" TEXT,
    "blockerSource" VARCHAR(200),
    "unblockCondition" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_startBlockId_key" ON "Project"("startBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_finishBlockId_key" ON "Project"("finishBlockId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Block_projectId_status_idx" ON "Block"("projectId", "status");

-- CreateIndex
CREATE INDEX "Block_projectId_parentBlockId_idx" ON "Block"("projectId", "parentBlockId");

-- CreateIndex
CREATE INDEX "Block_ownerId_status_idx" ON "Block"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Dependency_projectId_idx" ON "Dependency"("projectId");

-- CreateIndex
CREATE INDEX "Dependency_predecessorBlockId_idx" ON "Dependency"("predecessorBlockId");

-- CreateIndex
CREATE INDEX "Dependency_successorBlockId_idx" ON "Dependency"("successorBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "Dependency_projectId_predecessorBlockId_successorBlockId_key" ON "Dependency"("projectId", "predecessorBlockId", "successorBlockId");

-- CreateIndex
CREATE INDEX "Assignment_projectId_targetType_role_revokedAt_idx" ON "Assignment"("projectId", "targetType", "role", "revokedAt");

-- CreateIndex
CREATE INDEX "Assignment_blockId_role_revokedAt_idx" ON "Assignment"("blockId", "role", "revokedAt");

-- CreateIndex
CREATE INDEX "Assignment_subjectUserId_revokedAt_idx" ON "Assignment"("subjectUserId", "revokedAt");

-- CreateIndex
CREATE INDEX "AssignmentHistory_assignmentId_occurredAt_idx" ON "AssignmentHistory"("assignmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "AssignmentHistory_projectId_eventType_occurredAt_idx" ON "AssignmentHistory"("projectId", "eventType", "occurredAt");

-- CreateIndex
CREATE INDEX "AssignmentHistory_blockId_eventType_occurredAt_idx" ON "AssignmentHistory"("blockId", "eventType", "occurredAt");

-- CreateIndex
CREATE INDEX "Comment_projectId_createdAt_idx" ON "Comment"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_blockId_createdAt_idx" ON "Comment"("blockId", "createdAt");

-- CreateIndex
CREATE INDEX "BlockStatusHistory_blockId_occurredAt_idx" ON "BlockStatusHistory"("blockId", "occurredAt");

-- CreateIndex
CREATE INDEX "BlockStatusHistory_toStatus_occurredAt_idx" ON "BlockStatusHistory"("toStatus", "occurredAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_startBlockId_fkey" FOREIGN KEY ("startBlockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_finishBlockId_fkey" FOREIGN KEY ("finishBlockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_parentBlockId_fkey" FOREIGN KEY ("parentBlockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_predecessorBlockId_fkey" FOREIGN KEY ("predecessorBlockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_successorBlockId_fkey" FOREIGN KEY ("successorBlockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentHistory" ADD CONSTRAINT "AssignmentHistory_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentHistory" ADD CONSTRAINT "AssignmentHistory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentHistory" ADD CONSTRAINT "AssignmentHistory_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockStatusHistory" ADD CONSTRAINT "BlockStatusHistory_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;


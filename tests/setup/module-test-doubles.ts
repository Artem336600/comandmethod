import {
  Assignment,
  AssignmentHistoryEntry,
  AssignmentTarget,
  type AssignmentHistoryRepository,
  type AssignmentRepository
} from "@/src/modules/assignments/domain";
import {
  Block,
  BlockStatusHistoryEntry,
  type BlockRepository,
  type BlockStatusHistoryRepository
} from "@/src/modules/blocks/domain";
import type {
  BlockStatusTransitionScope,
  BlockStatusTransitionUnitOfWork
} from "@/src/modules/blocks/application";
import { Comment, CommentTarget, type CommentRepository } from "@/src/modules/comments/domain";
import { BlockDependency, type GraphRepository } from "@/src/modules/graph/domain";
import type {
  AssignmentScope,
  AssignmentUnitOfWork
} from "@/src/modules/assignments/application";

export function createExecutableBlock(overrides: Partial<Parameters<typeof Block.create>[0]> = {}) {
  return Block.create({
    id: overrides.id ?? "block-1",
    projectId: overrides.projectId ?? "project-1",
    parentBlockId: overrides.parentBlockId ?? null,
    title: overrides.title ?? "Onboarding flow delivered",
    summary: overrides.summary ?? "Ship the onboarding flow for new teams.",
    expectedResult: overrides.expectedResult ?? "Teams can complete onboarding end-to-end.",
    definitionOfDone: overrides.definitionOfDone ?? ["QA approved", "Docs updated"],
    acceptanceCriteria: overrides.acceptanceCriteria ?? ["Tracks completion state"],
    ownerId: overrides.ownerId ?? "user-owner",
    status: overrides.status ?? "ready",
    blocker: overrides.blocker ?? null,
    kind: overrides.kind ?? "deliverable",
    createdAt: overrides.createdAt ?? new Date("2026-03-11T09:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2026-03-11T09:00:00.000Z")
  });
}

export class InMemoryGraphRepository implements GraphRepository {
  readonly dependencies: BlockDependency[] = [];

  async saveDependency(dependency: BlockDependency): Promise<void> {
    const existingIndex = this.dependencies.findIndex((item) => item.id === dependency.id);

    if (existingIndex >= 0) {
      this.dependencies.splice(existingIndex, 1, dependency);
      return;
    }

    this.dependencies.push(dependency);
  }

  async removeDependency(projectId: string, predecessorBlockId: string, successorBlockId: string): Promise<void> {
    const nextDependencies = this.dependencies.filter(
      (dependency) =>
        !(
          dependency.projectId === projectId &&
          dependency.predecessorBlockId === predecessorBlockId &&
          dependency.successorBlockId === successorBlockId
        )
    );

    this.dependencies.splice(0, this.dependencies.length, ...nextDependencies);
  }

  async listDependenciesByProjectId(projectId: string): Promise<BlockDependency[]> {
    return this.dependencies.filter((dependency) => dependency.projectId === projectId);
  }

  async findPath(projectId: string, fromBlockId: string, toBlockId: string): Promise<string[]> {
    const adjacency = new Map<string, string[]>();

    for (const dependency of this.dependencies.filter((item) => item.projectId === projectId)) {
      const successors = adjacency.get(dependency.predecessorBlockId) ?? [];
      successors.push(dependency.successorBlockId);
      adjacency.set(dependency.predecessorBlockId, successors);
    }

    const queue: Array<{ blockId: string; path: string[] }> = [{ blockId: fromBlockId, path: [fromBlockId] }];
    const visited = new Set<string>([fromBlockId]);

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        break;
      }

      if (current.blockId === toBlockId) {
        return current.path;
      }

      for (const successor of adjacency.get(current.blockId) ?? []) {
        if (visited.has(successor)) {
          continue;
        }

        visited.add(successor);
        queue.push({
          blockId: successor,
          path: [...current.path, successor]
        });
      }
    }

    return [];
  }
}

export class InMemoryBlockRepository implements BlockRepository {
  private readonly blocks = new Map<string, Block>();

  constructor(initialBlocks: Block[] = []) {
    for (const block of initialBlocks) {
      this.blocks.set(block.id, block);
    }
  }

  async save(block: Block): Promise<void> {
    this.blocks.set(block.id, block);
  }

  async findById(blockId: string): Promise<Block | null> {
    return this.blocks.get(blockId) ?? null;
  }

  async listByProjectId(projectId: string): Promise<Block[]> {
    return [...this.blocks.values()].filter((block) => block.projectId === projectId);
  }

  async listChildren(parentBlockId: string): Promise<Block[]> {
    return [...this.blocks.values()].filter((block) => block.parentBlockId === parentBlockId);
  }
}

export class InMemoryBlockStatusHistoryRepository implements BlockStatusHistoryRepository {
  readonly entries: BlockStatusHistoryEntry[] = [];

  async append(entry: BlockStatusHistoryEntry): Promise<void> {
    this.entries.push(entry);
  }

  async listByBlockId(blockId: string): Promise<BlockStatusHistoryEntry[]> {
    return this.entries.filter((entry) => entry.blockId === blockId);
  }
}

export class InMemoryBlockStatusTransitionUnitOfWork implements BlockStatusTransitionUnitOfWork {
  constructor(
    readonly blocks: InMemoryBlockRepository,
    readonly statusHistory: InMemoryBlockStatusHistoryRepository
  ) {}

  async run<T>(operation: (scope: BlockStatusTransitionScope) => Promise<T>): Promise<T> {
    return operation({
      blocks: this.blocks,
      statusHistory: this.statusHistory
    });
  }
}

export class InMemoryAssignmentRepository implements AssignmentRepository {
  private readonly assignments = new Map<string, Assignment>();

  constructor(initialAssignments: Assignment[] = []) {
    for (const assignment of initialAssignments) {
      this.assignments.set(assignment.id, assignment);
    }
  }

  async save(assignment: Assignment): Promise<void> {
    this.assignments.set(assignment.id, assignment);
  }

  async findById(assignmentId: string): Promise<Assignment | null> {
    return this.assignments.get(assignmentId) ?? null;
  }

  async listByTarget(target: AssignmentTarget): Promise<Assignment[]> {
    return [...this.assignments.values()].filter((assignment) => {
      if (assignment.target.type !== target.type) {
        return false;
      }

      return assignment.target.projectId === target.projectId && assignment.target.targetId === target.targetId;
    });
  }
}

export class InMemoryAssignmentHistoryRepository implements AssignmentHistoryRepository {
  readonly entries: AssignmentHistoryEntry[] = [];

  async append(entry: AssignmentHistoryEntry): Promise<void> {
    this.entries.push(entry);
  }

  async listByTarget(target: AssignmentTarget): Promise<AssignmentHistoryEntry[]> {
    return this.entries.filter(
      (entry) => entry.target.type === target.type && entry.target.targetId === target.targetId
    );
  }
}

export class InMemoryAssignmentUnitOfWork implements AssignmentUnitOfWork {
  constructor(
    readonly assignments: InMemoryAssignmentRepository,
    readonly assignmentHistory: InMemoryAssignmentHistoryRepository
  ) {}

  async run<T>(operation: (scope: AssignmentScope) => Promise<T>): Promise<T> {
    return operation({
      assignments: this.assignments,
      assignmentHistory: this.assignmentHistory
    });
  }
}

export class InMemoryCommentRepository implements CommentRepository {
  private readonly comments = new Map<string, Comment>();

  constructor(initialComments: Comment[] = []) {
    for (const comment of initialComments) {
      this.comments.set(comment.id, comment);
    }
  }

  async save(comment: Comment): Promise<void> {
    this.comments.set(comment.id, comment);
  }

  async findById(commentId: string): Promise<Comment | null> {
    return this.comments.get(commentId) ?? null;
  }

  async listByTarget(target: CommentTarget): Promise<Comment[]> {
    return [...this.comments.values()].filter(
      (comment) =>
        comment.target.type === target.type &&
        comment.target.projectId === target.projectId &&
        comment.target.targetId === target.targetId
    );
  }
}

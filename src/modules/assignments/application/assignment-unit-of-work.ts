import type {
  AssignmentHistoryRepository,
  AssignmentRepository
} from "@/src/modules/assignments/domain";

export type AssignmentScope = {
  assignments: AssignmentRepository;
  assignmentHistory: AssignmentHistoryRepository;
};

export interface AssignmentUnitOfWork {
  run<T>(operation: (scope: AssignmentScope) => Promise<T>): Promise<T>;
}

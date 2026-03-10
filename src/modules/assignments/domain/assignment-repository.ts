import { Assignment } from "./assignment";
import { AssignmentTarget } from "./assignment-target";

export interface AssignmentRepository {
  save(assignment: Assignment): Promise<void>;
  findById(assignmentId: string): Promise<Assignment | null>;
  listByTarget(target: AssignmentTarget): Promise<Assignment[]>;
}

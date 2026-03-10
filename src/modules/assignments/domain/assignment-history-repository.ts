import { AssignmentHistoryEntry } from "./assignment-history-entry";
import { AssignmentTarget } from "./assignment-target";

export interface AssignmentHistoryRepository {
  append(entry: AssignmentHistoryEntry): Promise<void>;
  listByTarget(target: AssignmentTarget): Promise<AssignmentHistoryEntry[]>;
}

import { assertMaxLength, assertNonEmptyStringList, assertUniqueTextList } from "@/src/shared/domain";

export class DefinitionOfDone {
  readonly items: string[];

  private constructor(items: string[]) {
    this.items = items;
  }

  static create(items: readonly string[]) {
    const normalized = assertNonEmptyStringList(items, "definitionOfDoneItems").map((item) =>
      assertMaxLength(item, "definitionOfDoneItem", 280)
    );

    return new DefinitionOfDone(assertUniqueTextList(normalized, "definitionOfDoneItems"));
  }
}

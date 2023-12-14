import { describe, expect, it } from "vitest";
import { parseSortByConstraint, SortByConstraint } from "./sort-by-constraint";

describe("parseSortByConstraint tests", () => {
  it("should parse array of strings to array of sort filter", () => {
    const queryValues = ["-createdAt", "updatedAt", "1"];

    const res = parseSortByConstraint(queryValues);

    expect(res).toEqual([
      new SortByConstraint("createdAt", -1),
      new SortByConstraint("updatedAt", 1),
      new SortByConstraint("1", 1),
    ]);
  });

  it("should parse comma seperated string to array of sort filter", () => {
    const queryValues = "-createdAt,updatedAt,1";

    const res = parseSortByConstraint(queryValues);

    expect(res).toEqual([
      new SortByConstraint("createdAt", -1),
      new SortByConstraint("updatedAt", 1),
      new SortByConstraint("1", 1),
    ]);
  });
});

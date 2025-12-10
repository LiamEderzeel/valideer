import { describe, expect, it } from "vitest";
import { parseNumberList } from "./number-list.js";

describe("parseNumberList tests", () => {
  it("should parse array of strings to array of numbers", () => {
    const queryValues = ["1.2", "2", "3.5", "1,2"];

    const res = parseNumberList(queryValues);

    expect(res).toEqual([1.2, 2, 3.5, 1]);
  });

  it("should parse comma separated string to array of numbers", () => {
    const queryValues = "1.2,2,3.5,1";

    const res = parseNumberList(queryValues);

    expect(res).toEqual([1.2, 2, 3.5, 1]);
  });
});

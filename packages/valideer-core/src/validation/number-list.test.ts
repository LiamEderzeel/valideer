import { describe, expect, it } from "vitest";
import { parseNumberList } from "./number-list";

describe("parseNumberList tests", () => {
  it("should parse array of strings to array of numbers", () => {
    const queryValues = ["1.2", "2", "3.5", "1,2"];

    const res = parseNumberList(queryValues);

    expect(res).toEqual([1.2, 2, 3.5, 1]);
  });

  it("should parse comma seperated string to array of numbers", () => {
    const queryValues = "1.2,2,3.5,1";

    const res = parseNumberList(queryValues);

    expect(res).toEqual([1.2, 2, 3.5, 1]);
  });
});

import { describe, expect, it } from "vitest";
import { parseIntList } from "./int-list";

describe("parseIntList tests", () => {
  it("should parse array of strings to array of ints", () => {
    const queryValues = ["1", "2", "200", "1.3", "3.5", "2.80"];

    const res = parseIntList(queryValues);

    expect(res).toEqual([1, 2, 200, 1, 3, 2]);
  });

  it("should parse comma seperated string to array of ints", () => {
    const queryValues = "1,2,200, 1.3, 3.5, 2.8";

    const res = parseIntList(queryValues);

    expect(res).toEqual([1, 2, 200, 1, 3, 2]);
  });

  it("should not parse array of strings", () => {
    const queryValues = ["not", "a", "number"];

    const res = parseIntList(queryValues);

    expect(res).toEqual([]);
  });

  it("should not parse comma seperated string of strings", () => {
    const queryValues = "not,a,number";

    const res = parseIntList(queryValues);

    expect(res).toEqual([]);
  });
});

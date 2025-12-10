import { describe, expect, it } from "vitest";
import { isStringArray } from "./is-string-array.js";

describe("parseStringArray tests", () => {
  it("should return true if array of strings", () => {
    const queryValues = ["avocado", "tommato", "bannana", "strawberry"];

    const res = isStringArray(queryValues);

    expect(res).toEqual(true);
  });

  it("should return false if comma seportated string", () => {
    const queryValues = "avocado,tommato,bannana,strawberry";

    const res = isStringArray(queryValues);

    expect(res).toEqual(false);
  });

  it("should return false if array contains non string values", () => {
    const queryValues = [1, false, "bannana", "strawberry"];

    const res = isStringArray(queryValues);

    expect(res).toEqual(false);
  });
});

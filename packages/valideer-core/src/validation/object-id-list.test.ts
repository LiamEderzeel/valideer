import { describe, expect, it } from "vitest";
import { parseDateList } from "./date-list";
import { parseObjectIdList } from "./object-id-list";

describe("parseObjectIdList tests", () => {
  it("should parse array of strings to array of ObjectIds", () => {
    {
      const queryValues = [
        "64b15d20b5c71e09650f5de5",
        "64b15d2cq5c71e09650f5de7",
      ];

      const res = parseObjectIdList(queryValues);

      expect(res).toEqual(["64b15d20b5c71e09650f5de5"]);
    }
    {
      const queryValues = [
        "64b15d90b5c71e09650f5de8",
        "64b15d90b5c71e09650f5de9",
      ];

      const res = parseObjectIdList(queryValues);

      expect(res).toEqual([
        "64b15d90b5c71e09650f5de8",
        "64b15d90b5c71e09650f5de9",
      ]);
    }
  });

  it("should not parse array of strings", () => {
    const queryValues = ["not", "a", "number"];

    const res = parseDateList(queryValues);

    expect(res).toEqual([]);
  });

  it("should not parse comma separated string of strings", () => {
    const queryValues = "not,a,number";

    const res = parseDateList(queryValues);

    expect(res).toEqual([]);
  });
});

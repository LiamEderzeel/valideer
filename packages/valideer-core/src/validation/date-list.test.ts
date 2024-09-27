import { describe, expect, it } from "vitest";
import { parseDateList } from "./date-list";

describe("parseDateList tests", () => {
  it("should parse array of strings to array of dates", () => {
    {
      const queryValues = [
        "2011-10-05T14:48:00.000Z",
        "2011-10-05T14:99:00.000Z",
      ];

      const res = parseDateList(queryValues);

      expect(res).toEqual([new Date("2011-10-05T14:48:00.000Z")]);
    }
    {
      const queryValues = [
        "2013-10-05T14:48:00.000Z",
        "2014-10-05T14:12:48.000+06:30",
      ];

      const res = parseDateList(queryValues);

      expect(res).toEqual([
        new Date("2013-10-05T14:48:00.000Z"),
        new Date("2014-10-05T14:12:48.000+06:30"),
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

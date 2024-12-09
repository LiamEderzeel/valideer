import { describe, expect, it } from "vitest";
import { parseComplexFilter } from "./complex-filter";

describe("parseComplexFilter tests", () => {
  describe("parse int", () => {
    it("should parse string to array of ints", () => {
      const queryValue = "1";

      const res = parseComplexFilter(queryValue, "int");

      expect(res).toEqual({ $in: [1] });
    });

    it("should parse array of strings to array of ints", () => {
      const queryValue = ["1", "2", "3"];

      const res = parseComplexFilter(queryValue, "int");

      expect(res).toEqual({ $in: [1, 2, 3] });
    });

    it("should parse Record<string, any> to array of query object of type 'in' and ints", () => {
      const queryValue = { in: ["1", "2", "3"] };

      const res = parseComplexFilter(queryValue, "int");

      expect(res).toEqual({ $in: [1, 2, 3] });
    });
  });

  describe("parse boolean", () => {
    it("should parse array of strings to array of booleans", () => {
      const queryValue = ["true", "false", "1", "0"];

      const res = parseComplexFilter(queryValue, "boolean");

      expect(res).toEqual({ $in: [true, false, true, false] });
    });

    it("should parse Record<string, any> to array of query object of type 'in' and booleans", () => {
      const queryValue = { in: ["true", "false", "1", "0"] };

      const res = parseComplexFilter(queryValue, "boolean");

      expect(res).toEqual({ $in: [true, false, true, false] });
    });
  });

  describe("parse string", () => {
    it("should parse array of strings to array of string", () => {
      const queryValue = ["foo", "bar", "foobar"];

      const res = parseComplexFilter(queryValue, "string");

      expect(res).toEqual({ $in: ["foo", "bar", "foobar"] });
    });

    it("should parse Record<string, any> to array of query object of type 'in' and booleans", () => {
      const queryValue = { in: ["foo", "bar", "foobar"] };

      const res = parseComplexFilter(queryValue, "string");

      expect(res).toEqual({ $in: ["foo", "bar", "foobar"] });
    });
  });
});

import { describe, expect, it } from "vitest";
import { parseBoolean, parseBooleanList } from "./boolean-list.js";

describe("Boolean parser tests", () => {
  describe("parseBoolean tests", () => {
    it("should parse boolean string", () => {
      {
        const queryValue = "true";

        const res = parseBoolean(queryValue);

        expect(res).toEqual(true);
      }
      {
        const queryValue = "false";

        const res = parseBoolean(queryValue);

        expect(res).toEqual(false);
      }
    });

    it("should parse boolean number string", () => {
      {
        const queryValue = "1";

        const res = parseBoolean(queryValue);

        expect(res).toEqual(true);
      }
      {
        const queryValue = "0";

        const res = parseBoolean(queryValue);

        expect(res).toEqual(false);
      }
    });
  });

  describe("parseBlooleanList tests", () => {
    it("should parse array of boolean strings", () => {
      const queryValue = ["true", "false"];

      const res = parseBooleanList(queryValue);

      expect(res.length).toEqual(2);
      expect(res).toEqual([true, false]);
    });

    it("should parse comma separated boolean strings", () => {
      const queryValue = "true,false";

      const res = parseBooleanList(queryValue);

      expect(res.length).toEqual(2);
      expect(res).toEqual([true, false]);
    });

    it("should parse array of boolean numbers", () => {
      const queryValue = ["1", "0"];

      const res = parseBooleanList(queryValue);

      expect(res.length).toEqual(2);
      expect(res).toEqual([true, false]);
    });

    it("should parse comma separated boolean numbers", () => {
      const queryValue = "1,0";

      const res = parseBooleanList(queryValue);

      expect(res.length).toEqual(2);
      expect(res).toEqual([true, false]);
    });

    it("should parse random values as false", () => {
      const queryValue = ["any", "123", ""];

      const res = parseBooleanList(queryValue);

      expect(res.length).toEqual(3);
      expect(res).toEqual([false, false, false]);
    });
  });
});

import { describe, expect, it } from "vitest";
import { isEnumList, parseEnumList } from "./enum-list";

enum Color {
  Red = "red",
  Blue = "blue",
}

describe("isEnumList tests", () => {
  it("should validate array of strings", () => {
    const value = ["red", "blue"];

    const res = isEnumList(value, Color);

    expect(res).toEqual(true);
  });

  it("should validate comma separated string", () => {
    const value = "red,blue";

    const res = isEnumList(value, Color);

    expect(res).toEqual(true);
  });

  it("should not validate array of strings", () => {
    const value = ["green", "blue"];

    const res = isEnumList(value, Color);

    expect(res).toEqual(false);
  });

  it("should not validate comma separated string", () => {
    const value = "green,blue";

    const res = isEnumList(value, Color);

    expect(res).toEqual(false);
  });
});

describe("parseEnumList tests", () => {
  it("should parse array of strings to array of strings", () => {
    const value = ["red", "blue"];

    const res = parseEnumList(value, Color);

    expect(res).toEqual([Color.Red, Color.Blue]);
  });

  it("should parse comma separated string to array of strings", () => {
    const value = "red,blue";

    const res = parseEnumList(value, Color);

    expect(res).toEqual([Color.Red, Color.Blue]);
  });
});

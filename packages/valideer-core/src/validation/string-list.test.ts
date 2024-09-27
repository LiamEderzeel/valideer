import { describe, expect, it } from "vitest";
import { parseStringList } from "./string-list";

describe("parseStringList tests", () => {
  it("should parse array of strings to array of strings", () => {
    const value = ["foo", "bar"];

    const res = parseStringList(value);

    expect(res).toEqual(["foo", "bar"]);
  });

  it("should parse comma separated string to array of strings", () => {
    const value = "foo,bar";

    const res = parseStringList(value);

    expect(res).toEqual(["foo", "bar"]);
  });
});

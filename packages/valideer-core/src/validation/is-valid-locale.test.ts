import { describe, expect, it } from "vitest";
import { isValidLocale, locales } from "./is-valid-locale.js";

describe("parseStringArray tests", () => {
  it("should return true if array of strings", () => {
    for (const locale of locales) {
      const res = isValidLocale(locale);
      expect(res).toEqual(true);
    }
  });

  it("should return false if comma seportated string", () => {
    const queryValues = "not a locale";

    const res = isValidLocale(queryValues);

    expect(res).toEqual(false);
  });
});

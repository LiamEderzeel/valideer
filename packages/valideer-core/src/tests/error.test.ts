import { describe, expect, it } from "vitest";
import { ValidationError } from "class-validator";
import { ValidationMiddlwareError } from "..";

describe("ValidationMiddlwareError", () => {
  it("Is instanceof ValidationMiddlwareError", async () => {
    const err = new ValidationMiddlwareError(
      [new ValidationError()],
      "message",
    );

    expect(err instanceof ValidationMiddlwareError).toEqual(true);
  });
});

import { describe, expect, it } from "vitest";
import { ValidationError } from "class-validator";
import { ValidationMiddlewareError } from "..";

describe("ValidationMiddlewareError", () => {
  it("Is instanceof ValidationMiddlewareError", async () => {
    const err = new ValidationMiddlewareError(
      [new ValidationError()],
      "message",
    );

    expect(err instanceof Error).toEqual(true);
    expect(err instanceof ValidationMiddlewareError).toEqual(true);
    expect(err instanceof ValidationError).toEqual(false);
    expect(err.name).toEqual("ValidationMiddlewareError");
    expect(err.message).toEqual("message");
  });
});

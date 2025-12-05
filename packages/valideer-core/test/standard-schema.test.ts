import { describe, expect, it } from "vitest";
import * as v from "valibot";
import { validateData } from "../src/standart-schema";

describe("Standard schema test", () => {
  it("It should validate standard schema object and succeed", async () => {
    type LoginData = {
      email: string;
      password: string;
    };

    const LoginSchema = v.object({
      email: v.pipe(
        v.string("Your email must be a string."),
        v.nonEmpty("Please enter your email."),
        v.email("The email address is badly formatted."),
      ),
      password: v.pipe(
        v.string("Your password must be a string."),
        v.nonEmpty("Please enter your password."),
      ),
    });

    const data: LoginData = { email: "mail@mail.test", password: "password" };
    const result = await validateData(data, LoginSchema);

    expect(result).toEqual({ email: "mail@mail.test", password: "password" });
  });

  it("It should validate standard schema object and succeed", async () => {
    type LoginData = {
      id: string;
    };

    const LoginSchema = v.object({
      id: v.pipe(
        v.string("Your id must be a string."),
        v.nonEmpty("Please enter an id."),
        v.transform((input) => {
          const num = parseInt(input, 10);
          return v.parse(v.pipe(v.number(), v.minValue(1)), num);
        }),
      ),
    });

    const data: LoginData = { id: "1" };
    const result = await validateData(data, LoginSchema);

    expect(result).toEqual({ id: 1 });
  });
});

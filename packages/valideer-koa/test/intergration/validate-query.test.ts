import "reflect-metadata";
import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IsInt, IsNotEmpty, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";
import { Middleware } from "koa";
import request from "supertest";
import { errorMiddleware } from "./utils/error.middleware";
import * as v from "valibot";
import { ValidateFunction } from "@valideer/core";
import { transformAndValidate } from "class-transformer-validator";
import { validateQuery } from "../../src/validate-query";

const REGEX_NUMBER_STRING = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;

class TestParams {
  @IsNotEmpty() // Ensures the property is not an empty string or null/undefined
  @Type(() => Number) // 1. CLASS-TRANSFORMER: Converts the string input to a Number type
  @IsInt() // 2. CLASS-VALIDATOR: Ensures the value is an integer
  @Min(1) // 3. CLASS-VALIDATOR: Additional validation (e.g., minimum value)
  @IsPositive() // 4. CLASS-VALIDATOR: Ensures the value is a positive number
  id?: number;
}

describe("query middleware", () => {
  it("validate with validation function and should pass", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const validate: ValidateFunction<{
      id: number;
    }> = (data: any) => {
      if (
        !data.id ||
        typeof data.id !== "string" ||
        !REGEX_NUMBER_STRING.test(data.id)
      ) {
        throw new Error("Invalid id");
      }
      return {
        id: Number(data.id),
      };
    };

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateQuery(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.body = err;
      }
    };

    router.get("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/?id=1")
      .expect(200);

    expect(res.body).toEqual({ id: 1 });
  });

  it("validate with validation function and should fail", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const REGEX_NUMBER_STRING = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;
    const validate: ValidateFunction<{
      id: number;
    }> = (data: any) => {
      if (
        !data.id ||
        typeof data.id !== "string" ||
        !REGEX_NUMBER_STRING.test(data.id)
      ) {
        throw new Error("Invalid id");
      }
      return {
        id: Number(data.id),
      };
    };

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateQuery(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    };

    router.get("reqHandler", "/", reqHandler);

    app.use(router.routes());

    await request(app.listen()).get("/?id=test").expect(400);

    // expect(res.body).toEqual(data);
  });

  it("validate with class-validator function and should pass", async () => {
    type LoginData = {
      id: number;
    };

    const data: LoginData = { id: 1 };

    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const validate: ValidateFunction<LoginData> = async (data: any) => {
      return (await transformAndValidate(TestParams, data)) as LoginData;
    };

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateQuery(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.body = err;
      }
    };

    router.get("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/?id=1")
      .send(data)
      .expect(200);

    expect(res.body).toEqual({ id: 1 });
  });

  it("validate with class-validator function and should fail", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const validate: ValidateFunction<TestParams> = async (data: any) => {
      try {
        const res = (await transformAndValidate(
          TestParams,
          data,
        )) as TestParams;
        return res;
      } catch (err) {
        throw new Error("", { cause: err });
      }
    };

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateQuery(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.status = 400;
        ctx.body = { message: "validation error", errros: err.cause.cause };
        return;
      }
    };

    router.get("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/?id=test")
      .expect(400);

    expect(res.body).toEqual({
      message: "validation error",
      errros: [
        {
          children: [],
          constraints: {
            isInt: "id must be an integer number",
            isPositive: "id must be a positive number",
            min: "id must not be less than 1",
          },
          property: "id",
          target: {
            id: null,
          },
          value: null,
        },
      ],
    });
  });

  describe("valibot", async () => {
    const LoginSchema = v.object({
      id: v.pipe(
        v.string("Your id must be a number."),
        v.nonEmpty("Please enter an id."),
        v.transform((input) => {
          const num = parseInt(input, 10);
          return v.parse(v.pipe(v.number(), v.minValue(1)), num);
        }),
      ),
    });

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateQuery(ctx, LoginSchema);
        ctx.body = body;
      } catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    };

    it("validate with valibot and should pass", async () => {
      const data = { id: 1 };

      const app = new Koa();

      app.use(errorMiddleware);
      app.use(bodyParsesr());

      const router = new Router();

      const reqHandler: Middleware = async (ctx) => {
        try {
          const body = await validateQuery(ctx, LoginSchema);
          ctx.body = body;
        } catch (err) {
          ctx.body = err;
        }
      };

      router.get("reqHandler", "/", reqHandler);

      app.use(router.routes());

      const res: request.Response = await request(app.listen())
        .get("/?id=1")
        .expect(200);

      expect(res.body).toEqual(data);
    });

    it("validate with valibot and should fail", async () => {
      const app = new Koa();

      app.use(errorMiddleware);
      app.use(bodyParsesr());

      const router = new Router();

      router.get("reqHandler", "/", reqHandler);

      app.use(router.routes());

      const res: request.Response = await request(app.listen())
        .get("/?id=test")
        .expect(400);

      expect(res.body).toEqual({
        issues: [
          {
            expected: "number",
            input: null,
            kind: "schema",
            message: "Invalid type: Expected number but received NaN",
            received: "NaN",
            type: "number",
          },
        ],
        name: "ValiError",
      });
    });
  });
});

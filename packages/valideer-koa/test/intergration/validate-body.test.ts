import "reflect-metadata";
import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { Middleware } from "koa";
import request from "supertest";
import { errorMiddleware } from "./utils/error.middleware";
import { defineClassValidator } from "./utils/define-class-validator";

import { validateBody } from "../../src/validate-body";
import * as v from "valibot";
import { ValidateFunction } from "@valideer/core";

import { transformAndValidate } from "class-transformer-validator";
import { IsDefined, IsNumber } from "class-validator";

class TestParams {
  @IsDefined()
  @IsNumber()
  id: number;
}

const REGEX_NUMBER_STRING = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;

describe("body middleware", () => {
  it("validate with validation function and should pass", async () => {
    type LoginData = {
      id: string;
    };

    const data: LoginData = { id: "1" };

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
        const body = await validateBody(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.body = err;
      }
    };

    router.post("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send(data)
      .expect(200);

    expect(res.body).toEqual({ id: 1 });
  });

  it("validate with validation function and should fail", async () => {
    type LoginData = {
      id: number;
    };

    const data: LoginData = { id: 1 };

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
        const body = await validateBody(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.status = 400;
        ctx.body = err;
      }
    };

    router.post("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const _res: request.Response = await request(app.listen())
      .post("/")
      .send(data)
      .expect(400);

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
        const body = await validateBody(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.body = err;
      }
    };

    router.post("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send(data)
      .expect(200);

    expect(res.body).toEqual({ id: 1 });
  });

  it("validate with class-validator helper function and should pass", async () => {
    type LoginData = {
      id: number;
    };

    const data: LoginData = { id: 1 };

    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const validate: ValidateFunction<TestParams> =
      defineClassValidator(TestParams);

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateBody(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.body = err;
      }
    };

    router.post("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send(data)
      .expect(200);

    expect(res.body).toEqual({ id: 1 });
  });

  it("validate with class-validator function and should fail", async () => {
    type LoginData = {
      id: string;
    };

    const data: LoginData = { id: "test" };

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
        const body = await validateBody(ctx, validate);
        ctx.body = body;
      } catch (err) {
        ctx.status = 400;
        ctx.body = { message: "validation error", errros: err.cause.cause };
        return;
      }
    };

    router.post("reqHandler", "/", reqHandler);

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send(data)
      .expect(400);

    expect(res.body).toEqual({
      message: "validation error",
      errros: [
        {
          children: [],
          constraints: {
            isNumber:
              "id must be a number conforming to the specified constraints",
          },
          property: "id",
          target: {
            id: "test",
          },
          value: "test",
        },
      ],
    });
  });

  describe("valibot", async () => {
    const LoginSchema = v.object({
      id: v.pipe(v.number("Your id must be a number.")),
    });

    const reqHandler: Middleware = async (ctx) => {
      try {
        const body = await validateBody(ctx, LoginSchema);
        ctx.body = body;
      } catch (err) {
        ctx.status = 400;
        ctx.body = err.cause;
      }
    };

    it("validate with valibot and should pass", async () => {
      const data = { id: 1 };

      const app = new Koa();

      app.use(errorMiddleware);
      app.use(bodyParsesr());

      const router = new Router();

      router.post("reqHandler", "/", reqHandler);

      app.use(router.routes());

      const res: request.Response = await request(app.listen())
        .post("/")
        .send(data)
        .expect(200);

      expect(res.body).toEqual(data);
    });

    it("validate with valibot and should fail", async () => {
      const data = { id: "test" };

      const app = new Koa();

      app.use(errorMiddleware);
      app.use(bodyParsesr());

      const router = new Router();

      router.post("reqHandler", "/", reqHandler);

      app.use(router.routes());

      const res: request.Response = await request(app.listen())
        .post("/")
        .send(data)
        .expect(400);

      expect(res.body).toEqual({
        issues: [
          {
            expected: "number",
            input: "test",
            kind: "schema",
            message: "Your id must be a number.",
            path: [
              {
                input: {
                  id: "test",
                },
                key: "id",
                origin: "value",
                type: "object",
                value: "test",
              },
            ],
            received: '"test"',
            type: "number",
          },
        ],
        message: "Validation failed",
      });
    });
  });
});

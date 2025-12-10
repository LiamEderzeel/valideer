import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IParsedParamsState } from "@valideer/core";
import { Middleware } from "koa";
import request from "supertest";
import * as v from "valibot";
import { validateParamsMiddleware } from "../../src/validate-params.middleware";
import { errorMiddleware } from "./utils/error.middleware";

describe("params middleware", () => {
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

  type LoginResponse = v.InferOutput<typeof LoginSchema>;

  const reqHandler: Middleware<IParsedParamsState<LoginResponse>> = (ctx) => {
    try {
      ctx.body = ctx.state.params.id;
    } catch (err) {
      ctx.status = 400;
      ctx.body = err.cause;
    }
  };

  it("should pass", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();
    router.get(
      "reqHandler",
      "/:id",
      validateParamsMiddleware(LoginSchema),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/1")
      .expect(200);

    expect(res.body).toEqual(1);
  });

  it("should fail", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    router.get(
      "reqHandler",
      "/:id",
      validateParamsMiddleware(LoginSchema),
      reqHandler,
    );

    app.use(router.routes());

    await request(app.listen()).get("/test").expect(400);
  });
});

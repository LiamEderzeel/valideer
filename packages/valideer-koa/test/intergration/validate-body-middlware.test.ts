import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IParsedBodyState } from "@valideer/core";
import { Middleware } from "koa";
import request from "supertest";
import * as v from "valibot";
import { validateBodyMiddleware } from "../../src/validate-body.middleware";
import { errorMiddleware } from "./utils/error.middleware";

describe("body middleware", () => {
  const LoginSchema = v.object({
    id: v.pipe(
      v.number("id must be a number conforming to the specified constraints"),
    ),
  });

  type LoginResponse = v.InferOutput<typeof LoginSchema>;

  const reqHandler: Middleware<IParsedBodyState<LoginResponse>> = (ctx) => {
    try {
      ctx.body = ctx.state.body.id;
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

    router.post(
      "reqHandler",
      "/",
      validateBodyMiddleware(LoginSchema),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send({ id: 1 })
      .expect(200);

    expect(res.body).toEqual(1);
  });

  it("should fail", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    router.post(
      "reqHandler",
      "/",
      validateBodyMiddleware(LoginSchema),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send({ id: "test" })
      .expect(400);
  });
});

import { describe, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IParsedParamsState, ValidationMiddlewareError } from "@valideer/core";
import { IsDefined, IsNumberString, ValidationError } from "class-validator";
import { Middleware } from "koa";
import request from "supertest";
import { validateAndParseParams } from "../validate-params.middleware";

class TestParams {
  @IsDefined()
  @IsNumberString()
  id?: string;
}

class TestParamsParsed {
  id?: number;
  constructor(params: TestParams) {
    if (params.id != null) this.id = parseInt(params.id);
  }
}

function parseTestParams(params: TestParams) {
  return new TestParamsParsed(params);
}

const logError = (err: ValidationError) => {
  console.log(err);
  if (err.children) {
    err.children.forEach((err) => logError(err));
  }
};

export const ErrorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    if (err instanceof ValidationMiddlewareError) {
      const { errors, message } = err;
      err.errors.forEach((x) => logError(x));

      ctx.status = 400;
      ctx.body = { message, errors };
      return;
    }

    ctx.status = 500;
  }
};

describe("params", () => {
  it("should pass", async () => {
    const app = new Koa();

    app.use(ErrorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const reqHandler: Middleware<IParsedParamsState<TestParams>> = (ctx) => {
      ctx.body = ctx.state.params.id;
    };

    router.get<null, IParsedParamsState<TestParams>>(
      "/:id",
      validateAndParseParams(TestParams, parseTestParams),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/1")
      .expect(200);
  });
});

import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IParsedParamsState } from "@valideer/core";
import { IsDefined, IsNumberString, ValidationError } from "class-validator";
import { Middleware } from "koa";
import request from "supertest";
import { validateAndParseParams } from "../../src/validate-params.middleware";
import { errorMiddleware } from "./utils/error.middleware";

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

describe("params", () => {
  it("should pass", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const reqHandler: Middleware<IParsedParamsState<TestParams>> = (ctx) => {
      ctx.body = ctx.state.params.id;
    };

    router.get(
      "reqHandler",
      "/:id",
      validateAndParseParams(TestParams, parseTestParams),
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

    const reqHandler: Middleware<IParsedParamsState<TestParams>> = (ctx) => {
      ctx.body = ctx.state.params.id;
    };

    router.get(
      "reqHandler",
      "/:id",
      validateAndParseParams(TestParams, parseTestParams),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/test")
      .expect(400);

    const err = new ValidationError();
    err.children = [];
    expect(res.body).toEqual({
      errors: [
        {
          children: [],
          constraints: { isNumberString: "id must be a number string" },
          property: "id",
          target: { id: "test" },
          value: "test",
        },
      ],
      message: "",
    });
  });
});

import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IParsedBodyState } from "@valideer/core";
import { IsDefined, IsNumber, ValidationError } from "class-validator";
import { Middleware } from "koa";
import request from "supertest";
import { validateAndParseBody } from "../../src/validate-body.middleware";
import { errorMiddleware } from "./utils/error.middleware";

class TestBody {
  @IsDefined()
  @IsNumber()
  id?: string;
}

class TestBodyParsed {
  id?: number;
  constructor(body: TestBody) {
    if (body.id != null) this.id = parseInt(body.id);
  }
}

function parseTestBody(params: TestBody) {
  return new TestBodyParsed(params);
}

describe("body", () => {
  it("should pass", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const reqHandler: Middleware<IParsedBodyState<TestBody>> = (ctx) => {
      ctx.body = ctx.state.body.id;
    };

    router.post(
      "reqHandler",
      "/",
      validateAndParseBody(TestBody, parseTestBody),
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

    const reqHandler: Middleware<IParsedBodyState<TestBody>> = (ctx) => {
      ctx.body = ctx.state.body.id;
    };

    router.post(
      "reqHandler",
      "/",
      validateAndParseBody(TestBody, parseTestBody),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .post("/")
      .send({ id: "test" })
      .expect(400);

    const err = new ValidationError();
    err.children = [];
    expect(res.body).toEqual({
      errors: [
        {
          children: [],
          constraints: {
            isNumber:
              "id must be a number conforming to the specified constraints",
          },
          property: "id",
          target: { id: "test" },
          value: "test",
        },
      ],
      message: "",
    });
  });
});

import { describe, expect, it } from "vitest";
import Koa from "koa";
import bodyParsesr from "@koa/bodyparser";
import Router from "@koa/router";
import { IParsedQueryState } from "@valideer/core";
import { IsDefined, IsNumberString, ValidationError } from "class-validator";
import { Middleware } from "koa";
import request from "supertest";
import { validateAndParseQuery } from "../../src/validate-query.middleware";
import { errorMiddleware } from "./utils/error.middleware";

class TestQuery {
  @IsDefined()
  @IsNumberString()
  id?: string;
}

class TestQueryParsed {
  id?: number;
  constructor(query: TestQuery) {
    if (query.id != null) this.id = parseInt(query.id);
  }
}

function parseTestQuery(params: TestQuery) {
  return new TestQueryParsed(params);
}

describe("query", () => {
  it("should pass", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const reqHandler: Middleware<IParsedQueryState<TestQuery>> = (ctx) => {
      ctx.body = ctx.state.query.id;
    };

    router.get(
      "reqHandler",
      "/",
      validateAndParseQuery(TestQuery, parseTestQuery),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/")
      .query({ id: 1 })
      .expect(200);

    expect(res.body).toEqual(1);
  });

  it("should fail", async () => {
    const app = new Koa();

    app.use(errorMiddleware);
    app.use(bodyParsesr());

    const router = new Router();

    const reqHandler: Middleware<IParsedQueryState<TestQuery>> = (ctx) => {
      ctx.body = ctx.state.query.id;
    };

    router.get(
      "reqHandler",
      "/",
      validateAndParseQuery(TestQuery, parseTestQuery),
      reqHandler,
    );

    app.use(router.routes());

    const res: request.Response = await request(app.listen())
      .get("/")
      .query({ id: "test" })
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

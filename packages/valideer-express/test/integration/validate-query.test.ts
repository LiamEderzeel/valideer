import { describe, expect, it } from "vitest";
import express, { RequestHandler, Router } from "express";
import { IParsedParamsState, IParsedQueryState } from "@valideer/core";
import { validateAndParseParams } from "../../src/validate-params.middleware";
import { IsDefined, IsNumberString, ValidationError } from "class-validator";
import request from "supertest";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { errorMiddleware } from "./utils/error.middleware";
import { validateAndParseQuery } from "../../src/validate-query.middleware";

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
    const app = express();

    const router = Router();

    const reqHandler: RequestHandler<
      ParamsDictionary,
      any,
      any,
      Query,
      IParsedQueryState<TestQueryParsed>
    > = (_req, res, next) => {
      res.json(res.locals.query.id);
      next();
    };

    router.get(
      "/",
      (req, res, next) => {
        console.log(req.query);
        next();
      },
      validateAndParseQuery(TestQuery, parseTestQuery),
      reqHandler,
    );

    app.use("/", router);
    app.use(errorMiddleware);

    const res: request.Response = await request(app.listen())
      .get("/")
      .query({ id: 1 })
      .expect(200);

    expect(res.body).toEqual(1);
  });

  it("should fail", async () => {
    const app = express();

    const router = Router();

    const reqHandler: RequestHandler<
      ParamsDictionary,
      any,
      any,
      Query,
      IParsedQueryState<TestQueryParsed>
    > = (_req, res, _next) => {
      res.json(res.locals.query.id);
    };

    router.get(
      "/",
      validateAndParseQuery(TestQuery, parseTestQuery),
      reqHandler,
    );

    app.use("/", router);
    app.use(errorMiddleware);

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
          constraints: {
            isNumberString: "id must be a number string",
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

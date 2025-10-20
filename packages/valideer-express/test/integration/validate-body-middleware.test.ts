import { describe, expect, it } from "vitest";
import express, { json, RequestHandler, Router } from "express";
import { IParsedBodyState } from "@valideer/core";
import { IsDefined, IsNumber, ValidationError } from "class-validator";
import request from "supertest";
import { validateAndParseBodyMiddleware } from "../../src/validate-body.middleware";
import { ParamsDictionary, Query } from "express-serve-static-core";
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
    const app = express();

    const router = Router();

    const reqHandler: RequestHandler<
      ParamsDictionary,
      any,
      any,
      Query,
      IParsedBodyState<TestBodyParsed>
    > = (_req, res) => {
      res.json(res.locals.body.id);
    };

    router.post(
      "/",
      json(),
      validateAndParseBodyMiddleware(TestBody, parseTestBody),
      reqHandler,
    );

    app.use("/", router);
    app.use(errorMiddleware);

    const res: request.Response = await request(app.listen())
      .post("/")
      .send({ id: 1 })
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
      IParsedBodyState<TestBodyParsed>
    > = (_req, res) => {
      res.json(res.locals.body.id);
    };

    router.post(
      "/",
      json(),
      validateAndParseBodyMiddleware(TestBody, parseTestBody),
      reqHandler,
    );

    app.use("/", router);
    app.use(errorMiddleware);

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

import { describe, expect, it } from "vitest";
import express, { RequestHandler, Router } from "express";
import { IsDefined, IsNumberString, ValidationError } from "class-validator";
import request from "supertest";
import { errorMiddleware } from "./utils/error.middleware";
import { validateAndParseParams } from "../../src/validate-params";

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
    const app = express();

    const router = Router();

    const reqHandler: RequestHandler = async (req, res) => {
      const params = await validateAndParseParams(
        TestParams,
        req,
        parseTestParams,
      );
      res.json(params.id);
    };

    router.get("/:id", reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    const res: request.Response = await request(app.listen())
      .get("/1")
      .expect(200);

    expect(res.body).toEqual(1);
  });

  it("should fail", async () => {
    const app = express();

    const router = Router();

    const reqHandler: RequestHandler = async (req, res) => {
      const params = await validateAndParseParams(
        TestParams,
        req,
        parseTestParams,
      );
      res.json(params.id);
    };

    router.get("/:id", reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    const res: request.Response = await request(app.listen())
      .get("/test")
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

import { describe, expect, it } from "vitest";
import express, { RequestHandler, Router } from "express";
import { IParsedParamsState } from "@valideer/core";
import { validateParamsMiddleware } from "../../src/validate-params.middleware";
import request from "supertest";
import * as v from "valibot";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { errorMiddleware } from "./utils/error.middleware";

describe("params", () => {
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
  it("should pass", async () => {
    const app = express();

    const router = Router();

    const reqHandler: RequestHandler<
      ParamsDictionary,
      any,
      any,
      Query,
      IParsedParamsState<LoginResponse>
    > = (_req, res) => {
      res.json(res.locals.params.id);
    };

    router.get("/:id", validateParamsMiddleware(LoginSchema), reqHandler);

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

    const reqHandler: RequestHandler<
      ParamsDictionary,
      any,
      any,
      Query,
      IParsedParamsState<LoginResponse>
    > = (_req, res, next) => {
      res.json(res.locals.params.id);
      next();
    };

    router.get("/:id", validateParamsMiddleware(LoginSchema), reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    const res: request.Response = await request(app.listen())
      .get("/test")
      .expect(400);
  });
});

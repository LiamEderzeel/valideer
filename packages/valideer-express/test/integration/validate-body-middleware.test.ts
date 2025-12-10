import { describe, expect, it } from "vitest";
import express, { json, RequestHandler, Router } from "express";
import { IParsedBodyState } from "@valideer/core";
import request from "supertest";
import * as v from "valibot";
import { validateBodyMiddleware } from "../../src/validate-body.middleware";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { errorMiddleware } from "./utils/error.middleware";

describe("body", () => {
  const LoginSchema = v.object({
    id: v.pipe(v.number("Your id must be a number.")),
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
      IParsedBodyState<LoginResponse>
    > = (_req, res) => {
      res.json(res.locals.body.id);
    };

    router.post("/", json(), validateBodyMiddleware(LoginSchema), reqHandler);

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
      IParsedBodyState<LoginResponse>
    > = (_req, res) => {
      res.json(res.locals.body.id);
    };

    router.post("/", json(), validateBodyMiddleware(LoginSchema), reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    await request(app.listen()).post("/").send({ id: "test" }).expect(400);
  });
});

import { describe, expect, it } from "vitest";
import express, { RequestHandler, Router } from "express";
import request from "supertest";
import * as v from "valibot";
import { errorMiddleware } from "./utils/error.middleware";
import { validateParams } from "../../src/validate-params";

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

  const reqHandler: RequestHandler = async (req, res) => {
    const params = await validateParams(req, LoginSchema);
    res.json(params.id);
  };

  it("should pass", async () => {
    const app = express();

    const router = Router();

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

    router.get("/:id", reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    const res: request.Response = await request(app.listen())
      .get("/test")
      .expect(400);
  });
});

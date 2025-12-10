import { describe, expect, it } from "vitest";
import express, { RequestHandler, Router } from "express";
import request from "supertest";
import * as v from "valibot";
import { errorMiddleware } from "./utils/error.middleware";
import { validateQuery } from "../../src/validate-query";

describe("query", () => {
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
    const query = await validateQuery(req, LoginSchema);
    res.json(query.id);
  };

  it("should pass", async () => {
    const app = express();

    const router = Router();

    router.get("/", reqHandler);

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

    router.get("/", reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    await request(app.listen()).get("/").query({ id: "test" }).expect(400);
  });
});

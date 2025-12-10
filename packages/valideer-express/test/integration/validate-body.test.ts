import { describe, expect, it } from "vitest";
import express, { json, RequestHandler, Router } from "express";
import request from "supertest";
import * as v from "valibot";
import { errorMiddleware } from "./utils/error.middleware";
import { validateBody } from "../../src/validate-body";

describe("body", () => {
  const LoginSchema = v.object({
    id: v.pipe(v.number("Your id must be a number.")),
  });

  const reqHandler: RequestHandler = async (req, res) => {
    const body = await validateBody(req, LoginSchema);
    res.json(body.id);
  };

  it("should pass", async () => {
    const app = express();

    const router = Router();

    router.post("/", json(), reqHandler);

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

    router.post("/", json(), reqHandler);

    app.use("/", router);
    app.use(errorMiddleware);

    await request(app.listen()).post("/").send({ id: "test" }).expect(400);
  });
});

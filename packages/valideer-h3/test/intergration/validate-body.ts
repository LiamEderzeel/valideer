import { describe, expect, it } from "vitest";
import { defineEventHandler, H3, H3Event } from "h3";
import { IsDefined, IsNumber } from "class-validator";
import { errorMiddleware } from "./utils/error.middleware";
import { validateAndParseBody } from "../../src/validate-body";

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

const parseTest = async (event: H3Event) => await validateAndParseBody(TestBody, event, parseTestBody)

describe("body", () => {
  it("should pass", async () => {
    const app = new H3();

    app.use(errorMiddleware);


    const reqHandler = defineEventHandler(async (event) => {
      const body = await parseTest(event)

      return JSON.stringify(body)
    });

    app.post(
      "/",
      reqHandler,
    );

    const res = await app.request("/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 1 })
    })

    expect(res.status).toBe(200);
    const data = await res.json()
    expect(data).toEqual({ id: 1 });
  });

  it("should fail", async () => {
    const app = new H3();

    app.use(errorMiddleware);


    const reqHandler = defineEventHandler(async (event) => {
      const body = await parseTest(event)

      return JSON.stringify(body)
    });

    app.post(
      "/",
      reqHandler,
    );

    const res = await app.request("/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: "string" })
    })

    expect(res.status).toBe(400);
    const data = await res.json()
    expect(data).toEqual({ message: "", errors: [{ target: { id: "string" }, children: [], constraints: { isNumber: "id must be a number conforming to the specified constraints" }, property: "id", value: "string" }] });
  });
});

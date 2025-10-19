import { describe, expect, it } from "vitest";
import { defineEventHandler, H3, H3Event } from "h3";
import { IsDefined, IsNumberString } from "class-validator";
import { errorMiddleware } from "./utils/error.middleware";
import { validateAndParseQuery } from "../../src/validate-query";

class TestQuery {
  @IsDefined()
  @IsNumberString()
  id?: string;
}

class TestQueryParsed {
  id?: number;
  constructor(body: TestQuery) {
    if (body.id != null) this.id = parseInt(body.id);
  }
}

function parseTestBody(params: TestQuery) {
  return new TestQueryParsed(params);
}

const parseTest = async (event: H3Event) => await validateAndParseQuery(TestQuery, event, parseTestBody)


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

    const res = await app.request("/?id=1", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    const res = await app.request("/?id=test", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // expect(res.status).toBe(400);
    const data = await res.json()
    expect(data).toEqual({ message: "", errors: [{ target: { id: "test" }, children: [], constraints: { isNumberString: "id must be a number string" }, property: "id", value: "test" }] });
  });
});

import { describe, expect, it } from "vitest";
import request from "supertest";
import Koa from "koa";
import Router from "@koa/router";
import {
  IsComplexFilter,
  IsObjectFilter,
  IsNumberList,
  parseObjectFilter,
} from "@valideer/core";
import { validateAndParseQuery } from "../../validate-query.middleware.ts";

export class Test {
  parameters: {
    parameter1: 0;
    parameter2: 1;
  };
}

export class ClubQuery {
  @IsNumberList()
  t?: string;

  @IsObjectFilter()
  test?: string;

  @IsComplexFilter("boolean")
  test2?: string;
}

export const parseClubParsedQuery = (query: ClubQuery) =>
  new ClubParsedQuery(query);

export class ClubParsedQuery {
  filter: {
    test?: Test;
  } = {};

  constructor(query: ClubQuery) {
    if (query.test) this.filter.test = parseObjectFilter<Test>(query.test);
  }
}

describe("GET with object parameter", () => {
  it("should filter respone based on object parameter", async () => {
    const router = new Router();

    router.get(
      "/",
      validateAndParseQuery(ClubQuery, parseClubParsedQuery),
      (ctx) => {
        ctx.body = { message: "test" };
      },
    );

    const app = new Koa();
    app.use(router.routes());

    // app.use();

    const server = app.listen();
    const res: request.Response = await request(server).get("/").expect(200);

    expect(res.body).toEqual({ message: "test" });
  });
});

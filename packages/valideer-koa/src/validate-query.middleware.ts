import { ClassType } from "class-transformer-validator";
import { Middleware } from "koa";
import { IParsedQueryState, TransformValidationOptions } from "@valideer/core";
import { validateAndParseQuery, validateQuery } from "./validate-query";

export const validateQueryMiddleware = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): Middleware<IParsedQueryState<T>> => {
  return async (ctx, next) => {
    await validateQuery(validateionClass, ctx, options);
    await next();
  };
};

export const validateAndParseQueryMiddleware = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): Middleware<IParsedQueryState<U>> => {
  return async (ctx, next) => {
    ctx.state.query = await validateAndParseQuery(
      validateionClass,
      ctx,
      parse,
      options,
    );
    await next();
  };
};

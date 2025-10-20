import { ClassType } from "class-transformer-validator";
import { Middleware } from "koa";
import { IParsedBodyState, TransformValidationOptions } from "@valideer/core";
import "@koa/bodyparser";
import { validateAndParseBody, validateBody } from "./validate-body";

export const validateBodyMiddleware = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): Middleware<IParsedBodyState<T>> => {
  return async (ctx, next) => {
    ctx.state.body = await validateBody(validateionClass, ctx, options);
    await next();
  };
};

export const validateAndParseBodyMiddleware = <T extends object, U>(
  validationClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): Middleware<IParsedBodyState<U>> => {
  return async (ctx, next) => {
    ctx.state.body = await validateAndParseBody(
      validationClass,
      ctx,
      parse,
      options,
    );
    await next();
  };
};

import { ClassType } from "class-transformer-validator";
import { Middleware } from "koa";
import { IParsedParamsState, TransformValidationOptions } from "@valideer/core";
import { validateAndParseParams, validateParams } from "./validate-params";

export const validateParamsMiddleware = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): Middleware<IParsedParamsState<T>> => {
  return async (ctx, next) => {
    ctx.state.params = await validateParams(validateionClass, ctx, options);
    await next();
  };
};

export const validateAndParseParamsMiddleware = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): Middleware<IParsedParamsState<U>> => {
  return async (ctx, next) => {
    ctx.state.params = await validateAndParseParams(
      validateionClass,
      ctx,
      parse,
      options,
    );
    await next();
  };
};

import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedParamsState,
  ValidationMiddlwareError,
  isValidationError,
  validate,
  validateAndParse,
} from "@valideer/core";

export const validateParams = <T extends Record<string, unknown>>(
  validateionClass: ClassType<T>,
  options: TransformValidationOptions = {},
): Middleware<IParsedParamsState<T>> => {
  return async (ctx, next) => {
    try {
      ctx.state.params = await validate<T>(
        validateionClass,
        ctx.query,
        options,
      );

      await next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        throw new ValidationMiddlwareError(err);
      } else if (err instanceof ValidationError) {
        throw new ValidationMiddlwareError([err]);
      } else {
        throw err;
      }
    }
  };
};

export const validateAndParseParams = <T extends Record<string, unknown>, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options: TransformValidationOptions = {},
): Middleware<IParsedParamsState<U>> => {
  return async (ctx, next) => {
    try {
      ctx.state.params = await validateAndParse<T, U>(
        validateionClass,
        ctx.query,
        parse,
        options,
      );

      await next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        throw new ValidationMiddlwareError(err);
      } else if (err instanceof ValidationError) {
        throw new ValidationMiddlwareError([err]);
      } else {
        throw err;
      }
    }
  };
};

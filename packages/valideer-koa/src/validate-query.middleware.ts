import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedQueryState,
  ValidationMiddlwareError,
  isValidationError,
  validate,
  validateAndParse,
} from "@valideer/core";

export const validateQuery = <T extends object>(
  validateionClass: ClassType<T>,
  options: TransformValidationOptions = {},
): Middleware<IParsedQueryState<T>> => {
  return async (ctx, next) => {
    try {
      ctx.state.query = await validate<T>(validateionClass, ctx.query, options);

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

export const validateAndParseQuery = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options: TransformValidationOptions = {},
): Middleware<IParsedQueryState<U>> => {
  return async (ctx, next) => {
    try {
      ctx.state.query = await validateAndParse<T, U>(
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

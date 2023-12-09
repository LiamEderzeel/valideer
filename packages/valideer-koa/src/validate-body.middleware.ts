import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedBodyState,
  ValidationMiddlwareError,
  isValidationError,
  validate,
  validateAndParse,
} from "@valideer/core";

export const validateBody = <T extends object>(
  validateionClass: ClassType<T>,
  options: TransformValidationOptions = {},
): Middleware<IParsedBodyState<T>> => {
  return async (ctx, next) => {
    try {
      ctx.state.body = await validate<T>(validateionClass, ctx.query, options);

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

export const validateAndParseBody = <T extends object, U>(
  validationClass: ClassType<T>,
  parse: (data: T) => U,
  options: TransformValidationOptions = {},
): Middleware<IParsedBodyState<U>> => {
  return async (ctx, next) => {
    try {
      ctx.state.body = ctx.state.body = await validateAndParse<T, U>(
        validationClass,
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

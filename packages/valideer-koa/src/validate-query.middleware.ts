import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedQueryState,
  ValidationMiddlewareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";

export const validateQuery = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): Middleware<IParsedQueryState<T>> => {
  return async (ctx, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      ctx.state.query = await validate<T>(validateionClass, ctx.query, options);

      await next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        throw new ValidationMiddlewareError(err);
      } else if (err instanceof ValidationError) {
        throw new ValidationMiddlewareError([err]);
      } else {
        throw err;
      }
    }
  };
};

export const validateAndParseQuery = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): Middleware<IParsedQueryState<U>> => {
  return async (ctx, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      ctx.state.query = await validateAndParse<T, U>(
        validateionClass,
        ctx.query,
        parse,
        options,
      );

      await next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        throw new ValidationMiddlewareError(err);
      } else if (err instanceof ValidationError) {
        throw new ValidationMiddlewareError([err]);
      } else {
        throw err;
      }
    }
  };
};

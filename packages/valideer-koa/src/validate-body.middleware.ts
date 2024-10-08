import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedBodyState,
  ValidationMiddlewareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";
import "@koa/bodyparser";

export const validateBody = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): Middleware<IParsedBodyState<T>> => {
  return async (ctx, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      ctx.state.body = await validate<T>(
        validateionClass,
        ctx.request.body,
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

export const validateAndParseBody = <T extends object, U>(
  validationClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): Middleware<IParsedBodyState<U>> => {
  return async (ctx, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      ctx.state.body = await validateAndParse<T, U>(
        validationClass,
        ctx.request.body,
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

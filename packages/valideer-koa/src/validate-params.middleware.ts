import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedParamsState,
  ValidationMiddlwareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";

export const validateParams = <T extends object>(
  validateionClass: ClassType<T>,
  options: TransformValidationOptions,
): Middleware<IParsedParamsState<T>> => {
  return async (ctx, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      ctx.state.params = await validate<T>(
        validateionClass,
        ctx.params,
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

export const validateAndParseParams = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options: TransformValidationOptions,
): Middleware<IParsedParamsState<U>> => {
  return async (ctx, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      ctx.state.params = await validateAndParse<T, U>(
        validateionClass,
        ctx.params,
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

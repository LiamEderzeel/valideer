import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import {
  ValidationMiddlewareError,
  isValidationError,
  validate,
  IParsedQueryState,
  validateAndParse,
} from "@valideer/core";
import { ReqHandler } from "./req-handler";

export const validateQuery = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): ReqHandler<IParsedQueryState<T>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.query = await validate<T>(
        validateionClass,
        req.query,
        options,
      );

      next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        return next(new ValidationMiddlewareError(err));
      } else if (err instanceof ValidationError) {
        return next(new ValidationMiddlewareError([err]));
      } else {
        return next(err);
      }
    }
  };
};

export const validateAndParseQuery = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): ReqHandler<IParsedQueryState<U>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.query = await validateAndParse<T, U>(
        validateionClass,
        req.query,
        parse,
        options,
      );

      next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        return next(new ValidationMiddlewareError(err));
      } else if (err instanceof ValidationError) {
        return next(new ValidationMiddlewareError([err]));
      } else {
        return next(err);
      }
    }
  };
};

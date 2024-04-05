import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { ReqHandler } from "./req-handler";
import {
  ValidationMiddlwareError,
  isValidationError,
  validate,
  validateAndParse,
  IParsedBodyState,
  TransformValidationOptions,
} from "@valideer/core";

export const validateBody = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): ReqHandler<IParsedBodyState<T>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.body = await validate<T>(validateionClass, req.body, options);

      next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        return next(new ValidationMiddlwareError(err));
      } else if (err instanceof ValidationError) {
        return next(new ValidationMiddlwareError([err]));
      } else {
        return next(err);
      }
    }
  };
};

export const validateAndParseBody = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): ReqHandler<IParsedBodyState<U>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.body = await validateAndParse<T, U>(
        validateionClass,
        req.body,
        parse,
        options,
      );

      next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        return next(new ValidationMiddlwareError(err));
      } else if (err instanceof ValidationError) {
        return next(new ValidationMiddlwareError([err]));
      } else {
        return next(err);
      }
    }
  };
};

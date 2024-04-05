import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { ReqHandler } from "./req-handler";
import {
  ValidationMiddlwareError,
  IParsedParamsState,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";

export const validateParams = <T extends object>(
  validateionClass: ClassType<T>,
  options: TransformValidationOptions,
): ReqHandler<IParsedParamsState<T>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.params = await validate<T>(
        validateionClass,
        req.params,
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

export const validateAndParseParams = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options: TransformValidationOptions,
): ReqHandler<IParsedParamsState<U>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.params = await validateAndParse<T, U>(
        validateionClass,
        req.params,
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

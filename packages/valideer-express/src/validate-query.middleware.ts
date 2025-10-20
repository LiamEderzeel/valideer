import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { IParsedQueryState } from "@valideer/core";
import { ReqHandler } from "./req-handler";
import { validateAndParseQuery, validateQuery } from "./validate-query";

export const validateQueryMiddleware = <T extends object>(
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

      res.locals.query = await validateQuery(validateionClass, req, options);

      next();
    } catch (err) {
      return next(err);
    }
  };
};

export const validateAndParseQueryMiddleware = <T extends object, U>(
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

      res.locals.query = await validateAndParseQuery(
        validateionClass,
        req,
        parse,
        options,
      );

      next();
    } catch (err) {
      return next(err);
    }
  };
};

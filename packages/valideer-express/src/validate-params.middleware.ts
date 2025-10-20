import { ClassType } from "class-transformer-validator";
import { ReqHandler } from "./req-handler";
import { IParsedParamsState, TransformValidationOptions } from "@valideer/core";
import { validateAndParseParams, validateParams } from "./validate-params";

export const validateParamsMiddleware = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): ReqHandler<IParsedParamsState<T>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.params = await validateParams(validateionClass, req, options);

      next();
    } catch (err) {
      return next(err);
    }
  };
};

export const validateAndParseParamsMiddleware = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): ReqHandler<IParsedParamsState<U>> => {
  return async (req, res, next) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.params = await validateAndParseParams(
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

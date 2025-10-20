import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import {
  ValidationMiddlewareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";
import { Request } from "express";
import * as core from "express-serve-static-core";

export const validateParams = async <T extends object>(
  validateionClass: ClassType<T>,
  req: Request<
    core.ParamsDictionary,
    any,
    any,
    core.Query,
    Record<string, any>
  >,
  options?: TransformValidationOptions,
) => {
  try {
    if (!options) options = {};
    options.validator = options?.validator ?? {};
    options.validator.whitelist = options?.validator?.whitelist ?? false;
    options.validator.skipMissingProperties =
      options?.validator?.skipMissingProperties ?? true;

    return await validate<T>(validateionClass, req.params, options);
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

export const validateAndParseParams = async <T extends object, U>(
  validateionClass: ClassType<T>,
  req: Request<
    core.ParamsDictionary,
    any,
    any,
    core.Query,
    Record<string, any>
  >,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
) => {
  try {
    if (!options) options = {};
    options.validator = options?.validator ?? {};
    options.validator.whitelist = options?.validator?.whitelist ?? false;
    options.validator.skipMissingProperties =
      options?.validator?.skipMissingProperties ?? true;

    return await validateAndParse<T, U>(
      validateionClass,
      req.params,
      parse,
      options,
    );
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

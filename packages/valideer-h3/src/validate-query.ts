import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import {
  ValidationMiddlewareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";
import { getQuery, getRouterParams, H3Event } from "h3";

export const validateQuery = async <T extends object>(
  validateionClass: ClassType<T>,
  event: H3Event,
  options?: TransformValidationOptions,
) => {
  try {
    if (!options) options = {};
    options.validator = options?.validator ?? {};
    options.validator.whitelist = options?.validator?.whitelist ?? false;
    options.validator.skipMissingProperties =
      options?.validator?.skipMissingProperties ?? true;

    const query = getQuery(event)
    if (query == null) throw new Error('no query')

    return await validate<T>(
      validateionClass,
      query,
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

export const validateAndParseQuery = async <T extends object, U>(
  validateionClass: ClassType<T>,
  event: H3Event,
  parse: (data: T) => U,
  options?: TransformValidationOptions & {
    routerParamsOptions?: {
      decode?: boolean;
    }
  },
) => {
  try {
    if (!options) options = {};
    options.validator = options?.validator ?? {};
    options.validator.whitelist = options?.validator?.whitelist ?? false;
    options.validator.skipMissingProperties =
      options?.validator?.skipMissingProperties ?? true;

    const query = getQuery(event);
    if (query == null) throw new Error('no query')

    return await validateAndParse<T, U>(
      validateionClass,
      query,
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

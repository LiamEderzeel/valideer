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

export const validateParams = async <T extends object>(
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

    const params = getQuery(event)
    if (params == null) throw new Error('no params')

    return await validate<T>(
      validateionClass,
      params,
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

export const validateAndParseParams = async <T extends object, U>(
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

    const params = getRouterParams(event, options.routerParamsOptions);
    if (params == null) throw new Error('no params')

    return await validateAndParse<T, U>(
      validateionClass,
      params,
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

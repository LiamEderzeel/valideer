import { H3Event, readBody } from "h3"
import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import {
  ValidationMiddlewareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";

export const validateBody = async <T extends object>(
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

    const body = await readBody(event)
    if (body == null) throw new Error("body undefined")

    return await validate<T>(
      validateionClass,
      body,
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

export const validateAndParseBody = async <T extends object, U>(
  validationClass: ClassType<T>,
  event: H3Event,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
) => {
  try {
    if (!options) options = {};
    options.validator = options?.validator ?? {};
    options.validator.whitelist = options?.validator?.whitelist ?? false;
    options.validator.skipMissingProperties =
      options?.validator?.skipMissingProperties ?? true;

    const body = await readBody(event)
    if (body == null) throw new Error("body undefined")

    return await validateAndParse<T, U>(
      validationClass,
      body,
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

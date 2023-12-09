import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  IParsedBodyState,
  ValidationMiddlwareError,
  isValidationError,
  validate,
  validateAndParse,
} from "@valideer/core";
import { bodyParser } from "@koa/bodyparser";
import { BodyParserOptions } from "@koa/bodyparser/dist/body-parser.types";

export const validateBody = <T extends object>(
  validateionClass: ClassType<T>,
  transformValidationOptions?: TransformValidationOptions,
  bodyparserOptions?: BodyParserOptions,
): Middleware<IParsedBodyState<T>> => {
  return async (ctx, next) => {
    await bodyParser(bodyparserOptions)(ctx, next);

    try {
      if (!transformValidationOptions) transformValidationOptions = {};
      transformValidationOptions.validator =
        transformValidationOptions?.validator ?? {};
      transformValidationOptions.validator.whitelist =
        transformValidationOptions?.validator?.whitelist ?? false;
      transformValidationOptions.validator.skipMissingProperties =
        transformValidationOptions?.validator?.skipMissingProperties ?? true;

      ctx.state.body = await validate<T>(
        validateionClass,
        ctx.request.body,
        transformValidationOptions,
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

export const validateAndParseBody = <T extends object, U>(
  validationClass: ClassType<T>,
  parse: (data: T) => U,
  transformValidationOptions?: TransformValidationOptions,
  bodyparserOptions?: BodyParserOptions,
): Middleware<IParsedBodyState<U>> => {
  return async (ctx, next) => {
    await bodyParser(bodyparserOptions)(ctx, next);

    try {
      if (!transformValidationOptions) transformValidationOptions = {};
      transformValidationOptions.validator =
        transformValidationOptions?.validator ?? {};
      transformValidationOptions.validator.whitelist =
        transformValidationOptions?.validator?.whitelist ?? false;
      transformValidationOptions.validator.skipMissingProperties =
        transformValidationOptions?.validator?.skipMissingProperties ?? true;

      ctx.state.body = await validateAndParse<T, U>(
        validationClass,
        ctx.request.body,
        parse,
        transformValidationOptions,
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

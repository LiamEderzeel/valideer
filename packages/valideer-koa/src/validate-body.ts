import { ClassType } from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { ParameterizedContext } from "koa";
import {
  ValidationMiddlewareError,
  isValidationError,
  validate,
  validateAndParse,
  TransformValidationOptions,
} from "@valideer/core";
import "@koa/bodyparser";
import { StandardSchemaV1 } from "@standard-schema/spec";

export async function validateData<Schema extends StandardSchemaV1>(
  data: unknown,
  fn: Schema,
): Promise<StandardSchemaV1.InferOutput<Schema>>;
export async function validateData<T>(
  data: unknown,
  fn: (data: unknown) => ValidateResult<T> | Promise<ValidateResult<T>>,
): Promise<T>;
export async function validateData<T>(
  data: unknown,
  fn: ValidateFunction<T>,
): Promise<T> {

  export const validateBody = async <T extends object>(
    validateionClass: ClassType<T>,
    ctx: ParameterizedContext,
    options?: TransformValidationOptions,
  ) => {
    try {
      if (!options) options = {};
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      return await validate<T>(validateionClass, ctx.request.body, options);
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
    ctx: ParameterizedContext,
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
        validationClass,
        ctx.request.body,
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

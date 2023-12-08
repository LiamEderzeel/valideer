import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  BaseParseValidationClass,
  IParsedQueryState,
  IValidationClass,
  ValidationMiddlwareError,
  isValidationError,
  validate,
} from "@valideer/core";

export const validateQuery = <T extends IValidationClass>(
  queryClass: ClassType<T>,
  options: TransformValidationOptions = {},
): Middleware<IParsedQueryState<T, BaseParseValidationClass<T>>> => {
  return async (ctx, next) => {
    try {
      ctx.state.query = await validate<T>(queryClass, ctx.query, options);

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

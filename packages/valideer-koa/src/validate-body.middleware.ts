import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  BaseParseValidationClass,
  IParsedBodyState,
  IValidationClass,
  ValidationMiddlwareError,
  isValidationError,
  validate,
} from "@valideer/core";

export const validateBody = <T extends IValidationClass>(
  queryClass: ClassType<T>,
  options: TransformValidationOptions = {},
): Middleware<IParsedBodyState<T, BaseParseValidationClass<T>>> => {
  return async (ctx, next) => {
    try {
      ctx.state.body = await validate<T>(queryClass, ctx.query, options);

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

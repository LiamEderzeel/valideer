import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import {
  BaseParseValidationClass,
  IParsedParamsState,
  IValidationClass,
  ValidationMiddlwareError,
  isValidationError,
  validate,
} from "valideer";

export const validateParams = <T extends IValidationClass>(
  queryClass: ClassType<T>,
  options: TransformValidationOptions = {},
): Middleware<IParsedParamsState<T, BaseParseValidationClass<T>>> => {
  return async (ctx, next) => {
    try {
      ctx.state.params = await validate<T>(queryClass, ctx.query, options);

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

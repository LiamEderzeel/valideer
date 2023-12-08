import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import {
  BaseParseValidationClass,
  IValidationClass,
  ValidationMiddlwareError,
  isValidationError,
  validate,
  IParsedQueryState,
} from "@valideer/core";
import { ReqHandler } from "./req-handler";

export const validateQuery = <T extends IValidationClass>(
  queryClass: ClassType<T>,
  options: TransformValidationOptions = {},
): ReqHandler<IParsedQueryState<T, BaseParseValidationClass<T>>> => {
  return async (req, res, next) => {
    try {
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.query = await validate<T>(queryClass, req.query, options);

      next();
    } catch (err) {
      if (Array.isArray(err) && err.every(isValidationError)) {
        return next(new ValidationMiddlwareError(err));
      } else if (err instanceof ValidationError) {
        return next(new ValidationMiddlwareError([err]));
      } else {
        return next(err);
      }
    }
  };
};

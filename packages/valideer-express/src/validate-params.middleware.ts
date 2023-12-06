import {
  ClassType,
  TransformValidationOptions,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";
import { ReqHandler } from "./req-handler";
import {
  BaseParseValidationClass,
  IValidationClass,
  ValidationMiddlwareError,
  IParsedParamsState,
  isValidationError,
  validate,
} from "valideer";

export const validateParams = <T extends IValidationClass>(
  paramClass: ClassType<T>,
  options: TransformValidationOptions = {},
): ReqHandler<IParsedParamsState<T, BaseParseValidationClass<T>>> => {
  return async (req, res, next) => {
    try {
      options.validator = options?.validator ?? {};
      options.validator.whitelist = options?.validator?.whitelist ?? false;
      options.validator.skipMissingProperties =
        options?.validator?.skipMissingProperties ?? true;

      res.locals.params = await validate<T>(paramClass, req.params);

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

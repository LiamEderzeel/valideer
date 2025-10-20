import { ClassType } from "class-transformer-validator";
import { ReqHandler } from "./req-handler";
import { IParsedBodyState, TransformValidationOptions } from "@valideer/core";
import { validateAndParseBody, validateBody } from "./validate-body";

export const validateBodyMiddleware = <T extends object>(
  validateionClass: ClassType<T>,
  options?: TransformValidationOptions,
): ReqHandler<IParsedBodyState<T>> => {
  return async (req, res, next) => {
    try {
      res.locals.body = await validateBody(validateionClass, req, options);

      next();
    } catch (err) {
      return next(err);
    }
  };
};

export const validateAndParseBodyMiddleware = <T extends object, U>(
  validateionClass: ClassType<T>,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): ReqHandler<IParsedBodyState<U>> => {
  return async (req, res, next) => {
    try {
      res.locals.body = await validateAndParseBody(
        validateionClass,
        req,
        parse,
        options,
      );

      next();
    } catch (err) {
      return next(err);
    }
  };
};

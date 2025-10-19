import { ValidationMiddlewareError } from "@valideer/core";
import { ValidationError } from "class-validator";
import { Middleware } from "h3";

const logError = (err: ValidationError) => {
  console.log(err);
  if (err.children) {
    err.children.forEach((err) => logError(err));
  }
};

export const errorMiddleware: Middleware = async (event, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValidationMiddlewareError) {
      const { errors, message } = err;
      err.errors.forEach((x) => logError(x));

      event.res.status = 400;
      return JSON.stringify({ message, errors });
    }

    event.res.status = 500;
    return
  }
};

import { ValidationMiddlewareError } from "@valideer/core";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";

const logError = (err: ValidationError) => {
  console.log(err);
  if (err.children) {
    err.children.forEach((err) => logError(err));
  }
};

export const errorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValidationMiddlewareError) {
      const { errors, message } = err;
      err.errors.forEach((x) => logError(x));

      ctx.status = 400;
      ctx.body = { message, errors };
      return;
    }

    ctx.status = 500;
  }
};

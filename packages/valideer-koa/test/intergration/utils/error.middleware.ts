import { ValidationMiddlewareError, ValideerError } from "@valideer/core";
import { ValidationError } from "class-validator";
import { Middleware } from "koa";
import { ValiError } from "valibot";

const logError = (err: ValidationError) => {
  console.log(err);
  if (err.children) {
    err.children.forEach((err) => logError(err));
  }
};

// const formatValideerErrors = (err: ValideerError) => {
//   console.log(err);
//   if (err.issues) {
//     err.issues.forEach((err) => ({ path: err.path.join(".") }));
//   }
// };

export const errorMiddleware: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValiError) {
      // const { cause, message } = err;

      ctx.status = 400;
      return;
    }
    if (err instanceof ValideerError) {
      const { cause, message } = err;
      // err.errors.forEach((x) => logError(x));
      //
      if (err.cause instanceof ValidationError) {
        logError(err.cause);
      }
      // elseif(err instanceof ){
      // }
      // cause.issues;

      ctx.status = 400;
      ctx.body = { message, errors: cause.issues };
      return;
    }
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

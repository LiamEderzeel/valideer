import { ValidationMiddlewareError } from "@valideer/core";
import { ValidationError } from "class-validator";
import { ErrorRequestHandler } from "express";

const logError = (err: ValidationError) => {
  console.log(err);
  if (err.children) {
    err.children.forEach((err) => logError(err));
  }
};

export const errorMiddleware: ErrorRequestHandler = async (
  error,
  _req,
  res,
  _next,
) => {
  console.log(error);
  if (error instanceof ValidationMiddlewareError) {
    const { errors, message } = error;
    error.errors.forEach((x) => logError(x));

    res.status(400);
    res.json({ message, errors });
    return;
  }

  res.status(500);
};

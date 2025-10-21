import { ValidationMiddlewareError, ValideerError } from "@valideer/core";
import { ValidationError } from "class-validator";
import { ErrorRequestHandler } from "express";
import { ValiError } from "valibot";

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
  if (error instanceof ValiError) {
    const { message } = error;
    res.status(400);
    res.json({ message, error });
    return;
  }
  if (error instanceof ValideerError) {
    const { message } = error;
    res.status(400);
    res.json({ message, error });
    return;
  }
  if (error instanceof ValidationMiddlewareError) {
    const { errors, message } = error;
    error.errors.forEach((x) => logError(x));

    res.status(400);
    res.json({ message, errors });
    return;
  }

  res.status(500);
};

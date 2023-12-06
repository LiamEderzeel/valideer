import { ValidationError } from "class-validator";

export const isValidationError = (value: unknown): value is ValidationError => {
  return value instanceof ValidationError;
};

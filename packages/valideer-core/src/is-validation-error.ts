import { ValideerError } from "./standart-schema.js";

export const isValidationError = (value: unknown): value is ValideerError => {
  return value instanceof ValideerError;
};

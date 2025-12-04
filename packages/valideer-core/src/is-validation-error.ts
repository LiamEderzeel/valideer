import { ValideerError } from "./standart-schema";

export const isValidationError = (value: unknown): value is ValideerError => {
  return value instanceof ValideerError;
};

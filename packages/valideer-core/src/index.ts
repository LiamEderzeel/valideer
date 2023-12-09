import {
  ClassType,
  TransformValidationOptions,
  transformAndValidate,
} from "class-transformer-validator";
import { ValidationError } from "class-validator";

export * from "./parsed-query-state";
export * from "./parsed-params-state";
export * from "./parsed-body-state";
export * from "./is-validation-error";

export class ValidationMiddlwareError extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[], message: string = "") {
    super(message);
    this.errors = errors;
  }
}

export const validateAndParse = async <T extends object, U>(
  classType: ClassType<T>,
  data: Record<string, string> | object,
  parse: (data: T) => U,
  options: TransformValidationOptions = {
    validator: {
      skipMissingProperties: true,
      validationError: { target: false },
    },
  },
): Promise<U> => {
  const validator = await validate<T>(classType, data, options);

  return parse(validator);
};

export const validate = async <T extends object>(
  classType: ClassType<T>,
  data: Record<string, string> | object,
  options: TransformValidationOptions = {
    validator: {
      skipMissingProperties: true,
      validationError: { target: false },
    },
  },
): Promise<T> => {
  return await transformAndValidate<T>(classType, data, options);
};

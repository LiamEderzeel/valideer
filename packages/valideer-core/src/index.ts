import { ClassTransformOptions } from "class-transformer";
import {
  ClassType,
  TransformValidationOptions as ClassTransformValidationOptions,
  transformAndValidate,
} from "class-transformer-validator";
import {
  ValidationError,
  ValidatorOptions as ClassValidatorOptions,
} from "class-validator";

export * from "./parsed-query-state";
export * from "./parsed-params-state";
export * from "./parsed-body-state";
export * from "./is-validation-error";
export * from "./validation";

export class ValidationMiddlwareError extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[], message: string = "") {
    super(message);
    this.errors = errors;
    this.name = "ValidationMiddlwareError";

    Object.setPrototypeOf(this, ValidationMiddlwareError.prototype);
  }
}

export type ValidatorOptions = Omit<ClassValidatorOptions, "groups"> & {
  groups?:
    | ((data: string[] | Record<string, string> | object) => string[])
    | string[]
    | undefined;
};

export type TransformValidationOptions = {
  validator?: ValidatorOptions;
  transformer?: ClassTransformOptions;
};

const valideerTransformValidationOptionsToTransformValidationOptions = (
  data: Record<string, string> | object,
  options: TransformValidationOptions,
): ClassTransformValidationOptions => {
  if (options?.validator?.groups) {
    options.validator.groups =
      typeof options.validator.groups === "function"
        ? options.validator.groups(data)
        : options.validator.groups;
    options.validator?.groups;
  }

  return options as ClassTransformValidationOptions;
};

export const validateAndParse = async <T extends object, U>(
  classType: ClassType<T>,
  data: Record<string, string> | object,
  parse: (data: T) => U,
  options?: TransformValidationOptions,
): Promise<U> => {
  if (!options)
    options = {
      validator: {
        skipMissingProperties: true,
        validationError: { target: false },
      },
    };

  const validator = await validate<T>(classType, data, options);

  return parse(validator);
};

export const validate = async <T extends object>(
  classType: ClassType<T>,
  data: Record<string, string> | object,
  options?: TransformValidationOptions,
): Promise<T> => {
  if (!options)
    options = {
      validator: {
        skipMissingProperties: true,
        validationError: { target: false },
      },
    };

  return await transformAndValidate<T>(
    classType,
    data,
    valideerTransformValidationOptionsToTransformValidationOptions(
      data,
      options,
    ),
  );
};

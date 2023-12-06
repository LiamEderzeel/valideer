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

export interface IValidationClass {
  parse(): BaseParseValidationClass<IValidationClass>;
}

export abstract class BaseParseValidationClass<T extends IValidationClass> {
  rawParams: T;
  constructor(params: T) {
    this.rawParams = params;
  }
}

export const validate = async <T extends IValidationClass>(
  classType: ClassType<T>,
  data: Record<string, string> | object,
  options: TransformValidationOptions = {
    validator: {
      skipMissingProperties: true,
      validationError: { target: false },
    },
  },
): Promise<BaseParseValidationClass<T>> => {
  const validator: T = await transformAndValidate<T>(classType, data, options);

  return validator.parse() as BaseParseValidationClass<T>;
};

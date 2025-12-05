import { ValidateResult } from "@valideer/core";
import { ClassType, transformAndValidate } from "class-transformer-validator";

function isObjectValue(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

export function defineClassValidator<T extends object, U>(
  classType: ClassType<T>,
  parse?: (data: T) => U,
): (data: unknown) => ValidateResult<U> | Promise<ValidateResult<U>> {
  return async function (data: unknown) {
    if (!isObjectValue(data)) throw new Error("expect object");

    const validatedBody = await transformAndValidate(classType, data);

    const res = parse ? parse(validatedBody) : validatedBody;

    return res as U;
  };
}

import { StandardSchemaV1 } from "@standard-schema/spec";

export * from "./parsed-query-state";
export * from "./parsed-params-state";
export * from "./parsed-body-state";
export * from "./is-validation-error";
export * from "./validation";

export type ValidateResult<T> = T | true | false | void;

export type ValidateFunction<
  T,
  Schema extends StandardSchemaV1 = StandardSchemaV1<any, T>,
> =
  | Schema
  | ((data: unknown) => ValidateResult<T> | Promise<ValidateResult<T>>);

export async function validateData<Schema extends StandardSchemaV1>(
  data: unknown,
  fn: Schema,
): Promise<StandardSchemaV1.InferOutput<Schema>>;
export async function validateData<T>(
  data: unknown,
  fn: (data: unknown) => ValidateResult<T> | Promise<ValidateResult<T>>,
): Promise<T>;
export async function validateData<T>(
  data: unknown,
  fn: ValidateFunction<T>,
): Promise<T> {
  if ("~standard" in fn) {
    const result = await fn["~standard"].validate(data);
    if (result.issues) {
      throw createValidationError({
        message: "Validation failed",
        issues: result.issues,
      });
    }
    return result.value;
  }

  try {
    const res = await fn(data);
    if (res === false) {
      throw createValidationError({ message: "Validation failed" });
    }
    if (res === true) {
      return data as T;
    }
    return res ?? (data as T);
  } catch (error) {
    throw createValidationError(error);
  }
}

export type ErrorDetails = Error & { cause?: unknown };

export class ValideerError extends Error {
  override get name(): string {
    return "ValideerError";
  }

  constructor(message: string, details?: ErrorDetails);
  constructor(details: ErrorDetails);
  constructor(arg1: string | ErrorDetails, arg2?: ErrorDetails) {
    let messageInput: string | undefined;
    let details: ErrorDetails | undefined;

    if (typeof arg1 === "string") {
      messageInput = arg1;
      details = arg2;
    } else {
      details = arg1;
    }
    const message: string =
      messageInput ||
      details?.message ||
      (details?.cause as ErrorDetails)?.message;

    super(message, { cause: details });
    this.cause = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

function createValidationError(validateError?: any) {
  return new ValideerError(validateError?.message, validateError);
}

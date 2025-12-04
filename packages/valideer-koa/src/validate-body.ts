import { isDataContainer, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { ParameterizedContext } from "koa";
import { InferKoaInput } from "./context";
import type { ValidateResult } from "@valideer/core";

export async function validateBody<
  Context extends ParameterizedContext,
  S extends StandardSchemaV1,
>(ctx: Context, validate: S): Promise<StandardSchemaV1.InferOutput<S>>;
export async function validateBody<
  Context extends ParameterizedContext,
  OutputT,
  InputT = InferKoaInput<"body", Context, OutputT>,
>(
  ctx: Context,
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Promise<OutputT>;
export async function validateBody(
  ctx: ParameterizedContext,
  validate: any,
): Promise<any> {
  const t = await validateData(getBodyFromContext(ctx), validate);
  return t;
}

function getBodyFromContext(ctx: ParameterizedContext) {
  const contentType = ctx.request.type;

  const rawBody = ctx.request.body;

  if (contentType === "multipart/form-data") {
    return rawBody;
  }

  if (!rawBody || !isDataContainer(rawBody)) {
    return rawBody;
  }

  try {
    return JSON.parse(rawBody.data);
  } catch (e) {
    ctx.throw(400, "Invalid JSON in multipart 'data' field.");
  }
}

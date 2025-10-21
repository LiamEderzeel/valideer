import { ValidateResult, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { ParameterizedContext } from "koa";
import { InferKoaInput } from "./context";

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
  const t = await validateData(ctx.request.body, validate);
  return t;
}

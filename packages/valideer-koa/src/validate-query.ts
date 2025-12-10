import { ParameterizedContext } from "koa";
import { ValidateResult, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { InferKoaInput } from "./context.js";

export async function validateQuery<
  Context extends ParameterizedContext,
  S extends StandardSchemaV1,
>(ctx: Context, validate: S): Promise<StandardSchemaV1.InferOutput<S>>;
export async function validateQuery<
  Context extends ParameterizedContext,
  OutputT,
  InputT = InferKoaInput<"query", Context, OutputT>,
>(
  ctx: Context,
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Promise<OutputT>;
export async function validateQuery(
  ctx: ParameterizedContext,
  validate: any,
): Promise<any> {
  const t = await validateData(ctx.query, validate);
  return t;
}

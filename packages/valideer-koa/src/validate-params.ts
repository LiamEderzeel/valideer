import { ParameterizedContext } from "koa";
import { ValidateResult, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { InferKoaInput } from "./context";

export async function validateParams<
  Context extends ParameterizedContext,
  S extends StandardSchemaV1,
>(ctx: Context, validate: S): Promise<StandardSchemaV1.InferOutput<S>>;
export async function validateParams<
  Context extends ParameterizedContext,
  OutputT,
  InputT = InferKoaInput<"params", Context, OutputT>,
>(
  ctx: Context,
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Promise<OutputT>;
export async function validateParams(
  ctx: ParameterizedContext,
  validate: any,
): Promise<any> {
  const t = await validateData(ctx.params, validate);
  return t;
}

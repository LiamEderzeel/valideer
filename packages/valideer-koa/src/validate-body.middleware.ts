import { Middleware, ParameterizedContext } from "koa";
import { IParsedBodyState, ValidateResult } from "@valideer/core";
import { validateBody } from "./validate-body.js";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { InferKoaInput } from "./context.js";

export function validateBodyMiddleware<
  _Context extends ParameterizedContext,
  S extends StandardSchemaV1,
>(validate: S): Middleware<IParsedBodyState<StandardSchemaV1.InferOutput<S>>>;
export function validateBodyMiddleware<
  Context extends ParameterizedContext,
  OutputT,
  InputT = InferKoaInput<"body", Context, OutputT>,
>(
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Middleware<IParsedBodyState<OutputT>>;
export function validateBodyMiddleware(
  validate: any,
): Middleware<IParsedBodyState<any>> {
  return async (ctx, next) => {
    ctx.state.body = await validateBody(ctx, validate);
    await next();
  };
}

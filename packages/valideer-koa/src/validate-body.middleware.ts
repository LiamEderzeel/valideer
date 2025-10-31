import { Middleware, ParameterizedContext } from "koa";
import { IParsedBodyState, ValidateResult } from "@valideer/core";
import { validateBody } from "./validate-body";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { InferKoaInput } from "./context";

export function validateBodyMiddleware<
  Context extends ParameterizedContext,
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
    try {
      ctx.state.body = await validateBody(ctx, validate);
      await next();
    } catch (err) {
      throw err;
    }
  };
}

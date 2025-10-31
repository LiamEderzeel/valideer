import { Middleware, ParameterizedContext } from "koa";
import { IParsedParamsState, ValidateResult } from "@valideer/core";
import { validateParams } from "./validate-params";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { InferKoaInput } from "./context";

export function validateParamsMiddleware<
  Context extends ParameterizedContext,
  S extends StandardSchemaV1,
>(validate: S): Middleware<IParsedParamsState<StandardSchemaV1.InferOutput<S>>>;
export function validateParamsMiddleware<
  Context extends ParameterizedContext,
  OutputT,
  InputT = InferKoaInput<"params", Context, OutputT>,
>(
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Middleware<IParsedParamsState<OutputT>>;
export function validateParamsMiddleware(
  validate: any,
): Middleware<IParsedParamsState<any>> {
  return async (ctx, next) => {
    try {
      ctx.state.params = await validateParams(ctx, validate);
      await next();
    } catch (err) {
      throw err;
    }
  };
}

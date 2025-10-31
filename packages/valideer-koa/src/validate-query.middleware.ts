import { Middleware, ParameterizedContext } from "koa";
import { IParsedQueryState, ValidateResult } from "@valideer/core";
import { validateQuery } from "./validate-query";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { InferKoaInput } from "./context";

export function validateQueryMiddleware<
  Context extends ParameterizedContext,
  S extends StandardSchemaV1,
>(validate: S): Middleware<IParsedQueryState<StandardSchemaV1.InferOutput<S>>>;
export function validateQueryMiddleware<
  Context extends ParameterizedContext,
  OutputT,
  InputT = InferKoaInput<"query", Context, OutputT>,
>(
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Middleware<IParsedQueryState<OutputT>>;

export function validateQueryMiddleware(
  validate: any,
): Middleware<IParsedQueryState<any>> {
  return async (ctx, next) => {
    try {
      ctx.state.query = await validateQuery(ctx, validate);
      await next();
    } catch (err) {
      throw err;
    }
  };
}

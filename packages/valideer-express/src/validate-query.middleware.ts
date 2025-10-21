import { ReqHandler } from "./req-handler";
import { IParsedQueryState, ValidateResult } from "@valideer/core";
import { ExpressRequest, InferExpressInput } from "./request";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { validateQuery } from "./validate-query";

export function validateQueryMiddleware<
  Req extends ExpressRequest,
  S extends StandardSchemaV1,
>(validate: S): ReqHandler<IParsedQueryState<StandardSchemaV1.InferOutput<S>>>;
export function validateQueryMiddleware<
  Req extends ExpressRequest,
  OutputT,
  InputT = InferExpressInput<"params", Req, OutputT>,
>(
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): ReqHandler<IParsedQueryState<OutputT>>;
export function validateQueryMiddleware(
  validate: any,
): ReqHandler<IParsedQueryState<any>> {
  return async (req, res, next) => {
    try {
      res.locals.query = await validateQuery(req, validate);

      next();
    } catch (err) {
      return next(err);
    }
  };
}

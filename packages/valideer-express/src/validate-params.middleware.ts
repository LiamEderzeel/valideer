import { ReqHandler } from "./req-handler.js";
import { IParsedParamsState, ValidateResult } from "@valideer/core";
import { ExpressRequest, InferExpressInput } from "./request.js";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { validateParams } from "./validate-params.js";

export function validateParamsMiddleware<
  _Req extends ExpressRequest,
  S extends StandardSchemaV1,
>(validate: S): ReqHandler<IParsedParamsState<StandardSchemaV1.InferOutput<S>>>;
export function validateParamsMiddleware<
  Req extends ExpressRequest,
  OutputT,
  InputT = InferExpressInput<"params", Req, OutputT>,
>(
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): ReqHandler<IParsedParamsState<OutputT>>;
export function validateParamsMiddleware(
  validate: any,
): ReqHandler<IParsedParamsState<any>> {
  return async (req, res, next) => {
    try {
      res.locals.params = await validateParams(req, validate);

      next();
    } catch (err) {
      return next(err);
    }
  };
}

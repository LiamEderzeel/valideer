import { ReqHandler } from "./req-handler.js";
import { IParsedBodyState, ValidateResult } from "@valideer/core";
import { validateBody } from "./validate-body.js";
import { ExpressRequest, InferExpressInput } from "./request.js";
import { StandardSchemaV1 } from "@standard-schema/spec";

export function validateBodyMiddleware<
  _Req extends ExpressRequest,
  S extends StandardSchemaV1,
>(validate: S): ReqHandler<IParsedBodyState<StandardSchemaV1.InferOutput<S>>>;
export function validateBodyMiddleware<
  Req extends ExpressRequest,
  OutputT,
  InputT = InferExpressInput<"body", Req, OutputT>,
>(
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): ReqHandler<IParsedBodyState<OutputT>>;
export function validateBodyMiddleware(
  validate: any,
): ReqHandler<IParsedBodyState<any>> {
  return async (req, res, next) => {
    try {
      res.locals.body = await validateBody(req, validate);

      next();
    } catch (err) {
      return next(err);
    }
  };
}

import { Request } from "express";
import { ValidateResult, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { ExpressRequest, InferExpressInput } from "./request.js";

export async function validateQuery<
  Req extends ExpressRequest,
  S extends StandardSchemaV1,
>(req: Req, validate: S): Promise<StandardSchemaV1.InferOutput<S>>;
export async function validateQuery<
  Req extends ExpressRequest,
  OutputT,
  InputT = InferExpressInput<"query", Req, OutputT>,
>(
  req: Req,
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Promise<OutputT>;
export async function validateQuery(req: Request, validate: any): Promise<any> {
  const t = await validateData(req.query, validate);
  return t;
}

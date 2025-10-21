import { Request } from "express";
import { ValidateResult, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { ExpressRequest, InferExpressInput } from "./request";

export async function validateParams<
  Req extends ExpressRequest,
  S extends StandardSchemaV1,
>(req: Req, validate: S): Promise<StandardSchemaV1.InferOutput<S>>;
export async function validateParams<
  Req extends ExpressRequest,
  OutputT,
  InputT = InferExpressInput<"params", Req, OutputT>,
>(
  req: Req,
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Promise<OutputT>;
export async function validateParams(
  req: Request,
  validate: any,
): Promise<any> {
  const t = await validateData(req.params, validate);
  return t;
}

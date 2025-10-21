import { Request } from "express";
import { ValidateResult, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { ExpressRequest, InferExpressInput } from "./request";

export async function validateBody<
  Req extends ExpressRequest,
  S extends StandardSchemaV1,
>(req: Req, validate: S): Promise<StandardSchemaV1.InferOutput<S>>;
export async function validateBody<
  Req extends ExpressRequest,
  OutputT,
  InputT = InferExpressInput<"body", Req, OutputT>,
>(
  req: Req,
  validate: (
    data: InputT,
  ) => ValidateResult<OutputT> | Promise<ValidateResult<OutputT>>,
): Promise<OutputT>;
export async function validateBody(req: Request, validate: any): Promise<any> {
  const t = await validateData(req.body, validate);
  return t;
}

import { Request } from "express";
import { ValidateResult, isDataContainer, validateData } from "@valideer/core";
import { StandardSchemaV1 } from "@standard-schema/spec";
import { ExpressRequest, InferExpressInput } from "./request.js";

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
  const t = await validateData(getBodyFromRequest(req), validate);
  return t;
}

function getBodyFromRequest(req: Request) {
  const contentType = req.headers["content-type"] || "";

  const rawBody = req.body;

  if (contentType.includes("multipart/form-data")) {
    return rawBody;
  }

  if (!rawBody || !isDataContainer(rawBody)) {
    return rawBody;
  }
  try {
    return JSON.parse(rawBody.data);
  } catch (e) {
    const error = new Error("Invalid JSON in 'data' field of request body.");
    error.cause = e;
    throw error;
  }
}

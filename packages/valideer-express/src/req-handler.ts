import { RequestHandler } from "express";
import type core from "express-serve-static-core";

export type GlobalLocals = { [key: string]: any };

export type ReqHandler<
  Locals = unknown,
  Params extends core.ParamsDictionary = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends core.Query = core.Query,
> = RequestHandler<Params, ResBody, ReqBody, ReqQuery, GlobalLocals & Locals>;

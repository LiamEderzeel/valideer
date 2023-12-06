import type core from "express-serve-static-core";

export type Res<State extends Record<string, any>> = core.Response<any, State>;

export type Req<
  ReqBody,
  Body = Record<string, any>,
  Query = core.Query,
> = core.Request<core.ParamsDictionary, Body, ReqBody, Query>;

export type DefaultState = {
  [key: string]: any;
};

export type ReqHandler<State extends Record<string, any> = DefaultState> = {
  (req: core.Request, res: Res<State>, next: core.NextFunction): void;
};

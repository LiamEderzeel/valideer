import { Request, Response, NextFunction } from "express";
import {
  ParamsDictionary,
  Query as ExpressQuery,
} from "express-serve-static-core";
import { ParsedQs } from "qs";

type ExpressInputMap = {
  params: ParamsDictionary;
  query: ExpressQuery & ParsedQs;
  body: any;
};

export interface ExpressEvent<
  E extends Partial<ExpressInputMap> = ExpressInputMap,
> {
  req: ExpressRequest<E>;
  res: Response;
  next: NextFunction;
}
export type ExpressRequest<
  E extends Partial<ExpressInputMap> = ExpressInputMap,
> = Request<
  E["params"] extends ParamsDictionary ? E["params"] : ParamsDictionary,
  any,
  E["body"] extends any ? E["body"] : any,
  E["query"] extends ExpressQuery ? E["query"] : ExpressQuery & ParsedQs
>;

export type InferExpressInput<
  Key extends keyof ExpressInputMap,
  Req extends Request,
  T = void,
> = void extends T
  ? Req extends ExpressRequest<infer E>
    ? E[Key]
    : ExpressInputMap[Key]
  : T;

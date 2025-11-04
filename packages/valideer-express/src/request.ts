import { Request, Response, NextFunction } from "express";
import {
  ParamsDictionary,
  Query as ExpressQuery,
} from "express-serve-static-core";
import { ParsedQs } from "qs";

// 1. The Express equivalent of KoaContext properties
// Maps the relevant Express request properties to a standardized input structure.

// NOTE: Express body is usually typed as 'any' or 'unknown' by default
// and depends entirely on the body-parser middleware used.
// We use 'any' as a practical default, but this should be customized
// to the actual body type if known (e.g., 'Record<string, any>' for JSON).

type ExpressInputMap = {
  // Express router parameters are on req.params
  params: ParamsDictionary; // A record of string keys to string values
  // Query parameters are on req.query
  query: ExpressQuery & ParsedQs; // The type for req.query
  // Body is on req.body (assuming a body parser middleware is used)
  body: any;
};

/**
 * A generic type that acts as a container for custom input types for Express.
 * E extends Partial<ExpressInputMap> allows us to override just specific keys (e.g., only 'body').
 */
export interface ExpressEvent<
  E extends Partial<ExpressInputMap> = ExpressInputMap,
> {
  // The full Express Request object, using the custom E types as overrides
  req: ExpressRequest<E>;
  // We often need the Response and NextFunction objects too
  res: Response;
  next: NextFunction;
}

// 2. A utility type for the Express Request object with custom input types.
/**
 * Extends the base Express Request to incorporate custom types for
 * params, query, and body from the input map E.
 */
export type ExpressRequest<
  E extends Partial<ExpressInputMap> = ExpressInputMap,
> = Request<
  E["params"] extends ParamsDictionary ? E["params"] : ParamsDictionary,
  any, // Response body is usually 'any' for the Request object
  E["body"] extends any ? E["body"] : any,
  E["query"] extends ExpressQuery ? E["query"] : ExpressQuery & ParsedQs
>;

// 3. The main inference utility type (equivalent)
/**
 * Infers the type of a specific request input property from an Express event.
 * Uses an explicit override (T) or infers from the ExpressEvent's payload (E).
 */
export type InferExpressInput<
  Key extends keyof ExpressInputMap,
  Req extends Request,
  T = void,
> = void extends T
  ? Req extends ExpressRequest<infer E> // Check against the new structure
  ? E[Key]
  : ExpressInputMap[Key] // Fallback to the default type if no specific override
  : T;

import {
  Context,
  DefaultContext,
  DefaultState,
  ParameterizedContext,
} from "koa";

type KoaInputMap = {
  // Koa router parameters are usually on ctx.params
  params: Context["params"];
  // Query parameters are on ctx.query
  query: Context["query"];
  // Body is on ctx.request.body (assuming a body parser)
  body: Context["request"]["body"];
};

/**
 * A generic type that acts as a container for custom input types.
 * E extends KoaInputMap allows us to override just specific keys (e.g., only 'body').
 */
export interface KoaEvent<E extends Partial<KoaInputMap> = KoaInputMap> {
  // The full context object, using the custom E types as overrides
  ctx: E;
}

// 3. The main inference utility type (revised)
/** * Infers the type of a specific request input property from a Koa event.
 * Uses an explicit override (T) or infers from the KoaEvent's payload (E).
 */
export type InferKoaInput<
  Key extends keyof KoaInputMap,
  Context extends ParameterizedContext,
  T = void,
> = void extends T
  ? Context extends KoaInputContext<infer E> // Check against the new structure
  ? E[Key]
  : KoaInputMap[Key] // Fallback to the default type if no specific override
  : T;

export type KoaInputContext<E extends Partial<KoaInputMap> = KoaInputMap> =
  ParameterizedContext<DefaultState, DefaultContext & E>;

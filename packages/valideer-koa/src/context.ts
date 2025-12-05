import {
  Context,
  DefaultContext,
  DefaultState,
  ParameterizedContext,
} from "koa";

type KoaInputMap = {
  params: Context["params"];
  query: Context["query"];
  body: Context["request"]["body"];
};

export interface KoaEvent<E extends Partial<KoaInputMap> = KoaInputMap> {
  ctx: E;
}

export type InferKoaInput<
  Key extends keyof KoaInputMap,
  Context extends ParameterizedContext,
  T = void,
> = void extends T
  ? Context extends KoaInputContext<infer E>
    ? E[Key]
    : KoaInputMap[Key]
  : T;

export type KoaInputContext<E extends Partial<KoaInputMap> = KoaInputMap> =
  ParameterizedContext<DefaultState, DefaultContext & E>;

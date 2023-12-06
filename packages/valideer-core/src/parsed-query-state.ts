import { BaseParseValidationClass, IValidationClass } from ".";

export interface IParsedQueryState<
  T extends IValidationClass,
  U extends BaseParseValidationClass<T>,
> {
  query: U;
}

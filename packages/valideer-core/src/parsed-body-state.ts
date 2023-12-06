import { BaseParseValidationClass, IValidationClass } from ".";

export interface IParsedBodyState<
  T extends IValidationClass,
  U extends BaseParseValidationClass<T>,
> {
  body: U;
}

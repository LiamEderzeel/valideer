import { BaseParseValidationClass, IValidationClass } from ".";

export interface IParsedParamsState<
  T extends IValidationClass,
  U extends BaseParseValidationClass<T>,
> {
  params: U;
}

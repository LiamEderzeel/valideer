import { registerDecorator } from "class-validator";
import { parseStringList } from "./string-list.js";

const ISODateMatcher =
  /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

export const isIsoDate = (value: string): boolean => {
  return ISODateMatcher.test(value);
};

export const parseDateList = (value: string | string[]): Date[] => {
  const res = parseStringList(value);
  const listOfStrings = Array.isArray(res) ? res : [res];
  const listOfDateStrings = listOfStrings.filter((x) => isIsoDate(x));
  return listOfDateStrings.map((x) => new Date(x));
};

export const IsDateList = () => {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: "isDateList",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: `${propertyName} is not a comma separated list of ISO8601 dates`,
      },
      validator: {
        validate: (value: any) => {
          if (typeof value === "string" || Array.isArray(value)) {
            const res = parseStringList(value);
            const listOfStrings = Array.isArray(res) ? res : [res];
            for (const s of listOfStrings) {
              if (!isIsoDate(s)) return false;
            }
            return parseDateList(value).length > 0;
          }

          return false;
        },
      },
    });
  };
};

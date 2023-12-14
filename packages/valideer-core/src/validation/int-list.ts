import { registerDecorator } from "class-validator";
import { parseStringList } from "./string-list";

export const parseIntList = (value: string | string[]): number[] => {
  return parseStringList(value)
    .map((x) => parseInt(x, 10))
    .filter((x) => !isNaN(x));
};

export const IsIntList = () => {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: "isIntList",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { message: `${propertyName} is not a comma separated list of integers` },
      validator: {
        validate: (value: any) => {
          if (typeof value === "string" || Array.isArray(value)) {
            return parseIntList(value).length > 0;
          }

          return false;
        },
      },
    });
  };
};

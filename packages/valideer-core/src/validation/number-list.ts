import { registerDecorator } from "class-validator";
import { parseStringList } from "./string-list";

export const parseNumberList = (value: string | string[]): number[] => {
  return parseStringList(value)
    .map((x) => parseFloat(x))
    .filter((x) => !isNaN(x));
};

export const IsNumberList = () => {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: "isNumberList",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { message: `${propertyName} is not a comma separated list of numbers` },
      validator: {
        validate: (value: any) => {
          if (typeof value === "string" || Array.isArray(value)) {
            return parseNumberList(value).length > 0;
          }

          return false;
        },
      },
    });
  };
};

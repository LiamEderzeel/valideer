import { registerDecorator } from "class-validator";
import { parseStringList } from "./string-list.js";

export class SortByConstraint {
  key: string;
  direction: number;

  constructor(key: string, direction: number) {
    this.key = key;
    this.direction = direction;
  }
}

export const parseSortByConstraint = (
  value: string | string[],
): SortByConstraint[] => {
  const entries = parseStringList(value);

  return entries.map((x) => {
    if (x.search("-") >= 0) {
      return new SortByConstraint(x.replace("-", ""), -1);
    }

    return new SortByConstraint(x, 1);
  });
};

export const IsSortByConstraint = () => {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      name: "isIntList",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: `${propertyName} is not a comma separated list of positive or negative keys`,
      },
      validator: {
        validate: (value: any) => {
          if (typeof value === "string" || Array.isArray(value)) {
            return parseSortByConstraint(value).length > 0;
          }

          return false;
        },
      },
    });
  };
};

import { registerDecorator, ValidationOptions } from "class-validator";
import { ObjectId } from "bson";
import { parseStringList } from "./string-list";

export const parseObjectIdList = (value: string | string[]): string[] => {
  const res = parseStringList(value);
  const listOfStrings = Array.isArray(res) ? res : [res];
  const listOfObjectIdStrings = listOfStrings.filter((x) =>
    ObjectId.isValid(x),
  );
  return listOfObjectIdStrings;
};

export const IsObjectId = (validationOptions?: ValidationOptions) => {
  return (object: Record<string, unknown>, propertyName: string): void => {
    registerDecorator({
      name: "isObjectId",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message:
          validationOptions?.message || `${propertyName} is not an ObjectId`,
        each: validationOptions?.each || false,
      },
      validator: {
        validate: (value: unknown) => {
          if (typeof value !== "string") return false;
          return ObjectId.isValid(value);
        },
      },
    });
  };
};

export const IsObjectIdList = () => {
  return (object: Record<string, unknown>, propertyName: string): void => {
    registerDecorator({
      name: "isObjectIdList",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: `${propertyName} is not a comma separated list of ObjectId`,
      },
      validator: {
        validate: (value: unknown) => {
          if (typeof value === "string" || Array.isArray(value)) {
            const res = parseStringList(value);
            const listOfStrings = Array.isArray(res) ? res : [res];
            for (const s of listOfStrings) {
              if (!ObjectId.isValid(s)) return false;
            }
            return parseObjectIdList(value).length > 0;
          }

          return false;
        },
      },
    });
  };
};

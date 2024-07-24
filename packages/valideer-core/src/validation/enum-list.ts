import { isEnum } from "class-validator";

export const isEnumList = <T>(value: string | string[], entity: T): boolean => {
  return (Array.isArray(value) ? value : value.split(",")).every((x) =>
    isEnum(x, entity),
  );
};

export const parseEnumList = <T extends Record<string, T[keyof T]>>(
  value: string | string[],
  entity: T,
): T[keyof T][] => {
  return (Array.isArray(value) ? value : value.split(",")).map((x) => {
    return entity[
      Object.keys(entity)[Object.values(entity).indexOf(x as T[keyof T])]
    ];
  });
};

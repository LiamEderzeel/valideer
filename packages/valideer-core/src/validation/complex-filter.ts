import { registerDecorator } from "class-validator";
import { parseBooleanList } from "./boolean-list";
import { parseIntList } from "./int-list";
import { parseStringList } from "./string-list";
import { parseDateList } from "./date-list";
import { parseObjectIdList } from "./object-id-list";

export const parseComplexFilter = (
	value: Record<string, string | string[]> | string | string[],
	subType: "int" | "boolean" | "string" | "date" | "objectId" = "int",
	filter: "in" | "nin" | "gt" | "gte" | "lt" | "lte" | "eq" | "ne" = "in"
): Record<string, any> => {
	if (typeof value === "string" || Array.isArray(value)) {
		switch (subType) {
			case "int":
				return { [`$${filter}`]: parseIntList(value) };
			case "boolean":
				return { [`$${filter}`]: parseBooleanList(value) };
			case "string":
				return { [`$${filter}`]: parseStringList(value) };
			case "date":
				return { [`$${filter}`]: parseDateList(value) };
			case "objectId":
				return { [`$${filter}`]: parseObjectIdList(value) };
		}
	}

	if (typeof value === "object") {
		const filters = ["in", "nin", "gt", "gte", "lt", "lte", "eq", "ne"];
		const filterObject = {} as Record<string, any>;

		for (const filter of filters) {
			if (value[filter] == null) continue;

			const valueList = parseStringList(value[filter]);
			if (valueList.length > 0) {
				const filterKey = `$${filter}`;

				switch (subType) {
					case "int":
						filterObject[filterKey] = parseIntList(valueList);
						break;
					case "boolean":
						filterObject[filterKey] = parseBooleanList(valueList);
						break;
					case "string":
						filterObject[filterKey] = parseStringList(valueList);
						break;
					case "date":
						filterObject[filterKey] = parseDateList(valueList);
						break;
					case "objectId":
						filterObject[filterKey] = parseObjectIdList(valueList);
						break;
					default:
						break;
				}
			}
		}

		return filterObject;
	}

	throw new Error("unexpected value");
};

export const IsComplexFilter = (subType: "string" | "int" | "boolean" | "date" | "objectId") => {
	return (object: Record<string, any>, propertyName: string): void => {
		registerDecorator({
			name: "isComplexFilter",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: {
				message: `${propertyName} is not a valid complex filter`,
			},
			validator: {
				validate: (value: any) => {
					if (value == null) return false;

					const isRecord = (value: unknown): value is Record<string, string | string[]> => {
						if (value == null) return false;
						if (Array.isArray(value)) return false;
						if (typeof value !== "object") return false;
						return Object.values(value).every((x) => typeof x === "string" || isStringArray(x));
					};

					const isString = (value: unknown): value is string => {
						if (value == null) return false;
						return typeof value === "string";
					};

					const isStringArray = (value: unknown): value is string[] => {
						if (value == null) return false;
						if (!Array.isArray(value)) return false;
						return value.every((x) => typeof x === "string");
					};

					if (isRecord(value) || isString(value) || isStringArray(value)) {
						const parsed = parseComplexFilter(value, subType);

						if (Array.isArray(parsed)) {
							return parsed.length > 0;
						} else if (typeof parsed === "object") {
							return Object.keys(parsed).length > 0;
						}
					}

					return false;
				},
			},
		});
	};
};

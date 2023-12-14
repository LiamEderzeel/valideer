import { registerDecorator } from "class-validator";
import { parseStringList } from "./string-list";

export const parseBoolean = (value: string) => {
	return ["true", "1"].includes(value);
};

export const parseBooleanList = (value: string | string[]): boolean[] => {
	return parseStringList(value).map((x: string) => parseBoolean(x));
};

export const IsBooleanList = () => {
	return (object: Record<string, any>, propertyName: string): void => {
		registerDecorator({
			name: "isBooleanList",
			target: object.constructor,
			propertyName,
			constraints: [],
			options: { message: `${propertyName} is not a comma separated list of booleans` },
			validator: {
				validate: (value: any) => {
					if (typeof value === "string" || Array.isArray(value)) {
						return parseBooleanList(value).length > 0;
					}

					return false;
				},
			},
		});
	};
};

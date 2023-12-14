export const parseStringList = (value: string | string[]): string[] => {
	return Array.isArray(value) ? value : value.split(",");
};

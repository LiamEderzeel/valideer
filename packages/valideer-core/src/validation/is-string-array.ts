export const isStringArray = (val: unknown): val is string[] => {
	if (!Array.isArray(val)) return false;
	const stringEntries = val.filter((x) => typeof x === "string").length;

	return stringEntries === val.length;
};

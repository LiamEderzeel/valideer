import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/", "docs/.vitepress"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: { "@typescript-eslint/no-explicit-any": "off" },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);

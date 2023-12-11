import { defaultExclude, defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: ["packages/**/*.test.ts"],
      exclude: [...defaultExclude, "**/build/**"],
    },
  },
]);

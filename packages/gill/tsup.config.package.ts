import { defineConfig } from "tsup";

import { getBaseConfig } from "../build-scripts/getBaseConfig";

export default defineConfig((options = {}) => [
  // ...getBaseConfig("node", ["cjs", "esm"], options),
  ...getBaseConfig("node", ["cjs", "esm"], {
    ...options,
    entry: {
      index: "src/index.ts",
      "node/index": "src/node/index.ts",
      // some program clients have symbol collision, re-exporting under a different path helps resolve them
      "programs/index": "src/programs/index.ts",
      "programs/token/index": "src/programs/token/index.ts",
    },
  }),
  ...getBaseConfig("browser", ["cjs", "esm"], options),
  ...getBaseConfig("native", ["esm"], options),
]);

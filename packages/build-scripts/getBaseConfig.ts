import { env } from "node:process";

import browsersListToEsBuild from "browserslist-to-esbuild";
import { Format, Options } from "tsup";

import { DevFlagPlugin } from "./dev-flag";

type Platform =
  | "browser"
  // React Native
  | "native"
  | "node";

const BROWSERSLIST_TARGETS = browsersListToEsBuild();

export function getBaseConfig(
  platform: Platform,
  formats: Format[],
  optionsInput: Options,
): Options[] {
  return [true, false]
    .flatMap<Options | null>((isDebugBuild) =>
      formats.map((format) =>
        format !== "iife" && isDebugBuild
          ? null // We don't build debug builds for packages; only for the iife bundle.
          : {
              define: {
                __BROWSER__: `${platform === "browser"}`,
                __NODEJS__: `${platform === "node"}`,
                __REACTNATIVE__: `${platform === "native"}`,
                __VERSION__: `"${env.npm_package_version}"`,
              },
              dts: true, // This enables .d.ts file generation
              entry: optionsInput.entry ? optionsInput.entry : [`./src/index.ts`],
              esbuildOptions(options, context) {
                const { format } = context;
                options.minify = format === "iife" && !isDebugBuild;
                if (format === "iife") {
                  options.define = {
                    ...options.define,
                    __DEV__: `${isDebugBuild}`,
                  };
                  options.target = BROWSERSLIST_TARGETS;
                } else {
                  options.define = {
                    ...options.define,
                    // Preserve `process.env.NODE_ENV` in the output without
                    // replacing it. This allows consumers' bundlers to replace it
                    // as they see fit.
                    "process.env.NODE_ENV": "process.env.NODE_ENV",
                  };
                }
              },
              esbuildPlugins: [DevFlagPlugin],
              format,
              globalName: "globalThis.gill",
              name: platform,
              outExtension({ format }) {
                let extension;
                if (format === "iife") {
                  extension = `.${isDebugBuild ? "development" : "production.min"}.js`;
                } else {
                  extension = `.${platform}.${format === "cjs" ? "cjs" : "mjs"}`;
                }
                return {
                  js: extension,
                };
              },
              platform: platform === "node" ? "node" : "browser",
              pure: ["process"],
              sourcemap: format !== "iife" || isDebugBuild,
              treeshake: true,
            },
      ),
    )
    .filter(Boolean) as Options[];
}

// npx esrun codama-script/generate-client.ts --idl=./path/to/idl.json --js-out=./js-output --rust-out=./rust-output
// script to generate the codama client sdks from the anchor idl

import { createFromRoot, updateProgramsVisitor } from "codama";
import { AnchorIdl, rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderVisitor as renderJavaScriptVisitor } from "@codama/renderers-js";
// import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import * as path from "path";
import { ensureDirectoryExists, ensureFileExist, loadJsonFile } from "./utils.js";

type CodamaInputArgNames = "idl" | "js-out" | "program-name";

type CodamaInputArgs = Record<CodamaInputArgNames, string | undefined>;

// Parse command line arguments without external dependencies
function parseArgs() {
  const args = process.argv.slice(2);
  const result: CodamaInputArgs = {
    idl: undefined,
    "js-out": undefined,
    "program-name": undefined,
    // idl: "./counter_program.json",
    // "js-out": "./codama-sdks/js/src/generated",
    // "program-name": "counter",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Check for help flag
    if (arg === "--help" || arg === "-h") {
      showHelp();
      process.exit(0);
    }

    // Parse arguments with format --key=value
    if (arg.startsWith("--")) {
      const parts = arg.substring(2).split("=");
      if (parts.length === 2) {
        result[parts[0] as CodamaInputArgNames] = parts[1];
      }
      // Handle format --key value
      else if (parts.length === 1 && i + 1 < args.length && !args[i + 1].startsWith("--")) {
        result[parts[0] as CodamaInputArgNames] = args[i + 1];
        i++; // Skip the next argument since we've used it as a value
      }
    }
  }

  return result;
}

function showHelp() {
  console.log(`
Usage: npx esrun codama.ts [options]

Options:
  --idl=<path>          Path to the Anchor IDL JSON file
  --js-out=<path>       Output directory for JavaScript client
  --program-name=<name> Name of the program
  --help, -h            Show this help message
  `);
}

try {
  // Parse arguments
  const args = parseArgs();

  if (!args.idl || !args["js-out"] || !args["program-name"]) {
    showHelp();
    console.log("Missing one or more input arguments.");
    console.log(args);
    process.exit();
  }

  // special parse some input args
  args["idl"] = path.resolve(args["idl"]);
  args["js-out"] = path.resolve(args["js-out"]);

  ensureDirectoryExists(args["js-out"]);
  ensureFileExist(args["idl"]);

  const idl = loadJsonFile<AnchorIdl>(args["idl"]);
  console.log(idl);

  // Generate the client SDKs
  const rootNode = rootNodeFromAnchor(idl);
  const codama = createFromRoot(rootNode);

  // Create a dynamic program configuration
  const programConfig: Record<string, { name: string }> = {};
  programConfig["name" in idl ? idl.name : "program"] = { name: args["program-name"] };

  codama.update(updateProgramsVisitor(programConfig));

  // Generate the JavaScript SDK
  console.log(`Generating JavaScript SDK at: ${args["js-out"]}`);
  codama.accept(renderJavaScriptVisitor(args["js-out"]));

  // // Generate the Rust SDK
  // console.log(`Generating Rust SDK at: ${argv["rust-out"]}`);
  // codama.accept(renderRustVisitor(argv["rust-out"]));

  console.log("SDK generation completed successfully!");
} catch (error) {
  console.error("Error generating SDKs:", error);
  process.exit(1);
}

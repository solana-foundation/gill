#!/usr/bin/env node
import fs from "fs";

type ReexportSettings = {
  package: string;
  outputFile: string;
};

const packages: ReexportSettings[] = [
  {
    package: "@solana-program/system",
    outputFile: "./src/programs/system/reexports.ts",
  },
  //   {
  //     package: "@solana-program/address-lookup-table",
  //     outputFile: "./src/programs/address-lookup-table/reexports.ts",
  //   },
  //   {
  //     package: "@solana-program/compute-budget",
  //     outputFile: "./src/programs/compute-budget/reexports.ts",
  //   },
];

async function generateExports() {
  for (const pkg of packages) {
    let exports = "";
    try {
      // Import the package to get its exports
      const module = await import(pkg.package);
      const exportNames = Object.keys(module).filter((key) => key !== "default");

      if (exportNames.length > 0) {
        exports += `// Re-exports from ${pkg.package}\n`;
        exports += `export {\n`;
        exports += exportNames.map((name) => `  ${name},`).join("\n");
        exports += `\n} from "${pkg.package}";\n\n`;
      }

      // Write to output file
      fs.writeFileSync(pkg.outputFile, exports);
      console.log(`✓ Generated exports for ${pkg.package}: ${exportNames.length} exports`);
    } catch (error) {
      console.error(`✗ Failed to process ${pkg.package}:`, error.message);
    }
  }
}

generateExports().catch(console.error);

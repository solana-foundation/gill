import { createCodamaConfig } from "../core";

describe("createCodamaConfig", () => {
  it("should return a valid config object", () => {
    const clientJs = "anchor/src/client/js";
    const idl = "anchor/target/idl/counter.json";

    const config = createCodamaConfig({
      clientJs,
      idl,
    });

    expect(config).toMatchObject({
      idl,
      scripts: {
        js: {
          args: [
            clientJs,
            {
              dependencyMap: {
                solanaAccounts: "gill",
                solanaAddresses: "gill",
                solanaCodecsCore: "gill",
                solanaCodecsDataStructures: "gill",
                solanaCodecsNumbers: "gill",
                solanaCodecsStrings: "gill",
                solanaErrors: "gill",
                solanaInstructions: "gill",
                solanaOptions: "gill",
                solanaPrograms: "gill",
                solanaRpcTypes: "gill",
                solanaSigners: "gill",
              },
            },
          ],
          from: "@codama/renderers-js",
        },
      },
    });
  });
});

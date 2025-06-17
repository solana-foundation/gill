export const GILL_EXTERNAL_MODULE_MAP: Record<string, string> = {
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
};

export function createCodamaConfig({
  clientJs,
  dependencyMap = GILL_EXTERNAL_MODULE_MAP,
  idl,
}: {
  clientJs: string;
  dependencyMap?: Record<string, string>;
  idl: string;
}) {
  return {
    idl,
    scripts: {
      js: {
        args: [clientJs, { dependencyMap }],
        from: "@codama/renderers-js",
      },
    },
  };
}

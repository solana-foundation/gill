import { GENESIS_HASH, getMonikerFromGenesisHash } from "../core";

describe("getMonikerFromGenesisHash", () => {
  it("should return 'mainnet' for mainnet genesis hash", () => {
    const result = getMonikerFromGenesisHash(GENESIS_HASH.mainnet);
    expect(result).toBe("mainnet");
  });

  it("should return 'devnet' for devnet genesis hash", () => {
    const result = getMonikerFromGenesisHash(GENESIS_HASH.devnet);
    expect(result).toBe("devnet");
  });

  it("should return 'testnet' for testnet genesis hash", () => {
    const result = getMonikerFromGenesisHash(GENESIS_HASH.testnet);
    expect(result).toBe("testnet");
  });

  it("should return 'unknown' for unrecognized hash", () => {
    const result = getMonikerFromGenesisHash("unknown-hash-value");
    expect(result).toBe("unknown");
  });
});

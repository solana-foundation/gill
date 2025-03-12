import { GENESIS_HASH, getMonikerFromGenesisHash, lamportsToSol } from "../core";

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

describe("lamportsToSol", () => {
  it("should convert correctly to 1 SOL", () => {
    const result = lamportsToSol(1_000_000_000);
    expect(result).toBe("1");
  });

  it("should convert correctly to 0.5 SOL", () => {
    const result = lamportsToSol(500_000_000);
    expect(result).toBe("0.5");
  });

  it("should convert correctly to 0.000000001 SOL", () => {
    const result = lamportsToSol(1);
    expect(result).toBe("0.000000001");
  });

  it("should convert correctly to 0 SOL", () => {
    const result = lamportsToSol(0);
    expect(result).toBe("0");
  });

  it("should convert a BigInt correctly", () => {
    // Max safe number value is 9_007_199_254_740_991
    const result = lamportsToSol(10_000_000_333_333_333n);
    expect(result).toBe("10,000,000.333333333");
  });
});

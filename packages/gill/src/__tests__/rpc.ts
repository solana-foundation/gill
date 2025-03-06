import assert from "node:assert";

import { getPublicSolanaRpcUrl } from "../core";

describe("getPublicSolanaRpcUrl", () => {
  test("getPublicSolanaRpcUrl returns mainnet-beta url", () => {
    const rpcUrl = getPublicSolanaRpcUrl("mainnet-beta");
    assert.equal(rpcUrl, "https://api.mainnet-beta.solana.com");
  });
  test("getPublicSolanaRpcUrl returns mainnet url", () => {
    const rpcUrl = getPublicSolanaRpcUrl("mainnet");
    assert.equal(rpcUrl, "https://api.mainnet-beta.solana.com");
  });
  test("getPublicSolanaRpcUrl returns devnet url", () => {
    const rpcUrl = getPublicSolanaRpcUrl("devnet");
    assert.equal(rpcUrl, "https://api.devnet.solana.com");
  });
  test("getPublicSolanaRpcUrl returns testnet url", () => {
    const rpcUrl = getPublicSolanaRpcUrl("testnet");
    assert.equal(rpcUrl, "https://api.testnet.solana.com");
  });
  test("getPublicSolanaRpcUrl returns localnet url", () => {
    const rpcUrl = getPublicSolanaRpcUrl("localnet");
    assert.equal(rpcUrl, "http://127.0.0.1:8899");
  });
  test("getPublicSolanaRpcUrl returns localhost url", () => {
    const rpcUrl = getPublicSolanaRpcUrl("localhost");
    assert.equal(rpcUrl, "http://127.0.0.1:8899");
  });
  test("getPublicSolanaRpcUrl show throw error on unsupported moniker", () => {
    // @ts-expect-error - `not-supported` is not a valid moniker
    assert.throws(() => getPublicSolanaRpcUrl("not-supported"), Error);
  });
  test("getPublicSolanaRpcUrl show throw error on a url provided", () => {
    // @ts-expect-error - urls are not supported
    assert.throws(() => getPublicSolanaRpcUrl("https://google.com"), Error);
  });
});

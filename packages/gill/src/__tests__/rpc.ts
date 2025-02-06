import assert from "node:assert";

import { getPublicSolanaRpcUrl, createSolanaClient } from "../core/rpc";

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
  test("getPublicSolanaRpcUrl show throw error on unsupported moniker", () => {
    // @ts-expect-error - `not-supported` is not a valid moniker
    assert.throws(() => getPublicSolanaRpcUrl("not-supported"), Error);
  });
  test("getPublicSolanaRpcUrl show throw error on a url provided", () => {
    // @ts-expect-error - urls are not supported
    assert.throws(() => getPublicSolanaRpcUrl("https://google.com"), Error);
  });
});

describe("createSolanaClient", () => {
  test("supports major cluster monikers and urls", () => {
    assert.doesNotThrow(() => {
      createSolanaClient({ urlOrMoniker: "mainnet" });
      createSolanaClient({ urlOrMoniker: "devnet" });
      createSolanaClient({ urlOrMoniker: "testnet" });
      createSolanaClient({ urlOrMoniker: "localnet" });
      createSolanaClient({ urlOrMoniker: "https://example-rpc.com" });
    });
  });
  test("throws on invalid moniker", () => {
    assert.throws(() => createSolanaClient({ urlOrMoniker: "invalid" }), "Invalid moniker");
  });
  test("throws on invalid and unsupported urls", () => {
    assert.throws(() => createSolanaClient({ urlOrMoniker: "http//invalid" }), "Invalid url");
    assert.throws(
      () => createSolanaClient({ urlOrMoniker: "ftp://invalid" }),
      "Unsupported protocol",
    );
  });
});

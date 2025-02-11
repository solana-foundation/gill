import assert from "node:assert";

import { blockhash } from "@solana/rpc-types";

import { address } from "@solana/addresses";
import { createTransaction } from "../core/transactions";
import { transactionToBase64 } from "../core/base64-transactions";

// initialize a sample transaction
const tx = createTransaction({
  version: "legacy",
  feePayer: address("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c"),
  instructions: [],
  latestBlockhash: {
    blockhash: blockhash("GK1nopeF3P8J46dGqq4KfaEWopZU7K65F6CKQXuUdr3z"),
    lastValidBlockHeight: 0n,
  },
});

describe("transactionToBase64", () => {
  test("can base64 encode an unsigned transaction", () => {
    const expected =
      "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABC7YxPJkVXZH3qqq8Nq1nwYa5Pm6+M9ZeObND0CCtBLXjfKbGfbEEIU1AEH81ttgpyiNLO+xurYCsjdCVcfR4YQA=";

    assert.equal(expected, transactionToBase64(tx));
  });
});

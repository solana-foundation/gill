import assert from "node:assert";

import { createTransaction } from "../core/transactions";
import { blockhash, generateKeyPairSigner, isKeyPairSigner, KeyPairSigner } from "@solana/web3.js";

describe("createTransaction", () => {
  let signer: KeyPairSigner;

  beforeAll(async () => {
    signer = await generateKeyPairSigner();
  });

  test("create a legacy transaction with a signer as the feePayer", () => {
    const tx = createTransaction({
      version: "legacy",
      feePayer: signer,
      instructions: [],
      latestBlockhash: {
        blockhash: blockhash("GK1nopeF3P8J46dGqq4KfaEWopZU7K65F6CKQXuUdr3z"),
        lastValidBlockHeight: 0n,
      },
    });

    assert.equal(tx.version, "legacy");
    assert.equal(tx.feePayer.address, signer.address);
    assert.equal(isKeyPairSigner(tx.feePayer), true);
    assert.equal(tx.instructions.length, 0);
    assert.equal(Object.hasOwn(tx, "lifetimeConstraint"), true);
  });

  test("create a version 0 transaction with a signer as the feePayer", () => {
    const tx = createTransaction({
      version: 0,
      feePayer: signer,
      instructions: [],
    });

    assert.equal(tx.version, 0);
    assert.equal(tx.feePayer.address, signer.address);
    assert.equal(isKeyPairSigner(tx.feePayer), true);
    assert.equal(tx.instructions.length, 0);
    assert.equal(Object.hasOwn(tx, "lifetimeConstraint"), false);
  });

  test("create a legacy transaction with an `Address` as the feePayer", () => {
    const tx = createTransaction({
      version: "legacy",
      feePayer: signer.address,
      instructions: [],
    });

    assert.equal(tx.version, "legacy");
    assert.equal(tx.feePayer.address, signer.address);
    assert.equal(isKeyPairSigner(tx.feePayer), false);
    assert.equal(tx.instructions.length, 0);
    assert.equal(Object.hasOwn(tx, "lifetimeConstraint"), false);
  });

  test("create a version 0 transaction with an `Address` as the feePayer", () => {
    const tx = createTransaction({
      version: 0,
      feePayer: signer.address,
      instructions: [],
      latestBlockhash: {
        blockhash: blockhash("GK1nopeF3P8J46dGqq4KfaEWopZU7K65F6CKQXuUdr3z"),
        lastValidBlockHeight: 0n,
      },
    });

    assert.equal(tx.version, 0);
    assert.equal(tx.feePayer.address, signer.address);
    assert.equal(isKeyPairSigner(tx.feePayer), false);
    assert.equal(tx.instructions.length, 0);
    assert.equal(Object.hasOwn(tx, "lifetimeConstraint"), true);
  });
});

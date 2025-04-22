/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  Address,
  BaseTransactionMessage,
  IInstruction,
  ITransactionMessageWithFeePayer,
  ITransactionMessageWithFeePayerSigner,
  KeyPairSigner,
  TransactionMessageWithBlockhashLifetime,
} from "@solana/kit";
import { signTransactionMessageWithSigners } from "@solana/kit";

import { createTransaction } from "../core";

// [DESCRIBE] createTransaction
{
  const feePayer = null as unknown as Address;
  const signer = null as unknown as KeyPairSigner;
  const latestBlockhash = null as unknown as TransactionMessageWithBlockhashLifetime["lifetimeConstraint"];

  const ix = null as unknown as IInstruction;

  // Legacy transactions
  {
    createTransaction({
      version: "legacy",
      feePayer: feePayer,
      instructions: [ix],
      computeUnitLimit: 0,
      computeUnitPrice: 0,
    }) satisfies BaseTransactionMessage<"legacy"> & ITransactionMessageWithFeePayer;

    createTransaction({
      version: "legacy",
      feePayer: signer,
      instructions: [ix],
    }) satisfies BaseTransactionMessage<"legacy"> & ITransactionMessageWithFeePayerSigner;

    createTransaction({
      version: "legacy",
      feePayer: feePayer,
      instructions: [ix],
      // @ts-expect-error Should not have a Lifetime
    }) satisfies TransactionMessageWithBlockhashLifetime;

    const txNotSignable = createTransaction({
      version: "legacy",
      feePayer: signer,
      instructions: [ix],
      // @ts-expect-error Should not have a Lifetime
    }) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    // Should be legacy with a Lifetime and Signer
    createTransaction({
      version: "legacy",
      feePayer: signer,
      instructions: [ix],
      latestBlockhash,
    }) satisfies BaseTransactionMessage<"legacy"> &
      TransactionMessageWithBlockhashLifetime &
      ITransactionMessageWithFeePayerSigner;

    // Should be legacy with a Lifetime and address (aka non Signer)
    const txSignable = createTransaction({
      version: "legacy",
      feePayer: feePayer,
      instructions: [ix],
      latestBlockhash,
    }) satisfies BaseTransactionMessage<"legacy"> &
      TransactionMessageWithBlockhashLifetime &
      ITransactionMessageWithFeePayer;

    createTransaction({
      version: "legacy",
      feePayer: feePayer,
      instructions: [ix],
      latestBlockhash,
      // @ts-expect-error Should not be a "fee payer signer"
    }) satisfies ITransactionMessageWithFeePayerSigner;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }

  // Version 0 transactions
  {
    createTransaction({
      version: 0,
      feePayer: feePayer,
      instructions: [ix],
      computeUnitLimit: 0,
      computeUnitPrice: 0,
    }) satisfies BaseTransactionMessage<0> & ITransactionMessageWithFeePayer;

    createTransaction({
      version: 0,
      feePayer: signer,
      instructions: [ix],
    }) satisfies BaseTransactionMessage<0> & ITransactionMessageWithFeePayerSigner;

    const txNotSignable = createTransaction({
      version: 0,
      feePayer: feePayer,
      instructions: [ix],
      // @ts-expect-error Should not have a Lifetime
    }) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    createTransaction({
      version: 0,
      feePayer: signer,
      instructions: [ix],
      // @ts-expect-error Should not have a Lifetime
    }) satisfies TransactionMessageWithBlockhashLifetime;

    // Should be version 0 with a Lifetime and Signer
    createTransaction({
      version: 0,
      feePayer: signer,
      instructions: [ix],
      latestBlockhash,
    }) satisfies BaseTransactionMessage<0> &
      TransactionMessageWithBlockhashLifetime &
      ITransactionMessageWithFeePayerSigner;

    // Should be version 0 with a Lifetime and address (aka non Signer)
    const txSignable = createTransaction({
      version: 0,
      feePayer: feePayer,
      instructions: [ix],
      latestBlockhash,
    }) satisfies BaseTransactionMessage<0> & TransactionMessageWithBlockhashLifetime & ITransactionMessageWithFeePayer;

    createTransaction({
      version: 0,
      feePayer: feePayer,
      instructions: [ix],
      latestBlockhash,
      // @ts-expect-error Should not be a "fee payer signer"
    }) satisfies ITransactionMessageWithFeePayerSigner;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }
}

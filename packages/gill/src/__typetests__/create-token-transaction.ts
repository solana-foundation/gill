/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { KeyPairSigner } from "@solana/signers";
import type {
  BaseTransactionMessage,
  TransactionMessageWithBlockhashLifetime,
} from "@solana/transaction-messages";
import { signTransactionMessageWithSigners } from "@solana/signers";

import { CreateTokenInstructionsArgs, createTokenTransaction } from "../programs";

// [DESCRIBE] createTokenTransaction
async () => {
  const signer = null as unknown as KeyPairSigner;
  const latestBlockhash =
    null as unknown as TransactionMessageWithBlockhashLifetime["lifetimeConstraint"];
  const metadata = {} as unknown as CreateTokenInstructionsArgs["metadata"];

  // Legacy transaction
  {
    (await createTokenTransaction({
      payer: signer,
      metadata,
    })) satisfies BaseTransactionMessage<"legacy">;

    (await createTokenTransaction({
      version: "legacy",
      payer: signer,
      metadata,
    })) satisfies BaseTransactionMessage<"legacy">;

    const txNotSignable = (await createTokenTransaction({
      version: "legacy",
      payer: signer,
      metadata,
      // @ts-expect-error Should not have a Lifetime
    })) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    const txSignable = (await createTokenTransaction({
      version: "legacy",
      payer: signer,
      metadata,
      latestBlockhash,
    })) satisfies BaseTransactionMessage<"legacy"> & TransactionMessageWithBlockhashLifetime;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }

  // Version 0 transaction
  {
    (await createTokenTransaction({
      version: 0,
      payer: signer,
      metadata,
    })) satisfies BaseTransactionMessage<0>;

    const txNotSignable = (await createTokenTransaction({
      version: 0,
      payer: signer,
      metadata,
      // @ts-expect-error Should not have a Lifetime
    })) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    const txSignable = (await createTokenTransaction({
      version: 0,
      payer: signer,
      metadata,
      latestBlockhash,
    })) satisfies BaseTransactionMessage<0> & TransactionMessageWithBlockhashLifetime;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }
};

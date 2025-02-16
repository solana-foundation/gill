/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { KeyPairSigner } from "@solana/signers";
import type {
  BaseTransactionMessage,
  TransactionMessageWithBlockhashLifetime,
} from "@solana/transaction-messages";
import { signTransactionMessageWithSigners } from "@solana/signers";

import { GetCreateTokenInstructionsArgs, getCreateTokenTransaction } from "../programs";

// [DESCRIBE] getCreateTokenTransaction
async () => {
  const mint = null as unknown as KeyPairSigner;
  const signer = null as unknown as KeyPairSigner;
  const latestBlockhash =
    null as unknown as TransactionMessageWithBlockhashLifetime["lifetimeConstraint"];
  const metadata = {} as unknown as GetCreateTokenInstructionsArgs["metadata"];

  // Legacy transaction
  {
    (await getCreateTokenTransaction({
      payer: signer,
      mint,
      metadata,
    })) satisfies BaseTransactionMessage<"legacy">;

    (await getCreateTokenTransaction({
      payer: signer,
      version: "legacy",
      mint,
      metadata,
    })) satisfies BaseTransactionMessage<"legacy">;

    const txNotSignable = (await getCreateTokenTransaction({
      payer: signer,
      version: "legacy",
      mint,
      metadata,
      // @ts-expect-error Should not have a Lifetime
    })) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    const txSignable = (await getCreateTokenTransaction({
      payer: signer,
      version: "legacy",
      mint,
      metadata,
      latestBlockhash,
    })) satisfies BaseTransactionMessage<"legacy"> & TransactionMessageWithBlockhashLifetime;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }

  // Version 0 transaction
  {
    (await getCreateTokenTransaction({
      payer: signer,
      version: 0,
      mint,
      metadata,
    })) satisfies BaseTransactionMessage<0>;

    const txNotSignable = (await getCreateTokenTransaction({
      payer: signer,
      version: 0,
      mint,
      metadata,
      // @ts-expect-error Should not have a Lifetime
    })) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    const txSignable = (await getCreateTokenTransaction({
      payer: signer,
      version: 0,
      mint,
      metadata,
      latestBlockhash,
    })) satisfies BaseTransactionMessage<0> & TransactionMessageWithBlockhashLifetime;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }
};

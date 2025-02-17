/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";
import type {
  BaseTransactionMessage,
  TransactionMessageWithBlockhashLifetime,
} from "@solana/transaction-messages";
import { signTransactionMessageWithSigners } from "@solana/signers";
import { buildMintTokensTransaction } from "../programs/token";

// [DESCRIBE] buildMintTokensTransaction
async () => {
  const signer = null as unknown as KeyPairSigner;
  const latestBlockhash =
    null as unknown as TransactionMessageWithBlockhashLifetime["lifetimeConstraint"];

  const mint = null as unknown as KeyPairSigner;
  const destination = null as unknown as Address;
  const ata = null as unknown as Address;
  const mintAuthority = null as unknown as KeyPairSigner;

  // Legacy transaction
  {
    (await buildMintTokensTransaction({
      payer: signer,
      mint,
      destination,
      amount: 0,
      ata,
      mintAuthority,
    })) satisfies BaseTransactionMessage<"legacy">;

    (await buildMintTokensTransaction({
      payer: signer,
      version: "legacy",
      mint,
      destination,
      amount: 0n,
      ata,
      mintAuthority,
    })) satisfies BaseTransactionMessage<"legacy">;

    const txNotSignable = (await buildMintTokensTransaction({
      payer: signer,
      version: "legacy",
      mint,
      destination,
      amount: 0,
      ata,
      mintAuthority,
      // @ts-expect-error Should not have a Lifetime
    })) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    const txSignable = (await buildMintTokensTransaction({
      payer: signer,
      version: "legacy",
      mint,
      destination,
      amount: 0,
      ata,
      mintAuthority,
      latestBlockhash,
    })) satisfies BaseTransactionMessage<"legacy"> & TransactionMessageWithBlockhashLifetime;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }

  // Version 0 transaction
  {
    (await buildMintTokensTransaction({
      payer: signer,
      version: 0,
      mint,
      destination,
      amount: 0,
      ata,
      mintAuthority,
    })) satisfies BaseTransactionMessage<0>;

    const txNotSignable = (await buildMintTokensTransaction({
      payer: signer,
      version: 0,
      mint,
      destination,
      amount: 0,
      ata,
      mintAuthority,
      // @ts-expect-error Should not have a Lifetime
    })) satisfies TransactionMessageWithBlockhashLifetime;

    // @ts-expect-error Should not be a signable transaction
    signTransactionMessageWithSigners(txNotSignable);

    const txSignable = (await buildMintTokensTransaction({
      payer: signer,
      version: 0,
      mint,
      destination,
      amount: 0n,
      ata,
      mintAuthority,
      latestBlockhash,
    })) satisfies BaseTransactionMessage<0> & TransactionMessageWithBlockhashLifetime;

    // Should be a signable transaction
    signTransactionMessageWithSigners(txSignable);
  }
};

import { Address } from "@solana/addresses";
import { IInstruction } from "@solana/instructions";
import { ITransactionMessageWithFeePayerSigner, TransactionSigner } from "@solana/signers";
import {
  BaseTransactionMessage,
  ITransactionMessageWithFeePayer,
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import { Simplify } from ".";

export type CreateTransactionInput<
  TVersion extends TransactionVersion,
  TFeePayer extends Address | TransactionSigner,
  TLifetimeConstraint extends
    | TransactionMessageWithBlockhashLifetime["lifetimeConstraint"]
    | undefined = undefined,
> = {
  /**
   * Transaction version
   * - `legacy` is commonly used
   * - `0` is needed for use with Address Lookup Tables
   * */
  version: TVersion;
  /** List of instructions for this transaction */
  instructions: IInstruction[];
  /** Address or Signer that will pay transaction fees */
  feePayer: TFeePayer;
  /**
   * Latest blockhash (aka transaction lifetime) for this transaction to
   * accepted for execution on the Solana network
   * */
  latestBlockhash?: TLifetimeConstraint;
};

// TLifetimeConstraint extends
//     | TransactionMessageWithBlockhashLifetime["lifetimeConstraint"]
//     | {} = {}

export type FullTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends ITransactionMessageWithFeePayer | ITransactionMessageWithFeePayerSigner,
  TBlockhashLifetime extends TransactionMessageWithBlockhashLifetime | undefined = undefined,
> = Simplify<
  BaseTransactionMessage<TVersion> &
    TFeePayer &
    (TBlockhashLifetime extends TransactionMessageWithBlockhashLifetime
      ? TransactionMessageWithBlockhashLifetime
      : {})
>;

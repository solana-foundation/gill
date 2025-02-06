import { pipe } from "@solana/functional";
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import { isTransactionSigner, setTransactionMessageFeePayerSigner } from "@solana/signers";
import type { FullTransaction, CreateTransactionInput } from "../types/transactions";

/**
 * Simple interface for creating a Solana transaction
 */
export function createTransaction<TVersion extends TransactionVersion, TFeePayer extends string>(
  props: CreateTransactionInput<TVersion, undefined>,
): FullTransaction<TVersion>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends string,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  props: CreateTransactionInput<TVersion, TLifetimeConstraint>,
): FullTransaction<TVersion, TFeePayer> & TransactionMessageWithBlockhashLifetime;
export function createTransaction<TVersion extends TransactionVersion>({
  version,
  feePayer,
  instructions,
  latestBlockhash,
}: CreateTransactionInput<TVersion>): FullTransaction<TVersion> {
  return pipe(
    createTransactionMessage({ version }),
    (tx) => {
      if (latestBlockhash) {
        tx = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx);
      }
      if (typeof feePayer !== "string" && "address" in feePayer && isTransactionSigner(feePayer)) {
        return setTransactionMessageFeePayerSigner(feePayer, tx);
      } else return setTransactionMessageFeePayer(feePayer, tx);
    },
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );
}

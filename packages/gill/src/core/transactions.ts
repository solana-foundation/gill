import { Simplify } from "../types";
import { pipe } from "@solana/functional";
import {
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  createTransactionMessage,
  ITransactionMessageWithFeePayer,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import {
  isTransactionSigner,
  ITransactionMessageWithFeePayerSigner,
  setTransactionMessageFeePayerSigner,
  TransactionSigner,
} from "@solana/signers";
import type { FullTransaction, CreateTransactionInput } from "../types/transactions";
import { Address } from "@solana/addresses";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";

/**
 * Simple interface for creating a Solana transaction
 */
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends TransactionSigner,
>(
  props: CreateTransactionInput<TVersion, TFeePayer>,
): FullTransaction<TVersion, ITransactionMessageWithFeePayerSigner>;
export function createTransaction<TVersion extends TransactionVersion, TFeePayer extends Address>(
  props: CreateTransactionInput<TVersion, TFeePayer>,
): FullTransaction<TVersion, ITransactionMessageWithFeePayer>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends Address,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  props: CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
): Simplify<
  FullTransaction<
    TVersion,
    ITransactionMessageWithFeePayer,
    TransactionMessageWithBlockhashLifetime
  >
>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends TransactionSigner,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  props: CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
): Simplify<
  FullTransaction<
    TVersion,
    ITransactionMessageWithFeePayerSigner,
    TransactionMessageWithBlockhashLifetime
  >
>;
export function createTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends Address | TransactionSigner,
>({
  version,
  feePayer,
  instructions,
  latestBlockhash,
  computeUnitLimit,
  computeUnitPrice,
}: CreateTransactionInput<TVersion, TFeePayer>): FullTransaction<
  TVersion,
  ITransactionMessageWithFeePayer | ITransactionMessageWithFeePayerSigner
> {
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
    (tx) => {
      if (typeof computeUnitLimit !== "undefined") {
        tx = appendTransactionMessageInstruction(
          getSetComputeUnitLimitInstruction({ units: Number(computeUnitLimit) }),
          tx,
        );
      }

      if (typeof computeUnitPrice !== "undefined") {
        tx = appendTransactionMessageInstruction(
          getSetComputeUnitPriceInstruction({ microLamports: Number(computeUnitPrice) }),
          tx,
        );
      }

      return appendTransactionMessageInstructions(instructions, tx);
    },
  );
}

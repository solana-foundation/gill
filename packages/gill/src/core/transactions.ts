import {
  pipe,
  isTransactionSigner,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageFeePayerSigner,
  appendTransactionMessageInstructions,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/web3.js";
import type { CreateTransactionInput } from "../types/transactions";

/**
 * Simple interface for creating a Solana transaction
 */
export function createTransaction({
  version,
  feePayer,
  instructions,
  latestBlockhash,
}: CreateTransactionInput) {
  return pipe(
    createTransactionMessage({ version }),
    (tx) => {
      if (latestBlockhash) {
        tx = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx);
      }
      if ("address" in feePayer && isTransactionSigner(feePayer)) {
        return setTransactionMessageFeePayerSigner(feePayer, tx);
      } else return setTransactionMessageFeePayer(feePayer, tx);
    },
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );
}

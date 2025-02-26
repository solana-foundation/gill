import { pipe } from "@solana/functional";
import { partiallySignTransactionMessageWithSigners } from "@solana/signers";
import type { CompilableTransactionMessage } from "@solana/transaction-messages";

import {
  type Transaction,
  compileTransaction,
  type Base64EncodedWireTransaction,
  getBase64EncodedWireTransaction,
} from "@solana/transactions";

/**
 * Compile a transaction to a base64 string
 *
 * Note: This will NOT attempt to sign the transaction,
 * so it will be missing `signatures` from any of the attached Signers
 *
 * Use {@link transactionToBase64WithSignatures} sign and base64 encode
 */
export function transactionToBase64(
  tx: CompilableTransactionMessage | Transaction,
): Base64EncodedWireTransaction {
  if ("messageBytes" in tx) return pipe(tx, getBase64EncodedWireTransaction);
  else return pipe(tx, compileTransaction, getBase64EncodedWireTransaction);
}

/**
 * Compile a transaction to a base64 string and sign it with all attached Signers
 *
 * See also {@link partiallySignTransactionMessageWithSigners}
 */
export async function transactionToBase64WithSigners(
  tx: CompilableTransactionMessage | Transaction,
): Promise<Base64EncodedWireTransaction> {
  if ("messageBytes" in tx) return transactionToBase64(tx);
  else return transactionToBase64(await partiallySignTransactionMessageWithSigners(tx));
}

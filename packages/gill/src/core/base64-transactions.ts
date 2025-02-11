import { pipe } from "@solana/functional";
import { CompilableTransactionMessage } from "@solana/transaction-messages";

import {
  Transaction,
  compileTransaction,
  Base64EncodedWireTransaction,
  getBase64EncodedWireTransaction,
} from "@solana/transactions";

/**
 * Compile a Transaction to a base64 string
 */
export function transactionToBase64(
  tx: CompilableTransactionMessage | Transaction,
): Base64EncodedWireTransaction {
  if ("messageBytes" in tx) {
    return pipe(tx, getBase64EncodedWireTransaction);
  } else {
    return pipe(tx, compileTransaction, getBase64EncodedWireTransaction);
  }
}

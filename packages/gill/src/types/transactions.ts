import type {
  Address,
  Blockhash,
  IInstruction,
  TransactionSigner,
  TransactionVersion,
} from "@solana/web3.js";

export type CreateTransactionInput = {
  /**
   * Transaction version
   * - `legacy` is commonly used
   * - `0` is needed for use with Address Lookup Tables
   * */
  version: TransactionVersion;
  /** List of instructions for this transaction */
  instructions: IInstruction[];
  /** Address or Signer that will pay transaction fees */
  feePayer: Address | TransactionSigner;
  /**
   * Latest blockhash (aka transaction lifetime) for this transaction to
   * accepted for execution on the Solana network
   * */
  latestBlockhash?: Readonly<{
    blockhash: Blockhash;
    lastValidBlockHeight: bigint;
  }>;
};

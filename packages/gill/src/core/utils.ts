import { createNoopSigner, isTransactionSigner, type Address, type TransactionSigner } from "@solana/kit";
import type { SolanaClusterMoniker } from "../types";
import { GENESIS_HASH } from "./const";

/**
 * Determine the Solana moniker from its genesis hash
 *
 * If the hash is NOT known, returns `unknown`
 */
export function getMonikerFromGenesisHash(hash: string): SolanaClusterMoniker | "unknown" {
  switch (hash) {
    case GENESIS_HASH.mainnet:
      return "mainnet";
    case GENESIS_HASH.devnet:
      return "devnet";
    case GENESIS_HASH.testnet:
      return "testnet";
    default:
      return "unknown";
  }
}

export function checkedAddress(input: Address | TransactionSigner): Address {
  return typeof input == "string" ? input : input.address;
}

export function checkedTransactionSigner(input: Address | TransactionSigner): TransactionSigner {
  if (typeof input === "string" || "address" in input == false) {
    return createNoopSigner(input);
  } else if (isTransactionSigner(input)) return input;
  throw new Error("A signer or address is required");
}

/**
 * Convert a lamport number to the human readable string of a SOL value
 */
export function lamportsToSol(lamports: bigint | number): string {
  // @ts-expect-error This format is valid
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(`${lamports}E-9`);
}

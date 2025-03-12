import type { Address, KeyPairSigner } from "@solana/kit";

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

export function checkedAddress(input: Address | KeyPairSigner): Address {
  return typeof input == "string" ? input : input.address;
}

/**
 * Convert a lamport number to the human readable string of a SOL value
 */
export function lamportsToSol(lamports: bigint | number): string {
  // @ts-expect-error This format is valid
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(`${lamports}E-9`);
}

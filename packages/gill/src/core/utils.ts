import type { KeyPairSigner, Address } from "@solana/kit";
import type { SolanaClusterMoniker } from "../types";
import { GENESIS_HASH, LAMPORTS_PER_SOL } from "./const";

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

export function checkedAddress(input: KeyPairSigner | Address): Address {
  return typeof input == "string" ? input : input.address;
}

/**
 * Convert a lamport number to the human readable string of a SOL value
 */
export function lamportsToSol(lamports: bigint | number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(Number(lamports) / LAMPORTS_PER_SOL);
}

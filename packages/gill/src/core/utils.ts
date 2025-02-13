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

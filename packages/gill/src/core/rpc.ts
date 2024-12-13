import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/web3.js";
import {
  CreateSolanaClientArgs,
  CreateSolanaClientResult,
  SolanaClusterMoniker,
} from "../types/rpc";

/**
 * Get a public Solana RPC endpoint for a cluster based on its moniker
 *
 * Note: These RPC URLs are rate limited and not suitable for production applications.
 */
export function getPublicSolanaRpcUrl(cluster: SolanaClusterMoniker): string {
  switch (cluster) {
    case "devnet":
      return "https://api.devnet.solana.com";
    case "testnet":
      return "https://api.testnet.solana.com";
    case "mainnet-beta":
      return "https://api.mainnet-beta.solana.com";
    case "localnet":
      return "http://127.0.0.1:8899";
    default:
      throw new Error("Invalid cluster moniker");
  }
}

/**
 * Create a Solana `rpc` and `rpcSubscriptions` client
 */
export function createSolanaClient({
  urlOrMoniker,
  rpcConfig,
  rpcSubscriptionsConfig,
}: CreateSolanaClientArgs): CreateSolanaClientResult {
  if (typeof urlOrMoniker == "string") {
    try {
      urlOrMoniker = new URL(urlOrMoniker);
    } catch (err) {
      try {
        urlOrMoniker = new URL(
          getPublicSolanaRpcUrl(urlOrMoniker as SolanaClusterMoniker),
        );
      } catch (err) {
        throw new Error("Invalid URL or cluster moniker");
      }
    }
  }

  const rpc = createSolanaRpc(urlOrMoniker.toString(), rpcConfig);
  if (urlOrMoniker.protocol.endsWith("s")) urlOrMoniker.protocol = "wss";
  else urlOrMoniker.protocol = "ws";

  const rpcSubscriptions = createSolanaRpcSubscriptions(
    urlOrMoniker.toString(),
    rpcSubscriptionsConfig,
  );

  return {
    rpc,
    rpcSubscriptions,
  };
}

import { createSolanaRpc } from "@solana/rpc";
import { createSolanaRpcSubscriptions } from "@solana/rpc-subscriptions";
import { devnet, mainnet, testnet } from "@solana/rpc-types";

import {
  LocalnetUrl,
  ModifiedClusterUrl,
  SolanaClusterMoniker,
  CreateSolanaClientArgs,
  CreateSolanaClientResult,
} from "../types/rpc";

export function localnet(putativeString: string): LocalnetUrl {
  return putativeString as LocalnetUrl;
}

/**
 * Get a public Solana RPC endpoint for a cluster based on its moniker
 *
 * Note: These RPC URLs are rate limited and not suitable for production applications.
 */
export function getPublicSolanaRpcUrl(
  cluster: SolanaClusterMoniker | "mainnet-beta",
): ModifiedClusterUrl {
  switch (cluster) {
    case "devnet":
      return devnet("https://api.devnet.solana.com");
    case "testnet":
      return testnet("https://api.testnet.solana.com");
    case "mainnet-beta":
    case "mainnet":
      return mainnet("https://api.mainnet-beta.solana.com");
    case "localnet":
      return localnet("http://127.0.0.1:8899");
    default:
      throw new Error("Invalid cluster moniker");
  }
}

/**
 * Create a Solana `rpc` and `rpcSubscriptions` client
 */
export function createSolanaClient<TCluster extends SolanaClusterMoniker>(
  props: CreateSolanaClientArgs<TCluster>,
): CreateSolanaClientResult<TCluster>;
export function createSolanaClient<TCluster extends SolanaClusterMoniker>({
  urlOrMoniker,
  rpcConfig,
  rpcSubscriptionsConfig,
}: CreateSolanaClientArgs<TCluster>) {
  if (!urlOrMoniker) throw new Error("Cluster url or moniker is required");
  if (urlOrMoniker instanceof URL == false) {
    try {
      urlOrMoniker = new URL(urlOrMoniker.toString());
    } catch (err) {
      try {
        urlOrMoniker = new URL(getPublicSolanaRpcUrl(urlOrMoniker.toString() as any));
      } catch (err) {
        throw new Error("Invalid URL or cluster moniker");
      }
    }
  }

  if (!urlOrMoniker.protocol.match(/^https?/i)) {
    throw new Error("Unsupported protocol. Only HTTP and HTTPS are supported");
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

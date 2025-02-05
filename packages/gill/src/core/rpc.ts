import { createSolanaRpc } from "@solana/rpc";
import { createSolanaRpcSubscriptions } from "@solana/rpc-subscriptions";
import { devnet, DevnetUrl, mainnet, MainnetUrl, testnet, TestnetUrl } from "@solana/rpc-types";

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
export function createSolanaClient(
  props: Omit<CreateSolanaClientArgs<MainnetUrl | "mainnet">, "urlOrMoniker"> & {
    urlOrMoniker: "mainnet";
  },
): CreateSolanaClientResult<MainnetUrl>;
export function createSolanaClient(
  props: Omit<CreateSolanaClientArgs<DevnetUrl | "devnet">, "urlOrMoniker"> & {
    urlOrMoniker: "devnet";
  },
): CreateSolanaClientResult<DevnetUrl>;
export function createSolanaClient(
  props: Omit<CreateSolanaClientArgs<TestnetUrl | "testnet">, "urlOrMoniker"> & {
    urlOrMoniker: "testnet";
  },
): CreateSolanaClientResult<TestnetUrl>;
export function createSolanaClient(
  props: Omit<CreateSolanaClientArgs<LocalnetUrl | "localnet">, "urlOrMoniker"> & {
    urlOrMoniker: "localnet";
  },
): CreateSolanaClientResult<LocalnetUrl>;
export function createSolanaClient<TClusterUrl extends ModifiedClusterUrl>(
  props: CreateSolanaClientArgs<TClusterUrl>,
): CreateSolanaClientResult<TClusterUrl>;
export function createSolanaClient<TCluster extends ModifiedClusterUrl>({
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

  const rpc = createSolanaRpc<TCluster>(urlOrMoniker.toString() as TCluster, rpcConfig);

  if (urlOrMoniker.protocol.endsWith("s")) urlOrMoniker.protocol = "wss";
  else urlOrMoniker.protocol = "ws";

  const rpcSubscriptions = createSolanaRpcSubscriptions<TCluster>(
    urlOrMoniker.toString() as TCluster,
    rpcSubscriptionsConfig,
  );

  return {
    rpc,
    rpcSubscriptions,
  };
}

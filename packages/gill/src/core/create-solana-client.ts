import { createSolanaRpc } from "@solana/rpc";
import { createSolanaRpcSubscriptions } from "@solana/rpc-subscriptions";
import { DevnetUrl, MainnetUrl, TestnetUrl } from "@solana/rpc-types";

import type {
  LocalnetUrl,
  ModifiedClusterUrl,
  CreateSolanaClientArgs,
  CreateSolanaClientResult,
} from "../types/rpc";
import { sendAndConfirmTransactionFactory } from "../kit";
import { getPublicSolanaRpcUrl } from "./rpc";

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

  if (rpcConfig?.port) {
    urlOrMoniker.port = rpcConfig.port.toString();
  }

  const rpc = createSolanaRpc<TCluster>(urlOrMoniker.toString() as TCluster, rpcConfig);

  if (urlOrMoniker.protocol.endsWith("s")) urlOrMoniker.protocol = "wss";
  else urlOrMoniker.protocol = "ws";

  if (rpcSubscriptionsConfig?.port) {
    urlOrMoniker.port = rpcSubscriptionsConfig.port.toString();
  } else if (urlOrMoniker.hostname == "localhost" || urlOrMoniker.hostname.startsWith("127")) {
    urlOrMoniker.port = "8900";
  }

  const rpcSubscriptions = createSolanaRpcSubscriptions<TCluster>(
    urlOrMoniker.toString() as TCluster,
    rpcSubscriptionsConfig,
  );

  // @ts-ignore
  const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

  return {
    rpc,
    rpcSubscriptions,
    sendAndConfirmTransaction,
  };
}

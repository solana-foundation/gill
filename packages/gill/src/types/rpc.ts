import type {
  Rpc,
  createSolanaRpc,
  SolanaRpcApiMainnet,
  SolanaRpcApiDevnet,
  SolanaRpcApiTestnet,
  SolanaRpcApi,
} from "@solana/rpc";
import type {
  createSolanaRpcSubscriptions,
  RpcSubscriptions,
  SolanaRpcSubscriptionsApi,
} from "@solana/rpc-subscriptions";
import type { DevnetUrl, MainnetUrl, TestnetUrl } from "@solana/rpc-types";

/** Solana cluster moniker */
export type SolanaClusterMoniker = "mainnet" | "devnet" | "testnet" | "localnet";

export type LocalnetUrl = string & { "~cluster": "localnet" };

type GenericUrl = string & {};

export type ModifiedClusterUrl = MainnetUrl | DevnetUrl | TestnetUrl | LocalnetUrl;

export type CreateSolanaClientArgs<TClusterUrl extends SolanaClusterMoniker> = {
  /** Full RPC URL (for a private RPC endpoint) or the Solana moniker (for a public RPC endpoint) */
  urlOrMoniker: TClusterUrl | URL | ModifiedClusterUrl | GenericUrl;
  /** Configuration used to create the `rpc` client */
  rpcConfig?: Parameters<typeof createSolanaRpc>[1];
  /** Configuration used to create the `rpcSubscriptions` client */
  rpcSubscriptionsConfig?: Parameters<typeof createSolanaRpcSubscriptions>[1];
};

export type CreateSolanaClientResult<TCluster extends SolanaClusterMoniker> = {
  rpc: Rpc<SolanaRpcApi | SolanaRpcApiDevnet | SolanaRpcApiMainnet | SolanaRpcApiTestnet> & {
    "~cluster"?: TCluster;
  };
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi> & {
    "~cluster"?: TCluster;
  };
};

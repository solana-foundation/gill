import { FullySignedTransaction } from "@solana/transactions";
import { SolanaClusterMoniker } from "./rpc";

type ExplorerLinkAccount = {
  address: string;
};
type ExplorerLinkTransaction = {
  transaction: string | FullySignedTransaction;
};
type ExplorerLinkBlock = {
  block: string;
};

/**
 * @param cluster - Default: `mainnet`
 */
export type GetExplorerLinkArgs = {
  cluster?: SolanaClusterMoniker | "mainnet-beta";
} & (ExplorerLinkAccount | ExplorerLinkTransaction | ExplorerLinkBlock);

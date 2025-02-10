import { SolanaClusterMoniker } from "./rpc";

type ExplorerLinkAccount = {
  address: string;
};
type ExplorerLinkTransaction = {
  transaction: string;
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

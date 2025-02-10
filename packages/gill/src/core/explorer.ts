import { GetExplorerLinkArgs } from "../types";

/**
 * Craft a Solana Explorer link on any cluster
 */
export function getExplorerLink(props: GetExplorerLinkArgs): string {
  let url: URL | null = null;

  // default to mainnet / mainnet-beta
  if (!props.cluster || props.cluster == "mainnet") props.cluster = "mainnet-beta";

  if ("address" in props) {
    url = new URL(`https://explorer.solana.com/address/${props.address}`);
  } else if ("transaction" in props) {
    url = new URL(`https://explorer.solana.com/tx/${props.transaction}`);
  } else if ("block" in props) {
    url = new URL(`https://explorer.solana.com/block/${props.block}`);
  }

  if (!url) throw new Error("Invalid Solana Explorer URL created");

  if (props.cluster !== "mainnet-beta") {
    if (props.cluster === "localnet") {
      // localnet technically isn't a cluster, so requires special handling
      url.searchParams.set("cluster", "custom");
      url.searchParams.set("customUrl", "http://localhost:8899");
    } else {
      url.searchParams.set("cluster", props.cluster);
    }
  }

  return url.toString();
}

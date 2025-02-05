// /* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Rpc,
  SolanaRpcApiMainnet,
  SolanaRpcApi,
  RpcTestnet,
  RequestAirdropApi,
  RpcDevnet,
} from "@solana/rpc";
import { createSolanaClient } from "../core";

// [DESCRIBE] createSolanaClient
{
  const mainnetClient = createSolanaClient({ urlOrMoniker: "mainnet" });
  //   const devnetClient = createSolanaClient({ urlOrMoniker: "devnet" });
  //   const testnetClient = createSolanaClient({ urlOrMoniker: "testnet" });
  //   const localnetClient = createSolanaClient({ urlOrMoniker: "localnet" });
  //   const genericClient = createSolanaClient({ urlOrMoniker: "https://example-rpc.com" });

  // Mainnet cluster typechecks when the providing the moniker
  {
    mainnetClient.rpc satisfies Rpc<SolanaRpcApiMainnet>;
    // mainnetClient.rpc satisfies RpcMainnet<SolanaRpcApiMainnet>;
    //@ts-expect-error Should not have `requestAirdrop` method
    mainnetClient.rpc satisfies Rpc<RequestAirdropApi>;
    //@ts-expect-error Should not be a devnet RPC
    mainnetClient.rpc satisfies RpcDevnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a testnet RPC
    mainnetClient.rpc satisfies RpcTestnet<SolanaRpcApi>;
  }

  // Devnet cluster typechecks when the providing the moniker
  {
    // devnetClient.rpc satisfies Rpc<SolanaRpcApi>;
    // devnetClient.rpc satisfies Rpc<RequestAirdropApi>;
    // devnetClient.rpc satisfies RpcDevnet<SolanaRpcApi>;
    // //@ts-expect-error Should not be a testnet RPC
    // devnetClient.rpc satisfies RpcTestnet<SolanaRpcApi>;
  }
}

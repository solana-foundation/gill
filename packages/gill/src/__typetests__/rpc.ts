/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Rpc,
  RpcDevnet,
  RpcTestnet,
  RpcMainnet,
  SolanaRpcApi,
  RequestAirdropApi,
  SolanaRpcApiMainnet,
} from "@solana/rpc";
import { createSolanaClient } from "../core/rpc";
import {
  sendAndConfirmDurableNonceTransactionFactory,
  sendAndConfirmTransactionFactory,
} from "../kit";

// [DESCRIBE] createSolanaClient
{
  // Mainnet cluster typechecks when the providing the moniker
  {
    const { rpc: mainnetRpc, rpcSubscriptions: mainnetRpcSubscriptions } = createSolanaClient({
      urlOrMoniker: "mainnet",
    });
    mainnetRpc satisfies Rpc<SolanaRpcApiMainnet>;
    mainnetRpc satisfies RpcMainnet<SolanaRpcApiMainnet>;
    //@ts-expect-error Should not have `requestAirdrop` method
    mainnetRpc satisfies Rpc<RequestAirdropApi>;
    //@ts-expect-error Should not be a devnet RPC
    mainnetRpc satisfies RpcDevnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a testnet RPC
    mainnetRpc satisfies RpcTestnet<SolanaRpcApi>;

    sendAndConfirmTransactionFactory({
      rpc: mainnetRpc,
      rpcSubscriptions: mainnetRpcSubscriptions,
    });
    sendAndConfirmDurableNonceTransactionFactory({
      rpc: mainnetRpc,
      rpcSubscriptions: mainnetRpcSubscriptions,
    });
  }

  // Devnet cluster typechecks when the providing the moniker
  {
    const { rpc: devnetRpc, rpcSubscriptions: devnetRpcSubscriptions } = createSolanaClient({
      urlOrMoniker: "devnet",
    });
    devnetRpc satisfies Rpc<SolanaRpcApi>;
    devnetRpc satisfies Rpc<RequestAirdropApi>;
    devnetRpc satisfies RpcDevnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a testnet RPC
    devnetRpc satisfies RpcTestnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a mainnet RPC
    devnetRpc satisfies RpcMainnet<SolanaRpcApiMainnet>;

    sendAndConfirmTransactionFactory({
      rpc: devnetRpc,
      rpcSubscriptions: devnetRpcSubscriptions,
    });
    sendAndConfirmDurableNonceTransactionFactory({
      rpc: devnetRpc,
      rpcSubscriptions: devnetRpcSubscriptions,
    });
  }

  // Testnet cluster typechecks when the providing the moniker
  {
    const { rpc: testnetRpc, rpcSubscriptions: testnetRpcSubscriptions } = createSolanaClient({
      urlOrMoniker: "testnet",
    });
    testnetRpc satisfies Rpc<SolanaRpcApi>;
    testnetRpc satisfies Rpc<RequestAirdropApi>;
    testnetRpc satisfies RpcTestnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a devnet RPC
    testnetRpc satisfies RpcDevnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a mainnet RPC
    testnetRpc satisfies RpcMainnet<SolanaRpcApiMainnet>;

    sendAndConfirmTransactionFactory({
      rpc: testnetRpc,
      rpcSubscriptions: testnetRpcSubscriptions,
    });
    sendAndConfirmDurableNonceTransactionFactory({
      rpc: testnetRpc,
      rpcSubscriptions: testnetRpcSubscriptions,
    });
  }

  // Localnet cluster typechecks when the providing the moniker
  {
    const { rpc: localnetRpc, rpcSubscriptions: localnetRpcSubscriptions } = createSolanaClient({
      urlOrMoniker: "localnet",
    });
    localnetRpc satisfies Rpc<SolanaRpcApi>;
    localnetRpc satisfies Rpc<RequestAirdropApi>;
    //@ts-expect-error Should not be a testnet RPC
    localnetRpc satisfies RpcTestnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a devnet RPC
    localnetRpc satisfies RpcDevnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a mainnet RPC
    localnetRpc satisfies RpcMainnet<SolanaRpcApiMainnet>;

    sendAndConfirmTransactionFactory({
      rpc: localnetRpc,
      rpcSubscriptions: localnetRpcSubscriptions,
    });
    sendAndConfirmDurableNonceTransactionFactory({
      rpc: localnetRpc,
      rpcSubscriptions: localnetRpcSubscriptions,
    });
  }

  // Localnet cluster typechecks when the providing the moniker
  {
    const { rpc: genericRpc, rpcSubscriptions: genericRpcSubscriptions } = createSolanaClient({
      urlOrMoniker: "https://example-rpc.com",
    });
    genericRpc satisfies Rpc<SolanaRpcApi>;
    genericRpc satisfies Rpc<RequestAirdropApi>;
    //@ts-expect-error Should not be a testnet RPC
    genericRpc satisfies RpcTestnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a devnet RPC
    genericRpc satisfies RpcDevnet<SolanaRpcApi>;
    //@ts-expect-error Should not be a mainnet RPC
    genericRpc satisfies RpcMainnet<SolanaRpcApiMainnet>;

    sendAndConfirmTransactionFactory({
      rpc: genericRpc,
      rpcSubscriptions: genericRpcSubscriptions,
    });
    sendAndConfirmDurableNonceTransactionFactory({
      rpc: genericRpc,
      rpcSubscriptions: genericRpcSubscriptions,
    });
  }
}

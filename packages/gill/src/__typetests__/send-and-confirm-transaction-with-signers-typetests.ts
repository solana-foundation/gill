/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  GetEpochInfoApi,
  GetSignatureStatusesApi,
  Rpc,
  RpcDevnet,
  RpcMainnet,
  RpcSubscriptions,
  RpcSubscriptionsDevnet,
  RpcSubscriptionsMainnet,
  RpcSubscriptionsTestnet,
  RpcTestnet,
  SendTransactionApi,
  SignatureNotificationsApi,
  SlotNotificationsApi,
} from "@solana/kit";
import { sendAndConfirmTransactionWithSignersFactory } from "../core/send-and-confirm-transaction-with-signers";

const rpc = null as unknown as Rpc<GetEpochInfoApi & GetSignatureStatusesApi & SendTransactionApi>;
const rpcDevnet = null as unknown as RpcDevnet<GetEpochInfoApi & GetSignatureStatusesApi & SendTransactionApi>;
const rpcTestnet = null as unknown as RpcTestnet<GetEpochInfoApi & GetSignatureStatusesApi & SendTransactionApi>;
const rpcMainnet = null as unknown as RpcMainnet<GetEpochInfoApi & GetSignatureStatusesApi & SendTransactionApi>;

const rpcSubscriptions = null as unknown as RpcSubscriptions<SignatureNotificationsApi & SlotNotificationsApi>;
const rpcSubscriptionsDevnet = null as unknown as RpcSubscriptionsDevnet<
  SignatureNotificationsApi & SlotNotificationsApi
>;
const rpcSubscriptionsMainnet = null as unknown as RpcSubscriptionsMainnet<
  SignatureNotificationsApi & SlotNotificationsApi
>;
const rpcSubscriptionsTestnet = null as unknown as RpcSubscriptionsTestnet<
  SignatureNotificationsApi & SlotNotificationsApi
>;

// [DESCRIBE] sendAndConfirmTransactionWithSignersFactory
{
  {
    // It typechecks when the RPC clusters match.
    sendAndConfirmTransactionWithSignersFactory({ rpc, rpcSubscriptions });
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcDevnet, rpcSubscriptions: rpcSubscriptionsDevnet });
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcTestnet, rpcSubscriptions: rpcSubscriptionsTestnet });
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcMainnet, rpcSubscriptions: rpcSubscriptionsMainnet });
  }
  {
    // It typechecks when either RPC is generic.
    sendAndConfirmTransactionWithSignersFactory({ rpc, rpcSubscriptions });
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcDevnet, rpcSubscriptions });
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcTestnet, rpcSubscriptions });
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcMainnet, rpcSubscriptions });
  }
  {
    // It fails to typecheck when explicit RPC clusters mismatch.
    // @ts-expect-error
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcDevnet, rpcSubscriptions: rpcSubscriptionsTestnet });
    // @ts-expect-error
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcDevnet, rpcSubscriptions: rpcSubscriptionsMainnet });
    // @ts-expect-error
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcTestnet, rpcSubscriptions: rpcSubscriptionsMainnet });
    // @ts-expect-error
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcTestnet, rpcSubscriptions: rpcSubscriptionsDevnet });
    // @ts-expect-error
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcMainnet, rpcSubscriptions: rpcSubscriptionsDevnet });
    // @ts-expect-error
    sendAndConfirmTransactionWithSignersFactory({ rpc: rpcMainnet, rpcSubscriptions: rpcSubscriptionsTestnet });
  }
}

export * from "@solana/accounts";
export * from "@solana/addresses";
export * from "@solana/codecs";
export * from "@solana/errors";
export * from "@solana/functional";
export * from "@solana/instructions";
export * from "@solana/keys";
export * from "@solana/programs";
export * from "@solana/rpc";
export * from "@solana/rpc-parsed-types";
export * from "@solana/rpc-subscriptions";
export * from "@solana/rpc-types";
export * from "@solana/signers";
export * from "@solana/transaction-messages";
export * from "@solana/transactions";

export type {
  RpcRequest,
  RpcRequestTransformer,
  RpcResponse,
  RpcResponseData,
  RpcResponseTransformer,
} from "@solana/rpc-spec-types";
export { createRpcMessage } from "@solana/rpc-spec-types";
// export type { Nonce as SystemNonce } from '@solana-program/system';

// export type { Nonce as SystemNonce } from "@solana-program/system";
// // export type { Omit<T, K extends keyof any>, Pick<T, K extends keyof T> } from 'typescript';

// // export type { Omit<'Nonce'> } from '@solana-program/system';
// import { Nonce } from "@solana-program/system";
// export type {Nonce as NonceState}

export {} from "@solana-program/system";
// import * as packageB from "@solana-program/system";

// export default { ...packageA, ...packageB };

export * from "./kit";
export * from "./types";
export * from "./core";

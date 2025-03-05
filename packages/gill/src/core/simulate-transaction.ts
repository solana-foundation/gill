import type { Simplify } from "./../types/index";
import type { Rpc, SimulateTransactionApi } from "@solana/rpc";
import { partiallySignTransactionMessageWithSigners } from "@solana/signers";
import { type CompilableTransactionMessage } from "@solana/transaction-messages";
import { getBase64EncodedWireTransaction, type Transaction } from "@solana/transactions";

export type SimulateTransactionFunction = (
  transaction: Transaction | CompilableTransactionMessage,
  config?: Simplify<
    Omit<Parameters<SimulateTransactionApi["simulateTransaction"]>[1], "encoding" | "sigVerify">
  >,
) => Promise<ReturnType<SimulateTransactionApi["simulateTransaction"]>>;

type SimulateTransactionFactoryConfig<TCluster> = {
  rpc: Rpc<SimulateTransactionApi> & {
    "~cluster"?: TCluster;
  };
};

export function simulateTransactionFactory({
  rpc,
}: SimulateTransactionFactoryConfig<"devnet">): SimulateTransactionFunction;
export function simulateTransactionFactory({
  rpc,
}: SimulateTransactionFactoryConfig<"testnet">): SimulateTransactionFunction;
export function simulateTransactionFactory({
  rpc,
}: SimulateTransactionFactoryConfig<"mainnet">): SimulateTransactionFunction;
export function simulateTransactionFactory({
  rpc,
}: SimulateTransactionFactoryConfig<"localnet">): SimulateTransactionFunction;
export function simulateTransactionFactory<
  TCluster extends "devnet" | "mainnet" | "testnet" | "localnet" | void = void,
>({ rpc }: SimulateTransactionFactoryConfig<TCluster>): SimulateTransactionFunction {
  return async function simulateTransaction(transaction, config) {
    if ("messageBytes" in transaction == false) {
      transaction = await partiallySignTransactionMessageWithSigners(transaction);
    }

    return rpc
      .simulateTransaction(getBase64EncodedWireTransaction(transaction), {
        replaceRecentBlockhash: true,
        // innerInstructions: true,
        ...config,
        sigVerify: false,
        encoding: "base64",
      })
      .send();
  };
}

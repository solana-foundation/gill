"use client";
import { useQuery } from "@tanstack/react-query";
import type { GetTransactionApi, Signature, Simplify } from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { GillUseRpcHook } from "./types";

type RpcConfig = Simplify<Parameters<GetTransactionApi["getTransaction"]>>[1];

type UseGetTransactionInput<TConfig extends RpcConfig = RpcConfig> = GillUseRpcHook<TConfig> & {
  signature: Signature;
};

type UseGetTransactionResponse = ReturnType<GetTransactionApi["getTransaction"]>;

/**
 * Get transaction details using the Solana RPC method of
 * [`getTransaction`](https://solana.com/docs/rpc/http/gettransaction)
 */
export function useGetTransaction<TConfig extends RpcConfig = RpcConfig>({
  options,
  config,
  abortSignal,
  signature,
}: UseGetTransactionInput<TConfig>) {
  const { rpc } = useSolanaClient();

  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
    enabled: !!signature,
    queryKey: [GILL_HOOK_CLIENT_KEY, "getTransaction", signature],
    queryFn: async () => {
      const transaction = await rpc.getTransaction(signature, config).send({ abortSignal });
      return transaction;
    },
  });

  return {
    ...rest,
    transaction: data as UseGetTransactionResponse,
  };
}

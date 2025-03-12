"use client";

import { useQuery } from "@tanstack/react-query";
import { useSolanaClient } from "./client";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import type { GetLatestBlockhashApi } from "gill";

type RpcMethodReturnValue = ReturnType<GetLatestBlockhashApi["getLatestBlockhash"]>["value"];

/**
 * Get the latest blockhash the using the Solana RPC method
 * of [`getLatestBlockhash`](https://solana.com/docs/rpc/http/getlatestblockhash)
 *
 * To auto refetch the latest blockhash, provide a `refetchInterval` value
 */
export function useLatestBlockhash(
  options: Omit<Parameters<typeof useQuery<RpcMethodReturnValue>>[0], "queryKey" | "queryFn"> = {},
) {
  const { rpc } = useSolanaClient();
  const { data, ...rest } = useQuery({
    ...options,
    queryKey: [GILL_HOOK_CLIENT_KEY, "getLatestBlockhash"],
    queryFn: async () => {
      const { value } = await rpc.getLatestBlockhash().send();
      return value;
    },
  });
  return {
    ...rest,
    latestBlockhash: data,
  };
}

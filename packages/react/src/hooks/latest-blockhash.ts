"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetLatestBlockhashApi, Simplify } from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { OmittedUseQueryFields } from "./types";

type RpcMethodReturnValue = ReturnType<GetLatestBlockhashApi["getLatestBlockhash"]>["value"];

/**
 * Get the latest blockhash using the Solana RPC method
 * of [`getLatestBlockhash`](https://solana.com/docs/rpc/http/getlatestblockhash)
 *
 * To auto refetch the latest blockhash, provide a `options.refetchInterval` value
 */
export function useLatestBlockhash(
  options: Simplify<Omit<Parameters<typeof useQuery<RpcMethodReturnValue>>[0], OmittedUseQueryFields>> = {},
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

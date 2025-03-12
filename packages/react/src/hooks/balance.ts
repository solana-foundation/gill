"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "gill";
import { useSolanaClient } from "./client";
import { GILL_HOOK_CLIENT_KEY } from "../const";

/**
 * Get an account's balance the using the Solana RPC method [`getBalance`](https://solana.com/docs/rpc/http/getbalance)
 */
export function useBalance(address: string | Address) {
  const { data: balance, ...rest } = useQuery({
    queryKey: [GILL_HOOK_CLIENT_KEY, "balance", address],
    queryFn: async () => {
      const { value: balance } = await useSolanaClient()
        .rpc.getBalance(address as Address)
        .send();
      return balance;
    },
    networkMode: "offlineFirst",
    enabled: !!address,
  });
  return {
    ...rest,
    balance,
  };
}

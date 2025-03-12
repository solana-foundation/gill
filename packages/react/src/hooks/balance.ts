"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address, Lamports } from "gill";
import { useSolanaClient } from "./client";
import { GILL_HOOK_KEY_CONFIG } from "../const";

/**
 * Get an account's balance the using the Solana RPC method [`getBalance`](https://solana.com/docs/rpc/http/getbalance)
 */
export function useBalance(address: string | Address) {
  const { data: balance, ...rest } = useQuery<Lamports>({
    queryKey: [GILL_HOOK_KEY_CONFIG, "balance", address],
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
    balance: balance as Lamports,
  };
}

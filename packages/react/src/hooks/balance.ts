"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "gill";
import { useSolanaClient } from "./client";
import { GILL_HOOK_CLIENT_KEY } from "../const";

/**
 * Get an account's balance (in lamports) using the Solana RPC method
 * of [`getBalance`](https://solana.com/docs/rpc/http/getbalance)
 */
export function useBalance(address: string | Address) {
  const { rpc } = useSolanaClient();
  const { data, ...rest } = useQuery({
    queryKey: [GILL_HOOK_CLIENT_KEY, "getBalance", address],
    queryFn: async () => {
      const { value } = await rpc.getBalance(address as Address).send();
      return value;
    },
    networkMode: "offlineFirst",
    enabled: !!address,
  });
  return {
    ...rest,
    balance: data,
  };
}

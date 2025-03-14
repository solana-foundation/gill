"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "gill";
import { assertAccountExists, fetchEncodedAccount } from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";

/**
 * Get an account (and it's data) the using the Solana RPC method
 * of [`getBalance`](https://solana.com/docs/rpc/http/getaccountinfo)
 */
export function useAccount(address: string | Address) {
  const { rpc } = useSolanaClient();
  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    queryKey: [GILL_HOOK_CLIENT_KEY, "getAccountInfo", address],
    queryFn: async () => {
      const account = await fetchEncodedAccount(rpc, address as Address);
      assertAccountExists(account);
      return account;
    },
    enabled: !!address,
  });
  return {
    ...rest,
    account: data,
  };
}

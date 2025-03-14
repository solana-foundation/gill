"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address, Simplify } from "gill";
import { assertAccountExists, fetchEncodedAccount } from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { OmittedUseQueryFields } from "./types";

/**
 * Get the account info for an address using the Solana RPC method
 * of [`getAccountInfo`](https://solana.com/docs/rpc/http/getaccountinfo)
 */
export function useAccount(
  address: string | Address,
  options: Simplify<Omit<Parameters<typeof useQuery>[0], OmittedUseQueryFields>> = {},
) {
  const { rpc } = useSolanaClient();
  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
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

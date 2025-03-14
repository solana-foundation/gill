"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address, GetBalanceApi, Simplify } from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { OmittedUseQueryFields } from "./types";

type RpcMethodReturnValue = ReturnType<GetBalanceApi["getBalance"]>["value"];

/**
 * Get an account's balance (in lamports) using the Solana RPC method
 * of [`getBalance`](https://solana.com/docs/rpc/http/getbalance)
 */
export function useBalance(
  address: string | Address,
  options: Simplify<Omit<Parameters<typeof useQuery<RpcMethodReturnValue>>[0], OmittedUseQueryFields>> = {},
) {
  const { rpc } = useSolanaClient();
  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
    enabled: !!address,
    queryKey: [GILL_HOOK_CLIENT_KEY, "getBalance", address],
    queryFn: async () => {
      const { value } = await rpc.getBalance(address as Address).send();
      return value;
    },
  });
  return {
    ...rest,
    balance: data,
  };
}

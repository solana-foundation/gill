"use client";

import { useQuery } from "@tanstack/react-query";
import type { Account, Address, Simplify } from "gill";
import { assertAccountExists, fetchEncodedAccount } from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { GillUseRpcHook } from "./types";

type RpcConfig = Simplify<Parameters<typeof fetchEncodedAccount>>[2];

type UseAccountResponse<TData extends Uint8Array | object = Uint8Array, TAddress extends string = string> = Account<
  TData,
  TAddress
> & {
  exists: true;
};

type UseAccountInput<TConfig extends RpcConfig = RpcConfig> = GillUseRpcHook<TConfig> & {
  /**
   * Address of the account to get the balance of
   */
  address: Address | string;
};

/**
 * Get the account info for an address using the Solana RPC method of
 * [`getAccountInfo`](https://solana.com/docs/rpc/http/getaccountinfo)
 */
export function useAccount<TConfig extends RpcConfig = RpcConfig>({
  options,
  config,
  address,
}: UseAccountInput<TConfig>) {
  const { rpc } = useSolanaClient();
  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
    queryKey: [GILL_HOOK_CLIENT_KEY, "getAccountInfo", address],
    queryFn: async () => {
      const account = await fetchEncodedAccount(rpc, address as Address, config);
      assertAccountExists(account);
      return account;
    },
    enabled: !!address,
  });
  return {
    ...rest,
    account: data as UseAccountResponse,
  };
}

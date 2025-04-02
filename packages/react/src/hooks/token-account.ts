"use client";

import { useQuery } from "@tanstack/react-query";
import type { Account, Address, Decoder, FetchAccountConfig, Simplify } from "gill";
import { address, assertAccountExists, decodeAccount, fetchEncodedAccount } from "gill";
import { getAssociatedTokenAccountAddress, TOKEN_2022_PROGRAM_ADDRESS } from "gill/programs/token";

import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { GillUseRpcHook } from "./types";

type RpcConfig = Simplify<Omit<FetchAccountConfig, "abortSignal">>;

type UseTokenAccountResponse<TData extends Uint8Array | object = Uint8Array> = Account<TData> & {
  exists: true;
};

type UseTokenAccountInput<
  TConfig extends RpcConfig = RpcConfig,
  TDecodedData extends object = Uint8Array,
> = GillUseRpcHook<TConfig> & {
  /**
   * Optional manual ATA override (useful for multi-sig setups)
   */
  ataOverride?: Address;
  /**
   * Account decoder for token account data
   */
  decoder?: Decoder<TDecodedData>;
  /**
   * Mint address of the SPL token
   */
  mint: Address;
  /**
   * Owner of the token account
   */
  owner: Address;
  /**
   * Use Token-2022 instead of the default SPL Token Program
   */
  useToken2022?: boolean;
};

/**
 * Fetch the associated token account (ATA) for a given mint & owner.
 * Supports Token-2022 via the `useToken2022` flag.
 */
export function useTokenAccount<TConfig extends RpcConfig = RpcConfig, TDecodedData extends object = Uint8Array>({
  options,
  config,
  abortSignal,
  mint,
  owner,
  ataOverride,
  decoder,
  useToken2022 = false,
}: UseTokenAccountInput<TConfig, TDecodedData>) {
  const { rpc } = useSolanaClient();

  if (abortSignal) {
    // @ts-expect-error the `abortSignal` was stripped from the type but is now being adding back in
    config = {
      ...(config || {}),
      abortSignal,
    };
  }

  //   Supporting Token-2022 and SPL Token Programs
  const tokenProgram = useToken2022 ? TOKEN_2022_PROGRAM_ADDRESS : undefined;

  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
    enabled: !!mint && !!owner,
    queryFn: async () => {
      // Derive ATA if not manually provided
      const ata = ataOverride
        ? address(ataOverride)
        : await getAssociatedTokenAccountAddress(address(mint), address(owner), tokenProgram);

      const account = await fetchEncodedAccount(rpc, ata, config);
      assertAccountExists(account);

      return decoder ? decodeAccount(account, decoder as Decoder<TDecodedData>) : account;
    },
    queryKey: [GILL_HOOK_CLIENT_KEY, "getTokenAccount", mint, owner, useToken2022],
  });

  return {
    ...rest,
    account: data as UseTokenAccountResponse<TDecodedData>,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { Account, Address, FetchAccountConfig, Simplify } from "gill";
import { address, assertAccountExists, fetchEncodedAccount } from "gill";
import {
  checkedTokenProgramAddress,
  getAssociatedTokenAccountAddress,
  TokenProgramMonikers,
} from "gill/programs/token";

import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { GillUseRpcHook } from "./types";

type RpcConfig = Simplify<Omit<FetchAccountConfig, "abortSignal">>;

type UseTokenAccountResponse<TData extends Uint8Array | object = Uint8Array> = Account<TData> & {
  exists: true;
};

type UseTokenATA = {
  /**
   * Optional manual ATA override (useful for multi-sig setups)
   */
  ata: Address;

  mint?: never;
  owner?: never;
};

type UseTokenMintOwner = {
  ata?: never;
  /**
   * Mint address of the SPL token
   */
  mint: Address;
  /**
   * Owner of the token account
   */
  owner: Address;
};

type UseTokenAccountInput<
  TConfig extends RpcConfig = RpcConfig,
  // TDecodedData extends object = Uint8Array,
> = GillUseRpcHook<TConfig> & {
  /**
   * Token program to use for the ATA derivation
   */
  tokenProgram?: Address | TokenProgramMonikers;
} & (UseTokenATA | UseTokenMintOwner);

function hasATA(info: UseTokenATA | UseTokenMintOwner): info is UseTokenATA {
  return (info as UseTokenATA).ata !== undefined;
}

/**
 * Fetch the associated token account (ATA) for a given mint & owner.
 */
export function useTokenAccount<TConfig extends RpcConfig = RpcConfig>({
  options,
  config,
  abortSignal,
  tokenProgram,
  ...tokenAccountOptions
}: UseTokenAccountInput<TConfig>) {
  const { rpc } = useSolanaClient();

  if (abortSignal) {
    // @ts-expect-error the `abortSignal` was stripped from the type but is now being added back in
    config = {
      ...(config || {}),
      abortSignal,
    };
  }

  tokenProgram = checkedTokenProgramAddress(tokenProgram);

  const { data, ...rest } = useQuery({
    networkMode: "offlineFirst",
    ...options,
    enabled: hasATA(tokenAccountOptions)
      ? !!tokenAccountOptions.ata
      : !!tokenAccountOptions.mint && !!tokenAccountOptions.owner,
    queryFn: async () => {
      let _ata: Address;

      if (hasATA(tokenAccountOptions)) {
        _ata = address(tokenAccountOptions.ata);
      } else {
        _ata = await getAssociatedTokenAccountAddress(
          address(tokenAccountOptions.mint),
          address(tokenAccountOptions.owner),
          tokenProgram,
        );
      }

      const account = await fetchEncodedAccount(rpc, _ata, config);
      assertAccountExists(account);

      // TODO: decode account with ATA decoder
      return account;
    },
    queryKey: [
      GILL_HOOK_CLIENT_KEY,
      "getTokenAccount",
      tokenAccountOptions.ata,
      tokenAccountOptions.mint,
      tokenAccountOptions.owner,
      tokenProgram,
    ],
  });

  return {
    ...rest,
    account: data as UseTokenAccountResponse<Uint8Array>,
  };
}

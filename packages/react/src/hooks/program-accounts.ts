"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  AccountInfoBase,
  AccountInfoWithBase58Bytes,
  AccountInfoWithBase58EncodedData,
  AccountInfoWithBase64EncodedData,
  AccountInfoWithBase64EncodedZStdCompressedData,
  AccountInfoWithJsonData,
  AccountInfoWithPubkey,
  Address,
  GetProgramAccountsApi,
  Simplify,
  SolanaRpcResponse,
} from "gill";
import { GILL_HOOK_CLIENT_KEY } from "../const";
import { useSolanaClient } from "./client";
import type { GillUseRpcHook } from "./types";

type Encoding = "base64" | "jsonParsed" | "base64+zstd" | "base58";

type RpcConfig = Simplify<
  Parameters<GetProgramAccountsApi["getProgramAccounts"]>[1] &
    Readonly<{
      encoding?: Encoding;
    }>
>;

type UseProgramAccountsInput<TConfig extends RpcConfig = RpcConfig> = GillUseRpcHook<TConfig> & {
  /**
   * Address of the program used to call
   * [`getProgramAccounts`](https://solana.com/docs/rpc/http/getprogramaccounts)
   */
  program: Address | string;
};

type UseProgramAccountsResponse<TConfig extends RpcConfig> = TConfig extends {
  encoding: "base64";
  withContext: true;
}
  ? SolanaRpcResponse<AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase64EncodedData>[]>
  : TConfig extends { encoding: "base64" }
    ? AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase64EncodedData>[]
    : TConfig extends { encoding: "base64+zstd"; withContext: true }
      ? SolanaRpcResponse<AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase64EncodedZStdCompressedData>[]>
      : TConfig extends { encoding: "base64+zstd" }
        ? AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase64EncodedZStdCompressedData>[]
        : TConfig extends { encoding: "jsonParsed"; withContext: true }
          ? SolanaRpcResponse<AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithJsonData>[]>
          : TConfig extends { encoding: "jsonParsed" }
            ? AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithJsonData>[]
            : TConfig extends { encoding: "base58"; withContext: true }
              ? SolanaRpcResponse<AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase58EncodedData>[]>
              : TConfig extends { encoding: "base58" }
                ? AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase58EncodedData>[]
                : TConfig extends { withContext: true }
                  ? SolanaRpcResponse<AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase58Bytes>[]>
                  : AccountInfoWithPubkey<AccountInfoBase & AccountInfoWithBase58Bytes>[];

/**
 * Get all the accounts owned by a `program` using the Solana RPC method of
 * [`getProgramAccounts`](https://solana.com/docs/rpc/http/getprogramaccounts)
 */
export function useProgramAccounts<TConfig extends RpcConfig = RpcConfig>({
  options,
  config,
  abortSignal,
  program,
}: UseProgramAccountsInput<TConfig>) {
  const { rpc } = useSolanaClient();

  const { data, ...rest } = useQuery({
    ...options,
    enabled: !!program,
    queryKey: [GILL_HOOK_CLIENT_KEY, "getProgramAccounts", program],
    queryFn: async () => {
      const accounts = await rpc.getProgramAccounts(program as Address, config).send({ abortSignal });
      return accounts;
    },
  });

  return {
    ...rest,
    accounts: data as Simplify<UseProgramAccountsResponse<TConfig>>,
  };
}

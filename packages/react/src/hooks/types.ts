import type { useQuery } from "@tanstack/react-query";
import type { Simplify } from "gill";

export type OmittedUseQueryFields = "queryKey" | "queryFn";

export type GillUseQueryDefaultOptions = Omit<Parameters<typeof useQuery>[0], OmittedUseQueryFields>;

export type GillUseRpcHook<TConfig, TOptions extends GillUseQueryDefaultOptions = GillUseQueryDefaultOptions> = {
  /**
   * RPC configuration passed to the RPC method being called
   */
  config?: TConfig;
  /**
   * Options passed to the {@link useQuery} hook
   */
  options?: Simplify<TOptions>;
};

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GillConfig } from "./types";
import { GILL_HOOK_KEY_CONFIG } from "./const";

/**
 * Wrapper provider to utilize gill hooks
 */
export function GillProvider({
  config,
  children,
  queryClient = new QueryClient(),
}: {
  config: GillConfig;
  children: React.ReactNode;
  queryClient?: QueryClient;
}) {
  queryClient.setQueryData(GILL_HOOK_KEY_CONFIG, config);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

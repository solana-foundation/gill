"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GILL_HOOK_KEY_CONFIG } from "./const";
import type { SolanaClient } from "gill";

/**
 * Provider to utilize gill hooks for Solana
 */
export function SolanaProvider({
  client,
  children,
  queryClient = new QueryClient(),
}: {
  client: SolanaClient;
  children: React.ReactNode;
  queryClient?: QueryClient;
}) {
  queryClient.setQueryData([GILL_HOOK_KEY_CONFIG], client);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

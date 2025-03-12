"use client";

import { createSolanaClient } from "gill";
import { SolanaProvider } from "gill-react";

export function SolanaProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProvider
      client={createSolanaClient({
        urlOrMoniker: "devnet",
      })}
    >
      {children}
    </SolanaProvider>
  );
}

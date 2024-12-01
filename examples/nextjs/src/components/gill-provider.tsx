"use client";

import { createSolanaClient } from "gill";
import { GillConfigProvider } from "gill-react";

const gillConfig = createSolanaClient({
  urlOrMoniker: "devnet",
});

export function GillProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GillConfigProvider config={gillConfig}>{children}</GillConfigProvider>
  );
}

"use client";

import { lamportsToSol } from "gill";
import { useBalance, useLatestBlockhash } from "gill-react";

export function PageClient() {
  const { balance, isLoading } = useBalance("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c");
  const { latestBlockhash } = useLatestBlockhash();

  if (isLoading) {
    return <div className="">loading balance...</div>;
  }

  return (
    <div className="">
      <p>Balance: {lamportsToSol(balance || 0) + " SOL"}</p>
      <pre>latestBlockhash: {JSON.stringify(latestBlockhash, null, "\t")}</pre>
    </div>
  );
}

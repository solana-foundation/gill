<h1 align="center">
  gill-react
</h1>

<p align="center">
  React hooks library for the Solana blockchain
</p>

## Overview

Welcome to `gill-react`, a React hooks library for easily interacting with the [Solana](http://solana.com/) blockchain.

> Notice: `gill-react` is in active development. All APIs are subject to change until reaching the first major version
> (v1.0.0).

This React hooks library is built on top of two core libraries:

1. [`gill`](https://www.npmjs.com/package/gill) - modern JavaScript/TypeScript library for interacting with the Solana
   blockchain.
2. [`@tanstack/react-query`](https://www.npmjs.com/package/@tanstack/react-query) - popular and powerful asynchronous
   state management for React.

## Installation

Install `gill-react` with your package manager of choice:

```shell
npm install gill gill-react @tanstack/react-query
```

```shell
pnpm add gill gill-react @tanstack/react-query
```

```shell
yarn add gill gill-react @tanstack/react-query
```

> Note: `gill` and `@tanstack/react-query` are peer dependencies of `gill-react` so you need to explicitly install them.
> This allows you have more/easier control over managing dependencies yourself.

## Quick start

Setup and configure your `SolanaProvider` to use the gill hooks:

- [Wrap your React app in a context provider](#wrap-your-react-app-in-a-context-provider)
- [Create a client-only provider for NextJs and React server components](#create-a-client-only-provider-for-nextjs-and-react-server-components)
- [Wrap your app in the client-only provider for NextJs](#wrap-your-app-in-the-client-only-provider-for-nextjs)
- [Using React hooks in React server component applications](#using-react-hooks-in-react-server-component-applications)

Manage and use your Solana client's connections:

- [`useSolanaClient`](#get-solana-client) - get the current Solana client (including `rpc` and `rpcSubscriptions`)
- [`useUpdateSolanaClient`](#get-account-balance-in-lamports) - update the current Solana client (including `rpc` and
  `rpcSubscriptions`)

Fetch data from the Solana blockchain with the gill hooks:

- [`useAccount`](#get-account-info-and-data) - get the account info for an address
- [`useBalance`](#get-account-balance-in-lamports) - get account balance (in lamports)
- [`useLatestBlockhash`](#get-latest-blockhash) - get the latest blockhash

### Wrap your React app in a context provider

Wrap your app with the `SolanaProvider` React context provider and pass your Solana client to it:

```tsx
import { createSolanaClient } from "gill";
import { SolanaProvider } from "gill-react";

const client = createSolanaClient({
  urlOrMoniker: "devnet",
});

function App() {
  return <SolanaProvider client={client}>{/* ... */}</SolanaProvider>;
}
```

### Create a client-only provider for NextJs and React server components

For application that use React server components, like NextJS, you will need to create a "client only" wrapper for the
`SolanaProvider` exported from `gill-react`:

```tsx
"use client"; // <--- this "use client" directive is required!

import { createSolanaClient } from "gill";
import { SolanaProvider } from "gill-react";

const client = createSolanaClient({
  urlOrMoniker: "devnet",
});

export function SolanaProviderClient({ children }: { children: React.ReactNode }) {
  return <SolanaProvider client={client}>{children}</SolanaProvider>;
}
```

### Wrap your app in the client-only provider for NextJs

After creating your client-only provider, you can wrap your app with this
[`SolanaProviderClient`](#create-a-client-only-provider-for-nextjs-and-react-server-components) (normally inside the
root `layout.tsx`):

```tsx
import { SolanaProviderClient } from "@/providers/solana-provider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <SolanaProviderClient>{children}</SolanaProviderClient>
      </body>
    </html>
  );
}
```

### Using React hooks in React server component applications

After you have setup your client-only provider, you must set the `use client` directive in any component that uses the
`gill-react` library. Signifying this component is required to be "client only".

See React's [`use client` directive docs](https://react.dev/reference/rsc/use-client).

> Note: NextJs uses React server components by default. Read their docs
> [here](https://react.dev/reference/rsc/use-client) on the `use client` directive.

```tsx
"use client"; // <--- directive required anywhere you use `gill-react`

import { useBalance, ... } from "gill-react";
// ... other imports

export function PageClient() {
  const { balance } = useBalance({
    address: "nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c",
  });

  return (
    {/* ... */}
  );
}

```

### Get your Solana client

Get the current Solana client configured in the [`SolanaProvider`](#wrap-your-react-app-in-a-context-provider),
including the `rpc` and `rpcSubscriptions` connections:

```tsx
"use client";

import { useSolanaClient } from "gill-react";

export function PageClient() {
  const { rpc, rpcSubscriptions } = useSolanaClient();

  // you can now use `rpc` to access any of the Solana JSON RPC methods

  return { ... }
}
```

### Get account balance (in lamports)

Get an account's balance (in lamports) using the Solana RPC method of
[`getBalance`](https://solana.com/docs/rpc/http/getbalance):

```tsx
"use client";

import { lamportsToSol } from "gill";
import { useBalance } from "gill-react";

export function PageClient() {
  const { balance, isLoading, isError, error } = useBalance({
    address: "nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c",
  });

  // if (isLoading) { return ... }
  // if (isError) { return ... }

  return (
    <div className="">
      <p>Balance: {lamportsToSol(balance) + " SOL"}</p>
    </div>
  );
}
```

### Get latest blockhash

Get the latest blockhash using the Solana RPC method of
[`getLatestBlockhash`](https://solana.com/docs/rpc/http/getlatestblockhash)

```tsx
"use client";

import { useLatestBlockhash } from "gill-react";

export function PageClient() {
  const { latestBlockhash, isLoading, isError, error } = useLatestBlockhash();

  // if (isLoading) { return ... }
  // if (isError) { return ... }

  return (
    <div className="">
      <pre>latestBlockhash: {JSON.stringify(latestBlockhash, null, "\t")}</pre>
    </div>
  );
}
```

### Get account info (and data)

Get the account info for an address using the Solana RPC method of
[`getAccountInfo`](https://solana.com/docs/rpc/http/getaccountinfo):

```tsx
"use client";

import { useAccount } from "gill-react";

export function PageClient() {
  const { account, isLoading, isError, error } = useAccount({
    address: "nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c",
  });

  // if (isLoading) { return ... }
  // if (isError) { return ... }

  return (
    <div className="">
      <pre>account: {JSON.stringify(account, null, "\t")}</pre>
    </div>
  );
}
```

# gill

Welcome to gill, a [Solana web3.js v2](https://github.com/anza-xyz/solana-web3.js) compatible helper
library for building Solana apps in Node, web, and React Native.

## Get started

Install `gill` with your package manager of choice:

```shell
npm install gill
```

```shell
pnpm add gill
```

```shell
yarn add gill
```

## Quick start

- [Create a Solana RPC connection](#create-a-solana-rpc-connection)
- [Create a transaction](#create-a-transaction)
- [Get a Solana Explorer link](#get-a-solana-explorer-link-for-transactions-accounts-or-blocks)

You can also find some [NodeJS specific helpers](#node-specific-imports) like:

- [Loading a keypair from a file](#loading-a-keypair-from-a-file)

### Create a Solana RPC connection

Create a Solana `rpc` and `rpcSubscriptions` client for any RPC URL or standard Solana network
moniker (i.e. `devnet`, `localnet`, `mainnet` etc).

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: "mainnet",
});
```

> Using the Solana moniker will connect to the public RPC endpoints. These are subject to rate
> limits and should not be used in production applications. Applications should find their own RPC
> provider and the URL provided from them.

To create an RPC client for your local test validator:

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: "localnet",
});
```

To create an RPC client for an custom RPC provider or service:

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: "https://private-solana-rpc-provider.com",
});
```

### Create a transaction

Quickly create a Solana transaction:

```typescript
import { createTransaction } from "gill";

const transaction = createTransaction({
  version,
  feePayer,
  instructions,
});
```

To create a transaction while setting the latest blockhash:

```typescript
import { createTransaction } from "gill";

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transaction = createTransaction({
  version,
  feePayer,
  instructions,
  latestBlockhash,
});
```

The `feePayer` can be either an `Address` or `TransactionSigner`.

### Get a Solana Explorer link for transactions, accounts, or blocks

Craft a Solana Explorer link for transactions, accounts, or blocks on any cluster.

> When no `cluster` is provided, defaults to `mainnet`.

```typescript
import { getExplorerLink } from "gill";

const link: URL = getExplorerLink({
  transaction:
    "4nzNU7YxPtPsVzeg16oaZvLz4jMPtbAzavDfEFmemHNv93iYXKKYAaqBJzFCwEVxiULqTYYrbjPwQnA1d9ZCTELg",
});
```

To get an explorer link for an account on Solana's devnet:

```typescript
import { getExplorerLink } from "gill";

const link: URL = getExplorerLink({
  cluster: "devnet",
  account: "nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5",
});
```

To get an explorer link for an account on your local test validator:

```typescript
import { getExplorerLink } from "gill";

const link: URL = getExplorerLink({
  cluster: "localnet",
  account: "11111111111111111111111111111111",
});
```

To get an explorer link for a block:

```typescript
import { getExplorerLink } from "gill";

const link: URL = getExplorerLink({
  cluster: "mainnet",
  block: "242233124",
});
```

## Node specific imports

The `gill` package has specific imports for use in NodeJS server backends and/or serverless
environments which have access to Node specific APIs (like the file system via `node:fs`).

```typescript
import { ... } from "gill/node"
```

### Loading a keypair from a file

```typescript
import { loadKeypairSignerFromFile } from "gill/node";

// default file path: ~/.config/solana/id.json
const signer = await loadKeypairSignerFromFile();
console.log("address:", signer.address);
```

Load a `KeyPairSigner` from a filesystem wallet json file, like those output from the
[Solana CLI](https://solana.com/docs/intro/installation#install-the-solana-cli) (i.e. a JSON array
of numbers).

By default, the keypair file loaded is the Solana CLI's default keypair: `~/.config/solana/id.json`

To load a Signer from a specific filepath:

```typescript
import { loadKeypairSignerFromFile } from "gill/node";

const signer = await loadKeypairSignerFromFile("/path/to/your/keypair.json");
console.log("address:", signer.address);
```

## Program clients

With `gill` you can also import some of the most commonly used clients for popular programs. These
are also fully tree-shakable, so if you do not import them inside your project they will be removed
by your JavaScript bundler at build time (i.e. Webpack).

To import any of these program clients:

```typescript
import { ... } from "gill/programs";
```

The program clients included inside `gill` are:

- [System program](https://github.com/solana-program/system) - re-exported from
  `@solana-program/system`
- [Compute Budget program](https://github.com/solana-program/compute-budget) - re-exported from
  `@solana-program/compute-budget`
- [Memo program](https://github.com/solana-program/memo) - re-exported from `@solana-program/memo`

If one of the existing clients are not being exported from `gill/programs`, you can manually add
their compatible client to your repo.

### Other compatible program clients

From the [solana-program](https://github.com/solana-program/token) GitHub organization - formerly
known as the Solana Program Library (SPL)

- [Token program](https://github.com/solana-program/token) - re-exported from
  `@solana-program/token`
- [Token Extension program (aka Token22)](https://github.com/solana-program/token-2022) -
  re-exported from `@solana-program/token-2022`
- [Associated Token Account program](https://github.com/solana-program/associated-token-account) -
  re-exported from `@solana-program/associated-token-account`
- [Stake program](https://github.com/solana-program/stake) - re-exported from
  `@solana-program/stake`
- [Address Lookup Table program](https://github.com/solana-program/address-lookup-table) -
  re-exported from `@solana-program/address-lookup-table`

### Generate a program client from an IDL

If you want to easily interact with any custom program with this library, you can use
[Codama](https://github.com/codama-idl/codama) to generate a compatible JavaScript/TypeScript client
using its IDL. You can either store the generated client inside your repo or publish it as a NPM
package for others to easily consume.

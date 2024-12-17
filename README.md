# gill

Welcome to gill, a [Solana web3.js v2](https://github.com/solana-labs/solana-web3.js) compatible
helper library for building Solana apps in Node, web, and React Native.

## Get started

Install `gill` with your package manager of choice:

```shell
npm install gill @solana/web3.js@2
```

```shell
pnpm add gill @solana/web3.js@2
```

```shell
yarn add gill @solana/web3.js@2
```

## Quick start

- [Create a Solana RPC connection](#create-a-solana-rpc-connection)
- [Create a transaction](#create-a-transaction)
- [Get a Solana Explorer link](#create-a-transaction)

You can also find some [Node specific helpers](#node-specific-imports):

- [Loading a keypair from a file](#loading-a-keypair-from-a-file)

### Create a Solana RPC connection

Create a Solana `rpc` and `rpcSubscriptions` client for any RPC URL or standard Solana network
moniker (i.e. `devnet`, `localnet`, etc).

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: "mainnet-beta",
});
```

> Using the Solana moniker will connect to the public RPC endpoints. These are subject to heavy rate
> limits and should not be used in production applications.

To create an RPC client for your local test validator:

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions } = createSolanaClient({
  urlOrMoniker: "localnet",
});
```

To create an RPC client for a paid RPC service:

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

const transactions = createTransaction({
  version,
  feePayer,
  instructions,
});
```

To create a transaction while setting the latest blockhash:

```typescript
import { createTransaction } from "gill";

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transactions = createTransaction({
  version,
  feePayer,
  instructions,
  latestBlockhash,
});
```

The `feePayer` can be either an `Address` or `TransactionSigner`.

### Get a Solana Explorer link for transactions, accounts, or blocks

Craft a Solana Explorer link for transactions, accounts, or blocks on any cluster.

> When no `cluster` is provided, defaults to `mainnet-beta`.

```typescript
import { getExplorerLink } from "gill";

const link: URL = getExplorerLink({
  transaction:
    "4nzNU7YxPtPsVzeg16oaZvLz4jMPtbAzavDfEFmemHNv93iYXKKYAaqBJzFCwEVxiULqTYYrbjPwQnA1d9ZCTELg",
});
```

To get an explorer link for an account on devnet:

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
  cluster: "mainnet-beta",
  block: "242233124",
});
```

## Node specific imports

The `gill` package has specific imports for use in NodeJS server backend and/or serverless
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

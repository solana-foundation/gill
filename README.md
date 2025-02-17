<h1 align="center">
  gill
</h1>

<p align="center">
  javascript/typescript client library for interacting with the Solana blockchain
</p>

<p align="center">
  <a href="https://github.com/solana-foundation/gill/actions/workflows/publish-packages.yml"><img src="https://img.shields.io/github/actions/workflow/status/solana-foundation/gill/publish-packages.yml?logo=GitHub" /></a>
  <a href="https://www.npmjs.com/package/gill"><img src="https://img.shields.io/npm/v/gill?logo=npm&color=377CC0" /></a>
</p>

<p align="center">
  <img width="600" alt="gill" src="https://raw.githubusercontent.com/solana-foundation/gill/refs/heads/master/media/cover.png" />
</p>

## Overview

Welcome to `gill`, a JavaScript/TypeScript client library for interacting with the
[Solana](http://solana.com/) blockchain. You can use it to build Solana apps in Node, web, React
Native, or just about any other JavaScript environment.

Gill is built on top of the modern javascript libraries for Solana built by Anza and used in
([@solana/web3.js v2](https://github.com/anza-xyz/solana-web3.js)). By utilizing the same types and
functions under the hood, `gill` is compatible with web3.js.

## Installation

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
- [Making Solana RPC calls](#making-solana-rpc-calls)
- [Create a transaction](#create-a-transaction)
- [Signing transactions](#signing-transactions)
- [Sending and confirming transaction](#sending-and-confirming-transactions)
- [Get a transaction signature](#get-the-signature-from-a-signed-transaction)
- [Get a Solana Explorer link](#get-a-solana-explorer-link-for-transactions-accounts-or-blocks)
- [Calculate minimum rent balance for an account](#calculate-minimum-rent-for-an-account)

You can also find some [NodeJS specific helpers](#node-specific-imports) like:

- [Loading a keypair from a file](#loading-a-keypair-from-a-file)

For troubleshooting and debugging your Solana transactions, see [Debug mode](#debug-mode) below.

> You can also consult the documentation for Anza's
> [JavaScript client](https://github.com/anza-xyz/solana-web3.js) library for more information and
> helpful resources.

### Create a Solana RPC connection

Create a Solana `rpc` and `rpcSubscriptions` client for any RPC URL or standard Solana network
moniker (i.e. `devnet`, `localnet`, `mainnet` etc).

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "mainnet",
});
```

> Using the Solana moniker will connect to the public RPC endpoints. These are subject to rate
> limits and should not be used in production applications. Applications should find their own RPC
> provider and the URL provided from them.

To create an RPC client for your local test validator:

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "localnet",
});
```

To create an RPC client for an custom RPC provider or service:

```typescript
import { createSolanaClient } from "gill";

const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "https://private-solana-rpc-provider.com",
});
```

### Making Solana RPC calls

After you have a Solana `rpc` connection, you can make all the
[JSON RPC method](https://solana.com/docs/rpc) calls directly off of it.

```typescript
import { createSolanaClient } from "gill";

const { rpc } = createSolanaClient({ urlOrMoniker: "devnet" });

// get slot
const slot = await rpc.getSlot().send();

// get the latest blockhash
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
```

> The `rpc` client requires you to call `.send()` on the RPC method in order to actually send the
> request to your RPC provider and get a response.

You can also include custom configuration settings on your RPC calls, like using a JavaScript
[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), by passing it
into `send()`:

```typescript
import { createSolanaClient } from "gill";

const { rpc } = createSolanaClient({ urlOrMoniker: "devnet" });

// Create a new AbortController.
const abortController = new AbortController();

// Abort the request when the user navigates away from the current page.
function onUserNavigateAway() {
  abortController.abort();
}

// The request will be aborted if and only if the user navigates away from the page.
const slot = await rpc.getSlot().send({ abortSignal: abortController.signal });
```

### Create a transaction

Quickly create a Solana transaction:

> Note: The `feePayer` can be either an `Address` or `TransactionSigner`.

```typescript
import { createTransaction } from "gill";

const transaction = createTransaction({
  version,
  feePayer,
  instructions,
  // the compute budget values are HIGHLY recommend to be set in order to maximize your transaction landing rate
  // computeUnitLimit: number,
  // computeUnitPrice: number,
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
  // the compute budget values are HIGHLY recommend to be set in order to maximize your transaction landing rate
  // computeUnitLimit: number,
  // computeUnitPrice: number,
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
  // the compute budget values are HIGHLY recommend to be set in order to maximize your transaction landing rate
  // computeUnitLimit: number,
  // computeUnitPrice: number,
});
```

### Signing transactions

If your transaction already has the latest blockhash lifetime set via `createTransaction`:

```typescript
import { createTransaction, signTransactionMessageWithSigners } from "gill";

const transaction = createTransaction(...);

const signedTransaction = await signTransactionMessageWithSigners(transaction);
```

If your transaction does NOT have the latest blockhash lifetime set via `createTransaction`, you
must set the latest blockhash lifetime before (or during) the signing operation:

```typescript
import {
  createTransaction,
  createSolanaClient,
  signTransactionMessageWithSigners,
  setTransactionMessageLifetimeUsingBlockhash,
} from "gill";

const { rpc } = createSolanaClient(...);
const transaction = createTransaction(...);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const signedTransaction = await signTransactionMessageWithSigners(
  setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transaction),
);
```

### Sending and confirming transactions

To send and confirm a transaction to the blockchain, you can use the `sendAndConfirmTransaction`
function initialized from `createSolanaClient`.

```typescript
import { ... } from "gill";

const { sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "mainnet",
});

const transaction = createTransaction(...);

const signedTransaction = await signTransactionMessageWithSigners(transaction);
const signature: string = getSignatureFromTransaction(signedTransaction);

console.log(getExplorerLink({ transaction: signature }));

// default commitment level of `confirmed`
await sendAndConfirmTransaction(signedTransaction)
```

If you would like more fine grain control over the configuration of the `sendAndConfirmTransaction`
functionality, you can include configuration settings:

```typescript
await sendAndConfirmTransaction(signedTransaction, {
  commitment: "confirmed",
  skipPreflight: true,
  maxRetries: 10n,
  ...
});
```

### Get the signature from a signed transaction

After you already have a partially or fully signed transaction, you can get the transaction
signature as follows:

```typescript
import { getSignatureFromTransaction } from "gill";

const signature: string = getSignatureFromTransaction(signedTransaction);
console.log(signature);
// Example output: 4nzNU7YxPtPsVzeg16oaZvLz4jMPtbAzavDfEFmemHNv93iYXKKYAaqBJzFCwEVxiULqTYYrbjPwQnA1d9ZCTELg
```

> Note: After a transaction has been signed by at least one Signer, it will have a transaction
> signature (aka transaction id). This is due to Solana transaction ids are the first item in the
> transaction's `signatures` array. Therefore, client applications can know the signature before it
> is even sent to the network for confirmation.

### Get a Solana Explorer link for transactions, accounts, or blocks

Craft a Solana Explorer link for transactions, accounts, or blocks on any cluster.

> When no `cluster` is provided in the `getExplorerLink` function, it defaults to `mainnet`.

#### Get a Solana Explorer link for a transaction

To get an explorer link for a transaction's signature (aka transaction id):

```typescript
import { getExplorerLink } from "gill";

const link: string = getExplorerLink({
  transaction:
    "4nzNU7YxPtPsVzeg16oaZvLz4jMPtbAzavDfEFmemHNv93iYXKKYAaqBJzFCwEVxiULqTYYrbjPwQnA1d9ZCTELg",
});
```

If you have a partially or fully signed transaction, you can get the Explorer link before even
sending the transaction to the network:

```typescript
import {
  getExplorerLink,
  getSignatureFromTransaction
  signTransactionMessageWithSigners,
} from "gill";

const signedTransaction = await signTransactionMessageWithSigners(...);
const link: string = getExplorerLink({
  transaction: getSignatureFromTransaction(signedTransaction),
});
```

#### Get a Solana Explorer link for an account

To get an explorer link for an account on Solana's devnet:

```typescript
import { getExplorerLink } from "gill";

const link: string = getExplorerLink({
  cluster: "devnet",
  account: "nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5",
});
```

To get an explorer link for an account on your local test validator:

```typescript
import { getExplorerLink } from "gill";

const link: string = getExplorerLink({
  cluster: "localnet",
  account: "11111111111111111111111111111111",
});
```

#### Get a Solana Explorer link for a block

To get an explorer link for a block:

```typescript
import { getExplorerLink } from "gill";

const link: string = getExplorerLink({
  cluster: "mainnet",
  block: "242233124",
});
```

### Calculate minimum rent for an account

To calculate the minimum rent balance for an account (aka data storage deposit fee):

```typescript
import { getMinimumBalanceForRentExemption } from "gill";

// when not `space` argument is provided: defaults to `0`
const rent: bigint = getMinimumBalanceForRentExemption();
// Expected value: 890_880n

// same as
// getMinimumBalanceForRentExemption(0);

// same as, but this requires a network call
// const rent = await rpc.getMinimumBalanceForRentExemption(0n).send();
```

```typescript
import { getMinimumBalanceForRentExemption } from "gill";

const rent: bigint = getMinimumBalanceForRentExemption(50 /* 50 bytes */);
// Expected value: 1_238_880n

// same as, but this requires a network call
// const rent = await rpc.getMinimumBalanceForRentExemption(50n).send();
```

> Note: At this time, the minimum rent amount for an account is calculated based on static values in
> the Solana runtime. While you can use the `getMinimumBalanceForRentExemption` RPC call on your
> [connection](#create-a-solana-rpc-connection) to fetch this value, it will result in a network
> call and subject to latency.

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

## Debug mode

Within `gill`, you can enable "debug mode" to automatically log additional information that will be
helpful in troubleshooting your transactions.

Debug mode is disabled by default to minimize additional logs for your application. But with its
flexible debug controller, you can enable it from the most common places your code will be run.
Including your code itself, NodeJS backends, serverless functions, and even the in web browser
console itself.

Some examples of the existing debug logs that `gill` has sprinkled in:

- log the Solana Explorer link for transactions as you are sending them
- log the base64 transaction string to troubleshoot via
  [`mucho inspect`](https://github.com/solana-developers/mucho?tab=readme-ov-file#inspect) or Solana
  Explorer's [Transaction Inspector](https://explorer.solana.com/tx/inspector)

### How to enable debug mode

To enable debug mode, set any of the following to `true` or `1`:

- `process.env.GILL_DEBUG`
- `global.__GILL_DEBUG__`
- `window.__GILL_DEBUG__` (i.e. in your web browser's console)
- or manually set any debug log level (see below)

To set a desired level of logs to be output in your application, set the value of one of the
following (default: `info`):

- `process.env.GILL_DEBUG_LEVEL`
- `global.__GILL_DEBUG_LEVEL__`
- `window.__GILL_DEBUG_LEVEL__` (i.e. in your web browser's console)

The log levels supported (in order of priority):

- `debug` (lowest)
- `info` (default)
- `warn`
- `error`

### Custom debug logs

Gill also exports the same debug functions it uses internally, allowing you to implement your own
debug logic related to your Solana transactions and use the same controller for it as `gill` does.

- `isDebugEnabled()` - check if debug mode is enabled or not
- `debug()` - print debug message if the set log level is reached

```typescript
import { debug, isDebugEnabled } from "gill";

if (isDebugEnabled()) {
  // your custom logic
}

// log this message if the "info" or above log level is enabled
debug("custom message");

// log this message if the "debug" or above log level is enabled
debug("custom message", "debug");

// log this message if the "warn" or above log level is enabled
debug("custom message", "warn");

// log this message if the "warn" or above log level is enabled
debug("custom message", "warn");
```

## Program clients

With `gill` you can also import some of the most commonly used clients for popular programs. These
are also fully tree-shakable, so if you do not import them inside your project they will be removed
by your JavaScript bundler at build time (i.e. Webpack).

To import any of these program clients:

```typescript
import { ... } from "gill/programs";
import { ... } from "gill/programs/token";
```

> Note: Some client re-exported client program clients have a naming collision. As a result, they
> may be re-exported under a subpath of `gill/programs`. For example, `gill/programs/token`.

The program clients included inside `gill` are:

- System program - re-exported from
  [`@solana-program/system`](https://github.com/solana-program/system)
- Compute Budget program- re-exported from
  [`@solana-program/compute-budget`](https://github.com/solana-program/compute-budget)
- Memo program - re-exported from [`@solana-program/memo`](https://github.com/solana-program/memo)
- Token Program and Token Extensions program (aka Token22) - re-exported from
  [`@solana-program/token-2022`](https://github.com/solana-program/token-2022), which is a fully
  backwards compatible client with the original Token Program
- Address Lookup Table program - re-exported from
  [`@solana-program/address-lookup-table`](https://github.com/solana-program/address-lookup-table)
- Token Metadata program from Metaplex (only the v3 functionality) - generated via Codama their IDL
  ([source](https://github.com/metaplex-foundation/mpl-token-metadata))

If one of the existing clients are not being exported from `gill/programs` or a subpath therein, you
can of course manually add their compatible client to your repo.

> Note: Since the Token Extensions program client is fully compatible with the original Token
> Program client, `gill` only ships the `@solana-program/token-2022` client and the
> `TOKEN_PROGRAM_ADDRESS` in order to remove all that redundant code from the library.
>
> To use the original Token Program, simply pass the `TOKEN_PROGRAM_ADDRESS` as the the program
> address for any instructions

### Other compatible program clients

From the [solana-program](https://github.com/solana-program/token) GitHub organization, formerly
known as the Solana Program Library (SPL), you can find various other client libraries for specific
programs. Install their respective package to use in conjunction with gill:

- [Stake program](https://github.com/solana-program/stake) - `@solana-program/stake`
- [Vote program](https://github.com/solana-program/vote) - `@solana-program/vote`

### Generate a program client from an IDL

If you want to easily interact with any custom program with this library, you can use
[Codama](https://github.com/codama-idl/codama) to generate a compatible JavaScript/TypeScript client
using its IDL. You can either store the generated client inside your repo or publish it as a NPM
package for others to easily consume.

<h1 align="center">
  gill
</h1>

<p align="center">
  javascript/typescript client library for interacting with the Solana blockchain
</p>

<p align="center">
  <a href="https://github.com/solana-foundation/gill/actions/workflows/publish-packages.yml"><img src="https://img.shields.io/github/actions/workflow/status/solana-foundation/gill/publish-packages.yml?logo=GitHub&label=tests" /></a>
  <a href="https://www.npmjs.com/package/gill"><img src="https://img.shields.io/npm/v/gill?logo=npm&color=377CC0" /></a>
  <a href="https://www.npmjs.com/package/gill"><img src="https://img.shields.io/npm/dm/gill?color=377CC0" /></a>
</p>

<p align="center">
  <img width="600" alt="gill" src="https://raw.githubusercontent.com/solana-foundation/gill/refs/heads/master/docs/public/cover.png" />
</p>

## Overview

Welcome to `gill`, a JavaScript/TypeScript client library for interacting with the [Solana](http://solana.com/)
blockchain. You can use it to build Solana apps in Node, web, React Native, or just about any other JavaScript
environment.

Gill is built on top of the modern javascript libraries for Solana built by Anza called
[@solana/kit](https://github.com/anza-xyz/kit) (formerly known as "web3.js v2"). By utilizing the same types and
functions under the hood, `gill` is compatible with `kit`. See [Replacing Kit with gill](#replace-kit-with-gill).

> For a comparison of using gill vs web3js v2, take a look at the
> [comparison examples](https://github.com/solana-foundation/gill/tree/master/examples/get-started#comparison-of-gill-vs-solanakit-aka-web3js-v2).

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

### Replace Kit with gill

All imports from the `@solana/kit` library can be directly replaces with `gill` to achieve the exact same functionality.
Plus unlock the additional functionality only included in Gill, like `createSolanaTransaction`.

Simply [install gill](#installation) and replace your imports

## Quick start

> Find a collection of example code snippets using `gill` inside the
> [`/examples` directory](https://github.com/solana-foundation/gill/tree/master/examples), including
> [basic operations](https://github.com/solana-foundation/gill/tree/master/examples/get-started) and common
> [token operations](https://github.com/solana-foundation/gill/tree/master/examples/tokens).

- [Create a Solana RPC connection](#create-a-solana-rpc-connection)
- [Making Solana RPC calls](#making-solana-rpc-calls)
- [Create a transaction](#create-a-transaction)
- [Signing transactions](#signing-transactions)
- [Simulating transactions](#simulating-transactions)
- [Sending and confirming transaction](#sending-and-confirming-transactions)
- [Get a transaction signature](#get-the-signature-from-a-signed-transaction)
- [Get a Solana Explorer link](#get-a-solana-explorer-link-for-transactions-accounts-or-blocks)
- [Calculate minimum rent balance for an account](#calculate-minimum-rent-for-an-account)
- [Generating keypairs and signers](#generating-keypairs-and-signers)
- [Generating extractable keypairs and signers](#generating-extractable-keypairs-and-signers)

You can also find some [NodeJS specific helpers](#node-specific-imports) like:

- [Loading a keypair from a file](#loading-a-keypair-from-a-file)
- [Saving a keypair to a file](#saving-a-keypair-to-a-file)
- [Loading a keypair from an environment variable](#loading-a-keypair-from-an-environment-variable)
- [Saving a keypair to an environment variable file](#saving-a-keypair-to-an-environment-file)
- [Loading a base58 keypair from an environment variable](#loading-a-base58-keypair-from-an-environment-variable)

You can find [transaction builders](#transaction-builders) for common tasks, including:

- [Creating a token with metadata](#create-a-token-with-metadata)
- [Minting tokens to a destination wallet](#mint-tokens-to-a-destination-wallet)
- [Transfer tokens to a destination wallet](#transfer-tokens-to-a-destination-wallet)

For [Solana Pay](#solana-pay) integration, gill provides:

- [Creating transfer requests](#transfer-requests-non-interactive) for SOL and SPL tokens
- [Creating transaction requests](#transaction-requests-interactive) for interactive payments
- [Parsing and validating URLs](#parsing-and-validating-urls) from QR codes or links
- [Reference key tracking](#reference-key-tracking) for payment monitoring
- [QR code generation](#qr-code-generation) for mobile wallets
- [Complete examples](#complete-examples) for merchants and wallets

## Solana Pay

Gill includes comprehensive support for [Solana Pay](https://docs.solanapay.com/), the open protocol for payments built on Solana. Create payment requests, handle transactions, and integrate Solana Pay into your applications with full TypeScript support.

### Quick Start with Solana Pay

```typescript
import {
  createTransferRequestURL,
  createTransactionRequestURL,
  parseSolanaPayURL,
  validateSolanaPayURL,
  extractReferenceKeys,
  type Address,
} from "gill";
import { Keypair } from "@solana/web3.js";

// Generate a unique reference for payment tracking
const reference = Keypair.generate().publicKey.toBase58() as Address;

// Create a transfer request for SOL
const paymentURL = await createTransferRequestURL({
  recipient: "11111111111111111111111111111112" as Address,
  amount: 1000000n, // 0.001 SOL in lamports
  reference: [reference],
  label: "Coffee Shop",
  message: "Payment for 1x Latte ☕",
  memo: "Order #12345"
});

console.log(paymentURL);
// Output: solana:11111111111111111111111111111112?amount=1000000&reference=...&label=Coffee+Shop&message=Payment+for+1x+Latte+%E2%98%95&memo=Order+%2312345
```

### Transfer Requests (Non-Interactive)

Transfer requests allow direct SOL or SPL token payments without requiring server communication:

```typescript
import { createTransferRequestURL } from "gill";

// SOL transfer
const solPayment = await createTransferRequestURL({
  recipient: merchantWallet,
  amount: 5000000n, // 0.005 SOL
  reference: [referenceKey],
  label: "Merchant Name",
  message: "Payment description",
  memo: "Order #123"
});

// SPL token transfer (e.g., USDC)
const usdcPayment = await createTransferRequestURL({
  recipient: merchantWallet,
  amount: 5000000n, // 5 USDC (6 decimals)
  splToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" as Address, // USDC mint
  reference: [referenceKey],
  label: "Merchant Name",
  message: "USDC payment",
});
```

### Transaction Requests (Interactive)

Transaction requests enable complex payments that require server-side transaction creation:

```typescript
import { createTransactionRequestURL } from "gill";

const transactionURL = await createTransactionRequestURL({
  link: "https://merchant.com/api/solana-pay"
});

console.log(transactionURL);
// Output: solana:https://merchant.com/api/solana-pay
```

### Parsing and Validating URLs

Process Solana Pay URLs received from QR codes or links:

```typescript
import { parseSolanaPayURL, validateSolanaPayURL } from "gill";

// Validate URL format
const isValid = await validateSolanaPayURL(url);

if (isValid) {
  // Parse URL to extract payment details
  const parsed = await parseSolanaPayURL(url);
  
  if (parsed.type === "transfer") {
    console.log("Transfer request:");
    console.log(`- Recipient: ${parsed.params.recipient}`);
    console.log(`- Amount: ${parsed.params.amount} lamports`);
    console.log(`- Token: ${parsed.params.splToken || "SOL"}`);
    console.log(`- Label: ${parsed.params.label}`);
    console.log(`- Message: ${parsed.params.message}`);
  } else {
    console.log("Transaction request:");
    console.log(`- Endpoint: ${parsed.params.link}`);
  }
}
```

### Reference Key Tracking

Use reference keys to track and validate payments on-chain:

```typescript
import { extractReferenceKeys, findReference, validateTransfer } from "gill";

// Extract reference keys from a payment URL
const references = await extractReferenceKeys(paymentURL);
console.log("Reference keys:", references);

// Monitor for payments (in a real application)
try {
  const signatureInfo = await findReference(connection, references[0], {
    finality: "confirmed"
  });
  
  console.log(`Payment found: ${signatureInfo.signature}`);
  
  // Validate the payment details
  await validateTransfer(connection, signatureInfo.signature, {
    recipient: merchantWallet,
    amount: expectedAmount,
    reference: references[0],
  });
  
  console.log("Payment validated!");
} catch (error) {
  console.log("Payment not found or invalid");
}
```

### QR Code Generation

Generate QR codes for mobile wallet scanning:

```typescript
import { toQRCodeURL, createSolanaPayQR } from "gill";

// Get QR-friendly URL
const qrURL = await toQRCodeURL(paymentURL);

// Create QR code element (browser only)
const qrElement = await createSolanaPayQR(paymentURL, 256);
document.getElementById('qr-container').appendChild(qrElement);
```

### Error Handling

Gill provides specific error types for robust error handling:

```typescript
import { 
  SolanaPayError, 
  InvalidSolanaPayURLError,
  UnsupportedSolanaPayVersionError 
} from "gill";

try {
  const url = await createTransactionRequestURL({
    link: "http://insecure.com/api" // HTTP not allowed
  });
} catch (error) {
  if (error instanceof SolanaPayError) {
    console.log(`Solana Pay error: ${error.message}`);
    console.log(`Error code: ${error.code}`);
  }
}
```

### Complete Examples

Find comprehensive examples in the [`examples/solana-pay`](https://github.com/solana-foundation/gill/tree/master/examples/solana-pay) directory:

- **Basic Transfer** - SOL and SPL token payments with QR codes
- **Transaction Request** - Interactive payment flows
- **Merchant Integration** - Complete e-commerce payment processing
- **Wallet Integration** - Wallet-side URL handling and validation
- **Full Payment Flow** - End-to-end payment scenarios

```bash
# Run the examples
cd examples/solana-pay
pnpm install
pnpm run example:transfer
pnpm run example:transaction
pnpm run example:merchant
```

### Key Features

- ✅ **Full TypeScript Support** - Complete type safety with Gill's Address types
- ✅ **Transfer & Transaction Requests** - Support for both payment types
- ✅ **URL Validation** - Robust validation before processing
- ✅ **QR Code Generation** - Built-in QR code support for mobile wallets
- ✅ **Reference Tracking** - Unique payment identification and monitoring
- ✅ **Error Handling** - Comprehensive error management
- ✅ **ESM/CommonJS Compatible** - Works in all JavaScript environments

For more information, see the [Solana Pay documentation](https://docs.solanapay.com/) and explore the [complete examples](https://github.com/solana-foundation/gill/tree/master/examples/solana-pay).

## Debug mode

Within `gill`, you can enable "debug mode" to automatically log additional information that will be helpful in
troubleshooting your transactions.

Debug mode is disabled by default to minimize additional logs for your application. But with its flexible debug
controller, you can enable it from the most common places your code will be run. Including your code itself, NodeJS
backends, serverless functions, and even the in web browser console itself.

Some examples of the existing debug logs that `gill` has sprinkled in:

- log the Solana Explorer link for transactions as you are sending them
- log the base64 transaction string to troubleshoot via
  [`mucho inspect`](https://github.com/solana-developers/mucho?tab=readme-ov-file#inspect) or Solana Explorer's
  [Transaction Inspector](https://explorer.solana.com/tx/inspector)

### How to enable debug mode

To enable debug mode, set any of the following to `true` or `1`:

- `process.env.GILL_DEBUG`
- `global.__GILL_DEBUG__`
- `window.__GILL_DEBUG__` (i.e. in your web browser's console)
- or manually set any debug log level (see below)

To set a desired level of logs to be output in your application, set the value of one of the following (default:
`info`):

- `process.env.GILL_DEBUG_LEVEL`
- `global.__GILL_DEBUG_LEVEL__`
- `window.__GILL_DEBUG_LEVEL__` (i.e. in your web browser's console)

The log levels supported (in order of priority):

- `debug` (lowest)
- `info` (default)
- `warn`
- `error`

### Custom debug logs

Gill also exports the same debug functions it uses internally, allowing you to implement your own debug logic related to
your Solana transactions and use the same controller for it as `gill` does.

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

With `gill` you can also import some of the most commonly used clients for popular programs. These are also fully
tree-shakable, so if you do not import them inside your project they will be removed by your JavaScript bundler at build
time (i.e. Webpack).

To import any of these program clients:

```typescript
import { ... } from "gill/programs";
import { ... } from "gill/programs/token";
```

> Note: Some client re-exported client program clients have a naming collision. As a result, they may be re-exported
> under a subpath of `gill/programs`. For example, `gill/programs/token`.

The program clients included inside `gill` are:

- System program - re-exported from [`@solana-program/system`](https://github.com/solana-program/system)
- Compute Budget program- re-exported from
  [`@solana-program/compute-budget`](https://github.com/solana-program/compute-budget)
- Memo program - re-exported from [`@solana-program/memo`](https://github.com/solana-program/memo)
- Token Program and Token Extensions program (aka Token22) - re-exported from
  [`@solana-program/token-2022`](https://github.com/solana-program/token-2022), which is a fully backwards compatible
  client with the original Token Program
- Address Lookup Table program - re-exported from
  [`@solana-program/address-lookup-table`](https://github.com/solana-program/address-lookup-table)
- Token Metadata program from Metaplex (only the v3 functionality) - generated via Codama their IDL
  ([source](https://github.com/metaplex-foundation/mpl-token-metadata))

If one of the existing clients are not being exported from `gill/programs` or a subpath therein, you can of course
manually add their compatible client to your repo.

> Note: Since the Token Extensions program client is fully compatible with the original Token Program client, `gill`
> only ships the `@solana-program/token-2022` client and the `TOKEN_PROGRAM_ADDRESS` in order to remove all that
> redundant code from the library.
>
> To use the original Token Program, simply pass the `TOKEN_PROGRAM_ADDRESS` as the the program address for any
> instructions

### Other compatible program clients

From the [solana-program](https://github.com/solana-program/token) GitHub organization, formerly known as the Solana
Program Library (SPL), you can find various other client libraries for specific programs. Install their respective
package to use in conjunction with gill:

- [Stake program](https://github.com/solana-program/stake) - `@solana-program/stake`
- [Vote program](https://github.com/solana-program/vote) - `@solana-program/vote`

### Generate a program client from an IDL

If you want to easily interact with any custom program with this library, you can use
[Codama](https://github.com/codama-idl/codama) to generate a compatible JavaScript/TypeScript client using its IDL. You
can either store the generated client inside your repo or publish it as a NPM package for others to easily consume.

import {
  getExplorerLink,
  createSolanaClient,
  SolanaClusterMoniker,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
  generateKeyPairSigner,
  address,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import {
  buildCreateTokenTransaction,
  buildMintTokensTransaction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "gill/programs/token";

/** Turn on debug mode */
global.__GILL_DEBUG_LEVEL__ = "debug";

/**
 * Load a keypair signer from the local filesystem
 *
 * This defaults to the file path used by the Solana CLI: `~/.config/solana/id.json`
 */
const signer = await loadKeypairSignerFromFile();
console.log("address:", signer.address);

/**
 * Declare what Solana network cluster we want our code to interact with
 */
const cluster: SolanaClusterMoniker = "devnet";

/**
 * Create a client connection to the Solana blockchain
 *
 * Note: `urlOrMoniker` can be either a Solana network moniker or a full URL of your RPC provider
 */
const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: cluster,
});

/**
 * Declare our token mint and desired token program
 */
const tokenProgram = TOKEN_2022_PROGRAM_ADDRESS;
const mint = await generateKeyPairSigner();

/**
 * Get the latest blockhash (aka transaction lifetime). This acts as a recent timestamp
 * for the blockchain to key on when processing your transaction
 *
 * Pro tip: only request this value just before you are going to use it your code
 */
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
console.log("latestBlockhash:", latestBlockhash);

/**
 * Create a transaction that will create a new token (with metadata)
 *
 * - this will use the original SPL token by default (`TOKEN_PROGRAM_ADDRESS`)
 */
const createTokenTx = await buildCreateTokenTransaction({
  mint,
  latestBlockhash,
  payer: signer,
  // mintAuthority, // default=same as the `payer`
  metadata: {
    isMutable: true, // if the `updateAuthority` can change this metadata in the future
    name: "Only Possible On Solana",
    symbol: "OPOS",
    uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/Climate/metadata.json",
  },
  decimals: 2, // default=9,
  tokenProgram, //default=TOKEN_PROGRAM_ADDRESS
});

/**
 * Sign the transaction with the provided `signer` from when it was created
 */
let signedTransaction = await signTransactionMessageWithSigners(createTokenTx);
console.log("signedTransaction:");
console.log(signedTransaction);

/**
 * Get the transaction signature after it has been signed by at least one signer
 */
let signature = getSignatureFromTransaction(signedTransaction);

/**
 * Log the Solana Explorer link for the transaction we are about to send
 */
console.log("\nExplorer Link (for creating the mint):");
console.log(
  getExplorerLink({
    cluster,
    transaction: signature,
  }),
);

/**
 * Actually send the transaction to the blockchain and confirm it
 */
await sendAndConfirmTransaction(signedTransaction);

/**
 * Declare the wallet address that we want to mint the tokens to
 */
const destination = address("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c");

/**
 * Create a transaction that mints new tokens to the `destination` wallet address
 * (raising the token's overall supply)
 *
 * - be sure to use the correct token program that the `mint` was created with
 * - ensure the `mintAuthority` is the correct signer in order to actually mint new tokens
 */
const mintTokensTx = await buildMintTokensTransaction({
  payer: signer,
  latestBlockhash,
  mint,
  mintAuthority: signer,
  amount: 1000, // note: be sure to consider the mint's `decimals` value
  // if decimals=2 => this will mint 10.00 tokens
  // if decimals=4 => this will mint 0.100 tokens
  destination,
  tokenProgram, // default=TOKEN_PROGRAM_ADDRESS
});

console.log("Transaction to mint tokens:");
console.log(mintTokensTx);

/**
 * Sign the transaction with the provided `signer` from when it was created
 */
signedTransaction = await signTransactionMessageWithSigners(mintTokensTx);
signature = getSignatureFromTransaction(signedTransaction);

console.log("\nExplorer Link (for minting the tokens to the destination wallet):");
console.log(
  getExplorerLink({
    cluster,
    transaction: signature,
  }),
);

await sendAndConfirmTransaction(signedTransaction);

console.log("Complete.");

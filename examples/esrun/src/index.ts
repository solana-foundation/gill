import {
  createSolanaClient,
  createSolanaRpc,
  LAMPORTS_PER_SOL,
  mainnet,
  sendAndConfirmTransactionFactory,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { SYSTEM_PROGRAM_ADDRESS } from "gill/programs";
import { TOKEN_PROGRAM_ADDRESS } from "gill/programs/token";
import { TOKEN_2022_PROGRAM_ADDRESS } from "gill/programs/token22";

const signer = await loadKeypairSignerFromFile();

console.log("address:", signer.address);
console.log("LAMPORTS_PER_SOL:", LAMPORTS_PER_SOL);

console.log(SYSTEM_PROGRAM_ADDRESS);
console.log(TOKEN_PROGRAM_ADDRESS);
console.log(TOKEN_2022_PROGRAM_ADDRESS);

// @ts-ignore
const rpc2 = createSolanaRpc("derp");
// @ts-ignore
const rpc3 = createSolanaRpc(mainnet("d"));

const { rpc, rpcSubscriptions } = createSolanaClient({
  // urlOrMoniker: "devnet",
  // urlOrMoniker: "d",
  urlOrMoniker: "mainnet",
  // urlOrMoniker: "",
});

// @ts-ignore
const { rpc: mainnetRpc } = createSolanaClient({
  urlOrMoniker: "mainnet",
});
// @ts-ignore
const { rpc: devnetRpc } = createSolanaClient({
  urlOrMoniker: "devnet",
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
console.log("latestBlockhash:", latestBlockhash);

// @ts-ignore
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
  rpc,
  rpcSubscriptions,
});

// let tx = createTransaction({
//   feePayer: signer,
//   instructions: [],
//   version: 0,
//   latestBlockhash,
// });

// console.log(tx);

// let signedTransaction = await signTransactionMessageWithSigners(tx);
// signedTransaction = await signTransactionMessageWithSigners(
//   setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
// );
// tx = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx);
// signedTransaction = await signTransactionMessageWithSigners(tx);

// console.log("signedTransaction");
// console.log(signedTransaction);

// let signature = getSignatureFromTransaction(signedTransaction);
// console.log("signature:", signature);

// try {
//   await sendAndConfirmTransaction(signedTransaction, {
//     commitment: "confirmed",
//   });

//   console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
// } catch (e) {
//   // console.error("Unable to send and confirm");
//   // console.error(err);

//   if (isSolanaError(e, SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE)) {
//     const preflightErrorContext = e.context;
//     const preflightErrorMessage = e.message;
//     const errorDetailMessage = isSystemError(e.cause, transaction)
//       ? getSystemErrorMessage(e.cause.context.code)
//       : e.cause?.message;
//     console.error(preflightErrorContext, " - ", preflightErrorMessage);
//     console.log();
//     console.log(errorDetailMessage);
//   } else {
//     throw e;
//   }
// }

import {
  getExplorerLink,
  createTransaction,
  createSolanaClient,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { getAddMemoInstruction } from "gill/programs";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "devnet",
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const signer = await loadKeypairSignerFromFile();

const tx = createTransaction({
  version: "legacy",
  feePayer: signer,
  instructions: [
    getAddMemoInstruction({
      memo: "gm world!",
    }),
  ],
  latestBlockhash,
  computeUnitLimit: 5000,
  computeUnitPrice: 1000,
});

const signedTransaction = await signTransactionMessageWithSigners(tx);

try {
  console.log(
    "Sending transaction:",
    getExplorerLink({
      cluster: "devnet",
      transaction: getSignatureFromTransaction(signedTransaction),
    }),
  );

  await sendAndConfirmTransaction(signedTransaction);

  console.log("Transaction confirmed!");
} catch (err) {
  console.error("Unable to send and confirm the transaction");
  console.error(err);
}

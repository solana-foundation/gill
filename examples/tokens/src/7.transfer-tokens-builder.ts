import {
  address,
  createSolanaClient,
  getExplorerLink,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { buildTransferTokensTransaction } from "gill/programs/token";

const mint = address("HwxZNMkZbZMeiu9Xnmc6Rg8jYgNsJB47jwabHGUebW4F");

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "devnet",
});

const signer = await loadKeypairSignerFromFile();

const owner = address("7sZoCrE3cGgEpNgxcPnGffDeWfTewKnk6wWdLxmYA7Cy");

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const tx = await buildTransferTokensTransaction({
  feePayer: signer,
  version: "legacy",
  latestBlockhash,
  amount: 1_000_000,
  authority: signer,
  destination: owner,
  mint,
});

const signedTransaction = await signTransactionMessageWithSigners(tx);

console.log(
  "Explorer:",
  getExplorerLink({
    cluster: "devnet",
    transaction: getSignatureFromTransaction(signedTransaction),
  }),
);

await sendAndConfirmTransaction(signedTransaction);

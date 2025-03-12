import {
  address,
  createSolanaClient,
  createTransaction,
  getExplorerLink,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import {
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "gill/programs/token";

const mint = address("HwxZNMkZbZMeiu9Xnmc6Rg8jYgNsJB47jwabHGUebW4F");

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "devnet",
});

const signer = await loadKeypairSignerFromFile();

const owner = address("7sZoCrE3cGgEpNgxcPnGffDeWfTewKnk6wWdLxmYA7Cy");
const source = address("nick6zJc6HpW3kfBm4xS2dmbuVRyb5F3AnUvj5ymzR5");

const ata = await getAssociatedTokenAccountAddress(mint, owner, TOKEN_PROGRAM_ADDRESS);
const sourceAta = await getAssociatedTokenAccountAddress(mint, source, TOKEN_PROGRAM_ADDRESS);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const tx = createTransaction({
  feePayer: signer,
  version: "legacy",
  instructions: [
    getCreateAssociatedTokenIdempotentInstruction({
      mint,
      owner,
      payer: signer,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
      ata,
    }),
    getTransferInstruction(
      {
        source: sourceAta,
        authority: signer,
        destination: ata,
        amount: 1_000_000,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    ),
  ],
  latestBlockhash,
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

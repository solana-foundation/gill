import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import type {
  ITransactionMessageWithFeePayer,
  KeyPairSigner,
  TransactionMessageWithBlockhashLifetime,
  TransactionSigner,
  TransactionVersion,
} from "@solana/kit";
import { checkedTransactionSigner, createTransaction } from "../../../core";
import type { FullTransaction, Simplify } from "../../../types";
import { getTokenMetadataAddress } from "../../token-metadata";
import { checkedTokenProgramAddress, TOKEN_PROGRAM_ADDRESS } from "../addresses";
import { getCreateTokenInstructions, type GetCreateTokenInstructionsArgs } from "../instructions/create-token";
import type { TransactionBuilderInput } from "./types";

type GetCreateTokenTransactionInput = Simplify<
  Omit<GetCreateTokenInstructionsArgs, "metadataAddress"> &
    Partial<Pick<GetCreateTokenInstructionsArgs, "metadataAddress">>
>;

/**
 * Create a transaction that can create a token with metadata
 *
 * The transaction has the following defaults:
 * - Default `version` = `legacy`
 * - Default `computeUnitLimit`:
 *    - for TOKEN_PROGRAM_ADDRESS => `60_000`
 *    - for TOKEN_2022_PROGRAM_ADDRESS => `10_000`
 *
 * @example
 *
 * ```
 * const mint = await generateKeyPairSigner();
 *
 * const transaction = await buildCreateTokenTransaction({
 *   feePayer: signer,
 *   latestBlockhash,
 *   mint,
 *   metadata: {
 *     name: "Test Token",
 *     symbol: "TEST",
 *     uri: "https://example.com/metadata.json",
 *     isMutable: true,
 *   },
 *   // tokenProgram: TOKEN_PROGRAM_ADDRESS, // default
 *   // tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
 * });
 * ```
 */
export async function buildCreateTokenTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
>(
  args: TransactionBuilderInput<TVersion, TFeePayer> & GetCreateTokenTransactionInput,
): Promise<FullTransaction<TVersion, ITransactionMessageWithFeePayer>>;
export async function buildCreateTokenTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
  TLifetimeConstraint extends
    TransactionMessageWithBlockhashLifetime["lifetimeConstraint"] = TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  args: TransactionBuilderInput<TVersion, TFeePayer, TLifetimeConstraint> & GetCreateTokenTransactionInput,
): Promise<FullTransaction<TVersion, ITransactionMessageWithFeePayer, TransactionMessageWithBlockhashLifetime>>;
export async function buildCreateTokenTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends TransactionSigner,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(args: TransactionBuilderInput<TVersion, TFeePayer, TLifetimeConstraint> & GetCreateTokenTransactionInput) {
  args.tokenProgram = checkedTokenProgramAddress(args.tokenProgram);
  args.feePayer = checkedTransactionSigner(args.feePayer);

  let metadataAddress = args.mint.address;

  if (args.tokenProgram === TOKEN_PROGRAM_ADDRESS) {
    metadataAddress = await getTokenMetadataAddress(args.mint);

    // default a reasonably low computeUnitLimit based on simulation data
    if (!args.computeUnitLimit) {
      // creating the token's mint is around 3219cu (and stable?)
      // token metadata is the rest... and fluctuates a lot based on the pda and amount of metadata
      args.computeUnitLimit = 60_000;
    }
  } else if (args.tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
    if (!args.computeUnitLimit) {
      // token22 token creation, with metadata is (seemingly stable) around 7647cu,
      // but consume more with more metadata provided
      args.computeUnitLimit = 10_000;
    }
  }

  return createTransaction(
    (({ feePayer, version, computeUnitLimit, computeUnitPrice, latestBlockhash }: typeof args) => ({
      feePayer,
      version: version || "legacy",
      computeUnitLimit,
      computeUnitPrice,
      latestBlockhash,
      instructions: getCreateTokenInstructions(
        (({
          decimals,
          mintAuthority,
          freezeAuthority,
          updateAuthority,
          metadata,
          feePayer,
          tokenProgram,
          mint,
        }: typeof args) => ({
          mint: mint as KeyPairSigner,
          feePayer,
          metadataAddress,
          metadata,
          decimals,
          mintAuthority,
          freezeAuthority,
          updateAuthority,
          tokenProgram,
        }))(args),
      ),
    }))(args),
  );
}

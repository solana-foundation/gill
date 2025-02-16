import type {
  ITransactionMessageWithFeePayer,
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import { createTransaction } from "../core";
import type { CreateTransactionInput, FullTransaction, Simplify } from "../types";
import {
  createTokenInstructions,
  type CreateTokenInstructionsArgs,
} from "./create-token-instructions";
import { generateKeyPairSigner, type KeyPairSigner, type TransactionSigner } from "@solana/signers";
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import { getTokenMetadataAddress } from "./token-metadata";

type TransactionInput<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
  TLifetimeConstraint extends
    | TransactionMessageWithBlockhashLifetime["lifetimeConstraint"]
    | undefined = undefined,
> = Simplify<
  Omit<
    CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>,
    "version" | "instructions" | "feePayer"
  > &
    Partial<Pick<CreateTransactionInput<TVersion, TFeePayer, TLifetimeConstraint>, "version">>
>;

type CreateTokenInput = Simplify<
  Omit<CreateTokenInstructionsArgs, "mint" | "metadataAddress"> &
    Partial<Pick<CreateTokenInstructionsArgs, "mint" | "metadataAddress">>
>;

/**
 * Create a transaction to create a token with metadata
 *
 * @argument transaction - Base transaction configuration
 * - Default `version` = `legacy`
 * - Default `computeUnitLimit`
 *    - for TOKEN_PROGRAM_ADDRESS => `60_000`
 *    - for TOKEN_2022_PROGRAM_ADDRESS => `10_000`
 *
 * @argument token - Information required to create a Solana Token
 * - `mint` will be auto generated if not provided
 *
 * @example
 *
 * ```
 * const transaction = await createTokenTransaction({
 *   payer: signer,
 *   latestBlockhash,
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
export async function createTokenTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
>(
  input: TransactionInput<TVersion, TFeePayer> & CreateTokenInput,
): Promise<FullTransaction<TVersion, ITransactionMessageWithFeePayer>>;
export async function createTokenTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
  TLifetimeConstraint extends
    TransactionMessageWithBlockhashLifetime["lifetimeConstraint"] = TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  input: TransactionInput<TVersion, TFeePayer, TLifetimeConstraint> & CreateTokenInput,
): Promise<
  FullTransaction<
    TVersion,
    ITransactionMessageWithFeePayer,
    TransactionMessageWithBlockhashLifetime
  >
>;
export async function createTokenTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends TransactionSigner,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(input: TransactionInput<TVersion, TFeePayer, TLifetimeConstraint> & CreateTokenInput) {
  if (!input.mint) input.mint = await generateKeyPairSigner();

  let metadataAddress = input.mint.address;

  if (input.tokenProgram === TOKEN_PROGRAM_ADDRESS) {
    metadataAddress = await getTokenMetadataAddress(input.mint);

    // default a reasonably low computeUnitLimit based on simulation data
    if (!input.computeUnitLimit) {
      // creating the token's mint is around 3219cu (and stable?)
      // token metadata is the rest... and fluctuates a lot based on the pda and amount of metadata
      input.computeUnitLimit = 60_000;
    }
  } else if (input.tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
    if (!input.computeUnitLimit) {
      // token22 token creation, with metadata is (seemingly stable) around 7647cu,
      // but consume more with more metadata provided
      input.computeUnitLimit = 10_000;
    }
  }

  const instructions = createTokenInstructions(
    (({
      decimals,
      mintAuthority,
      freezeAuthority,
      updateAuthority,
      metadata,
      payer,
      tokenProgram,
      mint,
    }: typeof input) => ({
      mint: mint as KeyPairSigner,
      payer,
      metadataAddress,
      metadata,
      decimals,
      mintAuthority,
      freezeAuthority,
      updateAuthority,
      tokenProgram,
    }))(input),
  );

  return createTransaction(
    (({ payer, version, computeUnitLimit, computeUnitPrice, latestBlockhash }: typeof input) => ({
      feePayer: payer,
      version: version || "legacy",
      computeUnitLimit,
      computeUnitPrice,
      latestBlockhash,
      instructions,
    }))(input),
  );
}

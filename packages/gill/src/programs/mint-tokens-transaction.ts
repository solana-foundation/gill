import type {
  ITransactionMessageWithFeePayer,
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import { checkedAddress, createTransaction } from "../core";
import type { CreateTransactionInput, FullTransaction, Simplify } from "../types";
import { type TransactionSigner } from "@solana/signers";
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import { checkedTokenProgramAddress, getTokenAccountAddress } from "./token-shared";
import {
  getMintTokensInstructions,
  type GetMintTokensInstructionsArgs,
} from "./mint-tokens-instructions";
import { Address } from "@solana/addresses";

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

type GetCreateTokenTransactionInput = Simplify<
  Omit<GetMintTokensInstructionsArgs, "ata"> & Partial<Pick<GetMintTokensInstructionsArgs, "ata">>
>;

/**
 * Create a transaction to mint tokens to any wallet/owner,
 * including creating their ATA if it does not exist
 *
 * The transaction will has the following defaults:
 * - Default `version` = `legacy`
 * - Default `computeUnitLimit`:
 *    - for TOKEN_PROGRAM_ADDRESS => `60_000`
 *    - for TOKEN_2022_PROGRAM_ADDRESS => `10_000`
 *
 * @example
 *
 * ```
 * const destination = address("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c");
 *
 * const mint = address(...);
 * // or mint can be a keypair from a freshly created token
 *
 * const transaction = await buildMintTokensTransaction({
 *   payer: signer,
 *   latestBlockhash,
 *   mint,
 *   mintAuthority: signer,
 *   amount: 1000, // note: be sure to account for the mint's `decimals` value
 *   // if decimals=2 => this will mint 10.00 tokens
 *   // if decimals=4 => this will mint 0.100 tokens
 *   destination,
 *   // tokenProgram: TOKEN_PROGRAM_ADDRESS, // default
 *   // tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
 * });
 * ```
 */
export async function buildMintTokensTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
>(
  input: TransactionInput<TVersion, TFeePayer> & GetCreateTokenTransactionInput,
): Promise<FullTransaction<TVersion, ITransactionMessageWithFeePayer>>;
export async function buildMintTokensTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
  TLifetimeConstraint extends
    TransactionMessageWithBlockhashLifetime["lifetimeConstraint"] = TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  input: TransactionInput<TVersion, TFeePayer, TLifetimeConstraint> &
    GetCreateTokenTransactionInput,
): Promise<
  FullTransaction<
    TVersion,
    ITransactionMessageWithFeePayer,
    TransactionMessageWithBlockhashLifetime
  >
>;
export async function buildMintTokensTransaction<
  TVersion extends TransactionVersion,
  TFeePayer extends TransactionSigner,
  TLifetimeConstraint extends TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  input: TransactionInput<TVersion, TFeePayer, TLifetimeConstraint> &
    GetCreateTokenTransactionInput,
) {
  input.tokenProgram = checkedTokenProgramAddress(input.tokenProgram);
  input.mint = checkedAddress(input.mint);

  if (!input.ata) input.ata = await getTokenAccountAddress(input.mint, input.destination);

  // default a reasonably low computeUnitLimit based on simulation data
  if (!input.computeUnitLimit) {
    if (input.tokenProgram === TOKEN_PROGRAM_ADDRESS) {
      // creating the token's mint is around 3219cu (and stable?)
      // token metadata is the rest... and fluctuates a lot based on the pda and amount of metadata
      // input.computeUnitLimit = 60_000;
    } else if (input.tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
      // token22 token creation, with metadata is (seemingly stable) around 7647cu,
      // but consume more with more metadata provided
      // input.computeUnitLimit = 10_000;
    }
  }

  return createTransaction(
    (({ payer, version, computeUnitLimit, computeUnitPrice, latestBlockhash }: typeof input) => ({
      feePayer: payer,
      version: version || "legacy",
      computeUnitLimit,
      computeUnitPrice,
      latestBlockhash,
      instructions: getMintTokensInstructions(
        (({
          tokenProgram,
          payer,
          mint,
          ata,
          mintAuthority,
          amount,
          destination,
        }: typeof input) => ({
          tokenProgram,
          payer,
          mint,
          mintAuthority,
          ata: ata as Address,
          amount,
          destination,
        }))(input),
      ),
    }))(input),
  );
}

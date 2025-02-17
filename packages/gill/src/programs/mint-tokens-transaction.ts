import type {
  ITransactionMessageWithFeePayer,
  TransactionMessageWithBlockhashLifetime,
  TransactionVersion,
} from "@solana/transaction-messages";
import { checkedAddress, createTransaction } from "../core";
import type { CreateTransactionInput, FullTransaction, Simplify } from "../types";
import { type TransactionSigner } from "@solana/signers";
import { checkedTokenProgramAddress, getAssociatedTokenAccountAddress } from "./token-shared";
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
 * Create a transaction that can mint tokens to the desired wallet/owner,
 * including creating their ATA if it does not exist
 *
 * The transaction will has the following defaults:
 * - Default `version` = `legacy`
 * - Default `computeUnitLimit` = `31_000`
 *
 * @remarks
 *
 * - minting without creating the ata is generally < 10_000cu
 * - validating the ata onchain during creation results in a ~5000cu fluctuation
 *
 * @example
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
 *   amount: 1000, // note: be sure to consider the mint's `decimals` value
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
  args: TransactionInput<TVersion, TFeePayer> & GetCreateTokenTransactionInput,
): Promise<FullTransaction<TVersion, ITransactionMessageWithFeePayer>>;
export async function buildMintTokensTransaction<
  TVersion extends TransactionVersion = "legacy",
  TFeePayer extends TransactionSigner = TransactionSigner,
  TLifetimeConstraint extends
    TransactionMessageWithBlockhashLifetime["lifetimeConstraint"] = TransactionMessageWithBlockhashLifetime["lifetimeConstraint"],
>(
  args: TransactionInput<TVersion, TFeePayer, TLifetimeConstraint> & GetCreateTokenTransactionInput,
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
  args: TransactionInput<TVersion, TFeePayer, TLifetimeConstraint> & GetCreateTokenTransactionInput,
) {
  args.tokenProgram = checkedTokenProgramAddress(args.tokenProgram);
  args.mint = checkedAddress(args.mint);

  if (!args.ata) {
    args.ata = await getAssociatedTokenAccountAddress(
      args.mint,
      args.destination,
      args.tokenProgram,
    );
  }

  // default a reasonably low computeUnitLimit based on simulation data
  if (!args.computeUnitLimit) {
    /**
     * for TOKEN_PROGRAM_ADDRESS and multiple simulation attempts,
     * minting tokens costs the following:
     * - when not creating the ata: 9156cu
     * - when creating the ata: 26535cu
     *
     * for TOKEN_2022_PROGRAM_ADDRESS and multiple simulation attempts,
     * minting tokens costs the following:
     * - when not creating the ata: 8978cu
     * - when creating the ata: 22567cu
     */
    args.computeUnitLimit = 31_000;
  }

  return createTransaction(
    (({ payer, version, computeUnitLimit, computeUnitPrice, latestBlockhash }: typeof args) => ({
      feePayer: payer,
      version: version || "legacy",
      computeUnitLimit,
      computeUnitPrice,
      latestBlockhash,
      instructions: getMintTokensInstructions(
        (({ tokenProgram, payer, mint, ata, mintAuthority, amount, destination }: typeof args) => ({
          tokenProgram,
          payer,
          mint,
          mintAuthority,
          ata: ata as Address,
          amount,
          destination,
        }))(args),
      ),
    }))(args),
  );
}

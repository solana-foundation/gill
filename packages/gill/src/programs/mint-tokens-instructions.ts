import type { IInstruction } from "@solana/instructions";
import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";

import { checkedTokenProgramAddress } from "./token-shared";
import {
  getMintToInstruction,
  getCreateAssociatedTokenIdempotentInstruction,
} from "@solana-program/token-2022";
import { checkedAddress } from "../core";

export type GetMintTokensInstructionsArgs = {
  /** Signer that will pay for the rent storage deposit fee */
  payer: KeyPairSigner;
  /** Token mint to issue the tokens */
  mint: KeyPairSigner | Address;
  /**
   * The mint's minting authority. This should normally by a `KeyPairSigner`.
   *
   * Only for multi-sig authorities (like Squads Protocol), should you supply an `Address.
   * */
  mintAuthority: KeyPairSigner | Address;
  /** Wallet address to receive the tokens being minted to via their associated token account (ata) */
  destination: KeyPairSigner | Address;
  /** Associated token account (ata) address for `destination` */
  ata: Address;
  /** Amount of tokens to issue to the `owner` and their `ata` */
  amount: bigint | number;
  /**
   * Token program used to create the token's `mint`
   *
   * - (default) {@link TOKEN_PROGRAM_ADDRESS} - the original SPL Token Program
   * - {@link TOKEN_2022_PROGRAM_ADDRESS} - the SPL Token Extensions Program (aka Token22)
   **/
  tokenProgram?: Address;
};

/**
 * Create the instructions required to mint tokens to any wallet/owner,
 * including creating their ATA if it does not exist
 *
 * @example
 *
 * ```
 * const mint = await generateKeyPairSigner();
 * const destination = address("nicktrLHhYzLmoVbuZQzHUTicd2sfP571orwo9jfc8c");
 * const instructions = getMintTokensInstructions({
 *   mint,
 *   payer: signer,
 *   mintAuthority: signer,
 *   amount: 1000, // note: be sure to account for the mint's `decimals` value
 *   // if decimals=2 => this will mint 10.00 tokens
 *   // if decimals=4 => this will mint 0.100 tokens
 *   destination,
 *   ata: await getTokenAccountAddress(mint, destination),
 * });
 * ```
 */
export function getMintTokensInstructions(args: GetMintTokensInstructionsArgs): IInstruction[] {
  args.tokenProgram = checkedTokenProgramAddress(args.tokenProgram);
  args.mint = checkedAddress(args.mint);

  return [
    // create idempotent will gracefully fail if the ata already exists. this is the gold standard!
    getCreateAssociatedTokenIdempotentInstruction({
      owner: checkedAddress(args.destination),
      mint: args.mint,
      ata: args.ata,
      payer: args.payer,
      tokenProgram: args.tokenProgram,
    }),
    getMintToInstruction(
      {
        mint: args.mint,
        mintAuthority: args.mintAuthority,
        token: args.ata,
        amount: args.amount,
      },
      {
        programAddress: args.tokenProgram,
      },
    ),
  ];
}

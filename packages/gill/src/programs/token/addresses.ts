import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";
import { findAssociatedTokenPda } from "@solana-program/token-2022";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import { checkedAddress } from "../../core/utils";

export const TOKEN_PROGRAM_ADDRESS =
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" as Address<"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA">;

/**
 * Derive the associated token account (ata) address for an owner and mint/tokenProgram
 *
 * @argument `mint` - the token mint itself
 * @argument `owner` - destination wallet address to own tokens from `mint`
 * @argument `tokenProgram` - token program that the token `mint` was created with
 *
 * - (default) {@link TOKEN_PROGRAM_ADDRESS} - the original SPL Token Program
 * - {@link TOKEN_2022_PROGRAM_ADDRESS} - the SPL Token Extensions Program (aka Token22)
 */
export async function getAssociatedTokenAccountAddress(
  mint: Address | KeyPairSigner,
  owner: Address | KeyPairSigner,
  tokenProgram?: Address,
): Promise<Address> {
  return (
    await findAssociatedTokenPda({
      mint: checkedAddress(mint),
      owner: checkedAddress(owner),
      tokenProgram: checkedTokenProgramAddress(tokenProgram),
    })
  )[0];
}

export function assertIsSupportedTokenProgram(
  tokenProgram: Address,
): asserts tokenProgram is Address<typeof tokenProgram> {
  if (tokenProgram !== TOKEN_PROGRAM_ADDRESS && tokenProgram !== TOKEN_2022_PROGRAM_ADDRESS) {
    throw Error(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  }
}

/**
 * Check the provided program is one of the supported token programs.
 * Including setting the default to {@link TOKEN_PROGRAM_ADDRESS} (the original SPL token program)
 *
 * @example
 * ```
 * args.tokenProgram = checkedTokenProgramAddress(args.tokenProgram);
 * ```
 */
export function checkedTokenProgramAddress(tokenProgram?: Address): Address {
  if (!tokenProgram) return TOKEN_PROGRAM_ADDRESS;
  assertIsSupportedTokenProgram(tokenProgram);
  return tokenProgram;
}

import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";
import { findAssociatedTokenPda } from "@solana-program/token";

/**
 * Derive the Token Metadata address from a token's Mint address
 *
 * @argument `mint` - `Address` or `KeyPairSigner` of the token Mint
 * @argument `owner` - `Address` or `KeyPairSigner` of the owner's wallet address
 * @argument `tokenProgram` - `Address` of the owner's wallet address
 *
 * @summary
 * Commonly used token programs:
 * - `TOKEN_PROGRAM_ADDRESS` for the original SPL Token Program
 * - `TOKEN_2022_PROGRAM_ADDRESS` for the SPL Token Extension Program (aka Token22)
 */
export async function getTokenAccountAddress(
  mint: Address | KeyPairSigner,
  owner: Address | KeyPairSigner,
  tokenProgram: Address,
): Promise<Address> {
  return (
    await findAssociatedTokenPda({
      owner: "address" in owner ? owner.address : owner,
      mint: "address" in mint ? mint.address : mint,
      tokenProgram,
    })
  )[0];
}

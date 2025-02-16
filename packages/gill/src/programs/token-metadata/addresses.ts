import { Address, getAddressEncoder, getProgramDerivedAddress } from "@solana/addresses";
import { TOKEN_METADATA_PROGRAM_ADDRESS } from "./generated/instructions";
import { KeyPairSigner } from "@solana/signers";
import { checkedAddress } from "../../core/utils";

/**
 * Derive the Token Metadata address from a token's Mint address
 *
 * @param `mint` - `Address` or `KeyPairSigner` of the token Mint
 */
export async function getTokenMetadataAddress(mint: Address | KeyPairSigner): Promise<Address> {
  return (
    await getProgramDerivedAddress({
      programAddress: TOKEN_METADATA_PROGRAM_ADDRESS,
      seeds: [
        Buffer.from("metadata"),
        getAddressEncoder().encode(TOKEN_METADATA_PROGRAM_ADDRESS),
        getAddressEncoder().encode(checkedAddress(mint)),
      ],
    })
  )[0];
}

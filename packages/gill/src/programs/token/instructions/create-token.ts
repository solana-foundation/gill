import type { IInstruction } from "@solana/instructions";
import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";
import { getCreateAccountInstruction } from "@solana-program/system";
import { checkedAddress, getMinimumBalanceForRentExemption } from "../../../core";
import {
  getTokenMetadataAddress,
  getCreateMetadataAccountV3Instruction,
} from "../../token-metadata";

import {
  extension,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
  getInitializeMintInstruction,
  getInitializeTokenMetadataInstruction,
  getInitializeMetadataPointerInstruction,
} from "@solana-program/token-2022";
import { checkedTokenProgramAddress, type TOKEN_PROGRAM_ADDRESS } from "../addresses";

export type GetCreateTokenInstructionsArgs = {
  /** Signer that will pay for the rent storage deposit fee */
  payer: KeyPairSigner;
  /** Token mint to be created (aka token address) */
  mint: KeyPairSigner;
  /**
   * The number of decimal places this token should have
   *
   * @default `9` - the most commonly used decimals value
   **/
  decimals?: bigint | number;
  /**
   * Authority address that is allowed to mint new tokens
   *
   * When not provided, defaults to: `payer`
   **/
  mintAuthority?: KeyPairSigner;
  /**
   * Authority address that is able to freeze (and thaw) user owned token accounts.
   * When a user's token account is frozen, they will not be able to transfer their tokens.
   *
   * When not provided, defaults to: `null`
   **/
  freezeAuthority?: Address | KeyPairSigner;
  /**
   * Authority address that is allowed to update the metadata
   *
   * When not provided, defaults to: `payer`
   **/
  updateAuthority?: KeyPairSigner;
  /**
   * Optional (but highly recommended) metadata to attach to this token
   */
  metadata: {
    /** Name of this token */
    name: string;
    /** Symbol for this token */
    symbol: string;
    /** URI pointing to additional metadata for this token. Typically an offchain json file. */
    uri: string;
    /** Whether or not the onchain metadata will be editable after minting */
    isMutable: boolean;
  };
  /**
   * Metadata address for this token
   *
   * @example
   * For `TOKEN_PROGRAM_ADDRESS` use the {@link getTokenMetadataAddress} function:
   * ```
   * metadataAddress: await getTokenMetadataAddress(mint.address);
   * ```
   *
   * @example
   * For `TOKEN_2022_PROGRAM_ADDRESS` use the mint's address:
   * ```
   * metadataAddress: mint.address;
   * ```
   * */
  metadataAddress: Address;
  /**
   * Token program used to create the token's `mint`
   *
   * - (default) {@link TOKEN_PROGRAM_ADDRESS} - the original SPL Token Program
   * - {@link TOKEN_2022_PROGRAM_ADDRESS} - the SPL Token Extensions Program (aka Token22)
   **/
  tokenProgram?: Address;
  // extensions // todo
};

/**
 * Create the instructions required to initialize a new token's mint
 */
export function getCreateTokenInstructions(args: GetCreateTokenInstructionsArgs): IInstruction[] {
  args.tokenProgram = checkedTokenProgramAddress(args.tokenProgram);

  if (!args.decimals) args.decimals = 9;
  if (!args.mintAuthority) args.mintAuthority = args.payer;
  if (!args.updateAuthority) args.updateAuthority = args.payer;
  if (args.freezeAuthority) args.freezeAuthority = checkedAddress(args.freezeAuthority);

  if (args.tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
    // @ts-ignore FIXME(nick): errors due to not finding the valid overload
    const metadataPointer = extension("MetadataPointer", {
      metadataAddress: args.mint.address,
      authority: args.updateAuthority.address,
    });

    // @ts-ignore FIXME(nick): errors due to not finding the valid overload
    const metadataExtensionData = extension("TokenMetadata", {
      updateAuthority: args.updateAuthority.address,
      mint: args.mint.address,
      name: args.metadata.name,
      symbol: args.metadata.symbol,
      uri: args.metadata.uri,
      // todo: support token22 additional metadata
      additionalMetadata: new Map(),
    });

    return [
      getCreateAccountInstruction({
        payer: args.payer,
        newAccount: args.mint,
        /**
         * token22 requires only the pre-mint-initialization extensions (like metadata pointer)
         * to be the `space`. then it will extend the account's space for each applicable extension
         * */
        space: BigInt(getMintSize([metadataPointer])),
        /**
         * token22 requires the total lamport balance for all extensions,
         * including pre-initialization and post-initialization
         */
        lamports: getMinimumBalanceForRentExemption(
          BigInt(getMintSize([metadataPointer, metadataExtensionData])),
        ),
        programAddress: args.tokenProgram,
      }),
      getInitializeMetadataPointerInstruction({
        authority: args.mintAuthority.address,
        metadataAddress: args.metadataAddress,
        mint: args.mint.address,
      }),
      getInitializeMintInstruction({
        mint: args.mint.address,
        decimals: Number(args.decimals),
        mintAuthority: args.mintAuthority.address,
        freezeAuthority: args.freezeAuthority || null,
      }),
      getInitializeTokenMetadataInstruction({
        metadata: args.mint.address,
        mint: args.mint.address,
        mintAuthority: args.mintAuthority,
        name: args.metadata.name,
        symbol: args.metadata.symbol,
        uri: args.metadata.uri,
        updateAuthority: args.updateAuthority.address,
      }),
      // todo: support token22 additional metadata by adding that instruction(s) here
    ];
  } else {
    // the token22 `getMintSize` is fully compatible with the original token program
    const space: bigint = BigInt(getMintSize());

    return [
      getCreateAccountInstruction({
        payer: args.payer,
        newAccount: args.mint,
        lamports: getMinimumBalanceForRentExemption(space),
        space,
        programAddress: args.tokenProgram,
      }),
      getInitializeMintInstruction({
        mint: args.mint.address,
        decimals: Number(args.decimals),
        mintAuthority: args.mintAuthority.address,
        freezeAuthority: args.freezeAuthority || null,
      }),
      getCreateMetadataAccountV3Instruction({
        metadata: args.metadataAddress,
        mint: args.mint.address,
        mintAuthority: args.mintAuthority,
        payer: args.payer,
        updateAuthority: args.updateAuthority,
        data: {
          name: args.metadata.name,
          symbol: args.metadata.symbol,
          uri: args.metadata.uri,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: args.metadata.isMutable,
        collectionDetails: null,
      }),
    ];
  }
}

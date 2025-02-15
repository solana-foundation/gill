import type { IInstruction } from "@solana/instructions";
import type { Address } from "@solana/addresses";
import type { KeyPairSigner } from "@solana/signers";
import { getCreateAccountInstruction } from "@solana-program/system";
import { getMinimumBalanceForRentExemption } from "../core";
import { getTokenMetadataAddress, getCreateMetadataAccountV3Instruction } from "./token-metadata";

import { TOKEN_PROGRAM_ADDRESS, getInitializeMintInstruction } from "@solana-program/token";
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  getMintSize,
  getInitializeMintInstruction as getInitializeMintInstructionToken22,
} from "@solana-program/token-2022";

export type CreateTokenInstructionsArgs = {
  /** Signer that will pay for the rent storage deposit fee */
  payer: KeyPairSigner;
  /** Token Mint to be created (aka token address) */
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
  updateAuthority?: Address | KeyPairSigner;
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
   * Token program used to create the token
   *
   * @default `TOKEN_PROGRAM_ADDRESS` - the original SPL Token Program
   *
   * Supported token programs:
   * - `TOKEN_PROGRAM_ADDRESS` for the original SPL Token Program
   * - `TOKEN_2022_PROGRAM_ADDRESS` for the SPL Token Extension Program (aka Token22)
   **/
  tokenProgram?: Address;
  // extensions // todo
};

/**
 * Create the instructions required to initialize a new token's Mint
 */
export async function createTokenInstructions(
  args: CreateTokenInstructionsArgs,
): Promise<IInstruction[]> {
  if (!args.tokenProgram) args.tokenProgram = TOKEN_PROGRAM_ADDRESS;
  if (
    args.tokenProgram !== TOKEN_PROGRAM_ADDRESS &&
    args.tokenProgram !== TOKEN_2022_PROGRAM_ADDRESS
  ) {
    throw Error(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  }

  // the token22 `getMintSize` is fully compatible with the original token program
  const space: bigint = BigInt(getMintSize());

  if (!args.decimals) args.decimals = 9;
  if (!args.mintAuthority) args.mintAuthority = args.payer;
  if (!args.updateAuthority) args.updateAuthority = args.payer;

  const ixs: IInstruction[] = [
    getCreateAccountInstruction({
      payer: args.payer,
      newAccount: args.mint,
      lamports: getMinimumBalanceForRentExemption(space),
      space,
      programAddress: args.tokenProgram,
    }),
  ];

  if (args.tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
    ixs.push(
      getInitializeMintInstructionToken22({
        mint: args.mint.address,
        decimals: Number(args.decimals),
        mintAuthority: args.mintAuthority.address,
        freezeAuthority: args.freezeAuthority
          ? typeof args.freezeAuthority == "string"
            ? args.freezeAuthority
            : args.freezeAuthority.address
          : null,
      }),
    );
  } else {
    ixs.push(
      getInitializeMintInstruction({
        mint: args.mint.address,
        decimals: Number(args.decimals),
        mintAuthority: args.mintAuthority.address,
        freezeAuthority: args.freezeAuthority
          ? typeof args.freezeAuthority == "string"
            ? args.freezeAuthority
            : args.freezeAuthority.address
          : null,
      }),
    );
  }

  ixs.push(
    getCreateMetadataAccountV3Instruction({
      metadata: await getTokenMetadataAddress(args.mint),
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
  );

  return ixs;
}

import { generateKeyPairSigner, KeyPairSigner } from "@solana/signers";
import { Address } from "@solana/addresses";
import { IInstruction } from "@solana/instructions";
import { getCreateAccountInstruction } from "@solana-program/system";
import { getMinimumBalanceForRentExemption } from "../core";
import {
  getCreateMetadataAccountV3Instruction,
  getTokenMetadataAddress,
} from "../programs/token-metadata";
import {
  createTokenInstructions,
  CreateTokenInstructionsArgs,
} from "../programs/create-token-instructions";

import { TOKEN_PROGRAM_ADDRESS, getInitializeMintInstruction } from "@solana-program/token";
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  getMintSize,
  getInitializeMintInstruction as getInitializeMintInstructionToken22,
} from "@solana-program/token-2022";

const MOCK_SPACE = 122n;
const MOCK_RENT = 10000n;

jest.mock("../core", () => ({
  getMinimumBalanceForRentExemption: jest.fn(),
}));

jest.mock("../programs/token-metadata", () => ({
  getTokenMetadataAddress: jest.fn(),
  getCreateMetadataAccountV3Instruction: jest.fn(),
}));

jest.mock("@solana-program/system", () => ({
  getCreateAccountInstruction: jest.fn(),
}));

jest.mock("@solana-program/token", () => ({
  TOKEN_PROGRAM_ADDRESS: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  getInitializeMintInstruction: jest.fn(),
}));

jest.mock("@solana-program/token-2022", () => ({
  TOKEN_2022_PROGRAM_ADDRESS: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  getMintSize: jest.fn(),
  getInitializeMintInstruction: jest.fn(),
}));

describe("createTokenInstructions", () => {
  let mockPayer: KeyPairSigner;
  let mockMint: KeyPairSigner;

  let mockMintAuthority: KeyPairSigner;
  let mockFreezeAuthority: KeyPairSigner;

  let mockCreateAccountInstruction: IInstruction;
  let mockInitializeMintInstruction: IInstruction;
  let mockInitializeMintToken22Instruction: IInstruction;
  let mockCreateMetadataInstruction: IInstruction;

  const metadata: CreateTokenInstructionsArgs["metadata"] = {
    name: "Test Token",
    symbol: "TEST",
    uri: "https://example.com/metadata.json",
    isMutable: true,
  };

  beforeAll(async () => {
    [mockPayer, mockMint, mockMintAuthority, mockFreezeAuthority] = await Promise.all([
      generateKeyPairSigner(),
      generateKeyPairSigner(),
      generateKeyPairSigner(),
      generateKeyPairSigner(),
    ]);
  });

  beforeEach(() => {
    mockCreateAccountInstruction = {
      programAddress: "system" as Address,
      data: new Uint8Array([1]),
    };
    mockInitializeMintInstruction = {
      programAddress: "token" as Address,
      data: new Uint8Array([2]),
    };
    mockInitializeMintToken22Instruction = {
      programAddress: "token22" as Address,
      data: new Uint8Array([2]),
    };
    mockCreateMetadataInstruction = {
      programAddress: "metadata" as Address,
      data: new Uint8Array([3]),
    };

    (getCreateAccountInstruction as jest.Mock).mockReturnValue(mockCreateAccountInstruction);
    (getInitializeMintInstruction as jest.Mock).mockReturnValue(mockInitializeMintInstruction);
    (getInitializeMintInstructionToken22 as jest.Mock).mockReturnValue(
      mockInitializeMintToken22Instruction,
    );
    (getCreateMetadataAccountV3Instruction as jest.Mock).mockReturnValue(
      mockCreateMetadataInstruction,
    );

    (getMinimumBalanceForRentExemption as jest.Mock).mockReturnValue(MOCK_RENT);
    (getMintSize as jest.Mock).mockReturnValue(MOCK_SPACE);
    (getTokenMetadataAddress as jest.Mock).mockResolvedValue("metadataAddress123");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create basic token instructions with default values", async () => {
    const args: CreateTokenInstructionsArgs = {
      payer: mockPayer,
      mint: mockMint,
      metadata,
    };

    const instructions = await createTokenInstructions(args);

    expect(instructions).toHaveLength(3);
    expect(instructions[0]).toBe(mockCreateAccountInstruction);
    expect(instructions[1]).toBe(mockInitializeMintInstruction);
    expect(instructions[2]).toBe(mockCreateMetadataInstruction);

    expect(getCreateAccountInstruction).toHaveBeenCalledWith({
      payer: mockPayer,
      newAccount: mockMint,
      lamports: MOCK_RENT,
      space: MOCK_SPACE,
      programAddress: TOKEN_PROGRAM_ADDRESS,
    });

    expect(getInitializeMintInstruction).toHaveBeenCalledWith({
      mint: mockMint.address,
      decimals: 9,
      mintAuthority: mockPayer.address,
      freezeAuthority: null,
    });

    expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: "metadataAddress123",
        mint: mockMint.address,
        mintAuthority: mockPayer,
        payer: mockPayer,
        updateAuthority: mockPayer,
        data: {
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      }),
    );
  });

  it("should throw error for unsupported token program", async () => {
    const args: CreateTokenInstructionsArgs = {
      payer: mockPayer,
      mint: mockMint,
      tokenProgram: "UnsupportedProgramId" as Address,
      metadata,
    };

    await expect(createTokenInstructions(args)).rejects.toThrow(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  });

  describe("should use original token program", () => {
    it("should use original token program when specified", async () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        metadata,
      };

      await createTokenInstructions(args);

      expect(getCreateAccountInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          space: MOCK_SPACE,
          programAddress: TOKEN_PROGRAM_ADDRESS,
        }),
      );

      expect(getInitializeMintInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
        }),
      );
    });

    it("should use custom decimals when provided", async () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        decimals: 6,
        metadata,
      };

      await createTokenInstructions(args);

      expect(getInitializeMintInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          decimals: 6,
        }),
      );
    });

    it("should use custom mint and freeze authorities when provided", async () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadata,
        mintAuthority: mockMintAuthority,
        freezeAuthority: mockFreezeAuthority.address,
      };

      await createTokenInstructions(args);

      expect(getInitializeMintInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mintAuthority: mockMintAuthority.address,
          freezeAuthority: mockFreezeAuthority.address,
        }),
      );
    });

    it("should add metadata instruction when metadata is provided", async () => {
      const metadata: CreateTokenInstructionsArgs["metadata"] = {
        name: "Test Token",
        symbol: "TEST",
        uri: "https://example.com/metadata.json",
        isMutable: false,
      };

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadata,
      };

      const instructions = await createTokenInstructions(args);

      expect(instructions).toHaveLength(3);
      expect(instructions[2]).toBe(mockCreateMetadataInstruction);

      expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: "metadataAddress123",
          mint: mockMint.address,
          mintAuthority: mockPayer,
          payer: mockPayer,
          updateAuthority: mockPayer,
          data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: false,
          collectionDetails: null,
        }),
      );
    });

    it("should use custom update authority for metadata when provided", async () => {
      const customUpdateAuthority = { address: "customUpdateAuth202" } as KeyPairSigner;

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        updateAuthority: customUpdateAuthority,
        metadata,
      };

      await createTokenInstructions(args);

      expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
        expect.objectContaining({
          updateAuthority: customUpdateAuthority,
        }),
      );
    });
  });

  describe("should use token22 program", () => {
    it("should use Token-2022 program when specified", async () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        metadata,
      };

      await createTokenInstructions(args);

      expect(getCreateAccountInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          space: MOCK_SPACE,
          programAddress: TOKEN_2022_PROGRAM_ADDRESS,
        }),
      );

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
        }),
      );
    });

    it("should use custom decimals when provided", async () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        decimals: 6,
        metadata,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      await createTokenInstructions(args);

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          decimals: 6,
        }),
      );
    });

    it("should use custom mint and freeze authorities when provided", async () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadata,
        mintAuthority: mockMintAuthority,
        freezeAuthority: mockFreezeAuthority.address,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      await createTokenInstructions(args);

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mintAuthority: mockMintAuthority.address,
          freezeAuthority: mockFreezeAuthority.address,
        }),
      );
    });

    it("should add metadata instruction when metadata is provided", async () => {
      const metadata: CreateTokenInstructionsArgs["metadata"] = {
        name: "Test Token22",
        symbol: "TEST",
        uri: "https://example.com/metadata.json",
        isMutable: false,
      };

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadata,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      const instructions = await createTokenInstructions(args);

      expect(instructions).toHaveLength(3);
      expect(instructions[1]).toBe(mockInitializeMintToken22Instruction);
      expect(instructions[2]).toBe(mockCreateMetadataInstruction);

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
        }),
      );

      expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: "metadataAddress123",
          mint: mockMint.address,
          mintAuthority: mockPayer,
          payer: mockPayer,
          updateAuthority: mockPayer,
          data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: metadata.isMutable,
          collectionDetails: null,
        }),
      );
    });

    it("should use custom update authority for metadata when provided", async () => {
      const customUpdateAuthority = { address: "customUpdateAuth202" } as KeyPairSigner;

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        updateAuthority: customUpdateAuthority,
        metadata,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      const instructions = await createTokenInstructions(args);

      expect(instructions).toHaveLength(3);
      expect(instructions[1]).toBe(mockInitializeMintToken22Instruction);
      expect(instructions[2]).toBe(mockCreateMetadataInstruction);

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
        }),
      );

      expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
        expect.objectContaining({
          updateAuthority: customUpdateAuthority,
        }),
      );
    });
  });
});

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
  extension,
  getInitializeTokenMetadataInstruction,
  getInitializeMetadataPointerInstruction,
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
  extension: jest.fn(),
  getInitializeMetadataPointerInstruction: jest.fn(),
  getInitializeTokenMetadataInstruction: jest.fn(),
}));

describe("createTokenInstructions", () => {
  let mockPayer: KeyPairSigner;
  let mockMint: KeyPairSigner;

  let mockMetadataAddress = "mockMetadataAddress" as Address;

  let mockMintAuthority: KeyPairSigner;
  let mockFreezeAuthority: KeyPairSigner;

  let mockCreateAccountInstruction: IInstruction;
  let mockInitializeMintInstruction: IInstruction;
  let mockCreateMetadataInstruction: IInstruction;

  let mockInitializeMintToken22Instruction: IInstruction;
  let mockInitializeMetadataPointerInstruction: IInstruction;
  let mockInitializeTokenMetadataInstruction: IInstruction;

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
      data: new Uint8Array([3]),
    };
    mockCreateMetadataInstruction = {
      programAddress: "metadata" as Address,
      data: new Uint8Array([4]),
    };
    mockInitializeTokenMetadataInstruction = {
      programAddress: "initMetadata" as Address,
      data: new Uint8Array([5]),
    };
    mockInitializeMetadataPointerInstruction = {
      programAddress: "initMetadataPointer" as Address,
      data: new Uint8Array([6]),
    };

    (getCreateAccountInstruction as jest.Mock).mockReturnValue(mockCreateAccountInstruction);
    (getInitializeMintInstruction as jest.Mock).mockReturnValue(mockInitializeMintInstruction);
    (getCreateMetadataAccountV3Instruction as jest.Mock).mockReturnValue(
      mockCreateMetadataInstruction,
    );
    (getInitializeMintInstructionToken22 as jest.Mock).mockReturnValue(
      mockInitializeMintToken22Instruction,
    );
    (getInitializeMetadataPointerInstruction as jest.Mock).mockReturnValue(
      mockInitializeMetadataPointerInstruction,
    );
    (getInitializeTokenMetadataInstruction as jest.Mock).mockReturnValue(
      mockInitializeTokenMetadataInstruction,
    );
    (extension as jest.Mock).mockReturnValue("");

    (getMinimumBalanceForRentExemption as jest.Mock).mockReturnValue(MOCK_RENT);
    (getMintSize as jest.Mock).mockReturnValue(MOCK_SPACE);
    (getTokenMetadataAddress as jest.Mock).mockResolvedValue("metadataAddress123");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create basic token instructions with default values", () => {
    const args: CreateTokenInstructionsArgs = {
      payer: mockPayer,
      mint: mockMint,
      metadataAddress: mockMetadataAddress,
      metadata,
    };

    const instructions = createTokenInstructions(args);

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
        metadata: mockMetadataAddress,
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

  it("should throw error for unsupported token program", () => {
    const args: CreateTokenInstructionsArgs = {
      payer: mockPayer,
      mint: mockMint,
      metadataAddress: mockMetadataAddress,
      metadata,
      tokenProgram: "UnsupportedProgramId" as Address,
    };

    expect(() => createTokenInstructions(args)).toThrow(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  });

  describe("should use original token program", () => {
    it("should use original token program when specified", () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMetadataAddress,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        metadata,
      };

      createTokenInstructions(args);

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

    it("should use custom decimals when provided", () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        metadataAddress: mockMetadataAddress,
        mint: mockMint,
        decimals: 6,
        metadata,
      };

      createTokenInstructions(args);

      expect(getInitializeMintInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          decimals: 6,
        }),
      );
    });

    it("should use custom mint and freeze authorities when provided", () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMetadataAddress,
        metadata,
        mintAuthority: mockMintAuthority,
        freezeAuthority: mockFreezeAuthority.address,
      };

      createTokenInstructions(args);

      expect(getInitializeMintInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mintAuthority: mockMintAuthority.address,
          freezeAuthority: mockFreezeAuthority.address,
        }),
      );
    });

    it("should add metadata instruction when metadata is provided", () => {
      const metadata: CreateTokenInstructionsArgs["metadata"] = {
        name: "Test Token",
        symbol: "TEST",
        uri: "https://example.com/metadata.json",
        isMutable: false,
      };

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMetadataAddress,
        metadata,
      };

      const instructions = createTokenInstructions(args);

      expect(instructions).toHaveLength(3);
      expect(instructions[2]).toBe(mockCreateMetadataInstruction);

      expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: mockMetadataAddress,
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

    it("should use custom metadata update authority", () => {
      const customUpdateAuthority = { address: "customUpdateAuth" } as KeyPairSigner;

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMetadataAddress,
        updateAuthority: customUpdateAuthority,
        metadata,
      };

      createTokenInstructions(args);

      expect(getCreateMetadataAccountV3Instruction).toHaveBeenCalledWith(
        expect.objectContaining({
          updateAuthority: customUpdateAuthority,
        }),
      );
    });
  });

  describe("should use token22 program", () => {
    it("should use Token-2022 program when specified", () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMint.address,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        metadata,
      };

      createTokenInstructions(args);

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

    it("should use custom decimals when provided", () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMint.address,
        decimals: 6,
        metadata,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      createTokenInstructions(args);

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          decimals: 6,
        }),
      );
    });

    it("should use custom mint and freeze authorities when provided", () => {
      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMint.address,
        metadata,
        mintAuthority: mockMintAuthority,
        freezeAuthority: mockFreezeAuthority.address,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      createTokenInstructions(args);

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mintAuthority: mockMintAuthority.address,
          freezeAuthority: mockFreezeAuthority.address,
        }),
      );
    });

    it("should add metadata instruction when metadata is provided", () => {
      const metadata: CreateTokenInstructionsArgs["metadata"] = {
        name: "Test Token22",
        symbol: "TEST",
        uri: "https://example.com/metadata.json",
        isMutable: false,
      };

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMint.address,
        metadata,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      const instructions = createTokenInstructions(args);

      expect(instructions).toHaveLength(4);
      expect(instructions[1]).toBe(mockInitializeMetadataPointerInstruction);
      expect(instructions[2]).toBe(mockInitializeMintToken22Instruction);
      expect(instructions[3]).toBe(mockInitializeTokenMetadataInstruction);

      expect(getInitializeMetadataPointerInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          metadataAddress: mockMint.address,
          authority: mockPayer.address,
        }),
      );

      expect(getInitializeMintInstructionToken22).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          mintAuthority: mockPayer.address,
        }),
      );

      expect(getInitializeTokenMetadataInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          metadata: mockMint.address,
          mintAuthority: mockPayer,
          updateAuthority: mockPayer.address,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
        }),
      );
    });

    it("should use custom metadata update authority", () => {
      const customUpdateAuthority = { address: "customUpdateAuth" } as KeyPairSigner;

      const args: CreateTokenInstructionsArgs = {
        payer: mockPayer,
        mint: mockMint,
        metadataAddress: mockMint.address,
        updateAuthority: customUpdateAuthority,
        metadata,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      };

      const instructions = createTokenInstructions(args);

      expect(instructions).toHaveLength(4);
      expect(instructions[1]).toBe(mockInitializeMetadataPointerInstruction);
      expect(instructions[2]).toBe(mockInitializeMintToken22Instruction);
      expect(instructions[3]).toBe(mockInitializeTokenMetadataInstruction);

      expect(getInitializeMetadataPointerInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          mint: mockMint.address,
          metadataAddress: mockMint.address,
        }),
      );

      expect(getInitializeTokenMetadataInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          updateAuthority: customUpdateAuthority.address,
        }),
      );
    });
  });
});

import {
  getCreateAssociatedTokenIdempotentInstruction,
  getMintToInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { generateKeyPairSigner, type Address, type KeyPairSigner } from "@solana/kit";
import { getMintTokensInstructions, GetMintTokensInstructionsArgs, TOKEN_PROGRAM_ADDRESS } from "../programs/token";

// Mock the imported functions
jest.mock("@solana-program/token-2022", () => ({
  // preserve all real implementations to only change the desired ones
  ...jest.requireActual("@solana-program/token-2022"),

  getCreateAssociatedTokenIdempotentInstruction: jest.fn(),
  getMintToInstruction: jest.fn(),
}));

describe("getMintTokensInstructions", () => {
  let mockPayer: KeyPairSigner;
  let mockMint: KeyPairSigner;
  let mockMintAuthority: KeyPairSigner;
  let mockDestination: KeyPairSigner;

  const mockAta = "mockAtaAddress" as Address;
  const mockAmount = BigInt(1000);

  beforeAll(async () => {
    [mockPayer, mockMint, mockMintAuthority, mockDestination] = await Promise.all([
      generateKeyPairSigner(),
      generateKeyPairSigner(),
      generateKeyPairSigner(),
      generateKeyPairSigner(),
    ]);
  });

  beforeEach(() => {
    (getCreateAssociatedTokenIdempotentInstruction as jest.Mock).mockReturnValue({
      instruction: "mockCreateAtaInstruction",
    });

    (getMintToInstruction as jest.Mock).mockReturnValue({
      instruction: "mockMintToInstruction",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create instructions with default token program", () => {
    const args: GetMintTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      mintAuthority: mockMintAuthority,
      destination: mockDestination.address,
      ata: mockAta,
      amount: mockAmount,
    };

    const instructions = getMintTokensInstructions(args);

    expect(instructions).toHaveLength(2);

    expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
      owner: mockDestination.address,
      mint: mockMint.address,
      ata: mockAta,
      payer: mockPayer,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    expect(getMintToInstruction).toHaveBeenCalledWith(
      {
        mint: mockMint.address,
        mintAuthority: mockMintAuthority,
        token: mockAta,
        amount: mockAmount,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    );
  });

  it("should create instructions with Token-2022 program", () => {
    const args: GetMintTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      mintAuthority: mockMintAuthority,
      destination: mockDestination.address,
      ata: mockAta,
      amount: mockAmount,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    };

    const instructions = getMintTokensInstructions(args);

    expect(instructions).toHaveLength(2);
    expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
      owner: mockDestination.address,
      mint: mockMint.address,
      ata: mockAta,
      payer: mockPayer,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    });
  });

  it("should accept Address type for mint, mintAuthority, and destination", () => {
    const args: GetMintTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: "mintAddress" as Address,
      mintAuthority: "mintAuthorityAddress" as Address,
      destination: "ownerAddress" as Address,
      ata: mockAta,
      amount: mockAmount,
    };

    const instructions = getMintTokensInstructions(args);

    expect(instructions).toHaveLength(2);

    expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
      owner: args.destination,
      mint: args.mint,
      ata: mockAta,
      payer: mockPayer,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    expect(getMintToInstruction).toHaveBeenCalledWith(
      {
        mint: "mintAddress",
        mintAuthority: "mintAuthorityAddress",
        token: mockAta,
        amount: mockAmount,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    );
  });

  it("should accept number type for amount", () => {
    const args: GetMintTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      mintAuthority: mockMintAuthority,
      destination: mockDestination.address,
      ata: mockAta,
      amount: 1000,
    };

    const instructions = getMintTokensInstructions(args);

    expect(instructions).toHaveLength(2);
    expect(getMintToInstruction).toHaveBeenCalledWith(
      {
        mint: mockMint.address,
        mintAuthority: mockMintAuthority,
        token: mockAta,
        amount: 1000,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    );
  });

  it("should throw error for unsupported token program", () => {
    const args: GetMintTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      mintAuthority: mockMintAuthority,
      destination: mockDestination.address,
      ata: mockAta,
      amount: mockAmount,
      tokenProgram: "UnsupportedProgramId" as Address,
    };

    expect(() => getMintTokensInstructions(args)).toThrow(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  });
});

import {
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { generateKeyPairSigner, type Address, type KeyPairSigner } from "@solana/kit";
import {
  getTransferTokensInstructions,
  GetTransferTokensInstructionsArgs,
  TOKEN_PROGRAM_ADDRESS,
} from "../programs/token";

// Mock the imported functions
jest.mock("@solana-program/token-2022", () => ({
  // preserve all real implementations to only change the desired ones
  ...jest.requireActual("@solana-program/token-2022"),

  getCreateAssociatedTokenIdempotentInstruction: jest.fn(),
  getTransferInstruction: jest.fn(),
}));

describe("getTransferTokensInstructions", () => {
  let mockPayer = { address: "payer" } as KeyPairSigner;
  let mockMint = { address: "mint" } as KeyPairSigner;
  let mockAuthority = { address: "authority" } as KeyPairSigner;
  let mockDestination = { address: "destination" } as KeyPairSigner;
  const mockDestinationAta = "destinationAta" as Address;
  const mockSourceAta = "sourceAta" as Address;

  const mockAmount = BigInt(1000);

  beforeAll(async () => {
    [mockPayer, mockMint, mockAuthority, mockDestination] = await Promise.all([
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

    (getTransferInstruction as jest.Mock).mockReturnValue({
      instruction: "mockTransferInstruction",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create instructions with default token program", () => {
    const args: GetTransferTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      amount: mockAmount,
      authority: mockAuthority,
      sourceAta: mockSourceAta,
      destination: mockDestination.address,
      destinationAta: mockDestinationAta,
    };

    const instructions = getTransferTokensInstructions(args);

    expect(instructions).toHaveLength(2);

    expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
      owner: mockDestination.address,
      mint: mockMint.address,
      ata: mockDestinationAta,
      payer: mockPayer,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    expect(getTransferInstruction).toHaveBeenCalledWith(
      {
        authority: mockAuthority,
        source: mockSourceAta,
        amount: mockAmount,
        destination: mockDestinationAta,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    );
  });

  it("should create instructions with Token-2022 program", () => {
    const args: GetTransferTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      authority: mockAuthority,
      sourceAta: mockSourceAta,
      amount: mockAmount,
      destination: mockDestination.address,
      destinationAta: mockDestinationAta,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    };

    const instructions = getTransferTokensInstructions(args);

    expect(instructions).toHaveLength(2);

    expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
      owner: mockDestination.address,
      mint: mockMint.address,
      ata: mockDestinationAta,
      payer: mockPayer,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    });

    expect(getTransferInstruction).toHaveBeenCalledWith(
      {
        authority: mockAuthority,
        source: mockSourceAta,
        amount: mockAmount,
        destination: mockDestinationAta,
      },
      {
        programAddress: TOKEN_2022_PROGRAM_ADDRESS,
      },
    );
  });

  it("should accept Address type for mint, authority, and destination", () => {
    const args: GetTransferTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      authority: mockAuthority.address,
      amount: mockAmount,
      destination: mockDestination.address,
      destinationAta: mockDestinationAta,
      sourceAta: mockSourceAta,
    };

    const instructions = getTransferTokensInstructions(args);

    expect(instructions).toHaveLength(2);

    expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
      owner: args.destination,
      mint: args.mint,
      ata: mockDestinationAta,
      payer: mockPayer,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    expect(getTransferInstruction).toHaveBeenCalledWith(
      {
        authority: mockAuthority.address,
        source: mockSourceAta,
        amount: mockAmount,
        destination: mockDestinationAta,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    );
  });

  it("should accept number type for amount", () => {
    const args: GetTransferTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      authority: mockAuthority,
      amount: 1000,
      destination: mockDestination.address,
      destinationAta: mockDestinationAta,
      sourceAta: mockSourceAta,
    };

    const instructions = getTransferTokensInstructions(args);

    expect(instructions).toHaveLength(2);

    expect(getTransferInstruction).toHaveBeenCalledWith(
      {
        authority: mockAuthority,
        source: mockSourceAta,
        amount: 1000,
        destination: mockDestinationAta,
      },
      {
        programAddress: TOKEN_PROGRAM_ADDRESS,
      },
    );
  });

  it("should throw error for unsupported token program", () => {
    const args: GetTransferTokensInstructionsArgs = {
      feePayer: mockPayer,
      mint: mockMint.address,
      authority: mockAuthority,
      amount: mockAmount,
      tokenProgram: "UnsupportedProgramId" as Address,
      destination: mockDestination.address,
      destinationAta: mockDestinationAta,
      sourceAta: mockSourceAta,
    };

    expect(() => getTransferTokensInstructions(args)).toThrow(
      "Unsupported token program. Try 'TOKEN_PROGRAM_ADDRESS' or 'TOKEN_2022_PROGRAM_ADDRESS'",
    );
  });
});

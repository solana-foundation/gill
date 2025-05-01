import { Address, isSolanaError, Signature, SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN } from "@solana/kit";
import { getOldestSignatureForAddress } from "../core";

describe("getOldestSignatureForAddress", () => {
  // Sample test data
  const mockAddress = "mockAddress123" as Address;
  const mockSignature1 = { signature: "sig1" as Signature, slot: 100, blockTime: 1000 };
  const mockSignature2 = { signature: "sig2" as Signature, slot: 90, blockTime: 900 };
  const mockSignature3 = { signature: "sig3" as Signature, slot: 80, blockTime: 800 };
  const mockSignature4 = { signature: "sig4" as Signature, slot: 70, blockTime: 700 };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the oldest signature when there are signatures and less than the limit", async () => {
    const mockRpc = {
      getSignaturesForAddress: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue([mockSignature1, mockSignature2, mockSignature3]),
      }),
    };

    const result = await getOldestSignatureForAddress(mockRpc as any, mockAddress);

    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledWith(mockAddress, undefined);
    expect(result).toEqual(mockSignature3);
  });

  it("recursively fetches more signatures when limit is reached", async () => {
    // Create a mock that returns different results for different calls
    const mockRpc = {
      getSignaturesForAddress: jest
        .fn()
        .mockImplementationOnce(() => ({
          send: jest.fn().mockResolvedValue(
            Array(1000)
              .fill(null)
              .map((_, i) => ({
                signature: `sig${i}`,
                slot: 1000 - i,
                blockTime: 10000 - i * 10,
              })),
          ),
        }))
        .mockImplementationOnce(() => ({
          send: jest.fn().mockResolvedValue([mockSignature4]),
        })),
    };

    const result = await getOldestSignatureForAddress(mockRpc as any, mockAddress);

    // First call without before parameter
    expect(mockRpc.getSignaturesForAddress).toHaveBeenNthCalledWith(1, mockAddress, undefined);

    // Second call with before parameter set to the oldest signature from first batch
    expect(mockRpc.getSignaturesForAddress).toHaveBeenNthCalledWith(
      2,
      mockAddress,
      expect.objectContaining({
        before: "sig999", // The oldest from the first call has index 999
      }),
    );

    expect(result).toEqual(mockSignature4);
  });

  it("throws SolanaError when no signatures are found", async () => {
    const mockRpc = {
      getSignaturesForAddress: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue([]),
      }),
    };

    try {
      await getOldestSignatureForAddress(mockRpc as any, mockAddress);
      fail("Expected function to throw, but it did not");
    } catch (err) {
      expect(isSolanaError(err, SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN)).toBe(true);
      expect((err as any).context.errorName).toBe("OldestSignatureNotFound");
    }
  });

  it("returns the oldest signature from first batch if recursive call fails with 'not found'", async () => {
    const mockRpc = {
      getSignaturesForAddress: jest
        .fn()
        .mockImplementationOnce(() => ({
          send: jest.fn().mockResolvedValue(
            Array(1000)
              .fill(null)
              .map((_, i) => ({
                signature: `sig${i}`,
                slot: 1000 - i,
                blockTime: 10000 - i * 10,
              })),
          ),
        }))
        .mockImplementationOnce(() => ({
          send: jest.fn().mockResolvedValue([]),
        })),
    };

    const result = await getOldestSignatureForAddress(mockRpc as any, mockAddress);

    expect(result).toEqual({
      signature: "sig999",
      slot: 1,
      blockTime: 10,
    });
  });

  it("passes the abort signal to the RPC call", async () => {
    const abortSignal = new AbortController().signal;

    const mockSendFn = jest.fn().mockResolvedValue([mockSignature1]);
    const mockRpc = {
      getSignaturesForAddress: jest.fn().mockReturnValue({
        send: mockSendFn,
      }),
    };

    await getOldestSignatureForAddress(mockRpc as any, mockAddress, { abortSignal });

    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledWith(mockAddress, expect.objectContaining({ abortSignal }));
    expect(mockSendFn).toHaveBeenCalledWith({ abortSignal });
  });

  it("passes through other config options correctly", async () => {
    const mockRpc = {
      getSignaturesForAddress: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue([mockSignature1]),
      }),
    };

    const config = {
      limit: 50,
      before: "someSig" as Signature,
      until: "untilSig" as Signature,
      abortSignal: new AbortController().signal,
    };

    await getOldestSignatureForAddress(mockRpc as any, mockAddress, config);

    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledWith(
      mockAddress,
      expect.objectContaining({
        limit: 50,
        before: "someSig",
        until: "untilSig",
        abortSignal: config.abortSignal,
      }),
    );
  });

  it("rethrows unknown errors", async () => {
    const mockRpc = {
      getSignaturesForAddress: jest
        .fn()
        .mockImplementationOnce(() => ({
          send: jest.fn().mockResolvedValue(
            Array(1000)
              .fill(null)
              .map((_, i) => ({
                signature: `sig${i}`,
                slot: 1000 - i,
                blockTime: 10000 - i * 10,
              })),
          ),
        }))
        .mockImplementationOnce(() => ({
          send: jest.fn().mockRejectedValue(new Error("Network error")),
        })),
    };

    await expect(getOldestSignatureForAddress(mockRpc as any, mockAddress)).rejects.toEqual(new Error("Network error"));
  });
});

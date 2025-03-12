import { COMPUTE_BUDGET_PROGRAM_ADDRESS, ComputeBudgetInstruction } from "@solana-program/compute-budget";
import type { IInstruction, IInstructionWithData, TransactionMessage } from "@solana/kit";
import { isInstructionForProgram, isInstructionWithData } from "@solana/kit";

/**
 * Check if a given instruction is a `SetComputeUnitLimit` instruction
 */
export function isSetComputeLimitInstruction(
  instruction: IInstruction,
): instruction is IInstruction<typeof COMPUTE_BUDGET_PROGRAM_ADDRESS> & IInstructionWithData<Uint8Array> {
  return (
    isInstructionForProgram(instruction, COMPUTE_BUDGET_PROGRAM_ADDRESS) &&
    isInstructionWithData(instruction) &&
    instruction.data[0] === ComputeBudgetInstruction.SetComputeUnitLimit
  );
}

/**
 * Check if a given transaction contains a `SetComputeUnitLimit` instruction
 */
export function hasSetComputeLimitInstruction(tx: TransactionMessage): boolean {
  return tx.instructions.filter(isSetComputeLimitInstruction).length == 1;
}

/**
 * Check if a given instruction is a `SetComputeUnitPrice` instruction
 */
export function isSetComputeUnitPriceInstruction(
  instruction: IInstruction,
): instruction is IInstruction<typeof COMPUTE_BUDGET_PROGRAM_ADDRESS> & IInstructionWithData<Uint8Array> {
  return (
    isInstructionForProgram(instruction, COMPUTE_BUDGET_PROGRAM_ADDRESS) &&
    isInstructionWithData(instruction) &&
    instruction.data[0] === ComputeBudgetInstruction.SetComputeUnitPrice
  );
}

/**
 * Check if a given transaction contains a `SetComputeUnitPrice` instruction
 */
export function hasSetComputeUnitPriceInstruction(tx: TransactionMessage): boolean {
  return tx.instructions.filter(isSetComputeUnitPriceInstruction).length == 1;
}

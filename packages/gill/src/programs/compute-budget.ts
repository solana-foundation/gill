import {
  COMPUTE_BUDGET_PROGRAM_ADDRESS,
  ComputeBudgetInstruction,
} from "@solana-program/compute-budget";
import {
  IInstruction,
  IInstructionWithData,
  isInstructionForProgram,
  isInstructionWithData,
} from "@solana/instructions";

/**
 * Check if a given instruction is a `SetComputeUnitLimit` instruction
 */
export function isSetComputeLimitInstruction(
  instruction: IInstruction,
): instruction is IInstruction<typeof COMPUTE_BUDGET_PROGRAM_ADDRESS> &
  IInstructionWithData<Uint8Array> {
  return (
    isInstructionForProgram(instruction, COMPUTE_BUDGET_PROGRAM_ADDRESS) &&
    isInstructionWithData(instruction) &&
    instruction.data[0] === ComputeBudgetInstruction.SetComputeUnitLimit
  );
}

/**
 * Check if a given instruction is a `SetComputeUnitPrice` instruction
 */
export function isSetComputeUnitPriceInstruction(
  instruction: IInstruction,
): instruction is IInstruction<typeof COMPUTE_BUDGET_PROGRAM_ADDRESS> &
  IInstructionWithData<Uint8Array> {
  return (
    isInstructionForProgram(instruction, COMPUTE_BUDGET_PROGRAM_ADDRESS) &&
    isInstructionWithData(instruction) &&
    instruction.data[0] === ComputeBudgetInstruction.SetComputeUnitPrice
  );
}

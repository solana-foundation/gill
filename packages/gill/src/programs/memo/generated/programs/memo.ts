/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import { type Address } from "@solana/kit";
import { type ParsedAddMemoInstruction } from "../instructions";

export const MEMO_PROGRAM_ADDRESS =
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr" as Address<"MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr">;

export enum MemoInstruction {
  AddMemo,
}

export type ParsedMemoInstruction<TProgram extends string = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"> = {
  instructionType: MemoInstruction.AddMemo;
} & ParsedAddMemoInstruction<TProgram>;

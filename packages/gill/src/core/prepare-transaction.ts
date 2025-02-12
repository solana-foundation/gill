import {
  COMPUTE_BUDGET_PROGRAM_ADDRESS,
  getSetComputeUnitLimitInstruction,
} from "@solana-program/compute-budget";
import {
  type CompilableTransactionMessage,
  appendTransactionMessageInstruction,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/transaction-messages";
import type { GetLatestBlockhashApi, Rpc, SimulateTransactionApi } from "@solana/rpc";
import { isSetComputeLimitInstruction } from "../programs/compute-budget";
import { getComputeUnitEstimateForTransactionMessageFactory } from "../kit";
import { debug } from "./debug";
import { transactionToBase64 } from "./base64-transactions";

export type PrepareTransactionConfig = {
  /**
   * RPC client capable of simulating transactions and getting the latest blockhash
   **/
  rpc: Rpc<SimulateTransactionApi & GetLatestBlockhashApi>;
  /**
   * Multiplier applied to the simulated compute unit value obtained from simulation
   *
   * Default: `1.1`
   **/
  computeUnitLimitMultiplier?: number;
  /**
   * Whether or not you wish to force reset the compute unit limit value (if one is already set)
   * using the simulation response and `computeUnitLimitMultiplier`
   **/
  computeUnitLimitReset?: boolean;
  /**
   * Whether or not you wish to force reset the latest blockhash (if one is already set)
   *
   * Default: `true`
   **/
  blockhashReset?: boolean;
};

/**
 * Prepare a Transaction to be signed and sent to the network. Including:
 * - setting a compute unit limit (if not already set)
 * - fetching the latest blockhash (if not already set)
 * - (optional) simulating and resetting the compute unit limit
 * - (optional) resetting latest blockhash to the most recent
 */
export async function prepareTransaction<
  TMessage extends CompilableTransactionMessage = CompilableTransactionMessage,
>(transaction: TMessage, config: PrepareTransactionConfig) {
  // set the config defaults
  if (!config.computeUnitLimitMultiplier) config.computeUnitLimitMultiplier = 1.1;
  if (config.blockhashReset !== false) config.blockhashReset = true;

  const computeBudgetIndex = {
    limit: -1,
    price: -1,
  };

  transaction.instructions.map((ix, index) => {
    if (ix.programAddress != COMPUTE_BUDGET_PROGRAM_ADDRESS) return;

    if (isSetComputeLimitInstruction(ix)) {
      computeBudgetIndex.limit = index;
    }
    // else if (isSetComputeUnitPriceInstruction(ix)) {
    //   computeBudgetIndex.price = index;
    // }
  });

  // set a compute unit limit instruction
  if (computeBudgetIndex.limit < 0 || config.computeUnitLimitReset) {
    const units = await getComputeUnitEstimateForTransactionMessageFactory({ rpc: config.rpc })(
      transaction,
    );
    debug(`Obtained compute units from simulation: ${units}`, "debug");
    const ix = getSetComputeUnitLimitInstruction({
      units: units * config.computeUnitLimitMultiplier,
    });

    if (computeBudgetIndex.limit < 0) {
      transaction = appendTransactionMessageInstruction(ix, transaction);
    } else if (config.computeUnitLimitReset) {
      const nextInstructions = [...transaction.instructions];
      nextInstructions.splice(computeBudgetIndex.limit, 1, ix);
      transaction = Object.freeze({
        ...transaction,
        instructions: nextInstructions,
      } as typeof transaction);
    }
  }

  // update the latest blockhash
  if (config.blockhashReset || "lifetimeConstraint" in transaction == false) {
    const { value: latestBlockhash } = await config.rpc.getLatestBlockhash().send();
    if ("lifetimeConstraint" in transaction == false) {
      debug("Transaction missing latest blockhash, fetching one.", "debug");
      transaction = setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transaction);
    } else if (config.blockhashReset) {
      debug("Auto resetting the latest blockhash.", "debug");
      transaction = Object.freeze({
        ...transaction,
        lifetimeConstraint: latestBlockhash,
      } as typeof transaction);
    }
  }

  debug(`Transaction as base64: ${transactionToBase64(transaction)}`, "debug");

  return transaction;
}

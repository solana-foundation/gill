/**
 * Import and log one of each type of symbol from the reexported or generated program clients
 */

/**
 * SPL System program client
 */
import { SYSTEM_PROGRAM_ADDRESS } from "gill/programs";
console.log(SYSTEM_PROGRAM_ADDRESS);

import { getTransferSolInstruction } from "gill/programs";
console.log(getTransferSolInstruction);

/**
 * SPL Address Lookup Table program client
 */
import { ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS } from "gill/programs";
console.log(ADDRESS_LOOKUP_TABLE_PROGRAM_ADDRESS);

import { getAddressLookupTableDecoder } from "gill/programs";
console.log(getAddressLookupTableDecoder);

/**
 * SPL Compute Budget program client
 */
import { COMPUTE_BUDGET_PROGRAM_ADDRESS } from "gill/programs";
console.log(COMPUTE_BUDGET_PROGRAM_ADDRESS);

import { getSetComputeUnitLimitInstruction } from "gill/programs";
console.log(getSetComputeUnitLimitInstruction);

// !this is a custom symbol that gill provides
import { isSetComputeLimitInstruction } from "gill/programs";
console.log(isSetComputeLimitInstruction);

/**
 * !SPL Memo program is generated and vendored in
 */
import { MEMO_PROGRAM_ADDRESS } from "gill/programs";
console.log(MEMO_PROGRAM_ADDRESS);

import { getAddMemoInstruction } from "gill/programs";
console.log(getAddMemoInstruction);

/**
 * ! Metaplex's Token Metadata client is generated and vendored in
 */
import { TOKEN_METADATA_PROGRAM_ADDRESS } from "gill/programs";
console.log(TOKEN_METADATA_PROGRAM_ADDRESS);

import { getMetadataCodec } from "gill/programs";
console.log(getMetadataCodec);

/**
 * SPL Token 2022 program client
 */
import { TOKEN_2022_PROGRAM_ADDRESS } from "gill/programs/token";
console.log(TOKEN_2022_PROGRAM_ADDRESS);

import { getMintToInstruction } from "gill/programs/token";
console.log(getMintToInstruction);

// !this is a custom symbol that gill provides
import { getAssociatedTokenAccountAddress } from "gill/programs/token";
console.log(getAssociatedTokenAccountAddress);

// !this is a custom symbol that gill provides
import { TOKEN_PROGRAM_ADDRESS } from "gill/programs/token";
console.log(TOKEN_PROGRAM_ADDRESS);

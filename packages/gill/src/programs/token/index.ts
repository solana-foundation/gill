/**
 * Solana Program Library (SPL) Token Extension Program client (aka token22)
 * See: https://github.com/solana-program/token-2022
 *
 * Note:
 * Since the token22 program client is fully backwards compatible with the
 * Legacy Token program client, gill only includes the the token22 client.
 * This minimizes the dependencies and bundle sizes (plus naming conflicts).
 */

export * from "@solana-program/token-2022";
export * from "./instructions";
export * from "./transactions";
export * from "./addresses";
export * from "./ui-amount";

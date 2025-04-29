import { createSignerFromKeyPair, type KeyPairSigner } from "@solana/kit";
import { createKeypairFromBase58 } from "../core";

/**
 * Load a `CryptoKeyPair` from an environment variable containing a base58 encoded keypair
 *
 * @param variableName - environment variable name accessible via `process.env[variableName]`
 */
export async function loadKeypairFromEnvironmentBase58<TName extends keyof NodeJS.ProcessEnv | string>(
  variableName: TName,
): Promise<CryptoKeyPair> {
  if (!process.env[variableName]) {
    throw new Error(`Environment variable '${variableName}' not set`);
  }
  return createKeypairFromBase58(process.env[variableName]);
}

/**
 * Load a `KeyPairSigner` from an environment variable containing a base58 encoded keypair
 *
 * @param variableName - environment variable name accessible via `process.env[variableName]`
 */
export async function loadKeypairSignerFromEnvironmentBase58<TName extends keyof NodeJS.ProcessEnv | string>(
  variableName: TName,
): Promise<KeyPairSigner> {
  return createSignerFromKeyPair(await loadKeypairFromEnvironmentBase58(variableName));
}

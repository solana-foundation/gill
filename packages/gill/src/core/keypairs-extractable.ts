import { assertKeyExporterIsAvailable, assertKeyGenerationIsAvailable } from "@solana/assertions";
import type { KeyPairSigner, createKeyPairFromBytes, createKeyPairSignerFromBytes } from "@solana/kit";
import { createSignerFromKeyPair } from "@solana/kit";

export function assertKeyPairIsExtractable(keyPair: CryptoKeyPair): asserts keyPair is ExtractableCryptoKeyPair {
  assertKeyExporterIsAvailable();

  if (!keyPair.privateKey) {
    throw new Error("Keypair is missing private key");
  }

  if (!keyPair.publicKey) {
    throw new Error("Keypair is missing public key");
  }

  if (!keyPair.privateKey.extractable) {
    throw new Error("Private key is not extractable");
  }
}

type Extractable = { "~extractable": true };

type ExtractableCryptoKeyPair = CryptoKeyPair & Extractable;
type ExtractableKeyPairSigner = KeyPairSigner & Extractable;

/**
 * Generates an extractable Ed25519 `CryptoKeyPair` capable of signing messages and transactions
 * */
export async function generateExtractableKeyPair(): Promise<ExtractableCryptoKeyPair> {
  await assertKeyGenerationIsAvailable();
  return crypto.subtle.generateKey(
    /* algorithm */ "Ed25519", // Native implementation status: https://github.com/WICG/webcrypto-secure-curves/issues/20
    /* extractable */ true,
    /* allowed uses */ ["sign", "verify"],
  ) as Promise<ExtractableCryptoKeyPair>;
}

/**
 * Generates an extractable signer capable of signing messages and transactions using a Crypto KeyPair.
 * */
export async function generateExtractableKeyPairSigner(): Promise<ExtractableKeyPairSigner> {
  return createSignerFromKeyPair(await generateExtractableKeyPair()) as Promise<ExtractableKeyPairSigner>;
}

/**
 * Extracts the raw key material from an extractable Ed25519 CryptoKeyPair.
 *
 * @remarks
 * - Requires a keypair generated with extractable=true. See {@link generateExtractableKeyPair}.
 * - The extracted bytes can be used to reconstruct the `CryptoKeyPair` with {@link createKeyPairFromBytes}.
 *
 * @param keypair An extractable Ed25519 `CryptoKeyPair`
 * @returns Raw key bytes as `Uint8Array`
 */
export async function extractBytesFromKeyPair(keypair: ExtractableCryptoKeyPair | CryptoKeyPair): Promise<Uint8Array> {
  assertKeyPairIsExtractable(keypair);

  const [publicKeyBytes, privateKeyJwk] = await Promise.all([
    crypto.subtle.exportKey("raw", keypair.publicKey),
    crypto.subtle.exportKey("jwk", keypair.privateKey),
  ]);

  if (!privateKeyJwk.d) throw new Error("Failed to get private key bytes");

  return new Uint8Array([...Buffer.from(privateKeyJwk.d, "base64"), ...new Uint8Array(publicKeyBytes)]);
}

/**
 * Extracts the raw key material from an extractable Ed25519 KeyPairSigner.
 *
 * @remarks
 * - Requires a keypair generated with extractable=true. See {@link generateExtractableKeyPairSigner}.
 * - The extracted bytes can be used to reconstruct the `CryptoKeyPair` with {@link createKeyPairSignerFromBytes}.
 *
 * @param keypairSigner An extractable Ed25519 `KeyPairSigner`
 * @returns Raw key bytes as `Uint8Array`
 */
export async function extractBytesFromKeyPairSigner(
  keypairSigner: ExtractableKeyPairSigner | KeyPairSigner,
): Promise<Uint8Array> {
  return extractBytesFromKeyPair(keypairSigner.keyPair);
}

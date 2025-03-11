/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  getEnumDecoder,
  getEnumEncoder,
  type Codec,
  type Decoder,
  type Encoder,
} from '@solana/kit';

export enum PayloadKey {
  Amount,
  Authority,
  AuthoritySeeds,
  Delegate,
  DelegateSeeds,
  Destination,
  DestinationSeeds,
  Holder,
  Source,
  SourceSeeds,
}

export type PayloadKeyArgs = PayloadKey;

export function getPayloadKeyEncoder(): Encoder<PayloadKeyArgs> {
  return getEnumEncoder(PayloadKey);
}

export function getPayloadKeyDecoder(): Decoder<PayloadKey> {
  return getEnumDecoder(PayloadKey);
}

export function getPayloadKeyCodec(): Codec<PayloadKeyArgs, PayloadKey> {
  return combineCodec(getPayloadKeyEncoder(), getPayloadKeyDecoder());
}

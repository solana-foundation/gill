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

export enum AuthorityType {
  None,
  Metadata,
  Holder,
  MetadataDelegate,
  TokenDelegate,
}

export type AuthorityTypeArgs = AuthorityType;

export function getAuthorityTypeEncoder(): Encoder<AuthorityTypeArgs> {
  return getEnumEncoder(AuthorityType);
}

export function getAuthorityTypeDecoder(): Decoder<AuthorityType> {
  return getEnumDecoder(AuthorityType);
}

export function getAuthorityTypeCodec(): Codec<
  AuthorityTypeArgs,
  AuthorityType
> {
  return combineCodec(getAuthorityTypeEncoder(), getAuthorityTypeDecoder());
}

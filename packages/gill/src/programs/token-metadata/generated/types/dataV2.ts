/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  combineCodec,
  getArrayDecoder,
  getArrayEncoder,
  getOptionDecoder,
  getOptionEncoder,
  getStructDecoder,
  getStructEncoder,
  getU16Decoder,
  getU16Encoder,
  getU32Decoder,
  getU32Encoder,
  getUtf8Decoder,
  getUtf8Encoder,
  type Codec,
  type Decoder,
  type Encoder,
  type Option,
  type OptionOrNullable,
} from '@solana/kit';
import {
  getCollectionDecoder,
  getCollectionEncoder,
  getCreatorDecoder,
  getCreatorEncoder,
  getUsesDecoder,
  getUsesEncoder,
  type Collection,
  type CollectionArgs,
  type Creator,
  type CreatorArgs,
  type Uses,
  type UsesArgs,
} from '.';

export type DataV2 = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<Creator>>;
  collection: Option<Collection>;
  uses: Option<Uses>;
};

export type DataV2Args = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: OptionOrNullable<Array<CreatorArgs>>;
  collection: OptionOrNullable<CollectionArgs>;
  uses: OptionOrNullable<UsesArgs>;
};

export function getDataV2Encoder(): Encoder<DataV2Args> {
  return getStructEncoder([
    ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ['symbol', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ['uri', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ['sellerFeeBasisPoints', getU16Encoder()],
    ['creators', getOptionEncoder(getArrayEncoder(getCreatorEncoder()))],
    ['collection', getOptionEncoder(getCollectionEncoder())],
    ['uses', getOptionEncoder(getUsesEncoder())],
  ]);
}

export function getDataV2Decoder(): Decoder<DataV2> {
  return getStructDecoder([
    ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ['symbol', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ['uri', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ['sellerFeeBasisPoints', getU16Decoder()],
    ['creators', getOptionDecoder(getArrayDecoder(getCreatorDecoder()))],
    ['collection', getOptionDecoder(getCollectionDecoder())],
    ['uses', getOptionDecoder(getUsesDecoder())],
  ]);
}

export function getDataV2Codec(): Codec<DataV2Args, DataV2> {
  return combineCodec(getDataV2Encoder(), getDataV2Decoder());
}
